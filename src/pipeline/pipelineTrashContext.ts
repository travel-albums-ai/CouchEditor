import { createContext, type RefObject } from 'react';

export type PipelineTrashContextValue = {
  trashActive: boolean;
  trashRef: RefObject<HTMLElement | null>;
  setTrashActive: (active: boolean) => void;
};

export const PipelineTrashContext = createContext<PipelineTrashContextValue | null>(null);
