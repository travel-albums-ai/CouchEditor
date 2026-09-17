import { NodePaletteItem, NodeType } from '@/pipeline/NodePalette';
import { PreviewBeforeAfter } from '@/pipeline/components/PreviewBeforeAfter';
import { PreviewDescription } from '@/pipeline/components/PreviewDescription';
import PreviewTitle from '@/pipeline/components/PreviewTitle';
import { Box, Skeleton, useTheme } from '@mui/material';
import { ChartColumn, Cloud, Download, Eye, Flame, Folder, Map, Plus, Slash } from 'lucide-react';
import { useTranslation } from 'react-i18next';


type AdjustmentPreviewProps = {
  paletteItem: NodePaletteItem;
  width?: number;
  showText?: boolean;
};

const FolderImages =  ({ images, border = true }: { images: string[], border?: boolean }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', p: 0.5, border: border ? 1 : 0, borderColor: 'divider', borderRadius: 2 }}>
    {images.map((src, index) => (
      <img key={index} src={src} style={{ width: `20px`, borderRadius: '4px' }} />
    ))}
  </Box>
);

export function PreviewDemoStatic({ paletteItem, width, showText = false }: AdjustmentPreviewProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const sourceStages = {
    [NodeType.Source]: {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Folder color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.HotFolderRead]: {
      before: <Box sx={{ p: 2, py: 1, gap: 2, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Folder color={theme.palette.primary.main} />
        <Eye color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.GoogleDrive]: {
      before: <Box sx={{ p: 2, py: 1, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Cloud color={theme.palette.primary.main} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.Information]: {
      before: <Box sx={{ display: 'flex', flexDirection: 'column', border: 1, borderColor: theme.palette.divider, borderRadius: 2, p: 1 }}>
        <Skeleton width={90} height={16} />
        <Skeleton width={90} height={16} />
        <Skeleton width={90} height={16} />
      </Box>,
      after: undefined
    },
    [NodeType.SelectedPhoto]: {
      before: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
  }

  const logicStages = {
    [NodeType.Grouper]: {
      before: <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <FolderImages images={['sample.jpg']} />
        <Plus color={theme.palette.primary.main} />
        <FolderImages images={['sample2.jpg']} />
      </Box>,
      after: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>
    },
    [NodeType.ArraySwitch]: {
      before: <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, opacity: 0.5 }} />
        <Slash color={theme.palette.primary.main} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>,
      after: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>
    },
    [NodeType.ArrayAnd]: {
      before: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <FolderImages images={['sample.jpg', 'sample2.jpg']} />
        <Plus color={theme.palette.primary.main} />
        <FolderImages images={['sample3.jpg', 'sample2.jpg']} />
      </Box>,
      after: <FolderImages images={['sample3.jpg', 'sample2.jpg', 'sample.jpg']} />
    },
    [NodeType.ArrayOr]: {
      before: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <FolderImages images={['sample.jpg', 'sample2.jpg']} />
        <Plus color={theme.palette.primary.main} />
        <FolderImages images={['sample3.jpg', 'sample2.jpg']} />
      </Box>,
      after: <FolderImages images={[ 'sample3.jpg', 'sample.jpg']} />
    },
    [NodeType.ArrayAndNot]: {
      before: <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <FolderImages images={['sample.jpg', 'sample2.jpg']} />
        <Plus color={theme.palette.primary.main} />
        <FolderImages images={['sample3.jpg', 'sample2.jpg']} />
      </Box>,
      after: <FolderImages images={[ 'sample2.jpg']} />
    },
    [NodeType.ExifSplit]: {
      before: <FolderImages images={['sample.jpg', 'sample2.jpg']} />,
      after: <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <Slash color={theme.palette.primary.main} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>
    },
    [NodeType.GpsSplit]: {
      before: <FolderImages images={['sample.jpg', 'sample2.jpg']} />,
      after: <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <Slash color={theme.palette.primary.main} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>
    },

  }

  const otherStages = {
    [NodeType.ImagePicker]: {
      before: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
        <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.MergeChannels]: {
      before: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(90deg) ' }} />
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(180deg)' }} />
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(270deg)' }} />
      </Box>,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.SplitChannels]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(90deg) ' }} />
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(180deg)' }} />
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'hue-rotate(270deg)' }} />
      </Box>,
    },
    [NodeType.AiColorizer]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'grayscale(100%)' }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.Lut]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, filter: 'saturate(140%) contrast(150%)' }} />
    },
    [NodeType.AiDenoiser]: {
      before: <img src="aiDenoise.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.Rescale]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${30}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.Crop]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${30}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`, clipPath: 'polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)' }} />
    },
    [NodeType.Perspective]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}`,        transform: 'perspective(120px) rotateY(-35deg)',
        transformOrigin: 'center' }} />
    },
    [NodeType.Collage]: {
      before: <FolderImages images={['sample.jpg', 'sample2.jpg']} />,
      after: <FolderImages images={['sample.jpg', 'sample2.jpg']} border={false} />
    },
  }

  const aiStages = {
    [NodeType.AskAi]: {
      before: <img src="sample2.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample3.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.AiPhotoEditor]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <img src="sample3.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
  }

  const outputStages = {
    [NodeType.ExifViewer]: {
      before: <Box sx={{ display: 'flex', gap: 1 }}>
        <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
      </Box>,
      after: <Box sx={{ display: 'flex', flexDirection: 'column', border: 1, borderColor: theme.palette.divider, borderRadius: 2, p: 1 }}>
        <Skeleton width={90} height={16} />
        <Skeleton width={90} height={16} />
        <Skeleton width={90} height={16} />
      </Box>
    },
    [NodeType.ViewerSingle]: {
      before: <FolderImages images={['sample.jpg', 'sample2.jpg', 'sample3.jpg']} />,
      after: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />
    },
    [NodeType.GpsMap]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <Box sx={{ p: 2, py: 1, gap: 2, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Map color={theme.palette.primary.main} />
      </Box>,
    },
    [NodeType.PhotoHistogram]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <Box sx={{ p: 2, py: 1, gap: 2, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ChartColumn color={theme.palette.primary.main} />
      </Box>,
    },
    [NodeType.Viewer]: {
      before: <FolderImages images={['sample.jpg', 'sample2.jpg', 'sample3.jpg']} />,
      after: <Box sx={{ p: 2, py: 1, gap: 2, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Eye color={theme.palette.primary.main} />
        <Download color={theme.palette.primary.main} />
      </Box>,
    },
    [NodeType.HotFolderWrite]: {
      before: <img src="sample.jpg" style={{ width: `${width ?? 90}px`, borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }} />,
      after: <Box sx={{ p: 2, py: 1, gap: 2, border: 1, borderColor: theme.palette.divider, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Flame color={theme.palette.primary.main} />
        <Folder color={theme.palette.primary.main} />
      </Box>,
    },
  }

  const imagesPairs = {
    ...sourceStages,
    ...logicStages,
    ...aiStages,
    ...otherStages,
    ...outputStages,
  } as Record<NodeType, { before: React.ReactNode; after: React.ReactNode }>

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 0.5,
      p: 1,
      justifyContent: 'center',
      transition: 'opacity 0.25s ease',
      '&:hover': {
        opacity: 1,
      }
    }}>
      {imagesPairs[paletteItem.type] && <Box sx={{ p: 1 }}>
        <PreviewBeforeAfter
          width={width ?? 90}
          after={imagesPairs[paletteItem.type].after}
          before={imagesPairs[paletteItem.type].before || <></>}
        />
      </Box>}

      {showText && (
        <>
          <PreviewTitle paletteItem={paletteItem} />
          <PreviewDescription paletteItem={paletteItem} />
        </>
      )}
    </Box>
  );
}
