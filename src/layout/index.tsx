import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import ReactFlowWrapper from '@/pipeline/ReactFlowWrapper';
import Toolbars from '@/toolbars';
import WebMCP from '@/webmcp';
import Windows from '@/windows';

export default function AppLayout() {

  return (
    <>
      <ReactFlowWrapper />

      <MainDriver />
      <AiLoadingBar />

      <Windows />
      <Toolbars />
      <WebMCP />
    </>
  );
}
