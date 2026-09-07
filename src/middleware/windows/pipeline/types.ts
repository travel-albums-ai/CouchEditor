// Display-ready image handed back to the main thread by the pipeline
// worker. The heavy pixels live in a Blob produced off-thread; the UI
// only ever holds an object URL for <img> tags and downloads.
export type ImageValue = {
  src: string;
  width: number;
  height: number;
  // Original GalleryPhoto title / uploaded file name, carried through
  // every pipeline stage so the viewer can export with a sensible name.
  name?: string;
};

// Every node passes around an array of photos so the whole
// pipeline can process a batch in parallel.
export type ImageArray = ImageValue[];

// Node types whose results are encoded and posted back to the main
// thread instead of staying as in-worker ImageBitmaps.
export const VIEWER_NODE_TYPES = new Set(["viewer", "viewer-single", "photo-histogram", "hot-folder-write"]);

export type NodeInputs = Record<string, unknown>;
export type NodeOutputs = Record<string, unknown>;

export type PipelineNodeDefinition = {
  execute: (inputs: NodeInputs) => Promise<NodeOutputs>;
};

// ============================================================
// Worker protocol (main thread <-> pipeline.worker.ts)
// ============================================================

// Only the data keys the engine reads are projected onto this shape;
// evaluated results (viewer images) and React Flow internals stay on
// the main thread.
export type PipelineWorkerNode = {
  id: string;
  type?: string;
  data: Record<string, unknown>;
};

export type PipelineWorkerEdge = {
  source: string;
  sourceHandle: string | null;
  target: string;
  targetHandle: string | null;
};

// main thread -> worker
export type PipelineEvaluateMessage = {
  type: "evaluate";
  evaluationId: number;
  nodes: PipelineWorkerNode[];
  edges: PipelineWorkerEdge[];
};

// worker -> main thread
export type PipelineProgressMessage = {
  type: "progress";
  evaluationId: number;
  nodeType: string;
  nodeId: string;
  runId: number;
  completed: number;
  total: number;
};

export type PipelineViewerImagePayload = {
  blob: Blob;
  width: number;
  height: number;
  name?: string;
};

export type PipelineViewerMessage = {
  type: "viewer";
  evaluationId: number;
  nodeId: string;
  images: PipelineViewerImagePayload[];
};

export type PipelineDoneMessage = {
  type: "done";
  evaluationId: number;
};

export type PipelineErrorMessage = {
  type: "error";
  evaluationId: number;
  message: string;
};

export type PipelineWorkerOutbound =
  | PipelineProgressMessage
  | PipelineViewerMessage
  | PipelineDoneMessage
  | PipelineErrorMessage;
