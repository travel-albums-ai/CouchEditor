/* eslint-disable react-refresh/only-export-components */
import { ConnectionLineType, type Edge, type Node } from '@xyflow/react';

import AIAsyncColorizerNode from './AIAsyncColorizerNode';
import AIAsyncDenoiserNode from './AIAsyncDenoiserNode';
import AIPhotoEditorNode from './AIPhotoEditorNode';
import AskAINode from './AskAINode';
import ArraySetOperationNode from './ComplexNodes/ArraySetOperationNode';
import ArraySwitchNode from './ComplexNodes/ArraySwitchNode';
import CollageNode from './ComplexNodes/CollageNode';
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
import MergeChannelsNode from './ComplexNodes/MergeChannelsNode';
import PhotoHistogramNode from './ComplexNodes/PhotoHistogramNode';
import RescaleNode from './ComplexNodes/RescaleNode';
import SelectedPhotoNode from './ComplexNodes/SelectedPhotoNode';
import SinglePhotoViewerNode from './ComplexNodes/SinglePhotoViewerNode';
import SourceNode from './ComplexNodes/SourceNode';
import SplitChannelsNode from './ComplexNodes/SplitChannelsNode';
import SplitToningNode from './ComplexNodes/SplitToningNode';
import ViewerNode from './ComplexNodes/ViewerNode';
import VignetteNode from './ComplexNodes/VignetteNode';
import InformationNode from './InformationNode';
import {
  BlackAndWhiteNode, BrightnessNode, ContrastNode, CropNode, ExposureNode,
  FadeNode, FlipNode, GammaNode, GrainNode, HdrNode, HighlightsNode,
  HueRotationNode, InvertNode, LuminosityNode, MirrorNode, PerspectiveNode, PopNode,
  RgbBlackPointNode, RgbMidtonesNode, RgbWhitePointNode, RotateNode, SaturationNode,
  SepiaNode, ShadowsNode, SharpenNode, TemperatureTintNode, VibranceNode, WhitesBlacksNode,
} from './SimpleToggles';

export const CONNECTION_LINE_TYPE = ConnectionLineType.SmoothStep;
export const INITIAL_NODES: Node[] = [];
export const INITIAL_EDGES: Edge[] = [];
export const SNAP_GRID: [number, number] = [20, 20];
export const LAST_PIPELINE_STORAGE_KEY = 'lastOpenedPipelineId';
export const PIPELINE_FILE_EXTENSION = '.cep';
export const PIPELINE_NODE_COUNT_EVENT = 'pipeline:node-count';
export const PIPELINE_NODE_COUNT_REQUEST_EVENT = 'pipeline:node-count-request';

export const pipelineNodeTypes = {
  'ai-colorizer': AIAsyncColorizerNode,
  'ai-denoiser': AIAsyncDenoiserNode,
  'ai-photo-editor': AIPhotoEditorNode,
  'array-and-not': ArraySetOperationNode,
  'array-and': ArraySetOperationNode,
  'array-or': ArraySetOperationNode,
  'array-switch': ArraySwitchNode,
  'ask-ai': AskAINode,
  'black-white': BlackAndWhiteNode,
  'exif-split': ExifSplitNode,
  'exif-viewer': ExifViewerNode,
  'google-drive': GoogleDriveNode,
  'gps-map': GpsMapNode,
  'gps-split': GpsSplitNode,
  'hot-folder-read': HotFolderReadNode,
  'hot-folder-write': HotFolderWriteNode,
  'hue-rotation': HueRotationNode,
  'image-picker': ImagePickerNode,
  'merge-channels': MergeChannelsNode,
  'photo-histogram': PhotoHistogramNode,
  'rgb-black-point': RgbBlackPointNode,
  'rgb-midtones': RgbMidtonesNode,
  'rgb-white-point': RgbWhitePointNode,
  'selected-photo': SelectedPhotoNode,
  'split-channels': SplitChannelsNode,
  'split-toning': SplitToningNode,
  'temperature-tint': TemperatureTintNode,
  'viewer-single': SinglePhotoViewerNode,
  'whites-blacks': WhitesBlacksNode,
  brightness: BrightnessNode,
  collage: CollageNode,
  contrast: ContrastNode,
  crop: CropNode,
  exposure: ExposureNode,
  fade: FadeNode,
  flip: FlipNode,
  gamma: GammaNode,
  grain: GrainNode,
  grouper: GrouperNode,
  hdr: HdrNode,
  highlights: HighlightsNode,
  information: InformationNode,
  invert: InvertNode,
  luminosity: LuminosityNode,
  lut: LutNode,
  mirror: MirrorNode,
  perspective: PerspectiveNode,
  pop: PopNode,
  rescale: RescaleNode,
  rotate: RotateNode,
  saturation: SaturationNode,
  sepia: SepiaNode,
  shadows: ShadowsNode,
  sharpen: SharpenNode,
  source: SourceNode,
  vibrance: VibranceNode,
  viewer: ViewerNode,
  vignette: VignetteNode,
};
