import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { Box } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { HardDrive, RulerDimensionLine } from 'lucide-react';
import type { ImageArray } from "../types";

function formatMegabytes(byteSize: number): string {
  return `${(byteSize / (1024 * 1024)).toFixed(2)} MB`;
}

function SinglePhotoViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);

  const images = data.image ?? [];
  const match = previewPhotoObj
    ? images.find((image) => image.name === previewPhotoObj)
    : undefined;

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="viewer-single">
      <Box sx={{ height: '600px', width: '600px', overflow: 'auto' }}>
        {match ? (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, pb: 1  }}>
              <SolidChip label={`${match.width} x ${match.height} px`} fontSize={14} minWidth={120} height={28} icon={<RulerDimensionLine />} />
              <SolidChip label={`${formatMegabytes(match.byteSize)}`} fontSize={14} minWidth={100} height={28} icon={<HardDrive />} />
            </Box>
            <img
              src={match.src}
              alt={match.name ?? ''}
              style={{
                display: 'block',
                width: '100%',
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

export default SinglePhotoViewerNode;
