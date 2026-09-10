import { BeforeAfter } from '@/middleware/windows/pipeline/components/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Slider, Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type CropNodeData = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

function CropNode({
  id,
  data,
}: NodeProps<Node<CropNodeData>>) {
  const { setNodes } = useReactFlow();
  const { t } = useTranslation();
  const [crop, setCrop] = useState({
    top: data.top ?? 0,
    bottom: data.bottom ?? 0,
    left: data.left ?? 0,
    right: data.right ?? 0,
  });

  const updateData = (patch: Partial<CropNodeData>) => {
    setNodes((current) => current.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, ...patch } }
        : node
    ));
  };

  const updateCrop = (edge: keyof CropNodeData, value: number) => {
    const nextCrop = { ...crop, [edge]: value };
    updateData({ [edge]: value });
    setCrop(nextCrop);
  };

  const slider = (edge: keyof CropNodeData, label: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" sx={{ width: 52 }}>{label}</Typography>
      <Slider
        size="small"
        value={crop[edge]}
        onChange={(event, value) => updateCrop(edge, value as number)}
        min={0}
        max={90}
        step={1}
        sx={{ flex: 1 }}
      />
      <Typography variant="caption" sx={{ width: 32, textAlign: 'right' }}>
        {crop[edge]}%
      </Typography>
    </Box>
  );

  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper type="crop">
        {slider('top', t('pipelineCropTop'))}
        {slider('bottom', t('pipelineCropBottom'))}
        {slider('left', t('pipelineCropLeft'))}
        {slider('right', t('pipelineCropRight'))}

        <BeforeAfter
          image2style={{
            clipPath: `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`,
          }}
        />
        <small>{t('pipelineCropDescription')}</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default CropNode;
