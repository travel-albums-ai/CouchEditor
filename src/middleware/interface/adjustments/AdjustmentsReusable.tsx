import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import { composeUrl } from '@/lib/thumbnailService';
import AdjustmentsCanvas from '@/middleware/interface/adjustments/AdjustmentsCanvas';
import { Adjustments } from '@/middleware/interface/adjustments/types';

type AdjustmentsReusableProps = {
  previewPhotoObj: any;
  initialPreset?: Partial<Adjustments>;
};

export default function AdjustmentsReusable({
  previewPhotoObj,
  initialPreset,
}: AdjustmentsReusableProps) {
  const { pipeline } = useAdjustmentsState({ initialPreset });
  return (
    <AdjustmentsCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj)} />
  );
}
