import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
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

      <MainDriver />
      <AiLoadingBar />

      <ReactFlowWrapper />
    </>
  );
}
