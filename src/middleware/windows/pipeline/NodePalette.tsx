import { brightnessStage, contrastStage, exposureStage, fadeStage, gammaStage, grainStage, highlightsStage, luminosityStage, shadowsStage } from '@/lib/utils';
import { Angle, Astroid, ChartColumn, CheckSquare, Cloud, Contrast, Crop, EyeDashed, FileImage, Film, FolderInput, FolderOutput, Gem, GitFork, Group, HardDrive, Image, Images, ImageUpscale, Info, Landmark, Lightbulb, MapPinned, Minus, Moon, Mountain, Palette, Pipette, Plus, Slice, SlidersHorizontal, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashedMousePointer, SquaresExclude, Sun, SwatchBook, Theater, Thermometer, Wheat } from 'lucide-react';

export type NodePaletteConfig = {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type NodeStageItem = {
  type: string;
  labelKey: string;
  icon: React.ReactNode;
  ai?: boolean;
  algo?: any;
  config?: NodePaletteConfig;
  processing?: 'math';
};
export type NodePaletteItem = NodeStageItem & {
  groupKey: string;
}

const sourceStages: Array<NodeStageItem> = [
  { type: "source", labelKey: "pipelineLocalStorage", icon: <HardDrive size={16} /> },
  { type: "hot-folder-read", labelKey: "pipelineHotFolder", icon: <FolderInput size={16} /> },
  { type: "google-drive", labelKey: "pipelineGoogleDrive", icon: <Cloud size={16} /> },
  { type: "information", labelKey: "pipelineInformation", icon: <Info size={16} /> },
  { type: "selected-photo", labelKey: "pipelineSelectedPhoto", icon: <Image size={16} /> },
];

const loginStages: Array<NodeStageItem> = [
  { type: "grouper", labelKey: "pipelineGrouper", icon: <Group size={16} /> },
  { type: "array-switch", labelKey: "pipelineArraySwitch", icon: <GitFork size={16} /> },
  { type: "array-and", labelKey: "pipelineArrayAnd", icon: <GitFork size={16} /> },
  { type: "array-and-not", labelKey: "pipelineArrayAndNot", icon: <Minus size={16} /> },
  { type: "array-or", labelKey: "pipelineArrayOr", icon: <Plus size={16} /> },
  { type: "image-picker", labelKey: "pipelineImagePicker", icon: <CheckSquare size={16} /> },
  { type: "exif-split", labelKey: "pipelineExifSplit", icon: <FileImage size={16} /> },
  { type: "gps-split", labelKey: "pipelineGpsSplit", icon: <MapPinned size={16} /> },
]

const lightStages: Array<NodeStageItem> = [
  {
    type: "exposure", labelKey: "pipelineExposure", icon: <Sun size={16} />,
    algo: exposureStage, config: { min: -3, max: 3, step: 0.1, defaultValue: 0 },
    processing: 'math'
  },
  { type: "brightness", labelKey: "pipelineBrightness", icon: <Lightbulb size={16} />,
    algo: brightnessStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
  {
    type: "contrast", labelKey: "pipelineContrast", icon: <Contrast size={16} />,
    algo: contrastStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
  { type: "highlights", labelKey: "pipelineHighlights", icon: <Sun size={16} />,
    algo: highlightsStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
  { type: "shadows", labelKey: "pipelineShadows", icon: <Moon size={16} />,
    algo: shadowsStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
  {
    type: "gamma", labelKey: "pipelineGamma", icon: <Palette size={16} />,
    algo: gammaStage, config: {   min: 0.1, max: 3, step: 0.01, defaultValue: 1, },
    processing: 'math'
  },
  { type: "luminosity", labelKey: "pipelineLuminosity", icon: <Lightbulb size={16} />,
    algo: luminosityStage, config: { min: 0, max: 2, step: 0.05, defaultValue: 0 },
    processing: 'math'
  },
  { type: "whites-blacks", labelKey: "pipelineWhitesBlacks", icon: <Sun size={16} />,
    // algo: whitesBlacksStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    // processing: 'math'
  },
  { type: "rgb-black-point", labelKey: "pipelineRgbBlackPoint", icon: <SlidersHorizontal size={16} />,
    // algo: rgbBlackPointStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    // processing: 'math'
  },
  { type: "rgb-white-point", labelKey: "pipelineRgbWhitePoint", icon: <SlidersHorizontal size={16} />,
    // algo: rgbWhitePointStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    // processing: 'math'
  },
  { type: "rgb-midtones", labelKey: "pipelineRgbMidtones", icon: <SlidersHorizontal size={16} />,
    // algo: rgbMidtonesStage, config: { min: -100, max: 100, step: 1, defaultValue: 0 },
    // processing: 'math'
  },
]

const detailStages: Array<NodeStageItem> = [
  { type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} /> },
  { type: "ai-denoiser", labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, ai: true },
  {
    type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />,
    algo: grainStage, config: { min: 0, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
]

const effectsStages: Array<NodeStageItem> = [
  { type: "vignette", labelKey: "pipelineVignette", icon: <Theater size={16} /> },
  { type: "pop", labelKey: "pipelinePop", icon: <Gem size={16} /> },
  { type: "hdr", labelKey: "pipelineHdrEffect", icon: <Mountain size={16} /> },
  {
    type: "fade", labelKey: "pipelineFade", icon: <EyeDashed size={16} />,
    algo: fadeStage, config: { min: 0, max: 100, step: 1, defaultValue: 0 },
    processing: 'math'
  },
]

export const paletteItems: Array<NodePaletteItem> = [
  ...(sourceStages.map(stage => ({ ...stage, groupKey: "pipelineGroupInput" }))),
  ...(loginStages.map(stage => ({ ...stage, groupKey: "pipelineLogicInput" }))),

  { type: "grouper", labelKey: "pipelineGrouper", icon: <Group size={16} />, groupKey: "pipelineLogicInput" },
  { type: "array-switch", labelKey: "pipelineArraySwitch", icon: <GitFork size={16} />, groupKey: "pipelineLogicInput" },
  { type: "array-and", labelKey: "pipelineArrayAnd", icon: <GitFork size={16} />, groupKey: "pipelineLogicInput" },
  { type: "array-and-not", labelKey: "pipelineArrayAndNot", icon: <Minus size={16} />, groupKey: "pipelineLogicInput" },
  { type: "array-or", labelKey: "pipelineArrayOr", icon: <Plus size={16} />, groupKey: "pipelineLogicInput" },
  { type: "image-picker", labelKey: "pipelineImagePicker", icon: <CheckSquare size={16} />, groupKey: "pipelineLogicInput" },
  { type: "exif-split", labelKey: "pipelineExifSplit", icon: <FileImage size={16} />, groupKey: "pipelineLogicInput" },
  { type: "gps-split", labelKey: "pipelineGpsSplit", icon: <MapPinned size={16} />, groupKey: "pipelineLogicInput" },

  { type: "crop", labelKey: "pipelineCrop", icon: <Crop size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "rescale", labelKey: "pipelineRescale", icon: <ImageUpscale size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "collage", labelKey: "pipelineCollage", icon: <Images size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "rotate", labelKey: "pipelineRotate", icon: <Angle size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "flip", labelKey: "pipelineFlip", icon: <SquareCenterlineDashedVertical size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "mirror", labelKey: "pipelineMirror", icon: <SquareCenterlineDashedHorizontal size={16} />, groupKey: "pipelineGroupTransform" },
  { type: "perspective", labelKey: "pipelinePerspective", icon: <SquareDashedMousePointer size={16} />, groupKey: "pipelineGroupTransform" },

  ...(lightStages.map(stage => ({ ...stage, groupKey: "pipelineGroupLight" }))),

  { type: "saturation", labelKey: "pipelineSaturation", icon: <SwatchBook size={16} />, groupKey: "pipelineGroupColor" },
  { type: "vibrance", labelKey: "pipelineVibrance", icon:<Pipette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "hue-rotation", labelKey: "pipelineHueRotation", icon: <Palette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "black-white", labelKey: "pipelineBlackAndWhite", icon: <Landmark size={16} /> , groupKey: "pipelineGroupColor" },
  { type: "sepia", labelKey: "pipelineSepia", icon: <Palette size={16} />, groupKey: "pipelineGroupColor" },
  { type: "invert", labelKey: "pipelineInvert", icon: <SquaresExclude size={16} />, groupKey: "pipelineGroupColor" },
  { type: "lut", labelKey: "pipelineLut", icon: <Film size={16} />, groupKey: "pipelineGroupColor" },
  { type: "temperature-tint", labelKey: "pipelineTemperatureTint", icon: <Thermometer size={16} />, groupKey: "pipelineGroupColor" },
  { type: "split-toning", labelKey: "pipelineSplitToning", icon: <Palette size={16} />, groupKey: "pipelineGroupColor" },

  // { type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} />, groupKey: "pipelineGroupDetail" },
  // { type: "ai-denoiser", labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, groupKey: "pipelineGroupDetail", ai: true },
  // { type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />, groupKey: "pipelineGroupDetail" },

  ...(detailStages.map(stage => ({ ...stage, groupKey: "pipelineGroupDetail" }))),
  ...(effectsStages.map(stage => ({ ...stage, groupKey: "pipelineGroupEffects" }))),

  { type: "ai-colorizer", labelKey: "pipelineAiColorizer", icon: <Astroid size={16} />, groupKey: "pipelineGroupAi", ai: true },
  { type: "ai-photo-editor", labelKey: "pipelineAiPhotoEditor", icon: <Astroid size={16} />, groupKey: "pipelineGroupAi", ai: true },
  { type: "ask-ai", labelKey: "pipelineAskAI", icon: <Astroid size={16} />, groupKey: "pipelineGroupAi", ai: true },

  { type: "viewer", labelKey: "pipelinePhotosViewer", icon:<Images size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "viewer-single", labelKey: "pipelinePhotoViewer", icon: <Image size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "exif-viewer", labelKey: "pipelineExifViewer", icon: <FileImage size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "gps-map", labelKey: "pipelineGpsMap", icon: <MapPinned size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "photo-histogram", labelKey: "pipelinePhotoHistogram", icon: <ChartColumn size={16} />, groupKey: "pipelineGroupOutput" },
  { type: "hot-folder-write", labelKey: "pipelineHotFolder", icon: <FolderOutput size={16} />, groupKey: "pipelineGroupOutput" },
];

export const groupedPaletteItems = paletteItems.reduce((acc, item) => {
  if (!acc[item.groupKey]) {
    acc[item.groupKey] = [];
  }
  acc[item.groupKey].push(item);
  return acc;
}, {} as Record<string, NodePaletteItem[]>);

export const paletteItemsByType = paletteItems.reduce((acc, item) => {
  acc[item.type] = item;
  return acc;
}, {} as Record<string, NodePaletteItem>);
