import AiLoadingBar from '@/components/AiLoadingBar';
import GeneralRegistryWindow from '@/components/registry/GeneralRegistryWindow';
import MainDriver from '@/components/tutorial/MainDriver';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';

export default function AppLayout() {

  return (
    <>
      <GeneralRegistryWindow />
      <MainDriver />
      <AiLoadingBar />
      <ReactFlowWrapper />
    </>
  );
}
