import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { GitFork, Minus, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ArraySetOperation = 'array-and' | 'array-and-not' | 'array-or';

const OPERATION_CONFIG: Record<ArraySetOperation, { labelKey: string; descriptionKey: string; icon: React.ReactNode }> = {
  'array-and': {
    labelKey: 'pipelineArrayAnd',
    descriptionKey: 'pipelineArrayAndDescription',
    icon: <GitFork />,
  },
  'array-and-not': {
    labelKey: 'pipelineArrayAndNot',
    descriptionKey: 'pipelineArrayAndNotDescription',
    icon: <Minus />,
  },
  'array-or': {
    labelKey: 'pipelineArrayOr',
    descriptionKey: 'pipelineArrayOrDescription',
    icon: <Plus />,
  },
};

function ArraySetOperationNode({ type }: NodeProps<Node>) {
  const { t } = useTranslation();
  const operation = type as ArraySetOperation;
  const config = OPERATION_CONFIG[operation];

  return <>
    <InputHandle id="image-1" position={Position.Left} style={{ top: '35%' }} />
    <InputHandle id="image-2" position={Position.Left} style={{ top: '65%' }} />

    <NodeWrapper type={operation}>
      <small>{t(config.descriptionKey)}</small>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default ArraySetOperationNode;
