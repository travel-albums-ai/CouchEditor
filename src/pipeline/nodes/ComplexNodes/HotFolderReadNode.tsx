import NewChip from '@/components/NewChip';
import { usePipelineStore } from '@/context/pipelineStore';
import { deleteHotFolderReadHandle, loadHotFolderReadHandle, saveHotFolderReadHandle } from '@/lib/hotFolderHandleStore';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import { Box, Button, IconButton, LinearProgress, MenuItem, TextField, Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { FolderInput, Images, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  selectedHotFolderId?: string;
};

type HotFolderPermissionDescriptor = { mode?: 'read' | 'readwrite' };

type HotFolderDirectoryHandle = FileSystemDirectoryHandle & {
  queryPermission: (descriptor?: HotFolderPermissionDescriptor) => Promise<PermissionState>
  requestPermission: (descriptor?: HotFolderPermissionDescriptor) => Promise<PermissionState>
};

function isImageFile(file: File): boolean {
  return IMAGE_TYPES.has(file.type) || /\.(avif|bmp|gif|jpe?g|png|tiff?|webp)$/i.test(file.name);
}

async function readImageFiles(
  directory: HotFolderDirectoryHandle,
  onImageFound: (count: number) => void,
): Promise<File[]> {
  const files: File[] = [];

  for await (const entry of directory.values()) {
    if (entry.kind !== 'file') continue;

    const file = await entry.getFile();
    if (isImageFile(file)) {
      files.push(file);
      onImageFound(files.length);
    }
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
  const { hotFolderReads, addHotFolderRead, updateHotFolderRead, removeHotFolderRead } = usePipelineStore();
  const { t } = useTranslation();
  const translatorRef = useRef(t);
  const updateHotFolderReadRef = useRef(updateHotFolderRead);
  const directoryRef = useRef<HotFolderDirectoryHandle | null>(null);
  const pollingRef = useRef(false);
  const snapshotRef = useRef<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const selectedHotFolderIdRef = useRef(data.selectedHotFolderId);
  const [directoryName, setDirectoryName] = useState<string>();
  const [fileCount, setFileCount] = useState(data.files?.length ?? 0);
  const [status, setStatus] = useState(() => t('pipelineChooseFolderToWatch'));
  const selectedHotFolder = hotFolderReads.find((item) => item.id === data.selectedHotFolderId);

  useEffect(() => {
    selectedHotFolderIdRef.current = data.selectedHotFolderId;
  }, [data.selectedHotFolderId]);

  useEffect(() => {
    translatorRef.current = t;
  }, [t]);

  useEffect(() => {
    updateHotFolderReadRef.current = updateHotFolderRead;
  }, [updateHotFolderRead]);

  const refreshFiles = useCallback(async (
    directory: HotFolderDirectoryHandle | null = directoryRef.current,
    selectedHotFolderId = selectedHotFolderIdRef.current,
  ) => {
    if (!directory || pollingRef.current) return;

    pollingRef.current = true;
    const isInitialScan = snapshotRef.current === null;
    if (isInitialScan) {
      setIsLoadingFiles(true);
      setFileCount(0);
    }

    try {
      const files = await readImageFiles(directory, (count) => {
        if (isInitialScan) setFileCount(count);
      });
      const snapshot = getFileSnapshot(files);
      if (snapshot === snapshotRef.current) return;

      snapshotRef.current = snapshot;
      setNodes((current) => current.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, files, selectedHotFolderId } }
          : node
      ));
      setFileCount(files.length);
      setStatus(files.length === 0 ? translatorRef.current('pipelineFolderEmpty') : translatorRef.current('pipelineFoundPhotos', { count: files.length }));
      window.dispatchEvent(new CustomEvent('pipeline:changed'));
    } catch (error: unknown) {
      console.error('Failed to read hot folder:', error);
      setStatus(translatorRef.current('pipelineCouldNotReadFolder'));
    } finally {
      pollingRef.current = false;
      setIsLoadingFiles(false);
    }
  }, [id, setNodes]);

  useEffect(() => {
    directoryRef.current = null;
    snapshotRef.current = null;
    setFileCount(0);
    setDirectoryName(undefined);
    if (!selectedHotFolder?.claim) return;

    let disposed = false;

    void loadHotFolderReadHandle(selectedHotFolder.id)
      .then(async (directory) => {
        if (!directory || disposed) return;

        const permission = await (directory as HotFolderDirectoryHandle).queryPermission({ mode: 'read' });
        if (disposed) return;

        updateHotFolderReadRef.current(selectedHotFolder.id, { permission });

        directoryRef.current = directory as HotFolderDirectoryHandle;
        setDirectoryName(directory.name);
        setStatus(permission === 'granted' ? translatorRef.current('pipelineWatchingImageChanges') : translatorRef.current('pipelineReadPermissionDenied'));
        if (permission === 'granted') void refreshFiles(directory as HotFolderDirectoryHandle);
      })
      .catch((error: unknown) => {
        if (!disposed) console.error('Failed to restore hot folder:', error);
      });

    return () => {
      disposed = true;
    };
  }, [refreshFiles, selectedHotFolder?.claim, selectedHotFolder?.id]);

  useEffect(() => {
    void refreshFiles();
    const interval = window.setInterval(() => void refreshFiles(), POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [refreshFiles]);

  const chooseFolder = async () => {
    try {
      const directory = await (window as unknown as Window & {
        showDirectoryPicker: (options?: HotFolderPermissionDescriptor) => Promise<FileSystemDirectoryHandle>
      }).showDirectoryPicker({ mode: 'read' }) as HotFolderDirectoryHandle;
      const folder = {
        id: `hot-folder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        directory: directory.name,
        permission: 'prompt' as PermissionState,
        claim: true,
      };

      const permission = await directory.requestPermission({ mode: 'read' });

      if (permission !== 'granted') {
        setStatus(t('pipelineReadPermissionDenied'));
        return;
      }

      directoryRef.current = directory;
      snapshotRef.current = null;
      setDirectoryName(directory.name);
      setStatus(t('pipelineWatchingImageChanges'));
      await saveHotFolderReadHandle(folder.id, directory);
      addHotFolderRead({ ...folder, directory: directory.name, permission, claim: true });
      await refreshFiles(directory, folder.id);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Failed to choose hot folder:', error);
      setStatus(t('pipelineCouldNotAccessFolder'));
    }
  };

  const deleteFolder = async (folderId: string) => {
    await deleteHotFolderReadHandle(folderId);
    removeHotFolderRead(folderId);

    if (selectedHotFolder?.id !== folderId) return;

    directoryRef.current = null;
    snapshotRef.current = null;
    setDirectoryName(undefined);
    setFileCount(0);
    setStatus(t('pipelineChooseFolderToWatch'));
    setNodes((current) => current.map((node) =>
      node.id === id
        ? { ...node, data: { ...node.data, selectedHotFolderId: undefined, files: [] } }
        : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  return (
    <>
      <NodeWrapper type="hot-folder-read" tools={<PipelineStageTiming nodeId={id} nodeType={'hot-folder-read'} isBusy={setIsBusy} />}>
        {hotFolderReads.length > 0 && <TextField
          select
          disabled={isBusy}
          size="small"
          label={t('pipelineHotFolder')}
          value={selectedHotFolder?.id ?? ''}
          onChange={(event) => setNodes((current) => current.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, selectedHotFolderId: event.target.value } }
              : node
          ))}
          fullWidth
        >
          {hotFolderReads.map((folder) => (
            <MenuItem key={folder.id} value={folder.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {folder.directory ?? folder.id}
                <IconButton
                  size="small"
                  aria-label="Delete hot folder"
                  onClick={(event) => {
                    event.stopPropagation();
                    void deleteFolder(folder.id);
                  }}
                  onMouseDown={(event) => event.stopPropagation()}
                >
                  <Trash2 size={15} />
                </IconButton>
              </Box>
            </MenuItem>
          ))}
        </TextField>}
        <Button
          variant="outlined"
          disabled={isBusy}
          startIcon={<FolderInput size={14} />}
          onClick={() => void chooseFolder()}
        >
          {directoryName ?? t('pipelineChooseFolder')}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NewChip count={fileCount} label={t('pipelinePhotos')} fontSize={18} icon={<Images size={16} />} sx={{ py: 1.5 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {isLoadingFiles ? <>
              <LinearProgress aria-label={t('pipelinePhotos')} />
              <Typography variant="caption" color="text.secondary">
                {t('pipelinePhotos')}: {fileCount}
              </Typography>
            </> : <Typography variant="caption" color="text.secondary">{status}</Typography>}
          </Box>
        </Box>
      </NodeWrapper>
      <OutputHandle id="image" />
    </>
  );
}

export default HotFolderReadNode;
