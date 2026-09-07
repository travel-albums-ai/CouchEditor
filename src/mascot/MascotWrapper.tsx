import { useSettingsStoreSelector } from '@/context/settingsStore';
import Mascot from '@/mascot/Mascot';

export default function MascotWrapper() {
  const mascot = useSettingsStoreSelector((state) => state.mascot);

  return <>
    {mascot && <Mascot />}
  </>
}
