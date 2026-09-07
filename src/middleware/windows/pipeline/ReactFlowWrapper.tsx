import { Box, FormControl, MenuItem, Select, Stack, TextField } from '@mui/material';
import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import './styles.css';

import { CirclePlus, Copy, PanelLeftDashed, Save, Trash2 } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import AIAsyncColorizerNode from "./AIAsyncColorizerNode";
import AIAsyncDenoiserNode from "./AIAsyncDenoiserNode";
import BlackAndWhiteNode from "./BlackAndWhiteNode";
import BrightnessNode from "./BrightnessNode";
import ContrastNode from "./ContrastNode";
import CropNode from "./CropNode";
import ExposureNode from "./ExposureNode";
import FadeNode from "./FadeNode";
import FlipNode from "./FlipNode";
import GammaNode from "./GammaNode";
import GrainNode from "./GrainNode";
import GrouperNode from "./GrouperNode";
import HdrNode from "./HdrNode";
import HighlightsNode from "./HighlightsNode";
import HotFolderReadNode from "./HotFolderReadNode";
import HotFolderWriteNode from "./HotFolderWriteNode";
import HueRotationNode from "./HueRotationNode";
import InvertNode from "./InvertNode";
import LuminosityNode from "./LuminosityNode";
import LutNode from "./LutNode";
import MirrorNode from "./MirrorNode";
import NodeToolbox from "./NodeToolbox";
import PerspectiveNode from "./PerspectiveNode";
import PhotoHistogramNode from "./PhotoHistogramNode";
import { evaluatePipeline, terminatePipelineWorker } from "./pipelineWorkerClient";
import PopNode from "./PopNode";
import RescaleNode from "./RescaleNode";
import RotateNode from "./RotateNode";
import SaturationNode from "./SaturationNode";
import SelectionNode from "./SelectionNode";
import SepiaNode from "./SepiaNode";
import ShadowsNode from "./ShadowsNode";
import SharpenNode from "./SharpenNode";
import SinglePhotoViewerNode from "./SinglePhotoViewerNode";
import SourceNode from "./SourceNode";
import { VIEWER_NODE_TYPES } from "./types";
import VibranceNode from "./VibranceNode";
import ViewerNode from "./ViewerNode";
import VignetteNode from "./VignetteNode";

const CONNECTION_LINE_TYPE = ConnectionLineType.SmoothStep;

// ============================================================
// React Flow node registry
// ============================================================

const nodeTypes = {
  source: SourceNode,
  "hot-folder-read": HotFolderReadNode,
  selection: SelectionNode,
  grouper: GrouperNode,
  "ai-colorizer": AIAsyncColorizerNode,
  "ai-denoiser": AIAsyncDenoiserNode,
  invert: InvertNode,
  "black-white": BlackAndWhiteNode,
  sepia: SepiaNode,
  flip: FlipNode,
  mirror: MirrorNode,
  rotate: RotateNode,
  brightness: BrightnessNode,
  highlights: HighlightsNode,
  shadows: ShadowsNode,
  gamma: GammaNode,
  luminosity: LuminosityNode,
  lut: LutNode,
  exposure: ExposureNode,
  contrast: ContrastNode,
  crop: CropNode,
  perspective: PerspectiveNode,
  saturation: SaturationNode,
  vibrance: VibranceNode,
  vignette: VignetteNode,
  grain: GrainNode,
  sharpen: SharpenNode,
  pop: PopNode,
  hdr: HdrNode,
  "hue-rotation": HueRotationNode,
  fade: FadeNode,
  rescale: RescaleNode,
  viewer: ViewerNode,
  "viewer-single": SinglePhotoViewerNode,
  "photo-histogram": PhotoHistogramNode,
  "hot-folder-write": HotFolderWriteNode,
};

// ============================================================
// Initial graph
// ============================================================

const initialNodes: Node[] = [
  // {
  //   id: "selection",
  //   type: "selection",
  //   position: {
  //     x: 50,
  //     y: 200,
  //   },
  //   data: {},
  // },

  // {
  //   id: "brightness",
  //   type: "brightness",
  //   position: {
  //     x: 650,
  //     y: 200,
  //   },
  //   data: {},
  // },

  // {
  //   id: "viewer",
  //   type: "viewer",
  //   position: {
  //     x: 1250,
  //     y: 200,
  //   },
  //   data: {},
  // },
];

const initialEdges: Edge[] = [
  // {
  //   id: "source-invert",
  //   type: CONNECTION_LINE_TYPE,
  //   source: "selection",
  //   sourceHandle: "image",
  //   target: "brightness",
  //   targetHandle: "image",
  // },

  // {
  //   id: "brightness-viewer",
  //   type: CONNECTION_LINE_TYPE,
  //   source: "brightness",
  //   sourceHandle: "image",
  //   target: "viewer",
  //   targetHandle: "image",
  // },
];

const SNAP_GRID: [number, number] = [20, 20];

function Pipeline() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const showToolbox = usePipelineStoreSelector(state => state.showToolbox);
  const { toggleToolbox } = usePipelineStore();

  const { screenToFlowPosition, fitView } = useReactFlow();
  const {
    pipelines,
    saveNew,
    cloneExisting,
    updateById,
    deleteById,
    loadById
  } = usePipelineStore();
  const nodeIdRef = useRef(0);
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashActive, setTrashActive] = useState(false);
  const [currentPipelineId, setCurrentPipelineId] = useState<string>('');
  const [currentPipelineName, setCurrentPipelineName] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Nodes are measured asynchronously, so fitView is deferred a frame
  // to ensure it accounts for the restored graph's actual dimensions.
  useEffect(() => {
    const frame = requestAnimationFrame(() => fitView());
    return () => cancelAnimationFrame(frame);
  }, [fitView]);

  // Free the worker thread (and its in-memory AI result cache)
  // when the pipeline page unmounts.
  useEffect(() => () => terminatePipelineWorker(), []);

  const evaluationId = useRef(0);

  const evaluate = useCallback(async () => {
    const id = ++evaluationId.current;

    let results;

    try {
      results = await evaluatePipeline(nodes, edges);
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
    for (const node of nodes) {
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
    nodes,
    edges,
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

  const handleNodesChange = useCallback((changes: Parameters<typeof onNodesChange>[0]) => {
    setIsDirty(true);
    onNodesChange(changes);
  }, [onNodesChange]);

  const handleEdgesChange = useCallback((changes: Parameters<typeof onEdgesChange>[0]) => {
    setIsDirty(true);
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const saveCurrent = useCallback(() => {
    const name = currentPipelineName.trim() || window.prompt('Pipeline name', 'Untitled pipeline');
    if (name === null) return;

    const normalizedName = name.trim() || 'Untitled pipeline';

    if (currentPipelineId) {
      updateById(currentPipelineId, normalizedName, { nodes, edges });
      setCurrentPipelineName(normalizedName);
      setIsDirty(false);
      return;
    }

    const id = saveNew(name, { nodes, edges });
    setCurrentPipelineId(id);
    setCurrentPipelineName(normalizedName);
    setIsDirty(false);
  }, [currentPipelineId, currentPipelineName, edges, nodes, saveNew, updateById]);

  const saveAsCopy = useCallback(() => {
    const name = window.prompt(
      'Copy name',
      `${currentPipelineName || 'Untitled pipeline'} copy`
    );
    if (name === null) return;

    const id = currentPipelineId && !isDirty
      ? cloneExisting(currentPipelineId, name)
      : saveNew(name, { nodes, edges });

    if (!id) return;

    setCurrentPipelineId(id);
    setCurrentPipelineName(name.trim() || 'Untitled pipeline');
    setIsDirty(false);
  }, [cloneExisting, currentPipelineId, currentPipelineName, edges, isDirty, nodes, saveNew]);

  const loadPipeline = useCallback((id: string) => {
    if (!id || id === currentPipelineId) return;

    // if (isDirty) {
    //   window.alert('Save the current pipeline before loading another one.');
    //   return;
    // }

    const pipeline = loadById(id);
    if (!pipeline) return;

    setNodes(pipeline.nodes.map((node) => ({ ...node, data: { ...node.data } })));
    setEdges(pipeline.edges.map((edge) => ({ ...edge })));
    setCurrentPipelineId(pipeline.id);
    setCurrentPipelineName(pipeline.name);
    setIsDirty(false);
    fitView();
  }, [currentPipelineId, fitView, isDirty, loadById, setEdges, setNodes]);

  const deleteCurrent = useCallback(() => {
    if (!currentPipelineId) return;

    if (!window.confirm(`Delete pipeline "${currentPipelineName}"?`)) return;

    deleteById(currentPipelineId);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setCurrentPipelineId('');
    setCurrentPipelineName('');
    setIsDirty(false);
  }, [currentPipelineId, currentPipelineName, deleteById, setEdges, setNodes]);

  const clearWorkspace = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setCurrentPipelineId('');
    setCurrentPipelineName('');
    setIsDirty(false);
    fitView();
  }, [fitView, setEdges, setNodes]);

  useEffect(() => {
    const handler = () => {
      setIsDirty(true);
      evaluate();
    };

    window.addEventListener('pipeline:changed', handler);
    return () => window.removeEventListener('pipeline:changed', handler);
  }, [evaluate]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge({ ...connection, type: CONNECTION_LINE_TYPE }, current)
      );
    },
    [setEdges]
  );

  // Dragging an existing edge's endpoint onto a new handle
  // rewires it instead of creating a duplicate connection.
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((current) =>
        reconnectEdge(oldEdge, newConnection, current)
      );
    },
    [setEdges]
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

      if (!type || !(type in nodeTypes)) {
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

      fitView();
    },
    [fitView]
  );

  return (
    <Box className="app" sx={{ width: '100%', height: '100%' }}>
      {showToolbox && <NodeToolbox />}

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
          minZoom={0.25}
          nodeTypes={nodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}

          onReconnect={onReconnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          deleteKeyCode={["Backspace", "Delete"]}
          zoomOnDoubleClick={false}
          fitView
        >
          <Background gap={SNAP_GRID[0]} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        <Stack
          direction="row"
          spacing={1}
          sx={{ position: 'absolute',
            top: 8, left: 16, zIndex: 10,
            alignItems: 'center', bgcolor: 'divider',
            p: 1, borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              value={currentPipelineName}
              placeholder="Pipeline title..."
              onChange={(event) => {
                setCurrentPipelineName(event.target.value);
                setIsDirty(true);
              }}
              slotProps={{ htmlInput: { 'aria-label': 'Pipeline title' } }}
              sx={{ width: 180,  }}
            />
            <GenericToggleButtonGroup items={[
              {
                tooltip: 'New pipeline',
                icon: <CirclePlus /> ,
                onClick: () => clearWorkspace(),
                title: '',
              },
              {
                tooltip: 'Save pipeline',
                icon: <Save /> ,
                onClick: () => saveCurrent(),
                title: 'Save',
              },
              {
                tooltip: 'Save as clone',
                icon: <Copy /> ,
                onClick: () => saveAsCopy(),
                title: 'Clone',
              },
              {
                tooltip: 'Toggle toolbox',
                icon: <PanelLeftDashed /> ,
                onClick: () => toggleToolbox(),
                title: 'Toggle toolbox',
              }
            ] satisfies GenericToggleButtonProps[]} />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={currentPipelineId}
                displayEmpty
                onChange={(event) => loadPipeline(event.target.value)}
                renderValue={(value) => value
                  ? pipelines.find((pipeline) => pipeline.id === value)?.name ?? 'Pipeline'
                  : 'Load pipeline'}
                aria-label="Load pipeline"
              >
                <MenuItem value="" disabled>Load pipeline</MenuItem>
                {pipelines.map((pipeline) => (
                  <MenuItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>



        <Stack
          direction="row"
          spacing={1}
          sx={{ position: 'absolute', top: 8, right: 16, zIndex: 10,
          }}
        >
          <Box
            ref={trashRef}
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: trashActive ? 'error.main' : 'divider',
              bgcolor: trashActive ? 'error.main' : 'background.paper',
              color: trashActive ? 'error.contrastText' : 'text.secondary',
              boxShadow: 3,
              transform: trashActive ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.15s ease-in-out, background-color 0.15s ease-in-out',
              cursor: currentPipelineId ? 'pointer' : 'default'
            }}
            onClick={deleteCurrent}
            title={currentPipelineId ? 'Delete current pipeline' : 'No saved pipeline selected'}
          >
            <Trash2 size={22} />
          </Box>
        </Stack>
      </div>
    </Box>
  );
}

export default function ReactFlowWrapper() {
  return (
    <ReactFlowProvider>
      <Pipeline />
    </ReactFlowProvider>
  );
}
