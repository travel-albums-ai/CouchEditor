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

  processing?: 'math' | 'css';
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
  { type: "crop", labelKey: "pipelineCrop", icon: <Crop size={16} />,
    algo: (crop) => ({ clipPath: `inset(${crop?.top}% ${crop?.right}% ${crop?.bottom}% ${crop?.left}%)` }),
    configs: [
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Top', key: 'top' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Right', key: 'right' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Bottom', key: 'bottom' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Left', key: 'left' },
    ],
    processing: 'css',
    labelDescription: 'Crops the image by rotating it 180 degrees.',
  },
  { type: "rescale", labelKey: "pipelineRescale", icon: <ImageUpscale size={16} /> },
  { type: "collage", labelKey: "pipelineCollage", icon: <Images size={16} /> },
  { type: "rotate", labelKey: "pipelineRotate", icon: <Angle size={16} />,
    algo: (config: any) => ({ transform: `rotate(${config.amount}deg)` }),
    configs: [
      { min: 0, max: 360, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'css',
    labelDescription: 'Rotates the image by the specified amount of degrees.',
  },
  { type: "flip", labelKey: "pipelineFlip", icon: <SquareCenterlineDashedVertical size={16} />,
    algo: () => ({ transform: `rotate(180deg)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Flips the image upside down.',
  },
  { type: "mirror", labelKey: "pipelineMirror", icon: <SquareCenterlineDashedHorizontal size={16} />,
    algo: () => ({ transform: `scaleX(-1)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Mirrors the image horizontally.',
  },
  { type: "perspective", labelKey: "pipelinePerspective", icon: <SquareDashedMousePointer size={16} />,
    algo: () => ({ transform: `perspective(500px)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Applies a perspective transformation to the image.',
  },
]

const lightStages: Array<NodeStageItem> = [
  {
    type: "exposure", labelKey: "pipelineExposure", icon: <Sun size={16} />,
    algo: ({ amount }: { amount: number }) => exposureStage(amount),
    configs: [
      { min: -3, max: 3, step: 0.1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the exposure of the image, making it brighter or darker.',
  },
  {
    type: "brightness", labelKey: "pipelineBrightness", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => brightnessStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the brightness of the image, making it lighter or darker.',
  },
  {
    type: "contrast", labelKey: "pipelineContrast", icon: <Contrast size={16} />,
    algo: ({ amount }: { amount: number }) => contrastStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the contrast of the image, making the darks darker and the lights lighter.',
  },
  {
    type: "highlights", labelKey: "pipelineHighlights", icon: <Sun size={16} />,
    algo: ({ amount }: { amount: number }) => highlightsStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the highlights of the image, affecting the brighter areas.',
  },
  {
    type: "shadows", labelKey: "pipelineShadows", icon: <Moon size={16} />,
    algo: ({ amount }: { amount: number }) => shadowsStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the shadows of the image, affecting the darker areas.',
  },
  {
    type: "gamma", labelKey: "pipelineGamma", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => gammaStage(amount),
    configs: [
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Applies gamma correction to the image, affecting the midtones.',
  },
  {
    type: "luminosity", labelKey: "pipelineLuminosity", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => luminosityStage(amount),
    configs: [
      { min: 0, max: 2, step: 0.05, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the overall luminosity of the image.',
  },
  { type: "whites-blacks", labelKey: "pipelineWhitesBlacks", icon: <Sun size={16} />,
    algo: ({ whites, blacks }: { whites: number, blacks: number }) => whitesBlacksStage(whites, blacks),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Whites', key: 'whites' },
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Blacks', key: 'blacks' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the whites and blacks of the image, affecting the brightest and darkest areas.',
  },
  { type: "rgb-black-point", labelKey: "pipelineRgbBlackPoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbBlackPointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Red', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Green', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the black point of the RGB channels, affecting the darkest areas of the image.',
  },
  { type: "rgb-white-point", labelKey: "pipelineRgbWhitePoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbWhitePointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Red', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Green', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the white point of the RGB channels, affecting the brightest areas of the image.',
  },
  { type: "rgb-midtones", labelKey: "pipelineRgbMidtones", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbMidtonesStage(red, green, blue),
    configs: [
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Red', key: 'red' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Green', key: 'green' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'Blue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the midtones of the RGB channels, affecting the middle range of brightness in the image.',
  },
]

const colorStages: Array<NodeStageItem> = [
  {
    type: "saturation", labelKey: "pipelineSaturation", icon: <SwatchBook size={16} />,
    algo: ({ amount }: { amount: number }) => saturationStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the saturation of the image colors, enhancing or reducing the overall color vibrancy.',
  },
  {
    type: "vibrance", labelKey: "pipelineVibrance", icon:<Pipette size={16} />,
    algo: ({ amount }: { amount: number }) => vibranceStage(amount),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Enhances the vibrancy of the colors in the image while protecting skin tones from oversaturation.',
  },
  {
    type: "hue-rotation", labelKey: "pipelineHueRotation", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => hueRotationStage(amount),
    configs: [
      { min: -180, max: 180, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Rotates the hue of the image colors by the specified amount.',
  },
  { type: "black-white", labelKey: "pipelineBlackAndWhite", icon: <Landmark size={16} />,
    algo: () => ({ filter: `grayscale(1)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Converts the image to black and white by applying a grayscale filter.',
  },
  { type: "sepia", labelKey: "pipelineSepia", icon: <Palette size={16} />,
    algo: () => ({ filter: `sepia(1)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Applies a sepia filter to the image, giving it a warm, brownish tone.',
  },
  { type: "invert", labelKey: "pipelineInvert", icon: <SquaresExclude size={16} />,
    algo: () => ({ filter: `invert(1)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'Inverts the colors of the image by applying an invert filter.',
  },
  { type: "lut", labelKey: "pipelineLut", icon: <Film size={16} />,
    labelDescription: 'Applies a lookup table (LUT) to the image for color grading.'
  },
  { type: "temperature-tint", labelKey: "pipelineTemperatureTint", icon: <Thermometer size={16} />,
    algo: ({ temperature, tint }: { temperature: number, tint: number }) => temperatureTintStage(temperature, tint),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'Temperature', key: 'temperature' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'Tint', key: 'tint' }
    ],
    processing: 'math',
    labelDescription: 'Adjusts the temperature and tint of the image, allowing for color balance corrections.',
  },
  { type: "split-toning", labelKey: "pipelineSplitToning", icon: <Palette size={16} />,
    algo: ({ shadowTint, highlightTint, strength }: { shadowTint: [number, number, number], highlightTint: [number, number, number], strength: number }) =>
      splitToningStage(shadowTint[0], shadowTint[1], shadowTint[2], highlightTint[0], highlightTint[1], highlightTint[2], strength),

    configs: [
      { min: 0, max: 10, step: 1, defaultValue: 50, labelKey: 'Strength', key: 'strength' }
    ],
    processing: 'math',
    labelDescription: 'Applies split toning to the image, allowing separate color adjustments for shadows and highlights.',
  },
]

const detailStages: Array<NodeStageItem> = [
  {
    type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} />,
    algo: ({ amount }: { amount: number }) => sharpenStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'Sharpens the image by enhancing the edges and fine details.',
  },
  { type: "ai-denoiser", labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, ai: true, labelDescription: 'Reduces noise in the image using AI-based denoising algorithms.' },
  {
    type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />,
    algo: ({ amount }: { amount: number }) => grainStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'Adds grain to the image, simulating the texture of film photography.',
  },
]

const effectsStages: Array<NodeStageItem> = [
  { type: "vignette", labelKey: "pipelineVignette", icon: <Theater size={16} />,
    algo: ({ amount, color }: { amount: number, color: [number, number, number] }) => vignetteStage(amount, color),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'Applies a vignette effect to the image, darkening the corners and edges.',
  },
  {
    type: "pop", labelKey: "pipelinePop", icon: <Gem size={16} />,
    algo: ({ amount }: { amount: number }) => popStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'Enhances the overall contrast and color vibrancy of the image.',
  },
  { type: "hdr", labelKey: "pipelineHdrEffect", icon: <Mountain size={16} />,
    algo: ({ amount, radius }: { amount: number, radius: number }) => hdrEffectStage(amount, radius),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'Amount', key: 'amount' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'Radius', key: 'radius' },
    ],
    processing: 'math',
    labelDescription: 'Applies an HDR effect to the image, enhancing details in both shadows and highlights.',
  },
  {
    type: "fade", labelKey: "pipelineFade", icon: <EyeDashed size={16} />,
    algo: ({ amount }: { amount: number }) => fadeStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'Applies a fade effect to the image, reducing contrast and giving a washed-out look.',
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
