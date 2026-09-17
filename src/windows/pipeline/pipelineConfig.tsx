/* eslint-disable react-refresh/only-export-components */
import { ConnectionLineType, type Edge, type Node } from '@xyflow/react';

import AIAsyncColorizerNode from '@/node/ComplexNodes/AIAsyncColorizerNode';
import AIAsyncDenoiserNode from '@/node/ComplexNodes/AIAsyncDenoiserNode';
import AIPhotoEditorNode from '@/node/ComplexNodes/AIPhotoEditorNode';
import ArraySetOperationNode from '@/node/ComplexNodes/ArraySetOperationNode';
import ArraySwitchNode from '@/node/ComplexNodes/ArraySwitchNode';
import AskAINode from '@/node/ComplexNodes/AskAINode';
import CollageNode from '@/node/ComplexNodes/CollageNode';
import ExifSplitNode from '@/node/ComplexNodes/ExifSplitNode';
import ExifViewerNode from '@/node/ComplexNodes/ExifViewerNode';
import GoogleDriveNode from '@/node/ComplexNodes/GoogleDriveNode';
import GpsMapNode from '@/node/ComplexNodes/GpsMapNode';
import GpsSplitNode from '@/node/ComplexNodes/GpsSplitNode';
import GrouperNode from '@/node/ComplexNodes/GrouperNode';
import HotFolderReadNode from '@/node/ComplexNodes/HotFolderReadNode';
import HotFolderWriteNode from '@/node/ComplexNodes/HotFolderWriteNode';
import ImagePickerNode from '@/node/ComplexNodes/ImagePickerNode';
import InformationNode from '@/node/ComplexNodes/InformationNode';
import LutNode from '@/node/ComplexNodes/LutNode';
import MergeChannelsNode from '@/node/ComplexNodes/MergeChannelsNode';
import PhotoHistogramNode from '@/node/ComplexNodes/PhotoHistogramNode';
import RescaleNode from '@/node/ComplexNodes/RescaleNode';
import SelectedPhotoNode from '@/node/ComplexNodes/SelectedPhotoNode';
import SinglePhotoViewerNode from '@/node/ComplexNodes/SinglePhotoViewerNode';
import SourceNode from '@/node/ComplexNodes/SourceNode';
import SplitChannelsNode from '@/node/ComplexNodes/SplitChannelsNode';
import SplitToningNode from '@/node/ComplexNodes/SplitToningNode';
import ViewerNode from '@/node/ComplexNodes/ViewerNode';
import VignetteNode from '@/node/ComplexNodes/VignetteNode';
import {
  BlackAndWhiteNode, BrightnessNode, ContrastNode, CropNode, ExposureNode,
  FadeNode, FlipNode, GammaNode, GrainNode, HdrNode, HighlightsNode,
  HueRotationNode, InvertNode, LuminosityNode, MirrorNode, PerspectiveNode, PopNode,
  RgbBlackPointNode, RgbMidtonesNode, RgbWhitePointNode, RotateNode, SaturationNode,
  SepiaNode, ShadowsNode, SharpenNode, TemperatureTintNode, VibranceNode, WhitesBlacksNode,
} from '@/node/SimpleToggles';

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
