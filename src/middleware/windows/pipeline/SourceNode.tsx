import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box, Button } from '@mui/material';
import { type Node, type NodeProps } from "@xyflow/react";
import { Images, Upload } from 'lucide-react';
import { useEffect, useState } from "react";

function SourceNode({ data }: NodeProps<Node<{ files?: File[] }>>) {
  const [files, setFiles] = useState(data.files ?? []);

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

  const label = files.length
    ? `${files.length} photo${files.length === 1 ? "" : "s"} selected`
    : "Choose photos";

  return (
    <NodeWrapper type="source">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, borderBottom: '1px dotted', borderColor: 'divider', pb: 2 }}>
        <Button
          fullWidth
          component="label"
          variant="outlined"
          startIcon={<Upload size={16} />}
        >
        Select Images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(event) => {
              const selected = Array.from(event.target.files ?? []);

              if (selected.length === 0) return;

              data.files = selected;
              setFiles(selected);

              window.dispatchEvent(
                new CustomEvent("pipeline:changed")
              );

              // Allows selecting the same file(s) again
              event.target.value = "";
            }}
          />
        </Button>
        <SolidChip count={files.length} label="Photos" fontSize={16} height={38} icon={<Images size={16} />} minWidth={120} />
      </Box>

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        {previewUrls.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {previewUrls.map((value, index) => (
              <img
                key={index}
                src={value}
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

      <OutputHandle id="image" />
    </NodeWrapper>
  );
}

export default SourceNode;
