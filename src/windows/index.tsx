import HelpWindow from '@/windows/HelpWindow';
import LightboxWindow from '@/windows/lightbox/LightboxWindow';
import NewVersionWindow from '@/windows/NewVersionWindow';
import OnboardingWindow from '@/windows/OnboardingWindow';
import SettingsWindow from '@/windows/SettingsWindow';
import TemplatesWindow from '@/windows/TemplatesWindow';

export default function Windows() {

  return (
    <>
      <LightboxWindow />
      <NewVersionWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <TemplatesWindow />
      <HelpWindow />
    </>
  );
}
