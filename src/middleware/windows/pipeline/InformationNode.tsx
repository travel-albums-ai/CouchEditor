import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { FormControl, InputLabel, MenuItem, Select, useTheme } from '@mui/material';
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
  const theme = useTheme();
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
      <textarea
        style={{
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          border: '0px none',
          fontSize: size === 'header' ? 30 : size === 'description' ? 20 : 16,
          width: '100%',
          lineHeight: '1.5',
          minWidth: size !== 'notes' ? '250px' : '350px',
          minHeight: size !== 'notes' ? '150px' : '250px',
          maxHeight: '300px'
        }}
        placeholder="..."
        value={content}
        onChange={(event) => updateNode({ content: event.target.value })}
      >
      </textarea>
    </NodeWrapper>
  );
}

export default InformationNode;
