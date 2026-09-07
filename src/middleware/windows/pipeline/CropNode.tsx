import { BeforeAfter } from '@/middleware/windows/pipeline/BeforeAfter';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box, Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';

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
      <input
        type="range"
        min={0}
        max={90}
        step={1}
        value={crop[edge]}
        onChange={(event) => updateCrop(edge, Number(event.target.value))}
        style={{ flex: 1 }}
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
        {slider('top', 'Top')}
        {slider('bottom', 'Bottom')}
        {slider('left', 'Left')}
        {slider('right', 'Right')}

        <BeforeAfter
          image2style={{
            clipPath: `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)`,
          }}
        />
        <small>Crop each edge independently</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default CropNode;
