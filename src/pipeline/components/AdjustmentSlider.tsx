import SolidChip from '@/components/SolidChip';
import { Box, Slider, Typography, useTheme } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';

type AdjustmentSliderProps = {
  description?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  throttleMs?: number;
  disabled?: boolean;
};

export default function AdjustmentSlider({
  description,
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
  const theme = useTheme()

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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      {description && <Typography sx={{ minWidth: 70 }} variant="caption" color="textSecondary">{description}</Typography>}
      <Slider
        min={min}
        size="small"
        max={max}
        disabled={disabled}
        step={step}
        sx={{
          width: 'auto', flex: 1, mx: 1, mr: 2, opacity: disabled ? 0.5 : 1,
          '& .MuiSlider-thumb': {
            width: 20,
            height: 16,
            borderRadius: 4,
          },
          '& .MuiSlider-track': {
            border: 'none',
            height: 8,
          },
          '& .MuiSlider-rail': {
            height: 8,
            opacity: 0.2,
          },

        }}
        value={value}
        onChange={(_, nextValue) => {
          const nextAmount = Array.isArray(nextValue) ? nextValue[0] : nextValue;

          onChange(nextAmount);
          schedulePipelineChange();
        }}
      />

      <SolidChip count={value} fontSize={14} height={28} minWidth={50} />
    </Box>
  );
}
