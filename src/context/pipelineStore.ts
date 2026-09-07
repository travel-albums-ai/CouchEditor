import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';
import type { Edge, Node } from '@xyflow/react';

export type PipelineGraph = {
  nodes: Node[]
  edges: Edge[]
}

export type SavedPipeline = PipelineGraph & {
  id: string
  name: string
}

type PipelineStore = {
  pipelines: SavedPipeline[]
  showToolbox: boolean
}

const defaults: PipelineStore = {
  pipelines: [],
  showToolbox: true
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

function prepareGraph({ nodes, edges }: PipelineGraph): PipelineGraph {
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
    pipelines: store.pipelines,
    toggleToolbox: () => setState((prev) => ({ ...prev, showToolbox: !prev.showToolbox })),
    saveNew: (name: string, graph: PipelineGraph) => {
      const pipeline: SavedPipeline = {
        ...prepareGraph(graph),
        id: createPipelineId(),
        name: name.trim() || 'Untitled pipeline'
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

      const clone: SavedPipeline = {
        ...prepareGraph(existing),
        id: createPipelineId(),
        name: name?.trim() || `${existing.name} copy`
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
        name: name.trim() || 'Untitled pipeline'
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
