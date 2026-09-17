import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import Toolbars from '@/toolbars';
import WebMCPAddPipelineNode from '@/webmcp/WebMCPAddPipelineNode';
import WebMCPClonePipelineNode from '@/webmcp/WebMCPClonePipelineNode';
import WebMCPConnectPipelineNodes from '@/webmcp/WebMCPConnectPipelineNodes';
import WebMCPDeletePipelineEdge from '@/webmcp/WebMCPDeletePipelineEdge';
import WebMCPDeletePipelineNode from '@/webmcp/WebMCPDeletePipelineNode';
import WebMCPGetCurrentPipeline from '@/webmcp/WebMCPGetCurrentPipeline';
import WebMCPGetPipelineToolbox from '@/webmcp/WebMCPGetPipelineToolbox';
import WebMCPMovePipelineNode from '@/webmcp/WebMCPMovePipelineNode';
import WebMCPThemeTool from '@/webmcp/WebMCPThemeTool';
import WebMCPUpdatePipelineNodeProperties from '@/webmcp/WebMCPUpdatePipelineNodeProperties';
import HelpWindow from '@/windows/HelpWindow';
import LightboxWindow from '@/windows/LightboxWindow';
import NewVersionWindow from '@/windows/NewVersionWindow';
import OnboardingWindow from '@/windows/OnboardingWindow';
import ReactFlowWrapper from '@/windows/pipeline/ReactFlowWrapper';
import SettingsWindow from '@/windows/SettingsWindow';
import TemplatesWindow from '@/windows/TemplatesWindow';

export const TOOLBAR_GAP = 4;
export default function AppLayout() {

  return (
    <>
      <ReactFlowWrapper />

      {/* windows */}
      <LightboxWindow />
      <NewVersionWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <TemplatesWindow />
      <HelpWindow />

      {/* others */}
      <MainDriver />
      <AiLoadingBar />

      {/* toolbars */}
      <Toolbars />


      {/* <StartToolbar />
      <ToolboxToolbar />
      <OthersToolbar />
      <StatusToolbar /> */}

      {/* webmcp */}
      <WebMCPThemeTool />
      <WebMCPAddPipelineNode />
      <WebMCPClonePipelineNode />
      <WebMCPConnectPipelineNodes />
      <WebMCPDeletePipelineEdge />
      <WebMCPDeletePipelineNode />
      <WebMCPGetCurrentPipeline />
      <WebMCPGetPipelineToolbox />
      <WebMCPMovePipelineNode />
      <WebMCPUpdatePipelineNodeProperties />
    </>
  );
}
