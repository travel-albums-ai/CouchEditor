import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import WebMCPAddPipelineNode from '@/components/WebMCPAddPipelineNode';
import WebMCPClonePipelineNode from '@/components/WebMCPClonePipelineNode';
import WebMCPConnectPipelineNodes from '@/components/WebMCPConnectPipelineNodes';
import WebMCPDeletePipelineNode from '@/components/WebMCPDeletePipelineNode';
import WebMCPGetCurrentPipeline from '@/components/WebMCPGetCurrentPipeline';
import WebMCPGetPipelineToolbox from '@/components/WebMCPGetPipelineToolbox';
import WebMCPMovePipelineNode from '@/components/WebMCPMovePipelineNode';
import WebMCPThemeTool from '@/components/WebMCPThemeTool';
import WebMCPUpdatePipelineNodeProperties from '@/components/WebMCPUpdatePipelineNodeProperties';
import HelpWindow from '@/middleware/windows/HelpWindow';
import LightboxWindow from '@/middleware/windows/LightboxWindow';
import NewVersionWindow from '@/middleware/windows/NewVersionWindow';
import OnboardingWindow from '@/middleware/windows/OnboardingWindow';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import SettingsWindow from '@/middleware/windows/SettingsWindow';

export default function AppLayout() {

  return (
    <>
      <LightboxWindow />
      <NewVersionWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <HelpWindow />

      <MainDriver />
      <AiLoadingBar />

      {/* // webMcp */}
      <WebMCPThemeTool />
      <WebMCPAddPipelineNode />
      <WebMCPClonePipelineNode />
      <WebMCPConnectPipelineNodes />
      <WebMCPDeletePipelineNode />
      <WebMCPGetCurrentPipeline />
      <WebMCPGetPipelineToolbox />
      <WebMCPMovePipelineNode />
      <WebMCPUpdatePipelineNodeProperties />

      <ReactFlowWrapper />
    </>
  );
}
