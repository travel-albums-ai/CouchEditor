// Main-thread client for the pipeline worker (pipeline.worker.ts).
//
// Keeps the old evaluatePipeline() signature — a map of per-viewer
// promises — while the heavy processing runs off-thread. Also:
// - projects nodes/edges down to the serializable data the engine reads
//   (File objects and plain GalleryPhoto data survive structured clone),
// - relays AI progress messages back as window CustomEvents so node
//   components don't need to know a worker exists,
// - turns result Blobs into object URLs and revokes them when replaced,
// - supersedes the in-flight run when a new evaluation starts and
//   respawns the worker if it ever crashes.

import type { Edge, Node } from "@xyflow/react";

import type {
  ImageArray,
  ImageValue,
  PipelineEvaluateMessage,
  PipelineWorkerEdge,
  PipelineWorkerNode,
  PipelineWorkerOutbound,
} from "./types";
import { VIEWER_NODE_TYPES } from "./types";

// node.data keys the engine reads. Everything else (viewer results,
// React Flow internals) stays on the main thread.
const NODE_DATA_KEYS = [
  "files",
  "lutFile",
  "photos",
  "amount",
  "passthru",
  "apiKey",
  "scale",
  "top",
  "bottom",
  "left",
  "right",
  "topLeftx",
  "topLefty",
  "topRightx",
  "topRighty",
  "bottomLeftx",
  "bottomLefty",
  "bottomRightx",
  "bottomRighty",
] as const;

type PendingViewer = {
  evaluationId: number;
  resolve: (images: ImageArray) => void;
  reject: (error: unknown) => void;
};

let worker: Worker | null = null;
let activeEvaluationId = 0;

const pendingViewers = new Map<string, PendingViewer>();
const objectUrlsByNode = new Map<string, string[]>();
const liveViewerNodeIds = new Set<string>();

function revokeObjectUrls(nodeId: string) {
  const urls = objectUrlsByNode.get(nodeId);

  if (!urls) return;

  for (const url of urls) {
    URL.revokeObjectURL(url);
  }

  objectUrlsByNode.delete(nodeId);
}

function handleWorkerMessage(event: MessageEvent<PipelineWorkerOutbound>) {
  const message = event.data;

  // Anything from a superseded evaluation is dropped; its pending
  // viewers were already settled when the newer run started.
  if (message.evaluationId !== activeEvaluationId) {
    return;
  }

  switch (message.type) {
    case "progress": {
      // Relay to the node component's existing listener contract.
      window.dispatchEvent(
        new CustomEvent(`${message.nodeType}:progress`, {
          detail: {
            nodeId: message.nodeId,
            runId: message.runId,
            completed: message.completed,
            total: message.total,
          },
        })
      );
      return;
    }

    case "viewer": {
      const pending = pendingViewers.get(message.nodeId);

      if (!pending) return;

      pendingViewers.delete(message.nodeId);

      revokeObjectUrls(message.nodeId);

      const images: ImageValue[] = message.images.map((payload) => ({
        src: URL.createObjectURL(payload.blob),
        width: payload.width,
        height: payload.height,
        name: payload.name,
      }));

      objectUrlsByNode.set(
        message.nodeId,
        images.map((image) => image.src)
      );

      pending.resolve(images);
      return;
    }

    case "done": {
      // Viewers that never reported (e.g. an upstream failure)
      // settle empty instead of hanging.
      for (const [nodeId, pending] of pendingViewers) {
        if (pending.evaluationId !== message.evaluationId) continue;

        pendingViewers.delete(nodeId);
        pending.resolve([]);
      }

      // Release results of viewer nodes removed from the graph.
      for (const nodeId of [...objectUrlsByNode.keys()]) {
        if (!liveViewerNodeIds.has(nodeId)) {
          revokeObjectUrls(nodeId);
        }
      }
      return;
    }

    case "error": {
      const error = new Error(message.message);

      for (const [nodeId, pending] of pendingViewers) {
        if (pending.evaluationId !== message.evaluationId) continue;

        pendingViewers.delete(nodeId);
        pending.reject(error);
      }
      return;
    }
  }
}

function getWorker(): Worker {
  if (worker) {
    return worker;
  }

  worker = new Worker(new URL("./pipeline.worker.ts", import.meta.url), {
    type: "module",
  });

  worker.onmessage = handleWorkerMessage;

  worker.onerror = (event) => {
    console.error("Pipeline worker crashed:", event.message);

    const error = new Error("Pipeline worker crashed");

    for (const pending of pendingViewers.values()) {
      pending.reject(error);
    }

    pendingViewers.clear();

    worker?.terminate();
    // Respawn lazily on the next evaluation.
    worker = null;
  };

  return worker;
}

function projectNode(node: Node): PipelineWorkerNode {
  const data: Record<string, unknown> = {};

  for (const key of NODE_DATA_KEYS) {
    if (key in node.data) {
      data[key] = node.data[key];
    }
  }

  return { id: node.id, type: node.type, data };
}

function projectEdge(edge: Edge): PipelineWorkerEdge {
  return {
    source: edge.source,
    sourceHandle: edge.sourceHandle ?? null,
    target: edge.target,
    targetHandle: edge.targetHandle ?? null,
  };
}

// Same contract as the old main-thread engine: resolves to a map of
// per-viewer promises that settle progressively as results arrive.
export async function evaluatePipeline(
  nodes: Node[],
  edges: Edge[]
): Promise<Map<string, Promise<ImageArray>>> {
  const evaluationId = ++activeEvaluationId;

  // Settle viewers from the superseded run; the caller ignores
  // those results because its evaluation id no longer matches.
  for (const pending of pendingViewers.values()) {
    pending.resolve([]);
  }

  pendingViewers.clear();
  liveViewerNodeIds.clear();

  const results = new Map<string, Promise<ImageArray>>();

  for (const node of nodes) {
    if (!VIEWER_NODE_TYPES.has(node.type ?? "")) {
      continue;
    }

    liveViewerNodeIds.add(node.id);

    results.set(
      node.id,
      new Promise<ImageArray>((resolve, reject) => {
        pendingViewers.set(node.id, { evaluationId, resolve, reject });
      })
    );
  }

  const message: PipelineEvaluateMessage = {
    type: "evaluate",
    evaluationId,
    nodes: nodes.map(projectNode),
    edges: edges.map(projectEdge),
  };

  try {
    getWorker().postMessage(message);
  } catch (error) {
    for (const [nodeId, pending] of pendingViewers) {
      if (pending.evaluationId !== evaluationId) continue;

      pendingViewers.delete(nodeId);
      pending.reject(error);
    }
  }

  return results;
}

// Frees the worker thread, its in-memory AI result cache, and every
// outstanding object URL. Called when the pipeline page unmounts; the
// worker respawns lazily on the next evaluation.
export function terminatePipelineWorker() {
  worker?.terminate();
  worker = null;

  // Settle anything in flight so awaiting callers don't hang.
  for (const pending of pendingViewers.values()) {
    pending.resolve([]);
  }

  pendingViewers.clear();

  for (const nodeId of [...objectUrlsByNode.keys()]) {
    revokeObjectUrls(nodeId);
  }
}
