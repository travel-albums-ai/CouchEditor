import NewChip from '@/components/NewChip';
import NoPhotos from '@/components/NoPhotos';
import PictureInPictureButton from '@/components/PictureInPictureButton';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import type { ImageArray } from '@/types/types';
import { Box, Typography, useTheme } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { HardDrive, RulerDimensionLine } from 'lucide-react';

function formatMegabytes(byteSize: number): string {
  return `${(byteSize / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SinglePhotoViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const theme = useTheme();

  const images = data.image ?? [];
  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj)
    : undefined;

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="viewer-single" tools={<>
      <PictureInPictureButton photo={match} />
    </>}>
      <Box sx={{ height: '600px', width: '600px', overflow: 'auto' }}>
        {match ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2, pb: 1  }}>
              <Typography variant="body2" noWrap sx={{ flex: 1, fontWeight: 'bold' }}>
                {match.name}
              </Typography>
              <NewChip label={`${match.width} x ${match.height} px`} fontSize={16} sx={{ height: 38 }} icon={<RulerDimensionLine />} />
              <NewChip label={`${formatMegabytes(match.byteSize)}`} fontSize={16} sx={{ height: 38 }} icon={<HardDrive />} />
            </Box>


            <img
              src={match.src}
              alt=""
              style={{
                display: 'block',
                width: '100%',
                border: '1px dotted',
                borderColor: theme.palette.divider,
                height: '550px',
                objectFit: 'contain',
                borderRadius: '6px',
              }}
            />
          </>
        ) : (<>
          <NoPhotos />
        </>)}
      </Box>
    </NodeWrapper>
  </>);
}
