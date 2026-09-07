import { RefObject, useEffect, useRef } from 'react';

type UseWheelNavOpts = {
  enabled?: boolean;
  ref?: RefObject<HTMLElement | null>;
  next?: () => void;
  previous?: () => void;
  threshold?: number; // minimum deltaY to consider
  throttleMs?: number; // minimum time between events
};

export default function useWheelNav({ enabled = true, ref: targetRef, next, previous, threshold = 10, throttleMs = 150 }: UseWheelNavOpts) {
  const lastRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const el: EventTarget = (targetRef && targetRef.current) ? targetRef.current : window;

    const handler = (e: WheelEvent) => {
      const delta = e.deltaY;
      if (Math.abs(delta) < threshold) return;

      const now = Date.now();
      if (now - lastRef.current < throttleMs) return;
      lastRef.current = now;

      // only prevent default when attached to an element (not global)
      try {
        if (targetRef && targetRef.current && (e.cancelable ?? true)) e.preventDefault();
      } catch {}

      if (delta > 0) {
        next?.();
      } else {
        previous?.();
      }
    };

    if (el === window) {
      window.addEventListener('wheel', handler as EventListener, { passive: false });
      return () => window.removeEventListener('wheel', handler as EventListener);
    }

    const element = el as HTMLElement;
    element.addEventListener('wheel', handler as EventListener, { passive: false });
    return () => element.removeEventListener('wheel', handler as EventListener);
  }, [enabled, targetRef, next, previous, threshold, throttleMs]);
}
