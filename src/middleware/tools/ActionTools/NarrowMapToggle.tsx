import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import { Focus, SearchCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NarrowMapToggle() {
  const { setSetting } = useFilterPhotos()
  const filterGps = useFilterStoreSelector((state) => state.filterGps)
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup items={[
      {
        tooltip: t('reRunFilterGps'),
        onClick: () => setSetting((prev) => ({...prev, filterGps: !prev.filterGps})),
        icon: <Focus size={20} />,
        selected: filterGps
      },
      {
        value: 'contain',
        title: "Focus",
        tooltip: t('thumbnailContain'),
        onClick: () => setSetting((prev) => ({...prev, gps: localStorage.getItem('albumGlobeViewport')
          ? JSON.parse(localStorage.getItem('albumGlobeViewport'))
          : { top: 90, left: -180, bottom: -90, right: 180 }})),
        icon: <SearchCode size={20} />,
      }
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
