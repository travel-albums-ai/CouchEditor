import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import useTransform_PeopleAndPets from '@/hooks/sections/useTransform_PeopleAndPets';
import GeneralFilter from '@/middleware/windows/settings/components/GeneralFilter';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PeopleAndPetsFilter() {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const listRaw = useTransform_PeopleAndPets(rawPhotos || []);
  const { t } = useTranslation()

  return <>
    <GeneralFilter type="peopleAndPets" label={t('peopleAndPetsFilter')} icon={<Users size={16} />} listRaw={listRaw} />
  </>;
}
