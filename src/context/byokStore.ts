import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type Persona = {
  name: string;
  description: string;
}

type Usage = {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  input_tokens_details: Record<string, number>;
  output_tokens_details: Record<string, number>;
  total_tokens_details?: Record<string, number>;
}

type UsageStat = {
  created_at: string;
  model: string;
  usage: Usage;
  call_type?: string;
  service_tier?: string;
}

type BYOKStore = {
  enableAI: boolean,
  aiLoading: boolean,
  byokOpenAIKey?: string,
  serviceTier?: string,
  model?: string,
  mainPersona: Persona,
  additionalPersonas?: Persona[],
  webMcp?: boolean,
  registeredMcpTools?: any[],
  usageStats?: UsageStat[],
}

const defaults: BYOKStore = {
  enableAI: true,
  aiLoading: false,
  byokOpenAIKey: '',
  serviceTier: 'flex',
  model: 'gpt-5.6-luna',
  mainPersona: {
    name: '',
    description: '',
  },
  additionalPersonas: [],
  usageStats: [],
}

const {
  Provider: BYOKProvider,
  useStore,
  useSetStore,
  useStoreSelector: useBYOKStoreSelector
} = createLocalStorageStoreNg<BYOKStore>(defaults, 'byokStore')

export const useBYOK = () => {
  const store = useStore()
  const setSetting = useSetStore()

  return {
    setSetting,
    setAILoading: (loading: boolean) => {
      setSetting(prev => ({
        ...prev,
        aiLoading: loading,
      }))
    },
    setMainPersona: (persona: Persona) => {
      setSetting(prev => ({
        ...prev,
        mainPersona: persona,
      }))
    },
    clearUsageStats: () => {
      setSetting(prev => ({
        ...prev,
        usageStats: [],
      }))
    },
    addUsageStat: (usageStat: UsageStat) => {
      setSetting(prev => ({
        ...prev,
        usageStats: [...(prev.usageStats || []), usageStat],
      }))
    },
    addAdditionalPersona: (persona: Persona) => {
      setSetting(prev => ({
        ...prev,
        additionalPersonas: [...(prev.additionalPersonas || []), persona],
      }))
    },
    updateAdditionalPersona: (index: number, persona: Persona) => {
      setSetting(prev => {
        const updatedPersonas = [...(prev.additionalPersonas || [])]
        updatedPersonas[index] = persona
        return {
          ...prev,
          additionalPersonas: updatedPersonas,
        }
      })
    },
    removeAdditionalPersona: (index: number) => {
      setSetting(prev => {
        const updatedPersonas = [...(prev.additionalPersonas || [])]
        updatedPersonas.splice(index, 1)
        return {
          ...prev,
          additionalPersonas: updatedPersonas,
        }
      })
    },
    getMainPersona: () => store.mainPersona,
    getAdditionalPersonas: () => store.additionalPersonas || [],
    getAllPersonas: () => {
      return [store.mainPersona, ...(store.additionalPersonas || [])]
    },
    registerTool: (tool: any) => {
      setSetting(prev => {
        const registeredTools = prev.registeredMcpTools || []

        if (tool.name && registeredTools.some(registeredTool => registeredTool.name === tool.name)) {
          return prev
        }

        return {
          ...prev,
          registeredMcpTools: [...registeredTools, tool],
        }
      })
    },
    getRegisteredTools: () => store.registeredMcpTools || [],
  }
}

export { BYOKProvider, useBYOKStoreSelector };
