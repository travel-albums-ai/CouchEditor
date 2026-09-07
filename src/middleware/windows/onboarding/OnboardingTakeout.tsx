import OnboardingButton from '@/middleware/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import { Astroid, Turtle } from 'lucide-react';

const phaseSteps = [
  {
    key: '1',
    icon: <Astroid />,
    titleKey: 'AI as BYOK',
    descriptionKey: 'Add AI features to your pipeline to enhance the capabilities.',
  },
  {
    key: '2',
    icon: <Turtle />,
    titleKey: "High Performance",
    descriptionKey: 'Achieve high performance in your pipelines with optimized configurations. Benefits include faster execution and efficient resource utilization.',
  },
]

export default function OnboardingTakeout() {

  return (<>
    <OnboardingWrapper>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        <iframe
          src="https://www.youtube-nocookie.com/embed/nTLMbpX_4hQ"
          title="YouTube video"
          style={{
            position: "absolute",
            backgroundColor: 'transparent',
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <OnboardingButton href="https://takeout.google.com/settings/takeout" label={'Open Google Takeout...'} />
    </OnboardingWrapper>
    <OnboardingWrapperInfo light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapperInfo>
  </>)
}
