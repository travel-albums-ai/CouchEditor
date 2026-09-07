import GenericToggleButton, { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import { ToggleButtonGroup } from '@mui/material';

export default function GenericToggleButtonGroup({
  id,
  items,
  variant = 'outlined',
}: {
  id?: string,
  items: GenericToggleButtonProps[],
  variant?: 'outlined' | 'standard'
}) {

  const Wrapper = ToggleButtonGroup;

  return <Wrapper id={id}>
    {items.map((item) => <GenericToggleButton key={item.tooltip} item={item} variant={variant} />)}
  </Wrapper>
}
