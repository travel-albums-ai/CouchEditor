import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useTransform_Albums } from '@/hooks/sections/useTransform_Albums';
import GeneralFilter from '@/middleware/windows/settings/components/GeneralFilter';
import { Folder } from 'lucide-react';

export default function FoldersFilter() {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const listRaw = useTransform_Albums(rawPhotos || []);

  return <>
    <GeneralFilter type="folders" label="Folders filter" icon={<Folder size={16} />} listRaw={listRaw} />
  </>;
}
