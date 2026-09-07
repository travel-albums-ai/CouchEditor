import { AdjustmentsSlider } from '@/middleware/interface/adjustments/AdjustmentsItem';
import { ReactNode } from 'react';

export function numberSlider({
  label,
  max,
  min,
  scale,
  onValueChange,
  preIcon,
  skipLabel,
  step,
  value,
  defaultValue,
}: {
  label: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  preIcon?: ReactNode;
  skipLabel?: boolean;
  step?: number;
  scale?: number;
  value: number;
  defaultValue?: number;
}): AdjustmentsSlider {
  return {
    label,
    max,
    min,
    onChange: (_event, sliderValue) => onValueChange(sliderValue as number),
    preIcon,
    skipLabel,
    step,
    scale,
    value,
    defaultValue,
  };
}
