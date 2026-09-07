import { useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import AdjustmentsWrapper from '@/middleware/interface/adjustments/AdjustmentsWrapper';


export default function AdjustmentsDrawer() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <>
    {previewPhotoObj && <AdjustmentsWrapper previewPhotoObj={previewPhotoObj} url={composeUrl(previewPhotoObj)} hasToolbox={true} hasPresetSelector={true} hasGeneticBreeding={true} />}
  </>
}
