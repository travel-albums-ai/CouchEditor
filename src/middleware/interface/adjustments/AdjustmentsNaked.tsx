import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import AdjustmentsCanvas from '@/middleware/interface/adjustments/AdjustmentsCanvas';
import { Adjustments } from '@/middleware/interface/adjustments/types';

type AdjustmentsNakedProps = {
  url: string;
  initialPreset?: Partial<Adjustments>;
  sxCanvas?: Record<string, unknown>;
};

export default function AdjustmentsNaked({
  url,
  initialPreset,
  sxCanvas,
}: AdjustmentsNakedProps) {
  const { pipeline } = useAdjustmentsState({ initialPreset });

  return (
    <AdjustmentsCanvas pipeline={pipeline} url={url} sx={sxCanvas || { width: '600px', height: '400px' }} />
  );
}
