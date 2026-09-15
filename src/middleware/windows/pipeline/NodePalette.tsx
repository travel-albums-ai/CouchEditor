import { blackAndWhiteStage, brightnessStage, contrastStage, exposureStage, fadeStage, gammaStage, grainStage, hdrEffectStage, highlightsStage, hueRotationStage, invertStage, luminosityStage, popStage, rgbBlackPointStage, rgbMidtonesStage, rgbWhitePointStage, saturationStage, sepiaStage, shadowsStage, sharpenStage, splitToningStage, temperatureTintStage, vibranceStage, vignetteStage, whitesBlacksStage } from '@/lib/utils';
import { Angle, Astroid, ChartColumn, CheckSquare, Cloud, Contrast, Crop, EyeDashed, FileImage, Film, FolderInput, FolderOutput, Gem, GitFork, Group, HardDrive, Image, Images, ImageUpscale, Info, Landmark, Lightbulb, MapPinned, Merge, Minus, Moon, Mountain, Palette, Pipette, Plus, Slice, SlidersHorizontal, Split, SquareCenterlineDashedHorizontal, SquareCenterlineDashedVertical, SquareDashedMousePointer, SquaresExclude, Sun, SwatchBook, Theater, Thermometer, Wheat } from 'lucide-react';

export enum NodeType {
  Source = 'source',
  HotFolderRead = 'hot-folder-read',
  GoogleDrive = 'google-drive',
  Information = 'information',
  SelectedPhoto = 'selected-photo',
  Grouper = 'grouper',
  ArraySwitch = 'array-switch',
  ArrayAnd = 'array-and',
  ArrayAndNot = 'array-and-not',
  ArrayOr = 'array-or',
  ImagePicker = 'image-picker',
  ExifSplit = 'exif-split',
  GpsSplit = 'gps-split',
  SplitChannels = 'split-channels',
  MergeChannels = 'merge-channels',
  Crop = 'crop',
  Rescale = 'rescale',
  Collage = 'collage',
  Rotate = 'rotate',
  Flip = 'flip',
  Mirror = 'mirror',
  Perspective = 'perspective',
  Exposure = 'exposure',
  Brightness = 'brightness',
  Contrast = 'contrast',
  Highlights = 'highlights',
  Shadows = 'shadows',
  Gamma = 'gamma',
  Luminosity = 'luminosity',
  WhitesBlacks = 'whites-blacks',
  RgbBlackPoint = 'rgb-black-point',
  RgbWhitePoint = 'rgb-white-point',
  RgbMidtones = 'rgb-midtones',
  Saturation = 'saturation',
  Vibrance = 'vibrance',
  HueRotation = 'hue-rotation',
  BlackWhite = 'black-white',
  Sepia = 'sepia',
  Invert = 'invert',
  Lut = 'lut',
  TemperatureTint = 'temperature-tint',
  SplitToning = 'split-toning',
  Sharpen = 'sharpen',
  AiDenoiser = 'ai-denoiser',
  Grain = 'grain',
  Vignette = 'vignette',
  Pop = 'pop',
  Hdr = 'hdr',
  Fade = 'fade',
  AiColorizer = 'ai-colorizer',
  AiPhotoEditor = 'ai-photo-editor',
  AskAi = 'ask-ai',
  Viewer = 'viewer',
  ViewerSingle = 'viewer-single',
  ExifViewer = 'exif-viewer',
  GpsMap = 'gps-map',
  PhotoHistogram = 'photo-histogram',
  HotFolderWrite = 'hot-folder-write',
}

export enum NodeProcessing {
  Math = 'math',
  Css = 'css',
  Static = 'static',
}

export type NodePaletteConfig = {
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;

  labelKey?: string;
  key: string,
};

export type NodeStageItem = {
  type: `${NodeType}`;
  labelKey: string;

  labelDescription: string;
  icon: React.ReactNode;
  ai?: boolean;
  algo?: any;
  config?: NodePaletteConfig;

  configs?: NodePaletteConfig[];

  processing?: `${NodeProcessing}`;
};
export type NodePaletteItem = NodeStageItem & {
  groupKey: string;
}

const sourceStages: Array<NodeStageItem> = [
  {
    type: NodeType.Source,
    labelKey: "pipelineLocalStorage", icon: <HardDrive size={16} />,
    processing: 'static',
    labelDescription: 'pipelineLocalStorageDescription',
  },
  {
    type: NodeType.HotFolderRead,
    labelKey: "pipelineHotFolder", icon: <FolderInput size={16} />,
    processing: 'static',
    labelDescription: 'pipelineHotFolderDescription',
  },
  {
    type: NodeType.GoogleDrive,
    labelKey: "pipelineGoogleDrive", icon: <Cloud size={16} />,
    processing: 'static',
    labelDescription: 'pipelineGoogleDriveDescription',
  },
  {
    type: NodeType.Information,
    labelKey: "pipelineInformation", icon: <Info size={16} />,
    processing: 'static',
    labelDescription: 'pipelineInformationNodeDescription',
  },
  {
    type: NodeType.SelectedPhoto,
    labelKey: "pipelineSelectedPhoto", icon: <Image size={16} />,
    processing: 'static',
    labelDescription: 'pipelineSelectedPhotoDescription',
  },
];

const logicStages: Array<NodeStageItem> = [
  {
    type: NodeType.Grouper,
    labelKey: "pipelineGrouper", icon: <Group size={16} />,
    processing: 'static',
    labelDescription: 'pipelineGrouperNodeDescription',
  },
  {
    type: NodeType.ArraySwitch,
    labelKey: "pipelineArraySwitch", icon: <GitFork size={16} />,
    processing: 'static',
    labelDescription: 'pipelineArraySwitchNodeDescription',
  },
  {
    type: NodeType.ArrayAnd,
    labelKey: "pipelineArrayAnd", icon: <GitFork size={16} />,
    processing: 'static',
    labelDescription: 'pipelineArrayAndNodeDescription',
  },
  {
    type: NodeType.ArrayAndNot,
    labelKey: "pipelineArrayAndNot", icon: <Minus size={16} />,
    processing: 'static',
    labelDescription: 'pipelineArrayAndNotNodeDescription',
  },
  {
    type: NodeType.ArrayOr,
    labelKey: "pipelineArrayOr", icon: <Plus size={16} />,
    processing: 'static',
    labelDescription: 'pipelineArrayOrNodeDescription',
  },
  {
    type: NodeType.ImagePicker,
    labelKey: "pipelineImagePicker", icon: <CheckSquare size={16} />,
    processing: 'static',
    labelDescription: 'pipelineImagePickerDescription',
  },
  {
    type: NodeType.ExifSplit,
    labelKey: "pipelineExifSplit", icon: <FileImage size={16} />,
    processing: 'static',
    labelDescription: 'pipelineExifSplitNodeDescription',
  },
  {
    type: NodeType.GpsSplit,
    labelKey: "pipelineGpsSplit", icon: <MapPinned size={16} />,
    processing: 'static',
    labelDescription: 'pipelineGpsSplitNodeDescription',
  },

]

const transformStages: Array<NodeStageItem> = [
  { type: "crop", labelKey: "pipelineCrop", icon: <Crop size={16} />,
    algo: (crop: any) => {
      return { clipPath: `inset(${crop?.top || 0}% ${crop?.right || 0}% ${crop?.bottom || 0}% ${crop?.left || 0}%)` }},
    configs: [
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'pipelineCropTop', key: 'top' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'pipelineCropRight', key: 'right' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'pipelineCropBottom', key: 'bottom' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'pipelineCropLeft', key: 'left' },
    ],
    processing: 'static',
    labelDescription: 'pipelineCropDescription',
  },
  { type: "rescale", labelKey: "pipelineRescale", icon: <ImageUpscale size={16} />,
    processing: 'static',
    labelDescription: 'pipelineRescaleDescription',
  },
  { type: "collage", labelKey: "pipelineCollage", icon: <Images size={16} />,
    processing: 'static',
    labelDescription: 'pipelineCollageDescription',
  },
  { type: "rotate", labelKey: "pipelineRotate", icon: <Angle size={16} />,
    algo: (config: any) => ({ transform: `rotate(${config?.amount}deg)` }),
    configs: [
      { min: 0, max: 360, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'css',
    labelDescription: 'pipelineRotateDescription',
  },
  { type: "flip", labelKey: "pipelineFlip", icon: <SquareCenterlineDashedVertical size={16} />,
    algo: () => ({ transform: `rotate(180deg)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'pipelineFlipDescription',
  },
  { type: "mirror", labelKey: "pipelineMirror", icon: <SquareCenterlineDashedHorizontal size={16} />,
    algo: () => ({ transform: `scaleX(-1)` }),
    configs: [],
    processing: 'css',
    labelDescription: 'pipelineMirrorDescription',
  },
  { type: "perspective", labelKey: "pipelinePerspective", icon: <SquareDashedMousePointer size={16} />,
    algo: (data: any) => ({ clipPath: `polygon(${data?.topLeftx ?? 0}% ${data?.topLefty ?? 0}%, ${data?.topRightx ?? 0}% ${data?.topRighty ?? 0}%, ${data?.bottomRightx ?? 0}% ${data?.bottomRighty ?? 0}%, ${data?.bottomLeftx ?? 0}% ${data?.bottomLefty ?? 0}%)` }),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveTopLeftX', key: 'topLeftx' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveTopLeftY', key: 'topLefty' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveTopRightX', key: 'topRightx' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveTopRightY', key: 'topRighty' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveBottomLeftX', key: 'bottomLeftx' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveBottomLeftY', key: 'bottomLefty' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveBottomRightX', key: 'bottomRightx' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelinePerspectiveBottomRightY', key: 'bottomRighty' },
    ],
    processing: 'static',
    labelDescription: 'pipelinePerspectiveDescription',
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
    labelDescription: 'pipelineExposureDescription',
  },
  {
    type: "brightness", labelKey: "pipelineBrightness", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => brightnessStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineBrightnessDescription',
  },
  {
    type: "contrast", labelKey: "pipelineContrast", icon: <Contrast size={16} />,
    algo: ({ amount }: { amount: number }) => contrastStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineContrastDescription',
  },
  {
    type: "highlights", labelKey: "pipelineHighlights", icon: <Sun size={16} />,
    algo: ({ amount }: { amount: number }) => highlightsStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineHighlightsDescription',
  },
  {
    type: "shadows", labelKey: "pipelineShadows", icon: <Moon size={16} />,
    algo: ({ amount }: { amount: number }) => shadowsStage(amount),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineShadowsDescription',
  },
  {
    type: "gamma", labelKey: "pipelineGamma", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => gammaStage(amount),
    configs: [
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineGammaDescription',
  },
  {
    type: "luminosity", labelKey: "pipelineLuminosity", icon: <Lightbulb size={16} />,
    algo: ({ amount }: { amount: number }) => luminosityStage(amount),
    configs: [
      { min: 0, max: 2, step: 0.05, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineLuminosityDescription',
  },
  { type: "whites-blacks", labelKey: "pipelineWhitesBlacks", icon: <Sun size={16} />,
    algo: ({ whites, blacks }: { whites: number, blacks: number }) => whitesBlacksStage(whites, blacks),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelineWhites', key: 'whites' },
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelineBlacks', key: 'blacks' }
    ],
    processing: 'math',
    labelDescription: 'pipelineWhitesBlacksDescription',
  },
  { type: "rgb-black-point", labelKey: "pipelineRgbBlackPoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbBlackPointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'pipelineRed', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'pipelineGreen', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 0, labelKey: 'pipelineBlue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'pipelineRgbBlackPointDescription',
  },
  { type: "rgb-white-point", labelKey: "pipelineRgbWhitePoint", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbWhitePointStage(red, green, blue),
    configs: [
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'pipelineRed', key: 'red' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'pipelineGreen', key: 'green' },
      { min: 0, max: 255, step: 1, defaultValue: 255, labelKey: 'pipelineBlue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'pipelineRgbWhitePointDescription',
  },
  { type: "rgb-midtones", labelKey: "pipelineRgbMidtones", icon: <SlidersHorizontal size={16} />,
    algo: ({ red, green, blue }: { red: number, green: number, blue: number }) => rgbMidtonesStage(red, green, blue),
    configs: [
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'pipelineRed', key: 'red' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'pipelineGreen', key: 'green' },
      { min: 0.1, max: 3, step: 0.01, defaultValue: 1, labelKey: 'pipelineBlue', key: 'blue' }
    ],
    processing: 'math',
    labelDescription: 'pipelineRgbMidtonesDescription',
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
    labelDescription: 'pipelineSaturationDescription',
  },
  {
    type: "vibrance", labelKey: "pipelineVibrance", icon:<Pipette size={16} />,
    algo: ({ amount }: { amount: number }) => vibranceStage(amount),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineVibranceDescription',
  },
  {
    type: "hue-rotation", labelKey: "pipelineHueRotation", icon: <Palette size={16} />,
    algo: ({ amount }: { amount: number }) => hueRotationStage(amount),
    configs: [
      { min: -180, max: 180, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineHueRotationDescription',
  },
  { type: "black-white", labelKey: "pipelineBlackAndWhite", icon: <Landmark size={16} />,
    algo: () => blackAndWhiteStage(),
    configs: [],
    processing: 'math',
    labelDescription: 'pipelineBlackAndWhiteDescription',
  },
  { type: "sepia", labelKey: "pipelineSepia", icon: <Palette size={16} />,
    algo: () => sepiaStage(),
    configs: [],
    processing: 'math',
    labelDescription: 'pipelineSepiaDescription',
  },
  { type: "invert", labelKey: "pipelineInvert", icon: <SquaresExclude size={16} />,
    algo: () => invertStage(),
    configs: [],
    processing: 'math',
    labelDescription: 'pipelineInvertDescription',
  },
  {
    type: NodeType.Lut, labelKey: "pipelineLut", icon: <Film size={16} />,
    processing: 'static',
    labelDescription: 'pipelineLutDescription'
  },
  { type: "temperature-tint", labelKey: "pipelineTemperatureTint", icon: <Thermometer size={16} />,
    algo: ({ temperature, tint }: { temperature: number, tint: number }) => temperatureTintStage(temperature, tint),
    configs: [
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelineTemperature', key: 'temperature' },
      { min: -100, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelineTint', key: 'tint' }
    ],
    processing: 'math',
    labelDescription: 'pipelineTemperatureTintDescription',
  },
  { type: "split-toning", labelKey: "pipelineSplitToning", icon: <Palette size={16} />,
    algo: ({ shadowTint, highlightTint, strength }: { shadowTint: [number, number, number], highlightTint: [number, number, number], strength: number }) =>
      splitToningStage(shadowTint?.[0], shadowTint?.[1], shadowTint?.[2], highlightTint?.[0], highlightTint?.[1], highlightTint?.[2], strength),

    configs: [
      { min: 0, max: 10, step: 1, defaultValue: 50, labelKey: 'pipelineSplitToningStrength', key: 'strength' }
    ],
    processing: 'math',
    labelDescription: 'pipelineSplitToningDescription',
  },
  {
    type: NodeType.SplitChannels,
    labelKey: "pipelineSplitChannels", icon: <Split size={16} />,
    processing: 'static',
    labelDescription: 'pipelineSplitChannelsNodeDescription',
  },
  {
    type: NodeType.MergeChannels,
    labelKey: "pipelineMergeChannels", icon: <Merge size={16} />,
    processing: 'static',
    labelDescription: 'pipelineMergeChannelsNodeDescription',
  },
]

const detailStages: Array<NodeStageItem> = [
  {
    type: "sharpen", labelKey: "pipelineSharpen", icon: <Slice size={16} />,
    algo: ({ amount }: { amount: number }) => sharpenStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'pipelineSharpenDescription',
  },
  { type: NodeType.AiDenoiser,
    labelKey: "pipelineAiDenoiser", icon: <Astroid size={16} />, ai: true,
    processing: NodeProcessing.Static,
    labelDescription: 'pipelineAiDenoiserDescription' },
  {
    type: "grain", labelKey: "pipelineGrain", icon: <Wheat size={16} />,
    algo: ({ amount }: { amount: number }) => grainStage(amount),
    configs: [{ min: 0, max: 1000, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'pipelineGrainDescription',
  },
]

const effectsStages: Array<NodeStageItem> = [
  { type: "vignette", labelKey: "pipelineVignette", icon: <Theater size={16} />,
    algo: ({ amount, color }: { amount: number, color: [number, number, number] }) => vignetteStage(amount, color),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }
    ],
    processing: 'math',
    labelDescription: 'pipelineVignetteDescription',
  },
  {
    type: "pop", labelKey: "pipelinePop", icon: <Gem size={16} />,
    algo: ({ amount }: { amount: number }) => popStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'pipelinePopDescription',
  },
  { type: "hdr", labelKey: "pipelineHdrEffect", icon: <Mountain size={16} />,
    algo: ({ amount, radius }: { amount: number, radius: number }) => hdrEffectStage(amount, radius),
    configs: [
      { min: 0, max: 100, step: 1, defaultValue: 0, labelKey: 'pipelineAmount', key: 'amount' },
      { min: 0, max: 90, step: 1, defaultValue: 0, labelKey: 'pipelineRadius', key: 'radius' },
    ],
    processing: 'math',
    labelDescription: 'pipelineHdrEffectDescription',
  },
  {
    type: "fade", labelKey: "pipelineFade", icon: <EyeDashed size={16} />,
    algo: ({ amount }: { amount: number }) => fadeStage(amount),
    configs: [{ min: 0, max: 100, step: 1, defaultValue: 0, labelKey: '', key: 'amount' }],
    processing: 'math',
    labelDescription: 'pipelineFadeDescription',
  },
]

const aiStages: Array<NodeStageItem> = [
  { type: "ai-colorizer", labelKey: "pipelineAiColorizer", icon: <Astroid size={16} />,
    processing: 'static',
    labelDescription: 'pipelineAiColorizerDescription',
  },
  { type: "ai-photo-editor", labelKey: "pipelineAiPhotoEditor", icon: <Astroid size={16} />,
    processing: 'static',
    labelDescription: 'pipelineAiPhotoEditorDescription',
  },
  { type: "ask-ai", labelKey: "pipelineAskAI", icon: <Astroid size={16} />,
    processing: 'static',
    labelDescription: 'pipelineAskAIDescription',
  },
]

const outputStages: Array<NodeStageItem> = [
  {
    type: "viewer", labelKey: "pipelinePhotosViewer", icon:<Images size={16} />,
    processing: 'static', labelDescription: 'pipelinePhotosViewerDescription'
  },
  {
    type: "viewer-single", labelKey: "pipelinePhotoViewer", icon: <Image size={16} />,
    processing: 'static', labelDescription: 'pipelinePhotoViewerDescription'
  },
  {
    type: "exif-viewer", labelKey: "pipelineExifViewer", icon: <FileImage size={16} />,
    processing: 'static', labelDescription: 'pipelineExifViewerDescription'
  },
  {
    type: "gps-map", labelKey: "pipelineGpsMap", icon: <MapPinned size={16} />,
    processing: 'static', labelDescription: 'pipelineGpsMapDescription'
  },
  {
    type: "photo-histogram", labelKey: "pipelinePhotoHistogram", icon: <ChartColumn size={16} />,
    processing: 'static', labelDescription: 'pipelinePhotoHistogramDescription'
  },
  {
    type: "hot-folder-write", labelKey: "pipelineHotFolder", icon: <FolderOutput size={16} />,
    processing: 'static', labelDescription: 'pipelineHotFolderWriteDescription' },
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
