import GenericToggleButton, { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import { ToggleButtonGroup } from '@mui/material';

export default function GenericToggleButtonGroup({
  id,
  items,
  variant = 'outlined',
  anchorHorizontal="right",
  anchorVertical="top",
  transformHorizontal="left",
  transformVertical="bottom",
}: {
  id?: string,
  items: GenericToggleButtonProps[],
  variant?: 'outlined' | 'standard',
  anchorHorizontal?: 'left' | 'center' | 'right',
  anchorVertical?: 'top' | 'center' | 'bottom',
  transformHorizontal?: 'left' | 'center' | 'right',
  transformVertical?: 'top' | 'center' | 'bottom',
}) {

  const Wrapper = ToggleButtonGroup;

  return <Wrapper id={id}>
    {items.map((item) => <GenericToggleButton
      key={item.tooltip}
      item={item}
      variant={variant}
      anchorHorizontal={anchorHorizontal}
      anchorVertical={anchorVertical}
      transformHorizontal={transformHorizontal}
      transformVertical={transformVertical} />)}
  </Wrapper>
}
