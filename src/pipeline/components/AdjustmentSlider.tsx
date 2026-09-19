import SolidChip from '@/components/SolidChip';
import { Box, Slider, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';

type AdjustmentSliderProps = {
  description?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  debounceMs?: number;
  disabled?: boolean;
};

export default function AdjustmentSlider({
  description,
  min,
  max,
  step,
  value,
  onChange,
  debounceMs = 250,
  disabled,
}: AdjustmentSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const pendingChange = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dispatchPipelineChange = useCallback(() => {
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  }, []);

  const scheduleChange = useCallback((nextValue: number) => {
    if (pendingChange.current !== null) {
      clearTimeout(pendingChange.current);
    }

    pendingChange.current = setTimeout(() => {
      pendingChange.current = null;
      onChange(nextValue);
      dispatchPipelineChange();
    }, debounceMs);
  }, [debounceMs, dispatchPipelineChange, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => () => {
    if (pendingChange.current !== null) {
      clearTimeout(pendingChange.current);
      pendingChange.current = null;
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
        value={localValue}
        onChange={(_, nextValue) => {
          const nextAmount = Array.isArray(nextValue) ? nextValue[0] : nextValue;

          setLocalValue(nextAmount);
          scheduleChange(nextAmount);
        }}
      />

      <SolidChip count={localValue} fontSize={14} height={28} minWidth={50} />
    </Box>
  );
}
