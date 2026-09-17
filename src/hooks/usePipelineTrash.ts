import { useContext } from 'react';

import { PipelineTrashContext } from '../windows/pipeline/pipelineTrashContext';

export function usePipelineTrash() {
  const context = useContext(PipelineTrashContext);

  if (!context) {
    throw new Error('usePipelineTrash must be used within PipelineTrashProvider');
  }

  return context;
}
