import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { useTheme } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { Heading1, Heading5, Newspaper } from 'lucide-react';
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
      <GenericToggleButtonGroup id="pipeline-actions" items={[
        {
          tooltip: 'Header',
          icon: <Heading1 /> ,
          onClick: () => updateNode({ size: 'header' }),
          title: size === 'header' ? 'Header' : '',
          selected: size === 'header',
        },
        {
          tooltip: 'Description',
          icon: <Heading5 /> ,
          onClick: () => updateNode({ size: 'description' }),
          title: size === 'description' ? 'Description' : '',
          selected: size === 'description',
        },
        {
          tooltip: 'Notes',
          icon: <Newspaper /> ,
          onClick: () => updateNode({ size: 'notes' }),
          title: size === 'notes' ? 'Notes' : '',
          selected: size === 'notes',
        },
      ] satisfies GenericToggleButtonProps[]} />
      <textarea
        style={{
          backgroundColor: 'transparent',
          color: theme.palette.text.primary,
          border: '0px none',
          fontFamily: theme.typography.fontFamily,
          fontSize: size === 'header' ? 30 : size === 'description' ? 20 : 16,
          width: '100%',
          lineHeight: '1.5',
          minWidth: '350px',
          minHeight: '150px',
          maxHeight: '700px',
          maxWidth: '700px',
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
