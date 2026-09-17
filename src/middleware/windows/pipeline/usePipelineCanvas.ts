import { useContext } from 'react';

import { PipelineCanvasContext } from './pipelineCanvasContext';

export function usePipelineCanvas() {
  const context = useContext(PipelineCanvasContext);

  if (!context) {
    throw new Error('usePipelineCanvas must be used within PipelineTrashProvider');
  }

  return context;
}
