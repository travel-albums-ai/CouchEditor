import AiLoadingBar from '@/components/AiLoadingBar';
import MainDriver from '@/components/tutorial/MainDriver';
import Toolbars from '@/toolbars';
import WebMCP from '@/webmcp';
import Windows from '@/windows';
import ReactFlowWrapper from '@/windows/pipeline/ReactFlowWrapper';

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
