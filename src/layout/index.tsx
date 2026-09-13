import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import WebMCPCurrentPipeline from '@/components/WebMCPCurrentPipeline';
import WebMCPThemeTool from '@/components/WebMCPThemeTool';
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
      <WebMCPCurrentPipeline />

      <ReactFlowWrapper />
    </>
  );
}
