import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
type Axis = 'x' | 'y';
type PerspectiveKey = `${Corner}${Axis}`;
type PerspectiveNodeData = Partial<Record<PerspectiveKey, number>>;

const corners: Array<{ key: Corner; labelKey: string }> = [
  { key: 'topLeft', labelKey: 'pipelinePerspectiveTopLeft' },
  { key: 'topRight', labelKey: 'pipelinePerspectiveTopRight' },
  { key: 'bottomLeft', labelKey: 'pipelinePerspectiveBottomLeft' },
  { key: 'bottomRight', labelKey: 'pipelinePerspectiveBottomRight' },
];

function PerspectiveNode({ id, data }: NodeProps<Node<PerspectiveNodeData>>) {
  const { setNodes } = useReactFlow();
  const { t } = useTranslation();
  const [offsets, setOffsets] = useState<PerspectiveNodeData>(() => Object.fromEntries(
    corners.flatMap(({ key }) => [
      [`${key}x`, data[`${key}x`] ?? 0],
      [`${key}y`, data[`${key}y`] ?? 0],
    ])
  ));

  const updateOffset = (corner: Corner, axis: Axis, value: number) => {
    const key = `${corner}${axis}` as PerspectiveKey;
    setOffsets((current) => ({ ...current, [key]: value }));
    setNodes((current) => current.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, [key]: value } }
        : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  const slider = (corner: Corner, axis: Axis) => {
    const key = `${corner}${axis}` as PerspectiveKey;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ width: 18 }}>{axis.toUpperCase()}</Typography>
        <input
          type="range"
          min={-45}
          max={45}
          step={1}
          value={offsets[key] ?? 0}
          onChange={(event) => updateOffset(corner, axis, Number(event.target.value))}
          style={{ flex: 1 }}
        />
        <Typography variant="caption" sx={{ width: 32, textAlign: 'right' }}>
          {offsets[key] ?? 0}%
        </Typography>
      </Box>
    );
  };

  const polygon = corners.map(({ key }) => {
    const x = key.endsWith('Left') ? 0 : 100;
    const y = key.startsWith('top') ? 0 : 100;
    return `${x + (offsets[`${key}x`] ?? 0)}% ${y + (offsets[`${key}y`] ?? 0)}%`;
  }).join(', ');

  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper type="perspective">
        {corners.map(({ key, labelKey }) => (
          <Box key={key} sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ display: 'block' }}>{t(labelKey)}</Typography>
            {slider(key, 'x')}
            {slider(key, 'y')}
          </Box>
        ))}
        <BeforeAfter image2style={{ clipPath: `polygon(${polygon})` }} />
        <small>{t('pipelinePerspectiveDescription')}</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default PerspectiveNode;
