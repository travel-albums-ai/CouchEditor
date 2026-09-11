import GridVirtuoso from '@/components/GridVirtuoso';
import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Button, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { HardDrive, Images, Upload } from 'lucide-react';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

function SourceNode({ data }: NodeProps<Node<{ files?: File[] }>>) {
  const { t } = useTranslation();
  const [files, setFiles] = useState(data.files ?? []);
  const [isDragActive, setIsDragActive] = useState(false);
  const totalSizeInMb = files.reduce(
    (total, file) => total + (file instanceof File ? file.size : 0),
    0
  ) / (1024 * 1024);

  // Object URLs are just for the node preview; the pipeline
  // loads the actual images itself when it evaluates.
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // Stale localStorage may still hold non-File placeholders from
    // before `files` was excluded from persistence; skip those.
    const urls = files
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const updateFiles = (selected: File[]) => {
    if (selected.length === 0) return;

    Reflect.set(data, 'files', selected);
    setFiles(selected);

    window.dispatchEvent(
      new CustomEvent("pipeline:changed")
    );
  };

  return (
    <NodeWrapper type="source">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, borderBottom: '1px dotted', borderColor: 'divider', pb: 2 }}>
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
          {t('pipelineSourceSelectImages')}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            multiple
            hidden
            onChange={(event) => {
              updateFiles(Array.from(event.target.files ?? []));

              // Allows selecting the same file(s) again
              event.target.value = "";
            }}
          />
        </Button>
        <SolidChip count={files.length} label={t('pipelinePhotos')} fontSize={16} height={38} icon={<Images size={16} />} minWidth={150} />
        <SolidChip count={`${totalSizeInMb.toFixed(2)} MB`} label="" fontSize={16} height={38} icon={<HardDrive size={16} />} minWidth={120} />
      </Box>

      <Box
        sx={{
          height: '900px',
          width: '900px',
          overflow: 'auto',
          position: 'relative',
          border: '1px dashed',
          borderColor: isDragActive ? 'primary.main' : 'transparent',
          bgcolor: isDragActive ? 'action.hover' : 'transparent',
          transition: 'border-color 120ms ease, background-color 120ms ease',
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) {
            setIsDragActive(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragActive(false);
          updateFiles(Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/')));
        }}
      >
        {isDragActive && (
          <Box
            sx={{
              position: 'absolute',
              inset: 8,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              border: '2px dashed',
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
              opacity: 0.94,
            }}
          >
            <Typography variant="h6" color="primary.main">
              {t('pipelineDropImages')}
            </Typography>
          </Box>
        )}
        {previewUrls.length > 0 ? (
          <GridVirtuoso
            photos={files
              .filter((file): file is File => file instanceof File)
              .map((file, index) => ({ name: file.name, src: previewUrls[index] }))}
          />
        ) : (
          <NoPhotos />
        )}
      </Box>

      <OutputHandle id="image" position={Position.Top} />
    </NodeWrapper>
  );
}

export default SourceNode;
