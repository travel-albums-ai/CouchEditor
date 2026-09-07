import AiLoadingBar from '@/components/AiLoadingBar';
import GeneralRegistryWindow from '@/components/registry/GeneralRegistryWindow';
import MainDriver from '@/components/tutorial/MainDriver';
import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import Header from '@/layout/Header';
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

      <WebMCPDataView
        name="check_settings_store"
        description="Get current settings store"
        execute={async () => ({
          content: [{
            type: 'text',
            text: `Current settings store is ${JSON.stringify(settingsStore)}.`
          }]
        })}
      />

      <Header />

      <ReactFlowWrapper />

      <StatusBar />
    </>
  );
}
