import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, TextField } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type CollageNodeData = {
  columns?: number;
  rows?: number;
  tileWidth?: number;
  tileHeight?: number;
};

const DEFAULTS = {
  columns: 5,
  rows: 5,
  tileWidth: 200,
  tileHeight: 200,
};

function CollageNode({
  id,
  data,
}: NodeProps<Node<CollageNodeData>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const { columns: initialColumns, rows: initialRows, tileWidth: initialTileWidth, tileHeight: initialTileHeight } = {
    ...DEFAULTS,
    ...data,
  };
  const [values, setValues] = useState({
    columns: initialColumns,
    rows: initialRows,
    tileWidth: initialTileWidth,
    tileHeight: initialTileHeight,
  });

  const updateValue = (key: keyof CollageNodeData, rawValue: string) => {
    const value = Math.max(1, Math.round(Number(rawValue) || 1));
    setValues((current) => ({ ...current, [key]: value }));
    setNodes((current) => current.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, [key]: value } }
        : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  return (
    <>
      <InputHandle id="image" />
      <NodeWrapper type="collage">
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <TextField
            className="nodrag nopan"
            label={t('pipelineCollageColumns')}
            type="number"
            size="small"
            value={values.columns}
            onChange={(event) => updateValue('columns', event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
          <TextField
            className="nodrag nopan"
            label={t('pipelineCollageRows')}
            type="number"
            size="small"
            value={values.rows}
            onChange={(event) => updateValue('rows', event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
          <TextField
            className="nodrag nopan"
            label={t('pipelineCollageTileWidth')}
            type="number"
            size="small"
            value={values.tileWidth}
            onChange={(event) => updateValue('tileWidth', event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
          <TextField
            className="nodrag nopan"
            label={t('pipelineCollageTileHeight')}
            type="number"
            size="small"
            value={values.tileHeight}
            onChange={(event) => updateValue('tileHeight', event.target.value)}
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
        </Box>
        <small>{t('pipelineCollageDescription')}</small>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default CollageNode;
