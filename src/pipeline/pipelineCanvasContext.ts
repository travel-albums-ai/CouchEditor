import { createContext, type ChangeEvent, type MutableRefObject, type RefObject } from 'react';

export type PipelineCanvasActions = {
  clearWorkspace: () => void;
  saveCurrent: () => void;
  saveAsCopy: () => void;
  downloadPipeline: () => void;
  openPipelineFile: (file: File) => Promise<void>;
  uploadPipeline: (event: ChangeEvent<HTMLInputElement>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  zoomTo100: () => void;
  getZoom: () => number;
};

export type PipelineCanvasContextValue = {
  pipelineFileInputRef: RefObject<HTMLInputElement | null>;
  actionsRef: MutableRefObject<PipelineCanvasActions>;
};

export const PipelineCanvasContext = createContext<PipelineCanvasContextValue | null>(null);
