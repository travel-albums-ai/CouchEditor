// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

import NodeHeader from '@/middleware/windows/pipeline/NodeHeader';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { Angle, Astroid, ChartColumn, Contrast, Crop, EyeDashed, Film, FolderInput, FolderOutput, GalleryVerticalEnd, Gem, Group, HardDrive, Image, Images, ImageUpscale, Landmark, Lightbulb, Moon, Mountain, Palette, Pipette, Slice, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashedMousePointer, SquaresExclude, Sun, SwatchBook, Theater, Wheat } from 'lucide-react';

export const paletteItems: Array<{
  type: string;
  label: string;
  icon: React.ReactNode;
  group: string;
}> = [
  { type: "source", label: "Local Storage", icon: <HardDrive size={16} />, group: "input" },
  { type: "hot-folder-read", label: "Hot Folder", icon: <FolderInput size={16} />, group: "input" },
  { type: "selection", label: "Gallery", icon: <GalleryVerticalEnd size={16} />, group: "input" },
  { type: "grouper", label: "Grouper", icon: <Group size={16} />, group: "utility" },
  { type: "ai-colorizer", label: "AI Colorizer", icon: <Astroid size={16} />, group: "ai" },
  { type: "ai-denoiser", label: "AI Denoiser", icon: <Astroid size={16} />, group: "ai" },
  { type: "invert", label: "Invert", icon: <SquaresExclude size={16} />, group: "color" },
  { type: "black-white", label: "Black & White", icon: <Landmark size={16} /> , group: "color" },
  { type: "sepia", label: "Sepia", icon: <Palette size={16} />, group: "color" },
  { type: "lut", label: "3D LUT", icon: <Film size={16} />, group: "color" },
  { type: "flip", label: "Flip 180°", icon: <SquareCenterlineDashedVertical size={16} />, group: "utility" },
  { type: "mirror", label: "Mirror", icon: <SquareCenterlineDashedHorizontal size={16} />, group: "utility" },
  { type: "rotate", label: "Rotate", icon: <Angle size={16} />, group: "utility" },
  { type: "brightness", label: "Brightness", icon: <Lightbulb size={16} />, group: "basics" },
  { type: "highlights", label: "Highlights", icon: <Sun size={16} />, group: "tone" },
  { type: "shadows", label: "Shadows", icon: <Moon size={16} />, group: "tone" },
  { type: "gamma", label: "Gamma", icon: <Palette size={16} />, group: "adjustment" },
  { type: "luminosity", label: "Luminosity", icon: <Lightbulb size={16} />, group: "adjustment" },
  { type: "exposure", label: "Exposure", icon: <Sun size={16} />, group: "basics" },
  { type: "contrast", label: "Contrast", icon: <Contrast size={16} />, group: "basics" },
  { type: "saturation", label: "Saturation", icon: <SwatchBook size={16} />, group: "adjustment" },
  { type: "vibrance", label: "Vibrance", icon:<Pipette size={16} />, group: "adjustment" },
  { type: "vignette", label: "Vignette", icon: <Theater size={16} />, group: "decorative" },
  { type: "grain", label: "Grain", icon: <Wheat size={16} />, group: "decorative" },
  { type: "sharpen", label: "Sharpen", icon: <Slice size={16} />, group: "decorative" },
  { type: "pop", label: "Pop", icon: <Gem size={16} />, group: "decorative" },
  { type: "hdr", label: "HDR Effect", icon: <Mountain size={16} />, group: "decorative" },
  { type: "hue-rotation", label: "Hue Rotation", icon: <Palette size={16} />, group: "color" },
  { type: "fade", label: "Fade", icon: <EyeDashed size={16} />, group: "decorative" },
  { type: "rescale", label: "Rescale", icon: <ImageUpscale size={16} />, group: "utility" },
  { type: "crop", label: "Crop", icon: <Crop size={16} />, group: "utility" },
  { type: "perspective", label: "Perspective / Tilt", icon: <SquareDashedMousePointer size={16} />, group: "utility" },
  { type: "viewer", label: "Photos Viewer", icon:<Images size={16} />, group: "output" },
  { type: "viewer-single", label: "Photo Viewer", icon: <Image size={16} />, group: "output" },
  { type: "photo-histogram", label: "Photo Histogram", icon: <ChartColumn size={16} />, group: "output" },
  { type: "hot-folder-write", label: "Hot Folder", icon: <FolderOutput size={16} />, group: "output" },
];

const groupedPaletteItems = paletteItems.reduce((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = [];
  }
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof paletteItems>);

function NodeToolbox() {

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
      display: 'flex', flexDirection: 'column',
      gap: 0,
      borderRight: '1px solid',
      borderColor: 'divider',
      overflowY: 'auto',
      pr: 2
    }}>
      {Object.entries(groupedPaletteItems).map(([group, items]) => (
        <Box key={group}
          sx={{
            display: 'flex', flexDirection: 'column', gap: 0
          }}
        >
          <Divider sx={{ mb: 0.5, borderStyle: 'dotted', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: 10 }} color="textDisabled">
              {group}
            </Typography>
          </Divider>

          <Box sx={{
            display: 'grid',
            alignContent: 'start',
            mb: 1,
            gridTemplateColumns: 'repeat(2, 140px)',
            gap: 1,
          }}>
            {items.map((item, i) => (
              <Tooltip title={`Drag to add a ${item.label} to your flow`} key={item.type} arrow placement={i % 2 !== 0 ? "right" : "left"}>
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
