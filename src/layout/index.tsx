import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import HelpWindow from '@/middleware/windows/HelpWindow';
import LightboxWindow from '@/middleware/windows/LightboxWindow';
import NewVersionWindow from '@/middleware/windows/NewVersionWindow';
import OnboardingWindow from '@/middleware/windows/OnboardingWindow';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import SettingsWindow from '@/middleware/windows/SettingsWindow';
import TemplatesWindow from '@/middleware/windows/TemplatesWindow';
import OthersToolbar from '@/toolbars/OthersToolbar';
import StartToolbar from '@/toolbars/StartToolbar';
import StatusToolbar from '@/toolbars/StatusToolbar';
import ToolboxToolbar from '@/toolbars/ToolboxToolbar';
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
      <StartToolbar />
      <ToolboxToolbar />
      <OthersToolbar />
      <StatusToolbar />

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
