import SolidChip from '@/components/SolidChip';
import DebouncedSlider from '@/middleware/interface/adjustments/DebouncedSlider';
import OnboardingWrapperInfo from '@/middleware/windows/onboarding/OnboardingWrapperInfo';
import {
  Box,
  Switch,
  Typography
} from "@mui/material";

export interface AdjustmentsSlider {
  label: string;
  skipLabel?: boolean;
  preIcon?: React.ReactNode;
  min: number;
  max: number;
  scale?: number;
  step?: number;
  value: number;
  defaultValue?: number;
  onChange: (_event: Event, _value: number | number[]) => void;
}

export interface AdjustmentsItemProps {
  title: string;
  checked: boolean;
  onChange: (_checked: boolean) => void;
  sliders?: AdjustmentsSlider[];
}

export default function AdjustmentsItem({ title, checked, onChange, sliders }: AdjustmentsItemProps) {

  return (
    <OnboardingWrapperInfo light={true} sx={{ m: 0}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1, px: 1, py: 1, width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }} onClick={() => onChange(!checked)}>
          <Typography variant="caption" sx={{ cursor: 'pointer', fontWeight: checked ? 'bold' : 'normal' }}  color={checked ? 'textPrimary' : 'textDisabled'}>{title}</Typography>
        </Box>

        {sliders && sliders.length > 0 && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', opacity: checked ? 1 : 0.25, pointerEvents: checked ? 'auto' : 'none' }}>
          {sliders.map((slider, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, py: 0.5, justifyContent: 'flex-end' }} >
              {sliders.length !== 1 && !slider.skipLabel && <Typography variant="caption" color={checked ? 'textPrimary' : 'textDisabled'}>{slider.label}</Typography>}
              {slider.preIcon}
              <DebouncedSlider
                slider={slider}
                checked={checked}
              />
              <SolidChip count={Math.round(Math.round(slider.value * 1000) / 1000 / (slider.scale ?? 1) * 100) / 100} minWidth={50} />
            </Box>
          ))}
        </Box>}
        {sliders && sliders.length === 0 && <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', opacity: checked ? 1 : 0.25, pointerEvents: checked ? 'auto' : 'none' }}>
          <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} size="small" />
        </Box>}
      </Box>
    </OnboardingWrapperInfo>
  );
}
