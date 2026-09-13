import { useSettings } from '@/context/settingsStore';
import { useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

type WebMCPModelContext = {
  registerTool: (
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: Record<string, unknown>;
      annotations?: {
        readOnlyHint?: boolean;
        destructiveHint?: boolean;
        idempotentHint?: boolean;
        openWorldHint?: boolean;
      };
      execute: (input: { mode: ThemeMode }) => Promise<string> | string;
    },
    options?: {
      signal?: AbortSignal;
    },
  ) => Promise<void>;
};

declare global {
  interface Document {
    modelContext?: WebMCPModelContext;
  }
}

export default function WebMCPThemeTool() {
  const { setSetting } = useSettings();

  useEffect(() => {
    if (!document.modelContext) {
      return;
    }

    const controller = new AbortController();

    document.modelContext
      .registerTool(
        {
          name: 'set_theme',
          title: 'Set Theme',
          description:
            'Set the application theme to either light mode or dark mode.',

          inputSchema: {
            type: 'object',
            properties: {
              mode: {
                type: 'string',
                enum: ['light', 'dark'],
                description: 'The theme mode to apply.',
              },
            },
            required: ['mode'],
            additionalProperties: false,
          },

          annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: false,
          },

          async execute({ mode }) {
            setSetting((prev) => ({
              ...prev,
              themeMode: mode,
            }));

            localStorage.setItem('theme', mode);

            return `Theme changed to ${mode} mode.`;
          },
        },
        {
          signal: controller.signal,
        },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(
            '[WebMCP] Failed to register set_theme:',
            error,
          );
        }
      });

    return () => {
      controller.abort();
    };
  }, [setSetting]);

  return null;
}
