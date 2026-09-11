import { ConnectionLineType, type Edge, type Node } from '@xyflow/react';

import AIAsyncColorizerNode from './AIAsyncColorizerNode';
import AIAsyncDenoiserNode from './AIAsyncDenoiserNode';
import AIPhotoEditorNode from './AIPhotoEditorNode';
import AskAINode from './AskAINode';
import ArraySetOperationNode from './ComplexNodes/ArraySetOperationNode';
import ArraySwitchNode from './ComplexNodes/ArraySwitchNode';
import CollageNode from './ComplexNodes/CollageNode';
import CropNode from './ComplexNodes/CropNode';
import ExifSplitNode from './ComplexNodes/ExifSplitNode';
import ExifViewerNode from './ComplexNodes/ExifViewerNode';
import GoogleDriveNode from './ComplexNodes/GoogleDriveNode';
import GpsMapNode from './ComplexNodes/GpsMapNode';
import GpsSplitNode from './ComplexNodes/GpsSplitNode';
import GrouperNode from './ComplexNodes/GrouperNode';
import HotFolderReadNode from './ComplexNodes/HotFolderReadNode';
import HotFolderWriteNode from './ComplexNodes/HotFolderWriteNode';
import ImagePickerNode from './ComplexNodes/ImagePickerNode';
import LutNode from './ComplexNodes/LutNode';
import PerspectiveNode from './ComplexNodes/PerspectiveNode';
import PhotoHistogramNode from './ComplexNodes/PhotoHistogramNode';
import RescaleNode from './ComplexNodes/RescaleNode';
import SelectedPhotoNode from './ComplexNodes/SelectedPhotoNode';
import SinglePhotoViewerNode from './ComplexNodes/SinglePhotoViewerNode';
import SourceNode from './ComplexNodes/SourceNode';
import ViewerNode from './ComplexNodes/ViewerNode';
import InformationNode from './InformationNode';
import BrightnessNode from './OneBarToggles/BrightnessNode';
import ContrastNode from './OneBarToggles/ContrastNode';
import ExposureNode from './OneBarToggles/ExposureNode';
import FadeNode from './OneBarToggles/FadeNode';
import GammaNode from './OneBarToggles/GammaNode';
import GrainNode from './OneBarToggles/GrainNode';
import HdrNode from './OneBarToggles/HdrNode';
import HighlightsNode from './OneBarToggles/HighlightsNode';
import HueRotationNode from './OneBarToggles/HueRotationNode';
import LuminosityNode from './OneBarToggles/LuminosityNode';
import PopNode from './OneBarToggles/PopNode';
import {
  RgbBlackPointNode,
  RgbMidtonesNode,
  RgbWhitePointNode,
} from './OneBarToggles/RgbChannelsNode';
import RotateNode from './OneBarToggles/RotateNode';
import SaturationNode from './OneBarToggles/SaturationNode';
import ShadowsNode from './OneBarToggles/ShadowsNode';
import SharpenNode from './OneBarToggles/SharpenNode';
import SplitToningNode from './OneBarToggles/SplitToningNode';
import TemperatureTintNode from './OneBarToggles/TemperatureTintNode';
import VibranceNode from './OneBarToggles/VibranceNode';
import VignetteNode from './OneBarToggles/VignetteNode';
import WhitesBlacksNode from './OneBarToggles/WhitesBlacksNode';
import BlackAndWhiteNode from './SimpleToggles/BlackAndWhiteNode';
import FlipNode from './SimpleToggles/FlipNode';
import InvertNode from './SimpleToggles/InvertNode';
import MirrorNode from './SimpleToggles/MirrorNode';
import SepiaNode from './SimpleToggles/SepiaNode';

export const CONNECTION_LINE_TYPE = ConnectionLineType.SmoothStep;
export const INITIAL_NODES: Node[] = [];
export const INITIAL_EDGES: Edge[] = [];
export const SNAP_GRID: [number, number] = [20, 20];
export const LAST_PIPELINE_STORAGE_KEY = 'lastOpenedPipelineId';
export const PIPELINE_FILE_EXTENSION = '.cep';
export const PIPELINE_NODE_COUNT_EVENT = 'pipeline:node-count';
export const PIPELINE_NODE_COUNT_REQUEST_EVENT = 'pipeline:node-count-request';

export const pipelineNodeTypes = {
  source: SourceNode,
  'hot-folder-read': HotFolderReadNode,
  'google-drive': GoogleDriveNode,
  grouper: GrouperNode,
  'array-switch': ArraySwitchNode,
  'array-and': ArraySetOperationNode,
  'array-and-not': ArraySetOperationNode,
  'array-or': ArraySetOperationNode,
  'image-picker': ImagePickerNode,
  'exif-split': ExifSplitNode,
  'ai-colorizer': AIAsyncColorizerNode,
  'ai-denoiser': AIAsyncDenoiserNode,
  'ai-photo-editor': AIPhotoEditorNode,
  'ask-ai': AskAINode,
  invert: InvertNode,
  'black-white': BlackAndWhiteNode,
  sepia: SepiaNode,
  flip: FlipNode,
  mirror: MirrorNode,
  rotate: RotateNode,
  brightness: BrightnessNode,
  highlights: HighlightsNode,
  shadows: ShadowsNode,
  gamma: GammaNode,
  luminosity: LuminosityNode,
  lut: LutNode,
  exposure: ExposureNode,
  contrast: ContrastNode,
  crop: CropNode,
  perspective: PerspectiveNode,
  saturation: SaturationNode,
  vibrance: VibranceNode,
  vignette: VignetteNode,
  grain: GrainNode,
  sharpen: SharpenNode,
  pop: PopNode,
  hdr: HdrNode,
  'hue-rotation': HueRotationNode,
  fade: FadeNode,
  'whites-blacks': WhitesBlacksNode,
  'temperature-tint': TemperatureTintNode,
  'rgb-black-point': RgbBlackPointNode,
  'rgb-white-point': RgbWhitePointNode,
  'rgb-midtones': RgbMidtonesNode,
  'split-toning': SplitToningNode,
  rescale: RescaleNode,
  collage: CollageNode,
  'selected-photo': SelectedPhotoNode,
  viewer: ViewerNode,
  'viewer-single': SinglePhotoViewerNode,
  'exif-viewer': ExifViewerNode,
  'gps-map': GpsMapNode,
  'gps-split': GpsSplitNode,
  'photo-histogram': PhotoHistogramNode,
  'hot-folder-write': HotFolderWriteNode,
  information: InformationNode,
};
