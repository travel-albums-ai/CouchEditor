import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';
import { Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { CheckSquare, Image as ImageIcon, Square, XSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ImageArray } from '../types';

type ImagePickerData = {
  image?: ImageArray;
  selectedImageKeys?: string[];
};

function imageKey(name: string, index: number): string {
  return `${name}\u0000${index}`;
}

function ImagePickerNode({ id, data }: NodeProps<Node<ImagePickerData>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const images = data.image ?? [];
  const selectedKeys = new Set(data.selectedImageKeys ?? []);

  const updateSelection = (keys: string[]) => {
    setNodes((current) => current.map((node) => node.id === id
      ? { ...node, data: { ...node.data, selectedImageKeys: keys } }
      : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  const selectAll = () => updateSelection(images.map((image, index) => imageKey(image.name, index)));
  const selectNone = () => updateSelection([]);
  const selectInverse = () => updateSelection(
    images
      .map((image, index) => imageKey(image.name, index))
      .filter((key) => !selectedKeys.has(key))
  );

  return <>
    <InputHandle id="image" position={Position.Left} />

    <NodeWrapper type="image-picker" tools={<PipelineStageTiming nodeId={id} nodeType="image-picker" />}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }} className="nodrag nopan">
        <ButtonGroup fullWidth size="small" variant="outlined">
          <Button startIcon={<CheckSquare size={14} />} onClick={selectAll}>{t('pipelinePickerSelectAll')}</Button>
          <Button startIcon={<XSquare size={14} />} onClick={selectNone}>{t('pipelinePickerSelectNone')}</Button>
          <Button startIcon={<Square size={14} />} onClick={selectInverse}>{t('pipelinePickerSelectInverse')}</Button>
        </ButtonGroup>

        <Typography variant="caption" color="text.secondary">
          {t('pipelinePickerSelected', { selected: selectedKeys.size, total: images.length })}
        </Typography>

        <Box className="nowheel" sx={{ height: 700, width: 700, overflow: 'auto', display: 'flex',
          flexWrap: 'wrap',
          // gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 1 }}>
          {images.map((image, index) => {
            const key = imageKey(image.name, index);
            const isSelected = selectedKeys.has(key);

            return (
              <Box
                key={key}
                component="button"
                type="button"
                onClick={() => updateSelection(
                  isSelected
                    ? [...selectedKeys].filter((selectedKey) => selectedKey !== key)
                    : [...selectedKeys, key]
                )}
                sx={{
                  position: 'relative',
                  p: 0,
                  border: 2,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  aspectRatio: '1',
                }}
              >
                <img src={image.src} alt={image.name} loading="lazy" style={{
                  width: '220px',
                  objectFit: 'cover',
                }} />
                {isSelected && (
                  <Box sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '50%', p: 0.25 }}>
                    <ImageIcon size={16} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </NodeWrapper>
    <OutputHandle id="image" position={Position.Right} />
  </>;
}

export default ImagePickerNode;
