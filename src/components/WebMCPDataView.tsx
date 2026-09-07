import GenericWebMCP from '@/components/GenericWebMCP';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { useEffect } from 'react';

type WebMCPDataViewProps = {
  name: string;
  description: string;
  execute: (input: any) => Promise<any>;
};

export default function WebMCPDataView({ name, description, execute }: WebMCPDataViewProps) {
  const { registerTool } = useBYOK();
  const webMcp = useBYOKStoreSelector((state) => state.webMcp);

  useEffect(() => {
    registerTool({
      name,
      description,
      type: 'view',
    });
  }, [name, description]);

  return <>
    {webMcp && <GenericWebMCP webMcp={{
      name,
      description,
      execute,
    }} />}
  </>;
}
