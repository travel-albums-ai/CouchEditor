import { useEffect } from 'react';

type UseKeyboardNavOpts = {
  enabled?: boolean;
  next?: () => void;
  previous?: () => void;
  close?: () => void;
};

export default function useKeyboardNav({ enabled = true, next, previous, close }: UseKeyboardNavOpts) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (previous) {
            event.preventDefault();
            previous();
          }
          break;
        case 'ArrowRight':
          if (next) {
            event.preventDefault();
            next();
          }
          break;
        case 'Escape':
          if (close) {
            event.preventDefault();
            close();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, next, previous, close]);
}
