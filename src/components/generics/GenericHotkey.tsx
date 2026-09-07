import { useHotkey } from '@tanstack/react-hotkeys';
import { ReactNode } from 'react';

export interface GenericHotkeyProps {
  kbd: string;
  onClick: () => void;
  meta?: {
    name: string;
    description: string;
    icon: ReactNode;
    group: string;
  }
}

export default function GenericHotkey({
  item,
}: {
  item: GenericHotkeyProps,
}) {
  useHotkey(item.kbd as any, () => {
    item.onClick()
  }, {
    enabled: !!item.kbd,
    meta: item?.meta
  })

  return null
}
