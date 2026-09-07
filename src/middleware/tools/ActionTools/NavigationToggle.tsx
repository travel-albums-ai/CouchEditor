import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NavigationToggle() {
  const { t } = useTranslation()

  return <>
    <WebMCPDataRun
      name="navigate_back_forward_refresh"
      description="Navigate back, forward, or refresh the page."
      inputSchema={{
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['back', 'forward'],
            description: 'Navigation action to perform',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ action }: { action?: 'back' | 'forward' }) => {
        if (action === 'back') {
          window.history.back();
        } else if (action === 'forward') {
          window.history.forward();
        }

        return { action };
      }}
    />

    <GenericToggleButtonGroup items={[
      {
        webMcp: true,
        icon: <ArrowLeft  />,
        onClick: () => window.history.back(),
        tooltip: t('navBack')
      },
      {
        webMcp: true,
        icon: <ArrowRight />,
        onClick: () => window.history.forward(),
        tooltip: t('navForward')
      },
    ] satisfies GenericToggleButtonProps[]} variant="standard" />
  </>;
}
