import SolidChip from '@/components/SolidChip';
import { InputHandle } from '@/middleware/windows/pipeline/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { Box, Button, Typography } from '@mui/material';
import type { Node, NodeProps } from '@xyflow/react';
import { FolderOutput, Images } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ImageArray } from './types';

function toSafeFileName(name: string, index: number): string {
  const cleaned = name.trim().replace(/[\\/:*?"<>|]+/g, '_');
  return cleaned || `photo-${index + 1}`;
}

function getFileName(name: string | undefined, index: number): string {
  return `${toSafeFileName(name ?? `photo-${index + 1}`, index)}.jpg`;
}

async function emptyDirectory(directory: FileSystemDirectoryHandle) {
  for await (const entry of directory.values()) {
    await directory.removeEntry(entry.name, { recursive: true });
  }
}

async function writeImages(
  directory: FileSystemDirectoryHandle,
  images: ImageArray
) {
  await emptyDirectory(directory);
  const usedNames = new Set<string>();

  for (const [index, image] of images.entries()) {
    const response = await fetch(image.src);
    const blob = await response.blob();
    let fileName = getFileName(image.name, index);

    while (usedNames.has(fileName)) {
      fileName = `${toSafeFileName(image.name ?? `photo-${index + 1}`, index)}-${index + 1}.jpg`;
    }

    usedNames.add(fileName);
    const file = await directory.getFileHandle(fileName, { create: true });
    const writable = await file.createWritable();

    try {
      await writable.write(blob);
    } finally {
      await writable.close();
    }
  }
}

function HotFolderWriteNode({
  data,
}: NodeProps<Node<{ image?: ImageArray }>>) {
  const images = data.image ?? [];
  const directoryRef = useRef<FileSystemDirectoryHandle | null>(null);
  const writeIdRef = useRef(0);
  const [directoryName, setDirectoryName] = useState<string>();
  const [status, setStatus] = useState('Choose a writable folder');
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    const directory = directoryRef.current;

    if (!directory) return;

    const writeId = ++writeIdRef.current;
    setWriting(true);
    setStatus(images.length === 0 ? 'Folder will be emptied' : 'Writing photos…');

    void writeImages(directory, images)
      .then(() => {
        if (writeId !== writeIdRef.current) return;
        setStatus(images.length === 0 ? 'Folder is empty' : `Wrote ${images.length} photos`);
      })
      .catch((error: unknown) => {
        if (writeId !== writeIdRef.current) return;
        console.error('Failed to write hot folder:', error);
        setStatus('Could not write to folder');
      })
      .finally(() => {
        if (writeId === writeIdRef.current) setWriting(false);
      });
  }, [images]);

  const chooseFolder = async () => {
    try {
      const directory = await window.showDirectoryPicker({ mode: 'readwrite' });
      const permission = await directory.requestPermission({ mode: 'readwrite' });

      if (permission !== 'granted') {
        setStatus('Write permission was denied');
        return;
      }

      directoryRef.current = directory;
      setDirectoryName(directory.name);
      setStatus('Folder selected');

      const writeId = ++writeIdRef.current;
      setWriting(true);
      void writeImages(directory, images)
        .then(() => {
          if (writeId === writeIdRef.current) setStatus(images.length === 0 ? 'Folder is empty' : `Wrote ${images.length} photos`);
        })
        .catch((error: unknown) => {
          if (writeId !== writeIdRef.current) return;
          console.error('Failed to write hot folder:', error);
          setStatus('Could not write to folder');
        })
        .finally(() => {
          if (writeId === writeIdRef.current) setWriting(false);
        });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Failed to choose hot folder:', error);
      setStatus('Could not access folder');
    }
  };

  return (
    <>
      <InputHandle id="image" position="top" />
      <NodeWrapper type="hot-folder-write">
        <Button
          variant="outlined"
          startIcon={<FolderOutput size={14} />}
          onClick={() => void chooseFolder()}
          disabled={writing}
        >
          {directoryName ?? 'Choose Folder'}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SolidChip count={images.length} label="Photos" fontSize={16} height={38} icon={<Images size={16} />} minWidth={120} />
          <Typography variant="caption" color="text.secondary">{status}</Typography>
        </Box>
      </NodeWrapper>
    </>
  );
}

export default HotFolderWriteNode;
