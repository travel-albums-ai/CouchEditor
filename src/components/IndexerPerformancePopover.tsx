import { SegmentedControl, SegmentedControlItem } from '@/components/SegmentedControl';
import SettingsSection from '@/components/SettingsSection';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/remote/useFetch_PostConfig';
import SettingsSliderRow from '@/middleware/windows/settings/components/SettingsSliderRow';
import { Box } from '@mui/material';
import { t } from 'i18next';
import { Turtle } from 'lucide-react';
import { Fragment } from 'react';

const groups = [

  {
    title: "Performance",
    controls: [
      { key: 'CONCURRENCY', labelKey: 'CONCURRENCY', type: 'number', max: 32 },
      { key: "IMAGE_CONCURRENCY", labelKey: 'IMAGE_CONCURRENCY', type: 'number', max: 32 },
      { key: 'THUMBNAIL_SIZE', labelKey: 'THUMBNAIL_SIZE', type: 'number', max: 960 },
      { key: 'THUMBNAIL_QUALITY', labelKey: 'THUMBNAIL_QUALITY', type: 'number', max: 100 }
    ],
    icon: <Turtle />,
  },
]


export default function IndexerPerformancePopover() {
  const { data } = useFetch_Config();
  const { mutate } = usePost_Config();
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  const updateSetting = (key: string, value: number) => {
    mutate({ [key]: value });
  }

  const updateSettings = (settings: Record<string, number>) => {
    mutate(settings);
  }

  const updateSSDMode = () => {
    updateSettings({
      CONCURRENCY: 8,
      IMAGE_CONCURRENCY: 16,
      THUMBNAIL_SIZE: 700,
      THUMBNAIL_QUALITY: 80
    })
  }

  const updateHDDMode = () => {
    updateSettings({
      CONCURRENCY: 4,
      IMAGE_CONCURRENCY: 4,
      THUMBNAIL_SIZE: 600,
      THUMBNAIL_QUALITY: 72
    })
  }

  const isSSDMode = () => {
    return data?.CONCURRENCY === 8 &&
      data?.IMAGE_CONCURRENCY === 16 &&
      data?.THUMBNAIL_SIZE === 700 &&
      data?.THUMBNAIL_QUALITY === 80;
  }

  const isHDDMode = () => {
    return data?.CONCURRENCY === 4 &&
      data?.IMAGE_CONCURRENCY === 4 &&
      data?.THUMBNAIL_SIZE === 600 &&
      data?.THUMBNAIL_QUALITY === 72;
  }

  const isCustomMode = () => {
    return !isSSDMode() && !isHDDMode();
  }

  return <>

    {groups.map((group) => (
      <SettingsSection key={group.title} title={group.title} icon={group.icon} uuid="indexer-performance">
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <SegmentedControl defaultValue="hdd" onChange={(_, value) => value === 'hdd' ? updateHDDMode() : updateSSDMode()}>
            <SegmentedControlItem value="hdd" disabled={indexing || (!isCustomMode() && isHDDMode())}>HDD (Slow)</SegmentedControlItem>
            <SegmentedControlItem value="ssd" disabled={indexing || (!isCustomMode() && isSSDMode())}>SSD (Fast)</SegmentedControlItem>
          </SegmentedControl>
        </Box>
        {group.controls
          .map((control) => (
            <Fragment key={control.key}>
              {control.type === 'number' && <SettingsSliderRow
                label={t(control.labelKey)}
                max={control.max}
                disabled={indexing}
                value={data?.[control.key] || 0}
                onChange={(value) => updateSetting(control.key, value)}
              />}
            </Fragment>
          ))}
      </SettingsSection>
    ))}
  </>
}
