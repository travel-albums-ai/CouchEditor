import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { GitFork } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function ArraySwitchNode({ id, data }: NodeProps<Node<{ selectedInput?: number }>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const selectedInput = data.selectedInput === 2 ? 2 : 1;

  const selectInput = (value: string) => {
    const nextInput = Number(value);

    if (!id) return;

    setNodes((current) => current.map((node) => node.id === id
      ? { ...node, data: { ...node.data, selectedInput: nextInput } }
      : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  return <>
    <InputHandle id="image-1" position={Position.Left} style={{ top: '35%' }} />
    <InputHandle id="image-2" position={Position.Left} style={{ top: '65%' }} />

    <NodeWrapper title={t('pipelineArraySwitch')} icon={<GitFork />} type="array-switch">
      <SegmentedControl
        value={String(selectedInput)}
        onChange={(_, value) => selectInput(value)}
        fullWidth
      >
        <SegmentedControlItem value="1">{t('pipelinePhotoArray', { number: 1 })}</SegmentedControlItem>
        <SegmentedControlItem value="2">{t('pipelinePhotoArray', { number: 2 })}</SegmentedControlItem>
      </SegmentedControl>
      <small>{t('pipelineArraySwitchDescription')}</small>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default ArraySwitchNode;
