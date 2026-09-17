import KeyboardList from '@/components/KeyboardList';
import PopoverButton from '@/components/PopoverButton';
import { Keyboard } from 'lucide-react';

export default function KeyboardMenu() {
  return (<>
    <PopoverButton id="keyboard-list" trigger={<Keyboard size={16} />}
      width={450}
      upsideDown={true}
      anchorHorizontal="center"
      anchorVertical="top"
      transformHorizontal="center"
      transformVertical="bottom">
      <KeyboardList />
    </PopoverButton>
  </>)
}
