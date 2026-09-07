import AiLoadingBar from '@/components/AiLoadingBar';
import GeneralRegistryWindow from '@/components/registry/GeneralRegistryWindow';
import MainDriver from '@/components/tutorial/MainDriver';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import StatusBar from '@/layout/StatusBar';
import MascotWrapper from '@/mascot/MascotWrapper';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';

export default function AppLayout() {
  const settingsStore = useSettingsStoreSelector((state) => state);

  return (
    <>
      <GeneralRegistryWindow />
      <MainDriver />

      <MascotWrapper />

      <AiLoadingBar />


      {/* <Header /> */}

      <ReactFlowWrapper />

      <StatusBar />
    </>
  );
}
