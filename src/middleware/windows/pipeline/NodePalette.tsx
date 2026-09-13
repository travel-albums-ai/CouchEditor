import { brightnessStage, contrastStage, exposureStage, fadeStage, gammaStage, grainStage, hdrEffectStage, highlightsStage, hueRotationStage, luminosityStage, popStage, rgbBlackPointStage, rgbMidtonesStage, rgbWhitePointStage, saturationStage, shadowsStage, sharpenStage, splitToningStage, temperatureTintStage, vibranceStage, vignetteStage, whitesBlacksStage } from '@/lib/utils';
import { Angle, Astroid, ChartColumn, CheckSquare, Cloud, Contrast, Crop, EyeDashed, FileImage, Film, FolderInput, FolderOutput, Gem, GitFork, Group, HardDrive, Image, Images, ImageUpscale, Info, Landmark, Lightbulb, MapPinned, Minus, Moon, Mountain, Palette, Pipette, Plus, Slice, SlidersHorizontal, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashedMousePointer, SquaresExclude, Sun, SwatchBook, Theater, Thermometer, Wheat } from 'lucide-react';

export type NodePaletteConfig = {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;

  labelKey?: string;
  key: string,
};

export type NodeStageItem = {
  type: string;
  labelKey: string;

  labelDescription?: string;
  icon: React.ReactNode;
  ai?: boolean;
  algo?: any;
  config?: NodePaletteConfig;

  configs?: NodePaletteConfig[];

  processing?: 'math' | 'css' | 'complex';
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

const logicStages: Array<NodeStageItem> = [
  { type: "grouper", labelKey: "pipelineGrouper", icon: <Group size={16} /> },
  { type: "array-switch", labelKey: "pipelineArraySwitch", icon: <GitFork size={16} /> },
  { type: "array-and", labelKey: "pipelineArrayAnd", icon: <GitFork size={16} /> },
  { type: "array-and-not", labelKey: "pipelineArrayAndNot", icon: <Minus size={16} /> },
  { type: "array-or", labelKey: "pipelineArrayOr", icon: <Plus size={16} /> },
  { type: "image-picker", labelKey: "pipelineImagePicker", icon: <CheckSquare size={16} /> },
  { type: "exif-split", labelKey: "pipelineExifSplit", icon: <FileImage size={16} /> },
  { type: "gps-split", labelKey: "pipelineGpsSplit", icon: <MapPinned size={16} /> },
]

const transformStages: Array<NodeStageItem> = [
  { type: "crop", labelKey: "pipelineCrop", icon: <Crop size={16} /> },
  { type: "rescale", labelKey: "pipelineRescale", icon: <ImageUpscale size={16} /> },
  { type: "collage", labelKey: "pipelineCollage", icon: <Images size={16} /> },
  { type: "rotate", labelKey: "pipelineRotate", icon: <Angle size={16} />,
    algo: (config: any) => ({ transform: `rotate(${config.amount}deg)` }),
    configs: [
      { min: 0, max: 360, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'css'
  },
  { type: "flip", labelKey: "pipelineFlip", icon: <SquareCenterlineDashedVertical size={16} />,
    algo: (config: any) => ({ transform: `rotate(180deg)` }),
    configs: [{ min: 0, max: 0 }],
    processing: 'css'
  },
  { type: "mirror", labelKey: "pipelineMirror", icon: <SquareCenterlineDashedHorizontal size={16} />,
    algo: (config: any) => ({ transform: `scaleX(-1)` }),
    configs: [{ min: 0, max: 0 }],
    processing: 'css'
  },
  { type: "perspective", labelKey: "pipelinePerspective", icon: <SquareDashedMousePointer size={16} /> },
]

const lightStages: Array<NodeStageItem> = [
  {
    type: "exposure", labelKey: "pipelineExposure", icon: <Sun size={16} />,
    algo: ({ amount }: { amount: number }) => exposureStage(amount),
    configs: [{ min: -3, max: 3, step: 0.1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "brightness", labelKey: "pipelineBrightness", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => brightnessStage(amount),
    configs: [{ min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "contrast", labelKey: "pipelineContrast", icon: <Contrast size={16} />,
    algo: ({ amount }: { amount: number }) => contrastStage(amount),
    configs: [{ min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "highlights", labelKey: "pipelineHighlights", icon: <Sun size={16} />,
    algo: ({ amount }: { amount: number }) => highlightsStage(amount),
    configs: [{ min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "shadows", labelKey: "pipelineShadows", icon: <Moon size={16} />,
    algo: ({ amount }: { amount: number }) => shadowsStage(amount),
    configs: [{ min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "gamma", labelKey: "pipelineGamma", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => gammaStage(amount),
    configs: [{   min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "luminosity", labelKey: "pipelineLuminosity", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => luminosityStage(amount),
    configs: [{ min: 0, max: 2, step: 0.05, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  { type: "whites-blacks", labelKey: "pipelineWhitesBlacks", icon: <Sun size={16} />,
    algo: ({ whites, blacks }: { whites: number, blacks: number }) => whitesBlacksStage(whites, blacks),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Whites', key: 'whites' },
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Blacks', key: 'blacks' }
    ],
    processing: 'complex'
  },
  { type: "rgb-black-point", labelKey: "pipelineRgbBlackPoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbBlackPointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Red', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Green', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math'
  },
  { type: "rgb-white-point", labelKey: "pipelineRgbWhitePoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbWhitePointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Red', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Green', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math'
  },
  { type: "rgb-midtones", labelKey: "pipelineRgbMidtones", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbMidtonesStage(red, green, blue),
    configs: [
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Red', key: 'red' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Green', key: 'green' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math'
  },
]

const colorStages: Array<NodeStageItem> = [
  {
    type: "saturation", labelKey: "pipelineSaturation", icon: <SwatchBook size={16} />,
    algo: ({ amount }: { amount: number }) => saturationStage(amount),
    configs: [{ min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'Adjusts the intensity of the color saturation. The algorithm modifies the saturation level of the image colors. It applies the specified adjustment to enhance or reduce the overall color vibrancy.',
  },
  {
    type: "vibrance", labelKey: "pipelineVibrance", icon:<Pipette size={16} />,
    algo: ({ amount }: { amount: number }) => vibranceStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  {
    type: "hue-rotation", labelKey: "pipelineHueRotation", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => hueRotationStage(amount),
    configs: [{ min: -180, max: 180, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  { type: "black-white", labelKey: "pipelineBlackAndWhite", icon: <Landmark size={16} />,
    algo: (config: any) => ({ filter: `grayscale(1)` }),
    configs: [{ min: 0, max: 0 }],
    processing: 'css'
  },
  { type: "sepia", labelKey: "pipelineSepia", icon: <Palette size={16} />,
    algo: (config: any) => ({ filter: `sepia(1)` }),
    configs: [{ min: 0, max: 0 }],
    processing: 'css'
  },
  { type: "invert", labelKey: "pipelineInvert", icon: <SquaresExclude size={16} />,
    algo: (config: any) => ({ filter: `invert(1)` }),
    configs: [{ min: 0, max: 0 }],
    processing: 'css'
  },
  { type: "lut", labelKey: "pipelineLut", icon: <Film size={16} /> },
  { type: "temperature-tint", labelKey: "pipelineTemperatureTint", icon: <Thermometer size={16} />,
    algo: ({ temperature, tint }: { temperature: number, tint: number }) => temperatureTintStage(temperature, tint),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'Temperature', key: 'temperature' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'Tint', key: 'tint' }
    ],
    processing: 'complex'
  },
  { type: "split-toning", labelKey: "pipelineSplitToning", icon: <Palette size={16} />,
    algo: ({ shadowTint, highlightTint, strength }: { shadowTint: [number, number, number], highlightTint: [number, number, number], strength: number }) =>
      splitToningStage(shadowTint[0], shadowTint[1], shadowTint[2], highlightTint[0], highlightTint[1], highlightTint[2], strength),

    configs: [{ min: 0, max: 100, step: 1, defaultValue: 50 }],
    processing: 'complex'

  },
]

const detailStages: Array<NodeStageItem> = [
  {
    type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} />,
    algo: ({ amount }: { amount: number }) => sharpenStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  { type: "ai-denoiser", labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, ai: true },
  {
    type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />,
    algo: ({ amount }: { amount: number }) => grainStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
]

const effectsStages: Array<NodeStageItem> = [
  { type: "vignette", labelKey: "pipelineVignette", icon: <Theater size={16} />,
    algo: ({ amount, color }: { amount: number, color: [number, number, number] }) => vignetteStage(amount, color),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'complex'
  },
  {
    type: "pop", labelKey: "pipelinePop", icon: <Gem size={16} />,
    algo: ({ amount }: { amount: number }) => popStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
  { type: "hdr", labelKey: "pipelineHdrEffect", icon: <Mountain size={16} />,
    algo: ({ amount, radius }: { amount: number, radius: number }) => hdrEffectStage(amount, radius),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Amount', key: 'amount' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Radius', key: 'radius' },
    ],
    processing: 'complex'
  },
  {
    type: "fade", labelKey: "pipelineFade", icon: <EyeDashed size={16} />,
    algo: ({ amount }: { amount: number }) => fadeStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math'
  },
]

const aiStages: Array<NodeStageItem> = [
  { type: "ai-colorizer", labelKey: "pipelineAiColorizer", icon: <Astroid size={16} /> },
  { type: "ai-photo-editor", labelKey: "pipelineAiPhotoEditor", icon: <Astroid size={16} /> },
  { type: "ask-ai", labelKey: "pipelineAskAI", icon: <Astroid size={16} /> },
]

const outputStages: Array<NodeStageItem> = [
  { type: "viewer", labelKey: "pipelinePhotosViewer", icon:<Images size={16} /> },
  { type: "viewer-single", labelKey: "pipelinePhotoViewer", icon: <Image size={16} /> },
  { type: "exif-viewer", labelKey: "pipelineExifViewer", icon: <FileImage size={16} /> },
  { type: "gps-map", labelKey: "pipelineGpsMap", icon: <MapPinned size={16} /> },
  { type: "photo-histogram", labelKey: "pipelinePhotoHistogram", icon: <ChartColumn size={16} /> },
  { type: "hot-folder-write", labelKey: "pipelineHotFolder", icon: <FolderOutput size={16} /> },
]

export const paletteItems: Array<NodePaletteItem> = [
  ...(sourceStages.map(stage => ({ ...stage, groupKey: "pipelineGroupInput" }))),
  ...(logicStages.map(stage => ({ ...stage, groupKey: "pipelineLogicInput" }))),
  ...(transformStages.map(stage => ({ ...stage, groupKey: "pipelineGroupTransform" }))),
  ...(lightStages.map(stage => ({ ...stage, groupKey: "pipelineGroupLight" }))),
  ...(colorStages.map(stage => ({ ...stage, groupKey: "pipelineGroupColor" }))),
  ...(detailStages.map(stage => ({ ...stage, groupKey: "pipelineGroupDetail" }))),
  ...(effectsStages.map(stage => ({ ...stage, groupKey: "pipelineGroupEffects" }))),
  ...(aiStages.map(stage => ({ ...stage, groupKey: "pipelineGroupAi", ai: true }))),
  ...(outputStages.map(stage => ({ ...stage, groupKey: "pipelineGroupOutput" }))),
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
