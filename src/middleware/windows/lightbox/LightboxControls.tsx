import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { ReactNode } from 'react';

type ControlButtonProps = {
  tooltip: string;
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
};

export default function ControlButton({ tooltip, onClick, icon, disabled }: ControlButtonProps) {
  return (
    <GenericToggleButtonGroup
      items={[{
        tooltip,
        onClick,
        icon,
        selected: false,
        disabled: !!disabled,
      }] as GenericToggleButtonProps[]}
      variant="outlined"
    />
  );
}
