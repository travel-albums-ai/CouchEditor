import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import LocaleToggle from '@/middleware/tools/MixedTools/LocaleToggle';
import { Divider, Stack } from '@mui/material';
import { EllipsisVertical, ScrollText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const URLS = [
  {
    key: 'github',
    icon: <Settings />,
    url: 'https://github.com/travel-albums-ai/CouchEditor/blob/main/README.md',
  },
  {
    key: 'releaseNotes',
    icon: <ScrollText />,
    url: 'https://github.com/travel-albums-ai/CouchEditor/releases',
  },
  {
    key: 'website',
    icon: <ScrollText />,
    url: 'https://couch-editor.com/',
  },
  {
    key: 'openIssue',
    icon: <ScrollText />,
    url: 'https://github.com/travel-albums-ai/CouchEditor/issues/new',
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
              key={item.key}
              items={[
                {
                  tooltip: t(`extendedMenu${item.key[0].toUpperCase()}${item.key.slice(1)}`),
                  title: t(`extendedMenu${item.key[0].toUpperCase()}${item.key.slice(1)}`),
                  icon: item.icon,
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
