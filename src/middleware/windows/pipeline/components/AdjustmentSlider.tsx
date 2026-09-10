import SolidChip from '@/components/SolidChip';
import { Box, Slider } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';

type AdjustmentSliderProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  throttleMs?: number;
  disabled?: boolean;
};

export default function AdjustmentSlider({
  min,
  max,
  step,
  value,
  onChange,
  throttleMs = 100,
  disabled,
}: AdjustmentSliderProps) {
  const lastChangeAt = useRef(0);
  const pendingChange = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatchPipelineChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  }, []);

  const schedulePipelineChange = useCallback(() => {
    const elapsed = Date.now() - lastChangeAt.current;

    if (elapsed >= throttleMs) {
      lastChangeAt.current = Date.now();
      dispatchPipelineChange();
      return;
    }

    if (pendingChange.current !== null) return;

    pendingChange.current = setTimeout(() => {
      pendingChange.current = null;
      lastChangeAt.current = Date.now();
      dispatchPipelineChange();
    }, throttleMs - elapsed);
  }, [dispatchPipelineChange, throttleMs]);

  useEffect(() => () => {
    if (pendingChange.current !== null) {
      clearTimeout(pendingChange.current);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Slider
        min={min}
        size="small"
        max={max}
        disabled={disabled}
        step={step}
        sx={{ width: '150px', mx: 1, opacity: disabled ? 0.5 : 1 }}
        value={value}
        onChange={(_, nextValue) => {
          const nextAmount = Array.isArray(nextValue) ? nextValue[0] : nextValue;

          onChange(nextAmount);
          schedulePipelineChange();
        }}
      />
      <SolidChip count={value} />
    </Box>
  );
}
