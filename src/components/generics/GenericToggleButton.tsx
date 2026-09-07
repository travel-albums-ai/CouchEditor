import KeyboardChip from '@/components/KeyboardChip';
import PopoverButtonSimple from '@/components/PopoverButtonSimple';
import GenericHotkey from '@/components/generics/GenericHotkey';
import { Box, ToggleButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Astroid, ChevronDown, ChevronUp } from 'lucide-react';
import { cloneElement, memo, ReactElement, ReactNode } from 'react';

export interface GenericToggleButtonProps {
  id?: string;
  webMcp?: boolean;
  group?: string[];
  tooltip: string;
  kbd?: string;
  icon: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  selected?: boolean;
  value?: string | number | boolean;
  title?: string;
  disabled?: boolean;
  upsideDown?: boolean;
  popover?: ReactNode;
  meta?: {
    name: string;
    description: string;
    icon: ReactNode;
    group: string;
  };
}

interface Props {
  item: GenericToggleButtonProps;
  variant?: 'standard' | 'outlined';
  size?: number;
  dropShadow?: boolean;
}

export default memo(function GenericToggleButton({
  item,
  variant = 'standard',
  size = 16,
  dropShadow = false,
}: Props) {
  const theme = useTheme();
  const {
    icon,
    title,
    tooltip,
    kbd,
    disabled,
    selected,
    value,
    popover,
    upsideDown,
    webMcp,
    onClick,
  } = item;

  const textColor = theme.palette.text.primary;

  const button = (
    <ToggleButton
      value={value ?? tooltip}
      selected={!disabled && selected}
      disabled={disabled}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.25,
        border: 0,
        borderRadius: 2,
        ...(variant === 'outlined' && {
          boxShadow: `inset 0 0 0 1px ${theme.palette.divider}`,
        }),
      }}
    >
      {icon &&
        cloneElement(icon as ReactElement, {
          size,
          color: textColor,
          ...(dropShadow && {
            style: {
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,1))',
            },
          }),
        })}

      {title && (
        <Typography
          variant="caption"
          color="textPrimary"
          sx={{ ml: 0.5, lineHeight: 1 }}
        >
          {title}
        </Typography>
      )}

      {popover &&
        (upsideDown ? (
          <ChevronUp size={12} color={textColor} />
        ) : (
          <ChevronDown size={12} color={textColor} />
        ))}
    </ToggleButton>
  );

  const content = (
    <>
      {kbd && !disabled && <GenericHotkey item={item as any} />}

      <Tooltip
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 0.125 }}>
            {webMcp && <Astroid size={12} />}
            {tooltip}
            {kbd && !disabled && <KeyboardChip shortcut={kbd} />}
          </Box>
        }
        placement="bottom"
        arrow
      >
        <span>{button}</span>
      </Tooltip>
    </>
  );

  return popover ? (
    <PopoverButtonSimple trigger={<span>{content}</span>}>
      {popover}
    </PopoverButtonSimple>
  ) : (
    content
  );
});
