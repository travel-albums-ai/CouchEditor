import AiLoadingBar from '@/components/AiLoadingBar';
import GeneralRegistryWindow from '@/components/registry/GeneralRegistryWindow';
import MainDriver from '@/components/tutorial/MainDriver';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import StatusBar from '@/layout/StatusBar';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';

export default function AppLayout() {
  const settingsStore = useSettingsStoreSelector((state) => state);

  return (
    <>
      <GeneralRegistryWindow />
      <MainDriver />


      <AiLoadingBar />


      {/* <Header /> */}

      <ReactFlowWrapper />

      <StatusBar />
    </>
  );
}
