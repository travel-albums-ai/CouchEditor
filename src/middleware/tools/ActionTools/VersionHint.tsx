import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useTheme } from '@mui/material';
import { FlaskConical } from 'lucide-react';

export default function AllToFavoriteToggle() {
  const theme = useTheme()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      title: '[ ALPHA ]',
      tooltip: "This is an alpha version",
      icon: <FlaskConical fill={theme.palette.primary.dark} /> ,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
