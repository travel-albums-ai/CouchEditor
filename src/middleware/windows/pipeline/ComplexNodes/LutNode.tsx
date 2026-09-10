import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Button, Typography } from '@mui/material';
import { type Node, type NodeProps } from '@xyflow/react';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LutNode({ id, data }: NodeProps<Node<{ lutFile?: File }>>) {
  const { t } = useTranslation();
  const [fileName, setFileName] = useState(data.lutFile?.name ?? '');

  return (
    <>
      <InputHandle id="image" />

      <NodeWrapper type="lut" tools={<PipelineStageTiming nodeId={id} nodeType={'lut'} />}>
        <Button
          sx={{
            bgcolor: theme => `color-mix(in srgb, ${theme.palette.background.paper} 80%, ${theme.palette.primary.main} 20%)`,
            '&:hover': {
              bgcolor: 'primary.main',
            }
          }}
          fullWidth
          component="label"
          variant="contained"
          startIcon={<Upload size={16} />}
        >
          <input
            type="file"
            accept=".cube,text/plain"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) return;

              Object.assign(data, { lutFile: file });
              setFileName(file.name);
              window.dispatchEvent(new CustomEvent('pipeline:changed'));
            }}
          />
          *.cube
        </Button>
        <Typography variant="subtitle2" color="textPrimary">{fileName || t('pipelineLutChooseFile')}</Typography>

      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default LutNode;
