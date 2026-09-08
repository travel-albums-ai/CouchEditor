import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { driver, DriveStep } from "driver.js";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function MainDriver() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);
  const { t } = useTranslation();


  useEffect(() => {
    const steps = [
      ['#pipeline-header-left', 'tutorialStepHeaderTitle', 'tutorialStepHeaderDescription', 'bottom'],
      ['#pipeline-name', 'tutorialStepPipelineNameTitle', 'tutorialStepPipelineNameDescription', 'bottom'],
      ['#pipeline-actions', 'tutorialStepPipelineActionsTitle', 'tutorialStepPipelineActionsDescription', 'bottom'],
      ['#pipeline-header-right', 'tutorialStepHeaderRightTitle', 'tutorialStepHeaderRightDescription', 'bottom'],
      ['#pipeline-loader', 'tutorialStepPipelineLoaderTitle', 'tutorialStepPipelineLoaderDescription', 'bottom'],
      ['#toggle-toolbox-toggle', 'tutorialStepToolboxToggleTitle', 'tutorialStepToolboxToggleDescription', 'bottom'],
      ['#settings-toggle', 'tutorialStepSettingsToggleTitle', 'tutorialStepSettingsToggleDescription', 'bottom'],
      ['#dark-light-toggle', 'tutorialStepThemeToggleTitle', 'tutorialStepThemeToggleDescription', 'bottom'],
      ['#performance-toggle', 'tutorialStepPerformanceToggleTitle', 'tutorialStepPerformanceToggleDescription', 'bottom'],
      ['#fullscreen-toggle', 'tutorialStepFullscreenToggleTitle', 'tutorialStepFullscreenToggleDescription', 'bottom'],
      ['#extended-menu-toggle', 'tutorialStepExtendedMenuTitle', 'tutorialStepExtendedMenuDescription', 'bottom'],
      ['#pipeline-toolbox', 'tutorialStepToolboxTitle', 'tutorialStepToolboxDescription', 'bottom'],
      ['#pipeline-trash', 'tutorialStepTrashTitle', 'tutorialStepTrashDescription', 'bottom'],
      ['#outlet-drawer', 'tutorialStepMainScreenTitle', 'tutorialStepMainScreenDescription', 'top'],
    ].map(([element, title, description, side]) => ({
      element,
      popover: {
        title: t(title),
        description: t(description),
        side,
      },
    })) as DriveStep[];

    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: "rgba(0,0,0,0.7)",

      steps,
      onDestroyed: () => {
        setSetting((prev) => ({
          ...prev,
          tutorial: false,
        }));
      },
    });

    if (tutorial) {
      driverObj.drive();
    }

    return () => driverObj.destroy();
  }, [t, tutorial, setSetting]);

  return null
}
