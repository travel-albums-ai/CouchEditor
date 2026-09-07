import GenericWebMCP from '@/components/GenericWebMCP';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useEffect } from 'react';

type WebMCPDataRunProps = {
  name: string;
  description: string;
  inputSchema?: any;
  execute: (input: any) => Promise<any>;
  deps?: any[];
};

export default function WebMCPDataRun({ name, description, inputSchema, execute, deps }: WebMCPDataRunProps) {
  const { registerTool } = useBYOK();
  const webMcp = useBYOKStoreSelector((state) => state.webMcp);

  useEffect(() => {
    registerTool({
      name,
      description,
      inputSchema,
      type: 'run',
    });
  }, [name, description, inputSchema]);

  return <>
    {webMcp && <GenericWebMCP
      webMcp={{
        name,
        description,
        inputSchema,
        execute,
      }}
      deps={deps}
    />}
  </>;
}
