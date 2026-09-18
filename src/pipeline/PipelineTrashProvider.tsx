import { useRef, useState, type ReactNode } from 'react';

import { PipelineCanvasContext, type PipelineCanvasActions } from './pipelineCanvasContext';
import { PipelineTrashContext } from './pipelineTrashContext';

export function PipelineTrashProvider({ children }: { children: ReactNode }) {
  const trashRef = useRef<HTMLElement>(null);
  const [trashActive, setTrashActive] = useState(false);
  const pipelineFileInputRef = useRef<HTMLInputElement>(null);
  const actionsRef = useRef<PipelineCanvasActions>({
    clearWorkspace: () => {},
    saveCurrent: () => {},
    saveAsCopy: () => {},
    downloadPipeline: () => {},
    uploadPipeline: () => {},
    zoomIn: () => {},
    zoomOut: () => {},
    fitView: () => {},
    zoomTo100: () => {},
    getZoom: () => 1,
  });

  return (
    <PipelineCanvasContext.Provider value={{ pipelineFileInputRef, actionsRef }}>
      <PipelineTrashContext.Provider value={{ trashActive, trashRef, setTrashActive }}>
        {children}
      </PipelineTrashContext.Provider>
    </PipelineCanvasContext.Provider>
  );
}
