import { ensureToolDiscovery } from '@/discovery/toolDiscovery';
import { ToolComponentProps, toolRegistry } from '@/discovery/toolRegistry';
import { ComponentType, useEffect, useState } from 'react';

interface GeneralRegistryToolRendererProps {
  toolId: string;
  context?: ToolComponentProps['context'];
}

export default function GeneralRegistryToolRenderer({
  toolId,
  context,
}: GeneralRegistryToolRendererProps) {
  const [loadedTool, setLoadedTool] = useState<{
    id: string;
    component: ComponentType<ToolComponentProps> | null;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    ensureToolDiscovery()
      .then(() => {
        const meta = toolRegistry.all().find((item) => item.id === toolId);

        return meta ? toolRegistry.preload(meta) : null;
      })
      .then((loadedComponent) => {
        if (mounted) {
          setLoadedTool({ id: toolId, component: loadedComponent });
        }
      })
      .catch(() => {
        if (mounted) {
          setLoadedTool({ id: toolId, component: null });
        }
      });

    return () => {
      mounted = false;
    };
  }, [toolId]);

  const Component = loadedTool?.id === toolId ? loadedTool.component : null;

  return Component ? <Component context={context} /> : null;
}
