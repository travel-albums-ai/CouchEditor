import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import HelpWindow from '@/middleware/windows/HelpWindow';
import LightboxWindow from '@/middleware/windows/LightboxWindow';
import NewVersionWindow from '@/middleware/windows/NewVersionWindow';
import OnboardingWindow from '@/middleware/windows/OnboardingWindow';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import SettingsWindow from '@/middleware/windows/SettingsWindow';
import TemplatesWindow from '@/middleware/windows/TemplatesWindow';

export default function AppLayout() {

  return (
    <>
      <LightboxWindow />
      <NewVersionWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <TemplatesWindow />
      <HelpWindow />

      <MainDriver />
      <AiLoadingBar />

      <ReactFlowWrapper />
    </>
  );
}
