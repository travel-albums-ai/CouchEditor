import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onChange?: (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    value: string,
  ) => void;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const SegmentedControlRoot = styled(Box, {
  name: 'MuiSegmentedControl',
  slot: 'root',
  shouldForwardProp: (prop) => prop !== 'fullWidth',
})<{ fullWidth?: boolean }>(({ theme, fullWidth }) => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'stretch',
  width: fullWidth ? '100%' : 'fit-content',
  minHeight: 32,
  padding: 3,

  backgroundColor: theme.palette.action.hover,

  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius + 4,

  boxSizing: 'border-box',

  '&:focus-within': {
    borderColor: theme.palette.primary.main,
  },

  '& > *': {
    flex: fullWidth ? 1 : '0 0 auto',
  },
}));

export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(function SegmentedControl(
  {
    value: valueProp,
    defaultValue,
    onChange,
    children,
    fullWidth = false,
    ...rest
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue,
  );

  const value = valueProp !== undefined ? valueProp : uncontrolledValue;

  const select = React.useCallback(
    (
      event:
        | React.MouseEvent<HTMLElement>
        | React.KeyboardEvent<HTMLElement>,
      nextValue: string,
    ) => {
      if (valueProp === undefined) {
        setUncontrolledValue(nextValue);
      }

      onChange?.(event, nextValue);
    },
    [onChange, valueProp],
  );

  const items = React.Children.toArray(children);

  const itemValues = items
    .map((child) => {
      if (!React.isValidElement<SegmentedControlItemProps>(child)) {
        return null;
      }

      return child.props.value;
    })
    .filter((item): item is string => item != null);

  const moveFocus = React.useCallback(
    (
      currentValue: string,
      direction: 1 | -1,
      event: React.KeyboardEvent<HTMLElement>,
    ) => {
      if (!itemValues.length) return;

      const currentIndex = itemValues.indexOf(currentValue);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        nextIndex = itemValues.length - 1;
      }

      if (nextIndex >= itemValues.length) {
        nextIndex = 0;
      }

      const nextValue = itemValues[nextIndex];

      if (!nextValue) return;

      event.preventDefault();

      const root = event.currentTarget.closest(
        '[role="radiogroup"]',
      );

      const nextItem = root?.querySelector<HTMLElement>(
        `[data-segmented-value="${CSS.escape(nextValue)}"]`,
      );

      nextItem?.focus();
      select(event, nextValue);
    },
    [itemValues, select],
  );

  return (
    <SegmentedControlRoot
      ref={ref}
      role="radiogroup"
      fullWidth={fullWidth}
      {...rest}
    >
      {items.map((child, index) => {
        if (!React.isValidElement<SegmentedControlItemProps>(child)) {
          return child;
        }

        return React.cloneElement(child, {
          selected: value === child.props.value,
          tabIndex:
            value === child.props.value ||
            (value === undefined && index === 0)
              ? 0
              : -1,
          onSelect: select,
          onNavigate: moveFocus,
        });
      })}
    </SegmentedControlRoot>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

export interface SegmentedControlItemProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'onChange'
  > {
  value: string;
  selected?: boolean;
  disabled?: boolean;
  children: React.ReactNode;

  /**
   * Internal composition props injected by SegmentedControl.
   * You normally don't need to use these directly.
   */
  onSelect?: (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    value: string,
  ) => void;

  onNavigate?: (
    currentValue: string,
    direction: 1 | -1,
    event: React.KeyboardEvent<HTMLElement>,
  ) => void;
}

const SegmentedControlItemRoot = styled('button', {
  name: 'MuiSegmentedControlItem',
  slot: 'root',
  shouldForwardProp: (prop) =>
    prop !== 'selected' &&
    prop !== 'ownerTabIndex',
})<{
  selected?: boolean;
}>(({ theme, selected }) => ({
  position: 'relative',

  appearance: 'none',
  border: 0,
  outline: 0,

  minWidth: 0,
  minHeight: 26,
  padding: theme.spacing(0.5, 1.5),

  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',

  backgroundColor: selected
    ? theme.palette.background.paper
    : 'transparent',

  color: selected
    ? theme.palette.text.primary
    : theme.palette.text.secondary,

  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: selected ? 600 : 500,
  lineHeight: 1.25,

  whiteSpace: 'nowrap',
  cursor: 'pointer',

  borderRadius: theme.shape.borderRadius,

  boxShadow: selected
    ? theme.palette.mode === 'dark'
      ? '0 1px 3px rgba(0, 0, 0, 0.45)'
      : '0 1px 3px rgba(0, 0, 0, 0.16)'
    : 'none',

  transition: theme.transitions.create(
    ['background-color', 'color', 'box-shadow'],
    {
      duration: theme.transitions.duration.shortest,
    },
  ),

  '&:hover': {
    backgroundColor: selected
      ? theme.palette.background.paper
      : theme.palette.action.selected,
  },

  '&:focus-visible': {
    zIndex: 1,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`,
  },

  '&:active': {
    transform: 'translateY(0.5px)',
  },

  '&:disabled': {
    cursor: 'default',
    opacity: 0.45,
  },

  '& + &': {
    marginLeft: 1,
  },
}));

export const SegmentedControlItem = React.forwardRef<
  HTMLButtonElement,
  SegmentedControlItemProps
>(function SegmentedControlItem(
  {
    value,
    selected = false,
    disabled = false,
    children,
    onSelect,
    onNavigate,
    onClick,
    onKeyDown,
    tabIndex,
    ...rest
  },
  ref,
) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented && !disabled) {
      onSelect?.(event, value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        onNavigate?.(value, 1, event);
        break;

      case 'ArrowLeft':
        onNavigate?.(value, -1, event);
        break;

      case 'Home':
        onNavigate?.(value, -1, event);
        break;

      case 'End':
        onNavigate?.(value, 1, event);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.(event, value);
        break;
    }
  };

  return (
    <SegmentedControlItemRoot
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      data-segmented-value={value}
      selected={selected}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </SegmentedControlItemRoot>
  );
});

SegmentedControlItem.displayName = 'SegmentedControlItem';
