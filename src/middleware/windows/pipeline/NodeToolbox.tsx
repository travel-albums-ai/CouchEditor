import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
import { Box, Tooltip, Typography } from '@mui/material';
import { Angle, Astroid, ChartColumn, Contrast, Crop, EyeDashed, Film, FolderInput, FolderOutput, Gem, Group, HardDrive, Image, Images, ImageUpscale, Info, Landmark, Lightbulb, Moon, Mountain, Palette, Pipette, Slice, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashedMousePointer, SquaresExclude, Sun, SwatchBook, Theater, Wheat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const paletteItems: Array<{
  type: string;
  labelKey: string;
  icon: React.ReactNode;
  ai?: boolean;
  groupKey: string;
}> = [

  { type: "source", labelKey: "pipelineLocalStorage", icon: <HardDrive size={16} />, groupKey: "pipelineGroupInput" },
  { type: "hot-folder-read", labelKey: "pipelineHotFolder", icon: <FolderInput size={16} />, groupKey: "pipelineGroupInput" },
  { type: "grouper", labelKey: "pipelineGrouper", icon: <Group size={16} />, groupKey: "pipelineGroupInput" },
  { type: "information", labelKey: "pipelineInformation", icon: <Info size={16} />, groupKey: "pipelineGroupInput" },
  { type: "selected-photo", labelKey: "pipelineSelectedPhoto", icon: <Image size={16} />, groupKey: "pipelineGroupInput" },

  { type: "crop", labelKey: "pipelineCrop", icon: <Crop size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "rescale", labelKey: "pipelineRescale", icon: <ImageUpscale size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "rotate", labelKey: "pipelineRotate", icon: <Angle size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "flip", labelKey: "pipelineFlip", icon: <SquareCenterlineDashedVertical size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "mirror", labelKey: "pipelineMirror", icon: <SquareCenterlineDashedHorizontal size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "perspective", labelKey: "pipelinePerspective", icon: <SquareDashedMousePointer size={16} />, groupKey: "pipelineGroupTransform" },

  { type: "exposure", labelKey: "pipelineExposure", icon: <Sun size={16} />, groupKey: "pipelineGroupLight" },
  { type: "brightness", labelKey: "pipelineBrightness", icon: <Lightbulb size={16} />, groupKey: "pipelineGroupLight" },
  { type: "contrast", labelKey: "pipelineContrast", icon: <Contrast size={16} />, groupKey: "pipelineGroupLight" },
  { type: "highlights", labelKey: "pipelineHighlights", icon: <Sun size={16} />, groupKey: "pipelineGroupLight" },
  { type: "shadows", labelKey: "pipelineShadows", icon: <Moon size={16} />, groupKey: "pipelineGroupLight" },
  { type: "gamma", labelKey: "pipelineGamma", icon: <Palette size={16} />, groupKey: "pipelineGroupLight" },
  { type: "luminosity", labelKey: "pipelineLuminosity", icon: <Lightbulb size={16} />, groupKey: "pipelineGroupLight" },

  { type: "saturation", labelKey: "pipelineSaturation", icon: <SwatchBook size={16} />, groupKey: "pipelineGroupColor" },
  { type: "vibrance", labelKey: "pipelineVibrance", icon:<Pipette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "hue-rotation", labelKey: "pipelineHueRotation", icon: <Palette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "black-white", labelKey: "pipelineBlackAndWhite", icon: <Landmark size={16} /> , groupKey: "pipelineGroupColor" },
  { type: "sepia", labelKey: "pipelineSepia", icon: <Palette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "invert", labelKey: "pipelineInvert", icon: <SquaresExclude size={16} />, groupKey: "pipelineGroupColor" },
  { type: "lut", labelKey: "pipelineLut", icon: <Film size={16} />, groupKey: "pipelineGroupColor" },

  { type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} />, groupKey: "pipelineGroupDetail" },
  { type: "ai-denoiser", labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, groupKey: "pipelineGroupDetail", ai: true },
  { type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />, groupKey: "pipelineGroupDetail" },

  { type: "vignette", labelKey: "pipelineVignette", icon: <Theater size={16} />, groupKey: "pipelineGroupEffects" },
  { type: "pop", labelKey: "pipelinePop", icon: <Gem size={16} />, groupKey: "pipelineGroupEffects" },
  { type: "hdr", labelKey: "pipelineHdrEffect", icon: <Mountain size={16} />, groupKey: "pipelineGroupEffects" },
  { type: "fade", labelKey: "pipelineFade", icon: <EyeDashed size={16} />, groupKey: "pipelineGroupEffects" },

  { type: "ai-colorizer", labelKey: "pipelineAiColorizer", icon: <Astroid size={16} />, groupKey: "pipelineGroupAi", ai: true },

  { type: "viewer", labelKey: "pipelinePhotosViewer", icon:<Images size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "viewer-single", labelKey: "pipelinePhotoViewer", icon: <Image size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "photo-histogram", labelKey: "pipelinePhotoHistogram", icon: <ChartColumn size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "hot-folder-write", labelKey: "pipelineHotFolder", icon: <FolderOutput size={16} />, groupKey: "pipelineGroupOutput" },
];

const groupedPaletteItems = paletteItems.reduce((acc, item) => {
  if (!acc[item.groupKey]) {
    acc[item.groupKey] = [];
  }
  acc[item.groupKey].push(item);
  return acc;
}, {} as Record<string, typeof paletteItems>);

function NodeToolbox() {
  const { t } = useTranslation();
  const { setSetting } = useBYOK()
  const enableAI  = useBYOKStoreSelector((state) => state.enableAI)

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      nodeType
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return <>
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      m: 1,
      my: 1.5,
      borderRadius: 2,
      overflow: 'auto',
      p: 1,
    }}>
      {Object.entries(groupedPaletteItems)
        .filter(([group, items]) => enableAI || !items.every(item => item.ai))
        .map(([group, items]) => (
          <Box key={group}
            sx={{
              display: 'flex', flexDirection: 'column', gap: 0
            }}
          >
            <Typography variant="caption" sx={{ mb: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }} color="textDisabled">
              {t(group)}
            </Typography>

            <Box sx={{
              display: 'grid',
              alignContent: 'start',
              mb: 2,
              gridTemplateColumns: 'repeat(2, 140px)',
              gap: 1,
            }}>
              {items
                .filter(item => enableAI || item.ai === undefined)
                .map((item, i) => (
                  <Tooltip title={t('pipelineDragToAdd', { label: t(item.labelKey) })} key={item.type} arrow placement={i % 2 !== 0 ? "right" : "left"}>
                    <Box
                      key={item.type}
                      draggable
                      onDragStart={(event) =>
                        onDragStart(event, item.type)
                      }
                    >
                      <NodeHeader
                        type={item.type}
                      />
                    </Box>
                  </Tooltip>
                ))}
            </Box>
          </Box>
        ))}
    </Box>
  </>
}

export default NodeToolbox;
