import SettingsSection from '@/components/SettingsSection';
import DarkLightStatus from '@/toolbars/tools/DarkLightStatus';
import LocaleToggle from '@/toolbars/tools/LocaleToggle';
import ThemeMenu from '@/toolbars/tools/ThemeMenu';
import SettingsComponentRow from '@/windows/settings/components/SettingsComponentRow';
import { Languages, PaintBucket } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const groups = [
  {
    titleKey: 'layoutLocale',
    controls: [
      { key: 'locale', labelKey: 'layoutLocale', type: 'component', toolbarComponentId: <LocaleToggle /> },
    ],
    icon: <Languages />,
  },
  {
    titleKey: 'layoutThemeSection',
    controls: [
      { key: 'theme', labelKey: 'layoutTheme', type: 'component', toolbarComponentId: <ThemeMenu /> },
      { key: 'darkLightStatusAA', labelKey: 'toggleThemeName', type: 'component', toolbarComponentId: <DarkLightStatus /> },
    ],
    icon: <PaintBucket />,
  },
]

export default function LayoutPopover() {
  const { t } = useTranslation()

  return <>
    {groups.map((group) => (
      <SettingsSection key={group.titleKey} title={t(group.titleKey)} icon={group.icon} >
        {group.controls
          .map((control) => (
            <Fragment key={control.key}>

              {control.type === 'component' && <SettingsComponentRow label={t(control.labelKey)}>
                {control.toolbarComponentId}
              </SettingsComponentRow>}
            </Fragment>
          ))}
      </SettingsSection>
    ))}
  </>
}
