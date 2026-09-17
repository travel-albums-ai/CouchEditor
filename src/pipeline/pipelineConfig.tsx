/* eslint-disable react-refresh/only-export-components */
import { ConnectionLineType, type Edge, type Node } from '@xyflow/react';

import {
  BlackAndWhiteNode, BrightnessNode, ContrastNode, CropNode, ExposureNode,
  FadeNode, FlipNode, GammaNode, GrainNode, HdrNode, HighlightsNode,
  HueRotationNode, InvertNode, LuminosityNode, MirrorNode, PerspectiveNode, PopNode,
  RgbBlackPointNode, RgbMidtonesNode, RgbWhitePointNode, RotateNode, SaturationNode,
  SepiaNode, ShadowsNode, SharpenNode, TemperatureTintNode, VibranceNode, WhitesBlacksNode,
} from '@/pipeline/nodes';
import AIAsyncColorizerNode from '@/pipeline/nodes/ComplexNodes/AIAsyncColorizerNode';
import AIAsyncDenoiserNode from '@/pipeline/nodes/ComplexNodes/AIAsyncDenoiserNode';
import AIPhotoEditorNode from '@/pipeline/nodes/ComplexNodes/AIPhotoEditorNode';
import ArraySetOperationNode from '@/pipeline/nodes/ComplexNodes/ArraySetOperationNode';
import ArraySwitchNode from '@/pipeline/nodes/ComplexNodes/ArraySwitchNode';
import AskAINode from '@/pipeline/nodes/ComplexNodes/AskAINode';
import CollageNode from '@/pipeline/nodes/ComplexNodes/CollageNode';
import ExifSplitNode from '@/pipeline/nodes/ComplexNodes/ExifSplitNode';
import ExifViewerNode from '@/pipeline/nodes/ComplexNodes/ExifViewerNode';
import GoogleDriveNode from '@/pipeline/nodes/ComplexNodes/GoogleDriveNode';
import GpsMapNode from '@/pipeline/nodes/ComplexNodes/GpsMapNode';
import GpsSplitNode from '@/pipeline/nodes/ComplexNodes/GpsSplitNode';
import GrouperNode from '@/pipeline/nodes/ComplexNodes/GrouperNode';
import HotFolderReadNode from '@/pipeline/nodes/ComplexNodes/HotFolderReadNode';
import HotFolderWriteNode from '@/pipeline/nodes/ComplexNodes/HotFolderWriteNode';
import ImagePickerNode from '@/pipeline/nodes/ComplexNodes/ImagePickerNode';
import InformationNode from '@/pipeline/nodes/ComplexNodes/InformationNode';
import LutNode from '@/pipeline/nodes/ComplexNodes/LutNode';
import MergeChannelsNode from '@/pipeline/nodes/ComplexNodes/MergeChannelsNode';
import PhotoHistogramNode from '@/pipeline/nodes/ComplexNodes/PhotoHistogramNode';
import RescaleNode from '@/pipeline/nodes/ComplexNodes/RescaleNode';
import SelectedPhotoNode from '@/pipeline/nodes/ComplexNodes/SelectedPhotoNode';
import SinglePhotoViewerNode from '@/pipeline/nodes/ComplexNodes/SinglePhotoViewerNode';
import SourceNode from '@/pipeline/nodes/ComplexNodes/SourceNode';
import SplitChannelsNode from '@/pipeline/nodes/ComplexNodes/SplitChannelsNode';
import SplitToningNode from '@/pipeline/nodes/ComplexNodes/SplitToningNode';
import ViewerNode from '@/pipeline/nodes/ComplexNodes/ViewerNode';
import VignetteNode from '@/pipeline/nodes/ComplexNodes/VignetteNode';

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
