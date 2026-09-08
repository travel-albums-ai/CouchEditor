import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import NoPhotos from '@/components/NoPhotos';
import SolidChip from '@/components/SolidChip';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { Cloud, Images, LogIn, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

type GoogleDriveData = {
  files?: File[];
};

type GoogleTokenClient = {
  callback: (response: { access_token?: string; error?: string }) => void;
  error_callback?: (error: unknown) => void;
  requestAccessToken: () => void;
};

type GoogleIdentity = {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (response: { access_token?: string; error?: string }) => void;
        error_callback?: (error: unknown) => void;
      }) => GoogleTokenClient;
    };
  };
};

let googleScriptPromise: Promise<GoogleIdentity> | undefined;

function loadGoogleIdentity(): Promise<GoogleIdentity> {
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve((window as unknown as { google: GoogleIdentity }).google));
      existing.addEventListener('error', () => reject(new Error('Google Identity Services failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve((window as unknown as { google: GoogleIdentity }).google);
    script.onerror = () => reject(new Error('Google Identity Services failed to load'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

function requestAccessToken(clientId: string): Promise<string> {
  return loadGoogleIdentity().then((google) => new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error(response.error ?? 'Google sign-in failed'));
        }
      },
      error_callback: reject,
    });

    client.requestAccessToken();
  }));
}

async function readJpgsFromDrive(accessToken: string): Promise<File[]> {
  const query = encodeURIComponent("mimeType = 'image/jpeg' and trashed = false");
  const listResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&pageSize=10&orderBy=name&fields=files(id,name,mimeType)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!listResponse.ok) throw new Error(`Google Drive list failed (${listResponse.status})`);

  const result = await listResponse.json() as { files?: Array<{ id: string; name: string; mimeType: string }> };
  const files = await Promise.all((result.files ?? []).slice(0, 10).map(async (driveFile) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(driveFile.id)}?alt=media`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!response.ok) throw new Error(`Google Drive download failed (${response.status})`);

    return new File([await response.blob()], driveFile.name, { type: driveFile.mimeType });
  }));

  return files;
}

function GoogleDriveNode({ id, data }: NodeProps<Node<GoogleDriveData>>) {
  const { setNodes } = useReactFlow();
  const { t } = useTranslation();
  const [clientId, setClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const files = data.files ?? [];
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    void loadGoogleIdentity().catch(() => undefined);
  }, []);

  useEffect(() => {
    const urls = files
      .filter((file): file is File => file instanceof File)
      .map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const loadFiles = async () => {
    if (!clientId.trim()) {
      setStatus(t('pipelineGoogleDriveMissingClientId'));
      return;
    }

    setLoading(true);
    setStatus(t('pipelineGoogleDriveSigningIn'));

    try {
      const accessToken = await requestAccessToken(clientId.trim());
      const selectedFiles = await readJpgsFromDrive(accessToken);
      setNodes((current) => current.map((node) => node.id === id
        ? { ...node, data: { ...node.data, files: selectedFiles } }
        : node));
      setStatus(t('pipelineGoogleDriveFoundPhotos', { count: selectedFiles.length }));
      window.dispatchEvent(new CustomEvent('pipeline:changed'));
    } catch (error: unknown) {
      console.error('Failed to read Google Drive:', error);
      setStatus(error instanceof Error ? error.message : t('pipelineGoogleDriveFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <NodeWrapper type="google-drive">
      <TextField
        label={t('pipelineGoogleDriveClientId')}
        value={clientId}
        onChange={(event) => setClientId(event.target.value)}
        size="small"
        fullWidth
        placeholder="...apps.googleusercontent.com"
      />
      <Button
        variant="contained"
        startIcon={loading ? <RefreshCw size={16} /> : <LogIn size={16} />}
        onClick={() => void loadFiles()}
        disabled={loading}
      >
        {loading ? t('pipelineGoogleDriveLoading') : t('pipelineGoogleDriveLoad')}
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SolidChip count={files.length} label={t('pipelinePhotos')} fontSize={16} height={38} icon={<Images size={16} />} minWidth={120} />
        <Cloud size={16} />
        <Typography variant="caption" color="text.secondary">{status}</Typography>
      </Box>

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        {previewUrls.length > 0 ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {previewUrls.map((src, index) => (
              <AlbumPhotoThumbnailBackgroundNg
                key={src}
                photo={{ name: files[index]?.name, src }}
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
      <OutputHandle id="image" position={Position.Top} />
    </NodeWrapper>
  );
}

export default GoogleDriveNode;
