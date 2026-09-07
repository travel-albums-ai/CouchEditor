import Histogram from '@/components/Histogram';
import NoPhotos from '@/components/NoPhotos';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import type { ImageArray } from './types';

function PhotoHistogramNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const images = data.image ?? [];

  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj.title)
    : undefined;

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="photo-histogram">
      <Box sx={{ width: 400, height: 220 }}>
        {match ? (
          <Histogram imageUrl={match.src} width={400} height={220} />
        ) : (
          <NoPhotos />
        )}
      </Box>
    </NodeWrapper>
  </>);
}

export default PhotoHistogramNode;
