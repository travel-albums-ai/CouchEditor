import { AdjustmentsSlider } from '@/middleware/interface/adjustments/AdjustmentsItem';
import { Slider } from '@mui/material';
import { useEffect, useState } from 'react';

type DebouncedSliderProps = {
  slider: AdjustmentsSlider;
  checked: boolean;
};

export default function DebouncedSlider({ slider, checked }: DebouncedSliderProps) {
  const [value, setValue] = useState(slider.value);

  // Keep local state in sync if parent changes it.
  useEffect(() => {
    setValue(slider.value);
  }, [slider.value]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (value !== slider.value) {
        slider.onChange({} as Event, value);
      }
    }, 65);

    return () => clearTimeout(id);
  }, [value, slider]);

  return (<>
    <Slider
      disabled={!checked}
      sx={{ width: 150, p: 0, m: 0 }}
      size="small"
      min={slider.min}
      step={slider.step ?? 0.01}
      max={slider.max}
      value={value / (slider.scale ?? 1)}
      onChange={(_, newValue) => setValue((newValue as number) * (slider.scale ?? 1))}
      onContextMenu={(e) => {
        e.preventDefault();
        setValue(slider.defaultValue ?? 0);
      }}
    />
  </>
  );
}
