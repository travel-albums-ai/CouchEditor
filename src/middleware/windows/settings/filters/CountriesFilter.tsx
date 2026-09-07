import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import useTransform_Countries from '@/hooks/sections/useTransform_Countries';
import GeneralFilter from '@/middleware/windows/settings/components/GeneralFilter';
import { SquareDashedText } from 'lucide-react';

export default function CountriesFilter() {
  const { data: rawPhotos } = useFetch_TakeoutMetadata();

  const listRaw = useTransform_Countries(rawPhotos || []);

  return <>
    <GeneralFilter listRaw={listRaw} type="countries" label="Countries filter" icon={<SquareDashedText size={16} />} />
  </>;
}
