import NoPhotos from '@/components/NoPhotos';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import type { ImageArray } from "./types";

function SinglePhotoViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);

  const images = data.image ?? [];
  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj.title)
    : undefined;

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="viewer-single">
      <Box sx={{ height: '600px', width: '600px', overflow: 'auto' }}>
        {match ? (
          <img
            src={match.src}
            alt={match.name ?? ''}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '6px',
            }}
          />
        ) : (<>
          <NoPhotos />
        </>)}
      </Box>
    </NodeWrapper>
  </>);
}

export default SinglePhotoViewerNode;
