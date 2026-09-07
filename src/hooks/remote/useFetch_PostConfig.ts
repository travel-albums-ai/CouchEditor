import { useMutation, useQueryClient } from '@tanstack/react-query';

const SERVER_ORIGIN =
  import.meta.env.VITE_TAKEOUT_SERVER_ORIGIN?.trim() ||
  'http://localhost:3001'

const CONFIG_URL = `${SERVER_ORIGIN}/config`

type ConfigPayload = Record<string, unknown>

export default function usePostConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ConfigPayload) => {
      const response = await fetch(CONFIG_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to update config (${response.status} ${response.statusText})`
        )
      }

      const contentType = response.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        return response.json()
      }

      return undefined
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['config'],
      })
    },
  })
}
