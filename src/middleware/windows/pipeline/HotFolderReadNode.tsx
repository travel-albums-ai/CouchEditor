import SolidChip from '@/components/SolidChip';
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import { Box, Button, Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { FolderInput, Images } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const POLL_INTERVAL_MS = 1000;
const IMAGE_TYPES = new Set([
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'image/webp',
]);

type HotFolderReadData = {
  files?: File[];
};

function isImageFile(file: File): boolean {
  return IMAGE_TYPES.has(file.type) || /\.(avif|bmp|gif|jpe?g|png|tiff?|webp)$/i.test(file.name);
}

async function readImageFiles(directory: FileSystemDirectoryHandle): Promise<File[]> {
  const files: File[] = [];

  for await (const entry of directory.values()) {
    if (entry.kind !== 'file') continue;

    const file = await entry.getFile();
    if (isImageFile(file)) files.push(file);
  }

  return files.sort((left, right) => left.name.localeCompare(right.name));
}

function getFileSnapshot(files: File[]): string {
  return files
    .map((file) => `${file.name}:${file.size}:${file.lastModified}:${file.type}`)
    .join('|');
}

function HotFolderReadNode({
  id,
  data,
}: NodeProps<Node<HotFolderReadData>>) {
  const { setNodes } = useReactFlow();
  const directoryRef = useRef<FileSystemDirectoryHandle | null>(null);
  const pollingRef = useRef(false);
  const snapshotRef = useRef<string | null>(null);
  const [directoryName, setDirectoryName] = useState<string>();
  const [fileCount, setFileCount] = useState(data.files?.length ?? 0);
  const [status, setStatus] = useState('Choose a folder to watch');

  useEffect(() => {
    let disposed = false;

    const poll = async () => {
      const directory = directoryRef.current;
      if (!directory || disposed || pollingRef.current) return;

      pollingRef.current = true;

      try {
        const files = await readImageFiles(directory);
        if (disposed) return;

        const snapshot = getFileSnapshot(files);
        if (snapshot !== snapshotRef.current) {
          snapshotRef.current = snapshot;
          setNodes((current) => current.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, files } }
              : node
          ));
          setFileCount(files.length);
          setStatus(files.length === 0 ? 'Folder is empty' : `Found ${files.length} photos`);
          window.dispatchEvent(new CustomEvent('pipeline:changed'));
        }
      } catch (error: unknown) {
        if (!disposed) {
          console.error('Failed to read hot folder:', error);
          setStatus('Could not read folder');
        }
      } finally {
        pollingRef.current = false;
      }
    };

    void poll();
    const interval = window.setInterval(() => void poll(), POLL_INTERVAL_MS);

    return () => {
      disposed = true;
      window.clearInterval(interval);
    };
  }, [data, id, setNodes]);

  const chooseFolder = async () => {
    try {
      const directory = await window.showDirectoryPicker({ mode: 'read' });
      const permission = await directory.requestPermission({ mode: 'read' });

      if (permission !== 'granted') {
        setStatus('Read permission was denied');
        return;
      }

      directoryRef.current = directory;
      snapshotRef.current = null;
      setDirectoryName(directory.name);
      setStatus('Watching for image changes…');
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Failed to choose hot folder:', error);
      setStatus('Could not access folder');
    }
  };

  return (
    <>
      <NodeWrapper type="hot-folder-read">
        <Button
          variant="outlined"
          startIcon={<FolderInput size={14} />}
          onClick={() => void chooseFolder()}
        >
          {directoryName ?? 'Choose Folder'}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SolidChip count={fileCount} label="Photos" fontSize={16} height={38} icon={<Images size={16} />} minWidth={120} />
          <Typography variant="caption" color="text.secondary">{status}</Typography>
        </Box>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default HotFolderReadNode;
