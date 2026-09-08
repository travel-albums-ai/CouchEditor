import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useEffect } from 'react';

type SelectedPhotoNodeData = {
  selectedPhotoName?: string;
};

function SelectedPhotoNode({
  data,
}: NodeProps<Node<SelectedPhotoNodeData>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);

  useEffect(() => {
    if (data.selectedPhotoName === previewPhotoObj) return;

    data.selectedPhotoName = previewPhotoObj;
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  }, [data, previewPhotoObj]);

  return (
    <>
      <InputHandle id="image" position={Position.Top} />
      <NodeWrapper title="Selected Photo" type="selected-photo">
        <small>{previewPhotoObj ?? 'No photo selected'}</small>
      </NodeWrapper>
      <OutputHandle id="image" position={Position.Bottom} />
    </>
  );
}

export default SelectedPhotoNode;
