import GeneralRegistryToolRenderer from '@/components/registry/GeneralRegistryToolRenderer';
import SettingsSection from '@/components/SettingsSection';
import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import SettingsComponentRow from '@/middleware/windows/settings/components/SettingsComponentRow';
import SettingToggleRow from '@/middleware/windows/settings/components/SettingToggleRow';
import { CreditCard, GalleryHorizontal, Languages, PaintBucket } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

const groups = [
  {
    title: "Locale",
    controls: [
      { key: 'locale', labelKey: 'layoutLocale', type: 'toolbar', toolbarComponentId: "localeToggle" },
    ],
    icon: <Languages />,
  },
  {
    title: "Theme",
    controls: [
      { key: 'theme', labelKey: 'layoutTheme', type: 'toolbar', toolbarComponentId: "themeMenu" },
      { key: 'darkLightStatus', labelKey: 'toggleThemeName', type: 'toolbar', toolbarComponentId: "darkLightStatus" },
    ],
    icon: <PaintBucket />,
  },
  {
    title: "Card",
    controls: [
      { key: 'thumbSizeStatus', labelKey: 'layoutThumbSizeStatus', type: 'toolbar', toolbarComponentId: 'thumbSizeStatus' },
      { key: "thumbnailCover", labelKey: 'layoutThumbnailCover', type: 'toolbar', toolbarComponentId: "thumbnailCover" },
      { key: 'showDescription', labelKey: 'layoutShowDescription', type: 'boolean' },
      { key: 'showTags', labelKey: 'layoutShowTags', type: 'boolean' },
      { key: 'showDate', labelKey: 'layoutShowDate', type: 'boolean' },
      { key: 'showLocation', labelKey: 'layoutShowLocation', type: 'boolean' },
      { key: 'showFileName', labelKey: 'layoutShowFileName', type: 'boolean' },
    ],
    icon: <CreditCard style={{ transform: 'rotate(180deg)' }} />,
  },
  {
    title: "Scroller",
    controls: [
      { key: 'scrollerColumns', labelKey: 'layoutScrollerColumns', type: 'toolbar', toolbarComponentId: "scroller-columns-toggle" },
      { key: 'scrollerRows', labelKey: 'layoutScrollerRows', type: 'toolbar', toolbarComponentId: "scroller-rows-toggle" },
      { key: 'scrollerGrouping', labelKey: 'layoutScrollerGrouping', type: 'toolbar', toolbarComponentId: "scroller-grouping-toggle" },
      { key: 'scrollerOriginal', labelKey: 'layoutScrollerOriginal', type: 'toolbar', toolbarComponentId: "scroller-original-toggle" },
    ],
    icon: <GalleryHorizontal />,
  },
]

export default function LayoutPopover() {
  const { setSetting: setCardSetting } = useAlbumPhotoCard()
  const cardSettings = useAlbumPhotoCardStoreSelector((state) => state)
  const { t } = useTranslation()

  return <>
    {groups.map((group) => (
      <SettingsSection key={group.title} title={group.title} icon={group.icon} >
        {group.controls
          .map((control) => (
            <Fragment key={control.key}>
              {control.type === 'boolean' && <SettingToggleRow
                key={control.key}
                label={t(control.labelKey)}
                selected={cardSettings[control.key]}
                onChange={() => setCardSetting((prev) => ({ ...prev, [control.key]: !cardSettings[control.key] }))}
              />}

              {control.type === 'toolbar' && <SettingsComponentRow label={t(control.labelKey)}>
                <GeneralRegistryToolRenderer toolId={control.toolbarComponentId} />
              </SettingsComponentRow>}
            </Fragment>
          ))}
      </SettingsSection>
    ))}


  </>
}
