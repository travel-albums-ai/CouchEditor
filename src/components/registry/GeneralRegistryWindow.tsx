import { ensureWindowDiscovery } from '@/discovery/windowDiscovery';
import { windowRegistry } from '@/discovery/windowRegistry';
import { useEffect, useState } from 'react';

function RenderWindow({ id }: { id: string }) {
  const meta = windowRegistry.get(id);
  const [Comp, setComp] = useState<null | any>(null);

  useEffect(() => {
    let mounted = true;
    if (!meta) {
      setComp(null);
      return;
    }

    const cached = windowRegistry.resolve(meta);
    if (cached) {
      setComp(() => cached);
      return;
    }

    windowRegistry.preload(meta).then((c) => {
      if (mounted) setComp(() => c);
    }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, [meta?.id]);

  return Comp ? <Comp /> : null;
}

export default function GeneralRegistryWindow() {
  const [, setDiscovered] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await ensureWindowDiscovery();

        const enabled = windowRegistry.list().filter((m) => m.enabled !== false);

        // Preload all enabled window components to populate the cache
        await Promise.allSettled(enabled.map((m) => windowRegistry.preload(m)));
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setDiscovered((v) => !v);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {windowRegistry.list().filter((m) => m.enabled !== false).map((m) => (
        <RenderWindow key={m.id} id={m.id} />
      ))}
    </>
  );
}
