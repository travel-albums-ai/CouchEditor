import WebMCPAddPipelineNode from '@/webmcp/WebMCPAddPipelineNode';
import WebMCPClonePipelineNode from '@/webmcp/WebMCPClonePipelineNode';
import WebMCPConnectPipelineNodes from '@/webmcp/WebMCPConnectPipelineNodes';
import WebMCPDeletePipelineEdge from '@/webmcp/WebMCPDeletePipelineEdge';
import WebMCPDeletePipelineNode from '@/webmcp/WebMCPDeletePipelineNode';
import WebMCPGetCurrentPipeline from '@/webmcp/WebMCPGetCurrentPipeline';
import WebMCPGetPipelineToolbox from '@/webmcp/WebMCPGetPipelineToolbox';
import WebMCPMovePipelineNode from '@/webmcp/WebMCPMovePipelineNode';
import WebMCPThemeTool from '@/webmcp/WebMCPThemeTool';
import WebMCPUpdatePipelineNodeProperties from '@/webmcp/WebMCPUpdatePipelineNodeProperties';

export default function WebMCP() {

  return (
    <>
      <WebMCPThemeTool />
      <WebMCPAddPipelineNode />
      <WebMCPClonePipelineNode />
      <WebMCPConnectPipelineNodes />
      <WebMCPDeletePipelineEdge />
      <WebMCPDeletePipelineNode />
      <WebMCPGetCurrentPipeline />
      <WebMCPGetPipelineToolbox />
      <WebMCPMovePipelineNode />
      <WebMCPUpdatePipelineNodeProperties />
    </>
  );
}
