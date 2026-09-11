import { alpha, Box, useTheme } from '@mui/material';
import {
  addEdge,
  Background,
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

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useBYOKStoreSelector } from '@/context/byokStore';
import { usePipelineStore, usePipelineStoreSelector } from '@/context/pipelineStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import ToggleToolbox from '@/middleware/tools/ActionTools/ToggleToolbox';
import FloatingStack from '@/middleware/windows/pipeline/components/FloatingStack';
import Header from '@/middleware/windows/pipeline/components/Header';
import NodeToolbox from "./NodeToolbox";
import PipelineCanvasOverlays from './components/PipelineCanvasOverlays';
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
import { VIEWER_NODE_TYPES } from "./types";

function Pipeline() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const showToolbox = usePipelineStoreSelector(state => state.showToolbox);
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode)
  const pipelineMaxConcurrentTasks = useSettingsStoreSelector(s => s.pipelineMaxConcurrentTasks)
  const pipelinePhotoBatchSize = useSettingsStoreSelector(s => s.pipelinePhotoBatchSize)
  const pipelineMaxAIRequests = useSettingsStoreSelector(s => s.pipelineMaxAIRequests)
  const pipelineAICallDelayMs = useSettingsStoreSelector(s => s.pipelineAICallDelayMs)
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey);
  const byokModel = useBYOKStoreSelector((state) => state.model);
  const byokServiceTier = useBYOKStoreSelector((state) => state.serviceTier);
  const theme = useTheme();

  const { screenToFlowPosition, fitView, getViewport, setViewport } = useReactFlow();
  const {
    pipelines,
    saveNew,
    cloneExisting,
    updateById,
    deleteById,
    loadById
  } = usePipelineStore();
  const nodeIdRef = useRef(0);
  const pipelineFileInputRef = useRef<HTMLInputElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashActive, setTrashActive] = useState(false);
  const [currentPipelineId, setCurrentPipelineId] = useState<string>(() =>
    localStorage.getItem(LAST_PIPELINE_STORAGE_KEY) ?? ''
  );
  const [currentPipelineName, setCurrentPipelineName] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [organizingWithAI, setOrganizingWithAI] = useState(false);
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
    setViewport({ ...viewport, x: viewport.x + (showToolbox ? 170 : 0), zoom: viewport.zoom - 0.05 });
  }, [fitView, getViewport, setViewport, showToolbox]);

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

    if (!currentPipelineId) return;

    const pipeline = loadById(currentPipelineId);
    if (!pipeline) {
      localStorage.removeItem(LAST_PIPELINE_STORAGE_KEY);
      setCurrentPipelineId('');
      return;
    }

    setNodes(pipeline.nodes.map((node) => ({ ...node, data: { ...node.data } })));
    setEdges(styleEdges(pipeline.edges));
    setCurrentPipelineName(pipeline.name);
    setIsDirty(false);
  }, [currentPipelineId, loadById, setEdges, setNodes, styleEdges]);

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
  useEffect(() => () => terminatePipelineWorker(), []);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
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
  }, [evaluate, pipelineMaxConcurrentTasks, pipelinePhotoBatchSize, pipelineMaxAIRequests, pipelineAICallDelayMs]);

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

  const downloadPipeline = useCallback(() => {
    const name = currentPipelineName.trim() || 'Untitled pipeline';
    downloadPipelineFile(name, nodes, edges);
  }, [currentPipelineName, edges, nodes]);

  const uploadPipeline = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const { name, graph } = await readPipelineFile(file);
      const id = saveNew(name, {
        nodes: graph.nodes,
        edges: graph.edges,
      });

      setNodes(graph.nodes.map((node) => ({ ...node, data: { ...node.data } })));
      setEdges(styleEdges(graph.edges));
      setCurrentPipelineId(id);
      setCurrentPipelineName(name);
      setIsDirty(false);
      void fitPipelineView();
    } catch (error) {
      console.error('Pipeline import failed:', error);
      window.alert('The selected file is not a valid .cep pipeline.');
    }
  }, [fitPipelineView, saveNew, setEdges, setNodes, styleEdges]);

  const loadPipeline = useCallback((id: string) => {
    if (!id || id === currentPipelineId) return;

    // if (isDirty) {
    //   window.alert('Save the current pipeline before loading another one.');
    //   return;
    // }

    const pipeline = loadById(id);
    if (!pipeline) return;

    setNodes(pipeline.nodes.map((node) => ({ ...node, data: { ...node.data } })));
    setEdges(styleEdges(pipeline.edges));
    setCurrentPipelineId(pipeline.id);
    setCurrentPipelineName(pipeline.name);
    setIsDirty(false);
    void fitPipelineView();
  }, [currentPipelineId, fitPipelineView, isDirty, loadById, setEdges, setNodes, styleEdges]);

  const deleteCurrent = useCallback(() => {
    if (!currentPipelineId) return;

    if (!window.confirm(`Delete pipeline "${currentPipelineName}"?`)) return;

    deleteById(currentPipelineId);
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setCurrentPipelineId('');
    setCurrentPipelineName('');
    setIsDirty(false);
  }, [currentPipelineId, currentPipelineName, deleteById, setEdges, setNodes]);

  const clearWorkspace = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setCurrentPipelineId('');
    setCurrentPipelineName('');
    setIsDirty(false);
    void fitPipelineView();
  }, [fitPipelineView, setEdges, setNodes]);

  const organizeWithAI = useCallback(async () => {
    if (!byokOpenAIKey) {
      window.alert('No OpenAI key configured.');
      return;
    }

    if (nodes.length === 0) return;

    setOrganizingWithAI(true);

    try {
      const graph = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type ?? 'unknown',
          position: { x: node.position.x, y: node.position.y },
          size: {
            width: node.measured?.width ?? node.width ?? 0,
            height: node.measured?.height ?? node.height ?? 0,
          },
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
          // sourceHandle: edge.sourceHandle,
          // targetHandle: edge.targetHandle,
        })),
      };
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${byokOpenAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: byokModel,
          service_tier: byokServiceTier,
          response_format: { type: 'json_object' },
          messages: [{
            role: 'user',
            content: [
              'You are a strategic spatial layout engine for a React Flow pipeline displayed on a wide but finite desktop screen.',
              '',
              'Your primary goal is to produce a compact, readable, visually balanced pipeline that can realistically be viewed on a single 4K screen at any pipeline complexity. The canvas is wide, but it is NOT infinite. Do not create unnecessarily long horizontal chains.',
              '',
              'LAYOUT PHILOSOPHY:',
              '- Think globally before assigning coordinates. Do not place nodes greedily one at a time.',
              '- Treat the entire graph as a composition that must fit within a practical 4K viewport.',
              '- Arrange nodes according to data flow: sources and inputs generally on the left, processing stages through the middle, viewers/inspectors and final outputs toward the right.',
              '- Group nodes intelligently by their logical flow and purpose.',
              '- A viewer, preview, inspector, monitor, or output node should be positioned close to the branch or processing flow it corresponds to, rather than being treated as an unrelated endpoint.',
              '- Keep related branches spatially close so the relationship between a processing node and its viewers/outputs is immediately understandable.',
              '- Prefer compact horizontal lanes over one extremely long horizontal line.',
              '- When the pipeline becomes long, deliberately fold it into multiple horizontal lanes using a serpentine / snake-like layout.',
              '- A long sequence of 20 or more stages should normally NOT become a single 20-node line. Distribute it across several intelligently connected lanes.',
              '- Continue the flow left-to-right within each lane, then wrap to the next lane while preserving a clear reading order.',
              '- Use the available screen width efficiently. Avoid excessive empty horizontal space.',
              '- Minimize total bounding-box width and height together. Do not optimize width by creating excessive height, or height by creating an absurdly long line.',
              '- Prefer a compact, balanced aspect ratio appropriate for a wide desktop / 4K display.',
              '- The resulting graph should feel intentionally designed, not merely collision-free.',
              '',
              'FLOW AND GROUPING:',
              '- Preserve data-flow direction and make the main path visually obvious.',
              '- Keep connected nodes easy to follow.',
              '- Keep branches near the stage where they originate.',
              '- Place corresponding viewers/outputs near their associated processing flow, while avoiding collisions.',
              '- Avoid unnecessary edge crossings where possible.',
              '- When several viewers belong to the same stage or branch, group them spatially as a coherent cluster or lane.',
              '- Do not let a viewer belonging to one branch drift far away merely to satisfy a local placement decision.',
              '- Use lanes to separate independent branches and prevent visual tangling.',
              '',
              'GEOMETRY AND COLLISION RULES:',
              'The supplied position is the top-left corner of a node, not its center.',
              'The supplied size is the measured rendered width and height of that node in pixels.',
              'Treat every node as a rectangle: left=x, top=y, right=x+width, bottom=y+height.',
              'Use a minimum clear gap of 48 pixels between every pair of node rectangles.',
              'Two nodes are validly separated only when one of these is true:',
              'rightA+48 <= leftB, rightB+48 <= leftA, bottomA+48 <= topB, or bottomB+48 <= topA.',
              '',
              'Before returning coordinates, perform a global collision check across EVERY possible pair of nodes using their rectangle boundaries.',
              'Do not return coordinates until no pair violates the 48 pixel minimum gap.',
              'Do not solve collisions by overlapping nodes, partially intersecting rectangles, stacking nodes on top of each other, or assuming that edge routing will hide an intersection.',
              '',
              'SCREEN CONSTRAINT:',
              '- Design for a realistic wide 4K desktop viewport, not an infinite canvas.',
              '- Aim for the entire graph to fit comfortably within approximately 3840 pixels of width and 2160 pixels of height, with sensible margins.',
              '- Staying comfortably inside the viewport is more important than preserving a single horizontal flow.',
              '- If the graph cannot fit literally within those dimensions because of the number or size of nodes, create the most compact readable serpentine layout possible rather than producing an extremely wide line.',
              '- Use wrapping strategically. The graph should resemble a well-organized circuit or flow map, not a motorway stretching to another continent.',
              '',
              'LAYOUT PROCESS:',
              '1. Understand the complete graph and identify sources, main processing chains, branches, viewers, inspectors, and outputs.',
              '2. Identify logical groups and related flows.',
              '3. Determine an overall lane structure before assigning individual coordinates.',
              '4. Place the primary flow first.',
              '5. Place associated branches and viewers close to their corresponding flow.',
              '6. Wrap long flows into additional lanes when necessary.',
              '7. Balance the resulting composition so width and height are both reasonable.',
              '8. Perform a global pairwise rectangle collision check.',
              '9. Adjust coordinates until every node satisfies the 48 pixel separation requirement.',
              '10. Verify that all nodes remain inside a practical 4K-sized composition as far as possible.',
              '',
              'Return every node exactly once.',
              'Preserve every node id exactly.',
              'Do not add, remove, resize, or rotate nodes.',
              'All x and y values must be finite numbers.',
              'Use integer pixel coordinates when possible.',
              '',
              'Return ONLY valid JSON in exactly this form:',
              '{"nodes":[{"id":"node-id","x":0,"y":0}]}',
              '',
              `Pipeline graph: ${JSON.stringify(graph)}`,
            ].join(' '),
          }]
        }),
      });
      const result = await response.json() as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };

      if (!response.ok) {
        throw new Error(result.error?.message ?? `OpenAI request failed (${response.status})`);
      }

      const content = result.choices?.[0]?.message?.content;
      if (!content) throw new Error('OpenAI returned no layout.');

      const parsed = JSON.parse(content) as { nodes?: unknown };
      if (!Array.isArray(parsed.nodes)) throw new Error('OpenAI returned an invalid layout.');

      const knownNodeIds = new Set(nodes.map((node) => node.id));
      const positions = new Map<string, { x: number; y: number }>();

      for (const item of parsed.nodes) {
        if (!item || typeof item !== 'object') throw new Error('OpenAI returned an invalid node position.');
        const entry = item as { id?: unknown; x?: unknown; y?: unknown };
        if (typeof entry.id !== 'string' || !knownNodeIds.has(entry.id)
          || typeof entry.x !== 'number' || !Number.isFinite(entry.x)
          || typeof entry.y !== 'number' || !Number.isFinite(entry.y)) {
          throw new Error('OpenAI returned an invalid node position.');
        }
        positions.set(entry.id, { x: entry.x, y: entry.y });
      }

      if (positions.size !== nodes.length) throw new Error('OpenAI did not position every node.');

      setNodes((current) => current.map((node) => ({
        ...node,
        position: positions.get(node.id) ?? node.position,
      })));
      setIsDirty(true);
      requestAnimationFrame(() => void fitPipelineView());
    } catch (error) {
      console.error('AI layout organization failed:', error);
      window.alert(error instanceof Error ? error.message : 'Could not organize the layout with AI.');
    } finally {
      setOrganizingWithAI(false);
    }
  }, [byokOpenAIKey, edges, fitPipelineView, nodes, setNodes]);

  useEffect(() => {
    const handler = () => {
      setIsDirty(true);
      requestAnimationFrame(() => {
        void evaluate();
      });
    };

    window.addEventListener('pipeline:changed', handler);
    return () => window.removeEventListener('pipeline:changed', handler);
  }, [evaluate]);

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

  return (
    <Box className="app" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Header
        currentPipelineId={currentPipelineId}
        pipelines={pipelines}
        loadPipeline={loadPipeline}
      />
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
          nodeTypes={pipelineNodeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}

          onReconnect={onReconnect}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          deleteKeyCode={["Backspace", "Delete"]}
          zoomOnDoubleClick={false}
        >
          <Background gap={SNAP_GRID[0]} bgColor={theme.palette.background.default} color={theme.palette.divider} />
          <Controls position="bottom-right" orientation="horizontal" style={{ bottom: 164 }} />
          <MiniMap />
        </ReactFlow>

        <FloatingStack
          sx={{ top: 10, left: 12, bottom: showToolbox ? 10 : 'auto', overflow: 'auto' }}
          id="pipeline-toolbox"
          key={`pipeline-toolbox-${showToolbox ? 'visible' : 'hidden'}`}
          asIs={!showToolbox}>
          {showToolbox
            ? <NodeToolbox />
            : <ToggleToolbox />}
        </FloatingStack>

        <PipelineCanvasOverlays
          currentPipelineId={currentPipelineId}
          currentPipelineName={currentPipelineName}
          performanceMode={performanceMode}
          trashActive={trashActive}
          pipelineFileInputRef={pipelineFileInputRef}
          trashRef={trashRef}
          onClearWorkspace={clearWorkspace}
          onSave={saveCurrent}
          onSaveAsCopy={saveAsCopy}
          onDownload={downloadPipeline}
          onUpload={uploadPipeline}
          onNameChange={(name) => {
            setCurrentPipelineName(name);
            setIsDirty(true);
          }}
          onDelete={deleteCurrent}
          onOrganizeWithAI={organizeWithAI}
          organizingWithAI={organizingWithAI}
        />
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
