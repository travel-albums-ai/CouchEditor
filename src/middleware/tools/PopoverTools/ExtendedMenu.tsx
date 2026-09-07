import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import LocaleToggle from '@/middleware/tools/MixedTools/LocaleToggle';
import { Divider, Stack } from '@mui/material';
import { EllipsisVertical, ScrollText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const URLS = [
  {
    tooltip: 'GitHub',
    title: 'GitHub',
    icon: <Settings />,
    url: 'https://github.com/travel-albums-ai/travel-albums',
  },
  {
    tooltip: 'Release Notes',
    title: 'Release Notes',
    icon: <ScrollText />,
    url: 'https://github.com/travel-albums-ai/travel-albums/releases',
  },
  {
    tooltip: 'Website',
    title: 'Website',
    icon: <ScrollText />,
    url: 'https://www.travel-albums.com/',
  },
  {
    tooltip: 'Open an issue',
    title: 'Open an issue',
    icon: <ScrollText />,
    url: 'https://github.com/travel-albums-ai/travel-albums/issues',
  },
];

export default function ExtendedMenu() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup
    id="extended-menu-toggle"
    variant="standard"
    items={[
      {
        tooltip: t('openSectionsSettings'),
        icon: <EllipsisVertical />,
        popover: <>
          <Stack direction="column" spacing={1} divider={<Divider />}>
            {URLS.map((item) => (<GenericToggleButtonGroup
              variant="standard"
              key={item.title}
              items={[
                {
                  ...item,
                  onClick: () => window.open(item.url, '_blank'),
                },
              ] satisfies GenericToggleButtonProps[]}
            />))}
            <LocaleToggle />
          </Stack>
        </>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
