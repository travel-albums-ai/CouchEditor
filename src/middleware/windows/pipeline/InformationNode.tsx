import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useTranslation } from 'react-i18next';

type InformationSize = 'header' | 'description' | 'notes';

type InformationNodeData = {
  content?: string;
  size?: InformationSize;
  // Keep reading the previous shape so existing nodes retain their content.
  header?: string;
  description?: string;
  notes?: string;
};

function InformationNode({ id, data }: NodeProps<Node<InformationNodeData>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const size = data.size ?? 'header';
  const content = data.content ?? data[size] ?? '';

  const updateNode = (updates: Partial<InformationNodeData>) => {
    setNodes((nodes) => nodes.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  return (
    <NodeWrapper type="information">
      <FormControl size="small" fullWidth>
        <InputLabel id={`${id}-information-size-label`}>
          {t('pipelineInformationSize')}
        </InputLabel>
        <Select
          labelId={`${id}-information-size-label`}
          value={size}
          label={t('pipelineInformationSize')}
          onChange={(event) => updateNode({ size: event.target.value as InformationSize })}
        >
          <MenuItem value="header">{t('pipelineInformationHeader')}</MenuItem>
          <MenuItem value="description">{t('pipelineInformationDescription')}</MenuItem>
          <MenuItem value="notes">{t('pipelineInformationNotes')}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label={t(`pipelineInformation${size[0].toUpperCase()}${size.slice(1)}`)}
        value={content}
        onChange={(event) => updateNode({ content: event.target.value })}
        size="small"
        fullWidth
        multiline={size !== 'header'}
        minRows={size === 'notes' ? 4 : size === 'description' ? 2 : undefined}
      />
    </NodeWrapper>
  );
}

export default InformationNode;
