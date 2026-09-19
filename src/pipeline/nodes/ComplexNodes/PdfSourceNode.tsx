import GridVirtuoso from '@/components/GridVirtuoso';
import NewChip from '@/components/NewChip';
import NoPhotos from '@/components/NoPhotos';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/pipeline/components/PipelineStageTiming';
import type { ImageValue } from '@/types/types';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { Files, FileText, Upload } from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PagePreview = ImageValue;
type RenderedPage = { preview: PagePreview; file: File };
type PdfSourceData = { files?: File[]; pdfPages?: File[]; pdfResolution?: number };
const PDF_RESOLUTIONS = [512, 1024, 2048, 4096] as const;

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

async function renderPdfPreviews(file: File, maxDimension: number): Promise<RenderedPage[]> {
  const pdfDocument = await getDocument({
    data: await file.arrayBuffer(),
  }).promise;
  const pages: RenderedPage[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      const page = await pdfDocument.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = maxDimension / Math.max(baseViewport.width, baseViewport.height);
      const viewport = page.getViewport({ scale });
      const canvas = window.document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext('2d');

      if (!context) continue;

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 1);
      });

      if (!blob) continue;

      const name = `${file.name} - ${pageNumber}`;
      const pageFile = new File([blob], `${name}.jpg`, { type: 'image/jpeg' });
      pages.push({
        file: pageFile,
        preview: {
          name,
          src: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
          byteSize: blob.size,
        },
      });
      page.cleanup();
    }
  } finally {
    pdfDocument.cleanup();
  }

  return pages;
}

function PdfSourceNode({ id, data }: NodeProps<Node<PdfSourceData>>) {
  const { t } = useTranslation();
  const [files, setFiles] = useState(data.files ?? []);
  const [resolution, setResolution] = useState(data.pdfResolution ?? 2048);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const previewUrls = useRef<string[]>([]);

  const revokePagePreviews = useCallback(() => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = [];
  }, []);

  useEffect(() => {
    let cancelled = false;
    revokePagePreviews();

    const loadPreviews = async () => {
      const previews = await Promise.all(
        files
          .filter((file): file is File => file instanceof File)
          .map((file) => renderPdfPreviews(file, resolution))
      );

      if (!cancelled) {
        const renderedPages = previews.flat();
        Reflect.set(data, 'pdfPages', renderedPages.map(({ file }) => file));
        previewUrls.current = renderedPages.map(({ preview }) => preview.src);
        setPages(renderedPages.map(({ preview }) => preview));
        window.dispatchEvent(new CustomEvent('pipeline:changed'));
      } else {
        previews.flat().forEach(({ preview }) => URL.revokeObjectURL(preview.src));
      }
    };

    setPages([]);
    Reflect.set(data, 'pdfPages', []);
    void loadPreviews();

    return () => {
      cancelled = true;
      revokePagePreviews();
    };
  }, [data, files, resolution, revokePagePreviews]);

  useEffect(() => {
    const handleClearCaches = () => {
      revokePagePreviews();
      Reflect.set(data, 'pdfPages', []);
      setPages([]);
      setFiles((current) => [...current]);
    };

    window.addEventListener('pipeline:clear-caches', handleClearCaches);
    return () => window.removeEventListener('pipeline:clear-caches', handleClearCaches);
  }, [data, revokePagePreviews]);

  const acceptFiles = (selected: File[]) => selected.filter(
    (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  );

  const updateFiles = (selected: File[]) => {
    if (selected.length === 0) return;

    Reflect.set(data, 'files', selected);
    Reflect.set(data, 'pdfPages', []);
    setFiles(selected);
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  };

  return (
    <NodeWrapper type="pdf-source" tools={<PipelineStageTiming nodeId={id} nodeType="pdf-source" isBusy={setIsBusy} />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, borderBottom: '1px dotted', borderColor: 'divider', pb: 2 }}>
        <Button
          sx={{
            bgcolor: theme => `color-mix(in srgb, ${theme.palette.background.paper} 80%, ${theme.palette.primary.main} 20%)`,
            '&:hover': { bgcolor: 'primary.main' },
          }}
          fullWidth
          disabled={isBusy}
          component="label"
          variant="contained"
          startIcon={<Upload size={16} />}
        >
          {t('pipelinePdfSourceSelect')}
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            hidden
            onChange={(event) => {
              updateFiles(acceptFiles(Array.from(event.target.files ?? [])));
              event.target.value = '';
            }}
          />
        </Button>
        <Select
          size="small"
          value={resolution}
          aria-label={t('pipelinePdfSourcePages')}
          onChange={(event) => {
            const nextResolution = Number(event.target.value);
            Reflect.set(data, 'pdfResolution', nextResolution);
            setResolution(nextResolution);
          }}
          sx={{ minWidth: 76, height: 38 }}
        >
          {PDF_RESOLUTIONS.map((value) => (
            <MenuItem key={value} value={value}>{value >= 1024 ? `${value / 1024}K` : '0.5K'}</MenuItem>
          ))}
        </Select>
        <NewChip count={files.length} label={t('pipelinePdfSourceFiles')} fontSize={16} icon={<Files size={16} />} sx={{ height: 38 }} />
        <NewChip count={pages.length} label={t('pipelinePdfSourcePages')} fontSize={16} icon={<FileText size={16} />} sx={{ height: 38 }} />
      </Box>

      <Box
        className="nowheel"
        sx={{ height: '900px', width: '900px', overflow: 'auto', position: 'relative', border: '1px dashed', borderColor: isDragActive ? 'primary.main' : 'transparent', bgcolor: isDragActive ? 'action.hover' : 'transparent' }}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setIsDragActive(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragActive(false);
          updateFiles(acceptFiles(Array.from(event.dataTransfer.files)));
        }}
      >
        {isDragActive && (
          <Box sx={{ position: 'absolute', inset: 8, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', border: '2px dashed', borderColor: 'primary.main', bgcolor: 'background.paper', opacity: 0.94 }}>
            <Typography variant="h6" color="primary.main">{t('pipelinePdfSourceDrop')}</Typography>
          </Box>
        )}
        {pages.length > 0 ? <GridVirtuoso isBusy={isBusy} photos={pages} /> : <NoPhotos />}
      </Box>

      <OutputHandle id="image" position={Position.Top} />
    </NodeWrapper>
  );
}

export default PdfSourceNode;
