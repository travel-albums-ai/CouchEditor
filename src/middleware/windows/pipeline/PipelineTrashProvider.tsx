import { useRef, useState, type ReactNode } from 'react';

import { PipelineTrashContext } from './pipelineTrashContext';

export function PipelineTrashProvider({ children }: { children: ReactNode }) {
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashActive, setTrashActive] = useState(false);

  return (
    <PipelineTrashContext.Provider value={{ trashActive, trashRef, setTrashActive }}>
      {children}
    </PipelineTrashContext.Provider>
  );
}
