import { interfaceRegistry } from '@/discovery/interfaceRegistry';
import { useEffect, useState } from 'react';

interface GeneralRegistryDrawerProps {
  id: string;
}

export default function GeneralRegistryDrawer({ id }: GeneralRegistryDrawerProps) {
  const [component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    const meta = interfaceRegistry.get(id);

    if (!meta) {
      return () => {
        mounted = false;
      };
    }

    interfaceRegistry.preload(meta).then((loadedComponent) => {
      if (mounted) {
        setComponent(() => loadedComponent);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!component) {
    return null;
  }

  const Component = component;
  return <Component />;
}
