import { alpha, Box, useMediaQuery, useTheme } from '@mui/material';
import {
  addEdge,
  Background,
  MiniMap,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node
} from "@xyflow/react";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { usePipelineCanvas } from '@/hooks/usePipelineCanvas';
import { usePipelineTrash } from '@/hooks/usePipelineTrash';
import { VIEWER_NODE_TYPES } from "@/types/types";
import { useTranslation } from 'react-i18next';
import { downloadPipelineFile, readPipelineFile } from './pipelineApi';
import {
  CONNECTION_LINE_TYPE,
  INITIAL_EDGES,
  INITIAL_NODES,
  LAST_PIPELINE_STORAGE_KEY,
  PIPELINE_NODE_COUNT_EVENT,
  PIPELINE_NODE_COUNT_REQUEST_EVENT,
  pipelineNodeTypes,
  SNAP_GRID,
} from './pipelineConfig';
import { evaluatePipeline, terminatePipelineWorker } from "./pipelineWorkerClient";

function getBlobBytes(value: unknown, seen = new Set<object>()): number {
  if (value instanceof Blob) {
    return value.size;
  }

  if (!value || typeof value !== 'object' || seen.has(value)) {
    return 0;
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + getBlobBytes(item, seen), 0);
  }

  return Object.values(value).reduce(
    (total, item) => total + getBlobBytes(item, seen),
    0
  );
}

function Pipeline() {
  const { t } = useTranslation();
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const lockReactflow = usePipelineStoreSelector(state => state.lockReactflow);
  const pipelineMaxConcurrentTasks = useSettingsStoreSelector(s => s.pipelineMaxConcurrentTasks)
  const pipelinePhotoBatchSize = useSettingsStoreSelector(s => s.pipelinePhotoBatchSize)
  const pipelineMaxAIRequests = useSettingsStoreSelector(s => s.pipelineMaxAIRequests)
  const pipelineAICallDelayMs = useSettingsStoreSelector(s => s.pipelineAICallDelayMs)
  const pipelineSequentialMode = useSettingsStoreSelector(s => s.pipelineSequentialMode)
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 999px)');

  const { screenToFlowPosition, fitView, getViewport, setViewport, zoomIn, zoomOut } = useReactFlow();
  const { trashRef, setTrashActive } = usePipelineTrash();
  const { actionsRef } = usePipelineCanvas();
  const {
    currentPipeline,
    setCurrentPipeline,
    updateCurrentPipeline,
    setCurrentPipelineDirty,
    saveNew,
    cloneExisting,
    updateById,
    loadById
  } = usePipelineStore();
  const currentPipelineId = currentPipeline.id;
  const currentPipelineName = currentPipeline.name;
  const isDirty = currentPipeline.isDirty;
  const nodeIdRef = useRef(0);
  const restoredPipelineRef = useRef(false);
  const evaluationId = useRef(0);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const fitPaneOnDoubleClickRef = useRef(true);

  const styleEdges = useCallback((pipelineEdges: Edge[]) =>
    pipelineEdges.map((edge) => ({
      ...edge,
      type: CONNECTION_LINE_TYPE,
      style: {
        strokeWidth: 2,
        stroke: alpha(theme.palette.primary.main, 0.6),
      },
    })),
  [theme.palette.primary.main]);

  useEffect(() => {
    setEdges((current) => styleEdges(current));
  }, [setEdges, styleEdges]);

  const fitPipelineView = useCallback(async () => {
    const fitted = await fitView({ padding: 0.18 });

    if (!fitted) return;

    const viewport = getViewport();
    setViewport({ ...viewport, x: viewport.x + 0, zoom: viewport.zoom });
  }, [fitView, getViewport, setViewport]);

  const zoomInCanvas = useCallback(() => {
    void zoomIn();
  }, [zoomIn]);

  const zoomOutCanvas = useCallback(() => {
    void zoomOut();
  }, [zoomOut]);

  const zoomTo100 = useCallback(() => {
    setViewport({ ...getViewport(), zoom: 1 });
  }, [getViewport, setViewport]);

  const getZoom = useCallback(() => getViewport().zoom, [getViewport]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(PIPELINE_NODE_COUNT_EVENT, { detail: nodes.length }));
  }, [nodes.length]);

  useEffect(() => {
    const handleNodeCountRequest = () => {
      window.dispatchEvent(new CustomEvent(PIPELINE_NODE_COUNT_EVENT, { detail: nodesRef.current.length }));
    };

    window.addEventListener(PIPELINE_NODE_COUNT_REQUEST_EVENT, handleNodeCountRequest);

    return () => {
      window.removeEventListener(PIPELINE_NODE_COUNT_REQUEST_EVENT, handleNodeCountRequest);
      window.dispatchEvent(new CustomEvent(PIPELINE_NODE_COUNT_EVENT, { detail: 0 }));
    };
  }, []);

  useEffect(() => {
    if (restoredPipelineRef.current) return;

    restoredPipelineRef.current = true;

    const pipelineId = localStorage.getItem(LAST_PIPELINE_STORAGE_KEY) ?? '';
    if (!pipelineId) return;

    const pipeline = loadById(pipelineId);
    if (!pipeline) {
      localStorage.removeItem(LAST_PIPELINE_STORAGE_KEY);
      return;
    }

    setNodes(pipeline.nodes.map((node) => ({ ...node, data: { ...node.data } })));
    setEdges(styleEdges(pipeline.edges));
    setCurrentPipeline({ ...pipeline, isDirty: false });
  }, [loadById, setCurrentPipeline, setEdges, setNodes, styleEdges]);

  useEffect(() => {
    if (currentPipelineId) {
      localStorage.setItem(LAST_PIPELINE_STORAGE_KEY, currentPipelineId);
    } else {
      localStorage.removeItem(LAST_PIPELINE_STORAGE_KEY);
    }
  }, [currentPipelineId]);

  // Nodes are measured asynchronously, so fitView is deferred a frame
  // to ensure it accounts for the restored graph's actual dimensions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => void fitPipelineView());
    return () => cancelAnimationFrame(frame);
  }, [fitPipelineView]);

  // Free the worker thread (and its in-memory phase result cache)
  // when the pipeline page unmounts.
  useEffect(() => () => {
    window.dispatchEvent(
      new CustomEvent('pipeline:input-memory', { detail: { inputBytes: 0 } })
    );
    terminatePipelineWorker();
  }, []);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    updateCurrentPipeline({ nodes, edges }, currentPipeline.isDirty);

    const seen = new Set<object>();
    const inputBytes = nodes.reduce(
      (total, node) => total + getBlobBytes(node.data, seen),
      0
    );

    window.dispatchEvent(
      new CustomEvent('pipeline:input-memory', { detail: { inputBytes } })
    );
  }, [edges, nodes]);

  const evaluate = useCallback(async () => {
    const id = ++evaluationId.current;
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;

    let results;

    try {
      results = await evaluatePipeline(currentNodes, currentEdges);
    } catch (error) {
      console.error("Pipeline evaluation failed:", error);
      return;
    }

    // Don't allow an old evaluation to overwrite
    // a newer graph state.
    if (id !== evaluationId.current) {
      return;
    }

    // Update viewer nodes with their resolved result.
    for (const node of currentNodes) {
      if (!VIEWER_NODE_TYPES.has(node.type ?? "")) {
        continue;
      }

      const promise = results.get(node.id);

      if (!promise) continue;

      let result;

      try {
        result = await promise;
      } catch (error) {
        console.error(
          `Pipeline evaluation failed for node "${node.id}":`,
          error
        );
        continue;
      }

      if (
        id !== evaluationId.current
      ) {
        return;
      }

      setNodes((current) =>
        current.map((n) =>
          n.id === node.id
            ? {
              ...n,
              data: {
                ...n.data,
                image: result,
              },
            }
            : n
        )
      );
    }
  }, [
    setNodes,
  ]);

  // Re-evaluate when nodes/edges are added, removed, disconnected,
  // or reconnected. Node data mutated in place (e.g. slider drags)
  // doesn't change this signature, so it won't trigger extra runs.
  const graphSignatureRef = useRef("");

  useEffect(() => {
    const signature = JSON.stringify({
      nodeIds: nodes.map((node) => node.id).sort(),
      cropValues: nodes
        .filter((node) => node.type === "crop")
        .map((node) => `${node.id}:${node.data.top ?? 0}:${node.data.bottom ?? 0}:${node.data.left ?? 0}:${node.data.right ?? 0}`)
        .sort(),
      arraySwitchValues: nodes
        .filter((node) => node.type === "array-switch")
        .map((node) => `${node.id}:${node.data.selectedInput ?? 1}`)
        .sort(),
      collageValues: nodes
        .filter((node) => node.type === "collage")
        .map((node) => `${node.id}:${node.data.columns ?? 5}:${node.data.rows ?? 5}:${node.data.tileWidth ?? 200}:${node.data.tileHeight ?? 200}`)
        .sort(),
      resizeLimitValues: nodes
        .filter((node) => node.type === "resize-limit")
        .map((node) => `${node.id}:${node.data.maxDimension ?? 4096}`)
        .sort(),
      edges: edges
        .map(
          (edge) =>
            `${edge.id}:${edge.source}:${edge.sourceHandle}->${edge.target}:${edge.targetHandle}`
        )
        .sort(),
    });

    if (signature === graphSignatureRef.current) {
      return;
    }

    graphSignatureRef.current = signature;

    evaluate();
  }, [nodes, edges, evaluate]);

  useEffect(() => {
    if (!graphSignatureRef.current) return;

    evaluate();
  }, [evaluate, pipelineMaxConcurrentTasks, pipelinePhotoBatchSize, pipelineMaxAIRequests, pipelineAICallDelayMs, pipelineSequentialMode]);

  const handleNodesChange = useCallback((changes: Parameters<typeof onNodesChange>[0]) => {
    setCurrentPipelineDirty(true);
    onNodesChange(changes);
  }, [onNodesChange, setCurrentPipelineDirty]);

  const handleEdgesChange = useCallback((changes: Parameters<typeof onEdgesChange>[0]) => {
    setCurrentPipelineDirty(true);
    onEdgesChange(changes);
  }, [onEdgesChange, setCurrentPipelineDirty]);

  const saveCurrent = useCallback(() => {
    const name = currentPipelineName.trim() || window.prompt(t('pipelineNamePrompt'), t('untitledPipeline'));
    if (name === null) return;

    const normalizedName = name.trim() || t('untitledPipeline');

    if (currentPipelineId) {
      updateById(currentPipelineId, normalizedName, { nodes, edges });
      setCurrentPipeline({ ...currentPipeline, name: normalizedName, isDirty: false });
      return;
    }

    const id = saveNew(name, { nodes, edges });
    setCurrentPipeline({ id, name: normalizedName, nodes, edges, isDirty: false });
  }, [currentPipeline, currentPipelineId, currentPipelineName, edges, nodes, saveNew, setCurrentPipeline, updateById]);

  const saveAsCopy = useCallback(() => {
    const name = window.prompt(
      t('copyNamePrompt'),
      `${currentPipelineName || t('untitledPipeline')} copy`
    );
    if (name === null) return;

    const id = currentPipelineId && !isDirty
      ? cloneExisting(currentPipelineId, name)
      : saveNew(name, { nodes, edges });

    if (!id) return;

    setCurrentPipeline({
      id,
      name: name.trim() || t('untitledPipeline'),
      nodes,
      edges,
      isDirty: false,
    });
  }, [cloneExisting, currentPipelineId, currentPipelineName, edges, isDirty, nodes, saveNew, setCurrentPipeline]);

  const downloadPipeline = useCallback(() => {
    const name = currentPipelineName.trim() || t('untitledPipeline');
    downloadPipelineFile(name, nodes, edges);
  }, [currentPipelineName, edges, nodes]);

  const openPipelineFile = useCallback(async (file: File) => {
    try {
      const { name, graph } = await readPipelineFile(file);
      const id = saveNew(name, {
        nodes: graph.nodes,
        edges: graph.edges,
      });

      setNodes(graph.nodes.map((node) => ({ ...node, data: { ...node.data } })));
      setEdges(styleEdges(graph.edges));
      setCurrentPipeline({ id, name, nodes: graph.nodes, edges: graph.edges, isDirty: false });
      void fitPipelineView();
    } catch (error) {
      console.error('Pipeline import failed:', error);
      window.alert(t('invalidPipelineFile'));
    }
  }, [fitPipelineView, saveNew, setCurrentPipeline, setEdges, setNodes, styleEdges]);

  const uploadPipeline = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (file) {
      await openPipelineFile(file);
    }
  }, [openPipelineFile]);

  const previousPipelineIdRef = useRef(currentPipelineId);

  useEffect(() => {
    if (!currentPipelineId) {
      if (previousPipelineIdRef.current) {
        previousPipelineIdRef.current = '';
        setNodes(INITIAL_NODES);
        setEdges(INITIAL_EDGES);
      }
      return;
    }

    if (previousPipelineIdRef.current === currentPipelineId) return;

    const pipeline = loadById(currentPipelineId);
    if (!pipeline) return;

    previousPipelineIdRef.current = currentPipelineId;
    setNodes(pipeline.nodes.map((node) => ({ ...node, data: { ...node.data } })));
    setEdges(styleEdges(pipeline.edges));
    void fitPipelineView();
  }, [currentPipelineId, fitPipelineView, loadById, setEdges, setNodes, styleEdges]);

  const clearWorkspace = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setCurrentPipeline({ id: '', name: '', nodes: INITIAL_NODES, edges: INITIAL_EDGES, isDirty: false });
    void fitPipelineView();
  }, [fitPipelineView, setCurrentPipeline, setEdges, setNodes]);

  useEffect(() => {
    const handler = () => {
      setCurrentPipelineDirty(true);
      requestAnimationFrame(() => {
        void evaluate();
      });
    };

    window.addEventListener('pipeline:changed', handler);
    return () => window.removeEventListener('pipeline:changed', handler);
  }, [evaluate]);

  useEffect(() => {
    const handleGraphUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ nodes: Node[]; edges: Edge[] }>).detail;
      if (!detail?.nodes || !detail.edges) return;

      setNodes(detail.nodes);
      setEdges(styleEdges(detail.edges));
      window.dispatchEvent(new CustomEvent('pipeline:changed'));
    };

    window.addEventListener('pipeline:graph-updated', handleGraphUpdated);
    return () => window.removeEventListener('pipeline:graph-updated', handleGraphUpdated);
  }, [setEdges, setNodes, styleEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge({
          ...connection,
          type: CONNECTION_LINE_TYPE,
          style: {
            strokeWidth: 2,
            stroke: alpha(theme.palette.primary.main, 0.6),
          },
        }, current)
      );
    },
    [setEdges, theme.palette.primary.main]
  );

  // Dragging an existing edge's endpoint onto a new handle
  // rewires it instead of creating a duplicate connection.
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((current) =>
        styleEdges(reconnectEdge(oldEdge, newConnection, current))
      );
    },
    [setEdges, styleEdges]
  );

  const onEdgeDoubleClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setEdges((current) =>
        current.filter((e) => e.id !== edge.id)
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const isOverTrash = useCallback((event: MouseEvent | TouchEvent) => {
    const rect = trashRef.current?.getBoundingClientRect();

    if (!rect) return false;

    const point =
      "touches" in event
        ? event.touches[0] ?? event.changedTouches[0]
        : event;

    if (!point) return false;

    return (
      point.clientX >= rect.left &&
      point.clientX <= rect.right &&
      point.clientY >= rect.top &&
      point.clientY <= rect.bottom
    );
  }, []);

  const onNodeDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      setTrashActive(isOverTrash(event));
    },
    [isOverTrash]
  );

  // Dropping a node onto the trash can removes it and any edges attached to it.
  const onNodeDragStop = useCallback(
    (event: MouseEvent | TouchEvent, node: Node) => {
      if (isOverTrash(event)) {
        setNodes((current) => current.filter((n) => n.id !== node.id));
        setEdges((current) =>
          current.filter(
            (edge) => edge.source !== node.id && edge.target !== node.id
          )
        );
      }

      setTrashActive(false);
    },
    [isOverTrash, setNodes, setEdges]
  );

  // Drops a node dragged from the toolbox at the cursor position.
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!type || !(type in pipelineNodeTypes)) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const snappedPosition = {
        x: Math.round(position.x / SNAP_GRID[0]) * SNAP_GRID[0],
        y: Math.round(position.y / SNAP_GRID[1]) * SNAP_GRID[1],
      };

      const id = `${type}-${++nodeIdRef.current}`;

      setNodes((current) => [
        ...current,
        {
          id,
          type,
          position: snappedPosition,
          data: {},
        },
      ]);
    },
    [screenToFlowPosition, setNodes]
  );

  // Double-clicking the empty canvas re-centers the view instead of the
  // default zoom-in, which only fires when the pane itself is the target.
  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      if (!target.classList.contains("react-flow__pane")) {
        return;
      }

      if (fitPaneOnDoubleClickRef.current) {
        fitPaneOnDoubleClickRef.current = false;
        void fitPipelineView();
        return;
      }

      fitPaneOnDoubleClickRef.current = true;
      setViewport({ ...getViewport(), zoom: 1 });
    },
    [fitPipelineView, getViewport, setViewport]
  );

  useEffect(() => {
    actionsRef.current = {
      clearWorkspace,
      saveCurrent,
      saveAsCopy,
      downloadPipeline,
      openPipelineFile,
      uploadPipeline,
      zoomIn: zoomInCanvas,
      zoomOut: zoomOutCanvas,
      fitView: () => void fitPipelineView(),
      zoomTo100,
      getZoom,
    };
  }, [actionsRef, clearWorkspace, downloadPipeline, fitPipelineView, getZoom, openPipelineFile, saveAsCopy, saveCurrent, uploadPipeline, zoomInCanvas, zoomOutCanvas, zoomTo100]);

  useEffect(() => {
    const launchQueue = (window as Window & {
      launchQueue?: {
        setConsumer: (consumer: (params: { files: FileSystemFileHandle[] }) => Promise<void>) => void;
      };
    }).launchQueue;

    if (!launchQueue) return;

    launchQueue.setConsumer(async ({ files }) => {
      const fileHandle = files[0];

      if (fileHandle) {
        await actionsRef.current.openPipelineFile(await fileHandle.getFile());
      }
    });
  }, [actionsRef]);

  const isEmptyPipeline = nodes.length === 0 && edges.length === 0;

  return (
    <Box className="app" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <div
        className="reactflow-canvas"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDoubleClick={onPaneDoubleClick}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          snapToGrid
          snapGrid={SNAP_GRID}
          connectionLineType={CONNECTION_LINE_TYPE}
          defaultEdgeOptions={{ type: CONNECTION_LINE_TYPE }}
          minZoom={!isMobile ? 0.25 : 0.125}
          maxZoom={4}
          nodeTypes={pipelineNodeTypes}
          nodesDraggable={!lockReactflow}
          nodesConnectable={!lockReactflow}
          elementsSelectable={!lockReactflow}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}

          onReconnect={onReconnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onMove={(_, viewport) => {
            window.dispatchEvent(new CustomEvent('pipeline:zoom-changed', { detail: viewport.zoom }));
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          zoomOnDoubleClick={false}
        >
          <Background gap={SNAP_GRID[0]} bgColor={theme.palette.background.default} color={theme.palette.text.disabled} />
          {!isEmptyPipeline && (
            <MiniMap
              position="top-right"
              className="pipeline-minimap"
              style={{ top: 'var(--pipeline-minimap-top)' }}
            />
          )}
        </ReactFlow>

      </div>
    </Box>
  );
}

export default function ReactFlowWrapper() {
  return (
    <>
      <Pipeline />
    </>
  );
}
