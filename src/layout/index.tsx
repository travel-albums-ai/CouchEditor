import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import Toolbars from '@/toolbars';
import WebMCP from '@/webmcp';
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

      <Toolbars />
      <WebMCP />
    </>
  );
}
