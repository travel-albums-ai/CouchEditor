import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { Box, Stack, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { HardDrive, RulerDimensionLine } from 'lucide-react';
import type { ImageArray } from '../types';

function formatMegabytes(byteSize: number): string {
  return `${(byteSize / (1024 * 1024)).toFixed(2)} MB`;
}

function formatExifValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}

function ExifViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);

  const images = data.image ?? [];
  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj)
    : undefined;

  const metadataEntries = match?.exif ? Object.entries(match.exif) : [];

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="exif-viewer">
      <Box sx={{ height: '600px', width: '600px', overflow: 'auto' }} className="nowheel">
        {match ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 1 }}>
              <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 'bold' }}>
                {match.name}
              </Typography>
              <SolidChip label={`${match.width} x ${match.height} px`} fontSize={14} minWidth={32} height={28} icon={<RulerDimensionLine />} />
              <SolidChip label={formatMegabytes(match.byteSize)} fontSize={14} minWidth={32} height={28} icon={<HardDrive />} />
            </Box>
            <Box sx={{ p: 1 }}>
              {metadataEntries.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No EXIF data found.</Typography>
              ) : (
                <Stack spacing={0.5}>
                  {metadataEntries.map(([key, value]) => (
                    <Box key={key} sx={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 0.8fr) minmax(0, 1fr)', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{key}</Typography>
                      <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>{formatExifValue(value)}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </>
        ) : (
          <NoPhotos />
        )}
      </Box>
    </NodeWrapper>
  </>);
}

export default ExifViewerNode;
