import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { Box, Button } from '@mui/material';
import { Position, type Node, type NodeProps } from "@xyflow/react";
import JSZip from 'jszip';
import { Download, Images } from 'lucide-react';
import { useState } from 'react';
import type { ImageArray } from "./types";

// Photo titles aren't guaranteed to be filesystem-safe or unique.
function toSafeFileName(name: string, index: number): string {
  const cleaned = name.trim().replace(/[\\/:*?"<>|]+/g, "_");
  return cleaned || `photo-${index + 1}`;
}

async function downloadAsZip(images: ImageArray) {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  await Promise.all(
    images.map(async (value, index) => {
      const response = await fetch(value.src);
      const blob = await response.blob();

      const extension = blob.type === "image/png" ? "png" : "jpg";
      let fileName = `${toSafeFileName(value.name ?? `photo-${index + 1}`, index)}.${extension}`;

      // De-dupe filenames that collide after sanitizing/truncating.
      while (usedNames.has(fileName)) {
        fileName = `${toSafeFileName(value.name ?? `photo-${index + 1}`, index)}-${index + 1}.${extension}`;
      }

      usedNames.add(fileName);
      zip.file(fileName, blob);
    })
  );

  const archive = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(archive);

  const link = document.createElement("a");
  link.href = url;
  link.download = "photos.zip";
  link.click();

  URL.revokeObjectURL(url);
}

function ViewerNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const images = data.image ?? [];
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      await downloadAsZip(images);
    } catch (error) {
      console.error("Failed to build photo archive:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (<>
    <InputHandle id="image" position={Position.Top} />
    <NodeWrapper type="viewer">

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, borderBottom: '1px dotted', borderColor: 'divider', pb: 2 }}>


        <Button
          variant="outlined"
          fullWidth
          startIcon={<Download size={14} />}
          disabled={images.length === 0 || downloading}
          onClick={handleDownload}
        >
          {downloading ? 'Zipping…' : 'Download All'}
        </Button>
        <SolidChip count={images.length} label="Photos" fontSize={16} height={38} icon={<Images size={16} />} minWidth={120} />
      </Box>

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        {images.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {images.map((value, index) => (
              <img
                key={index}
                src={value.src}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                }}
              />
            ))}
          </Box>
        ) : (
          <NoPhotos />
        )}
      </Box>
    </NodeWrapper>
  </>);
}

export default ViewerNode;
