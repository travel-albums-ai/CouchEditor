import { Minimize2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';

export default function FullscreenToggle() {
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  const { t } = useTranslation();

  useEffect(() => {
    const onChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  };

  return <>
    <GenericToggleButtonGroup
      id="fullscreen-toggle"
      variant="standard"
      items={[
        {
          tooltip: t(fullscreen ? 'exitFullscreen' : 'enterFullscreen'),
          icon:  <Minimize2 />,
          onClick: toggleFullscreen,
          selected: fullscreen,
        },
      ] satisfies GenericToggleButtonProps[]}
    />
  </>;
}
