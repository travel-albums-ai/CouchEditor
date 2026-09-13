export type WebMCPModelContext = {
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
      execute: (input: Record<string, unknown>) => Promise<string> | string;
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
