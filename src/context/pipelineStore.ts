import { instagramPipeline } from '@/context/instagramPipelines';
import { samplePipeline } from '@/context/samplePipelines';
import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import type { Edge, Node } from '@xyflow/react';

export type PipelineGraph = {
  nodes: Node[]
  edges: Edge[]
}

export type PipelineType = 'sample' | 'instagram' | 'user' | 'community'


export type SavedPipeline = PipelineGraph & {
  id: string
  name: string
  isDeletable: boolean
  dateUpdated: string
  dateCreated: string
  type: PipelineType
}

export type CurrentPipeline = PipelineGraph & {
  id: string
  name: string
  isDirty: boolean
}

type PipelineStore = {
  pipelines: SavedPipeline[],
  currentPipeline: CurrentPipeline,
  lockReactflow: boolean,
  showToolbox: boolean,
  toolboxAsGrid: boolean,
  searchTermToolbox: string,
  collapsedToolboxGroups: Record<string, boolean>
}

const defaults: PipelineStore = {
  pipelines: [
    ...samplePipeline.map((pipeline) => ({
      ...pipeline,
      isDeletable: false,
      dateUpdated: '2026-01-01T00:00:00.000Z',
      dateCreated: '2026-01-01T00:00:00.000Z',
      type: 'sample' as const,
    })),
    ...instagramPipeline.map((pipeline) => ({
      ...pipeline,
      isDeletable: false,
      dateUpdated: '2026-01-01T00:00:00.000Z',
      dateCreated: '2026-01-01T00:00:00.000Z',
      type: 'instagram' as const,
    }))
  ],
  currentPipeline: {
    id: '',
    name: '',
    nodes: [],
    edges: [],
    isDirty: false,
  },
  lockReactflow: false,
  showToolbox: true,
  toolboxAsGrid: false,
  searchTermToolbox: '',
  collapsedToolboxGroups: {}
}

const {
  Provider: PipelineProvider,
  useStore,
  useSetStore,
  useStoreSelector: usePipelineStoreSelector
} = createLocalStorageStoreNg<PipelineStore>(defaults, 'pipelineStore')

function createPipelineId() {
  return `pipeline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createPipelineDate() {
  return new Date().toISOString()
}

export function prepareGraph({ nodes, edges }: PipelineGraph): PipelineGraph {
  return {
    nodes: nodes.map((node) => {
      const {
        image: _image,
        photos: _photos,
        apiKey: _apiKey,
        files: _files,
        lutFile: _lutFile,
        ...data
      } = node.data as Record<string, unknown>

      return { ...node, data }
    }),
    edges: edges.map((edge) => ({ ...edge }))
  }
}

export const usePipelineStore = () => {
  const store = useStore()
  const setState = useSetStore()

  return {
    setState,
    toolboxAsGrid: store.toolboxAsGrid,
    pipelines: store.pipelines,
    currentPipeline: store.currentPipeline,
    setCurrentPipeline: (currentPipeline: CurrentPipeline | ((prev: CurrentPipeline) => CurrentPipeline)) =>
      setState((prev) => ({
        ...prev,
        currentPipeline: typeof currentPipeline === 'function'
          ? currentPipeline(prev.currentPipeline)
          : currentPipeline,
      })),
    updateCurrentPipeline: (graph: PipelineGraph, isDirty = true) =>
      setState((prev) => ({
        ...prev,
        currentPipeline: { ...prev.currentPipeline, ...graph, isDirty },
      })),
    toggleLockReactflow: () => setState((prev) => ({ ...prev, lockReactflow: !prev.lockReactflow })),
    enableReactflow: () => setState((prev) => ({ ...prev, lockReactflow: false })),
    disableReactflow: () => setState((prev) => ({ ...prev, lockReactflow: true })),
    setCurrentPipelineName: (name: string) =>
      setState((prev) => ({
        ...prev,
        currentPipeline: { ...prev.currentPipeline, name },
      })),
    setCurrentPipelineDirty: (isDirty: boolean) =>
      setState((prev) => ({
        ...prev,
        currentPipeline: { ...prev.currentPipeline, isDirty },
      })),
    toggleToolbox: () => setState((prev) => ({ ...prev, showToolbox: !prev.showToolbox })),
    saveNew: (name: string, graph: PipelineGraph) => {
      const date = createPipelineDate()
      const pipeline: SavedPipeline = {
        ...prepareGraph(graph),
        id: createPipelineId(),
        name: name.trim() || 'Untitled pipeline',
        isDeletable: true,
        dateUpdated: date,
        dateCreated: date,
        type: 'user',
      }

      setState((prev) => ({
        ...prev,
        pipelines: [...prev.pipelines, pipeline]
      }))

      return pipeline.id
    },
    cloneExisting: (id: string, name?: string) => {
      const existing = store.pipelines.find((pipeline) => pipeline.id === id)
      if (!existing) return undefined

      const date = createPipelineDate()
      const clone: SavedPipeline = {
        ...prepareGraph(existing),
        id: createPipelineId(),
        name: name?.trim() || `${existing.name} copy`,
        isDeletable: true,
        dateUpdated: date,
        dateCreated: date,
        type: 'user',
      }

      setState((prev) => ({
        ...prev,
        pipelines: [...prev.pipelines, clone]
      }))

      return clone.id
    },
    updateById: (id: string, name: string, graph: PipelineGraph) => {
      const pipeline: SavedPipeline = {
        ...prepareGraph(graph),
        id,
        name: name.trim() || 'Untitled pipeline',
        isDeletable: store.pipelines.find((item) => item.id === id)?.isDeletable ?? true,
        dateUpdated: createPipelineDate(),
        dateCreated: store.pipelines.find((item) => item.id === id)?.dateCreated ?? createPipelineDate(),
        type: store.pipelines.find((item) => item.id === id)?.type ?? 'user',
      }

      setState((prev) => {
        if (!prev.pipelines.some((item) => item.id === id)) return prev

        return {
          ...prev,
          pipelines: prev.pipelines.map((item) => item.id === id ? pipeline : item)
        }
      })

      return pipeline.id
    },
    deleteById: (id: string) => {
      setState((prev) => {
        const pipelines = prev.pipelines.filter((pipeline) => pipeline.id !== id)
        return pipelines.length === prev.pipelines.length ? prev : { ...prev, pipelines }
      })
    },
    loadById: (id: string) => store.pipelines.find((pipeline) => pipeline.id === id)
  }
}

export { PipelineProvider, usePipelineStoreSelector };
