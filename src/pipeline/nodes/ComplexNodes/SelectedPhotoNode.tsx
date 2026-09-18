import { useSettingsStoreSelector } from '@/context/settingsStore';
import { InputHandle } from '@/pipeline/components/InputHandle';
import NodeWrapper from '@/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/pipeline/components/OutputHandle';
import { Position, type Node, type NodeProps } from '@xyflow/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type SelectedPhotoNodeData = {
  selectedPhotoName?: string;
};

function SelectedPhotoNode({
  data,
}: NodeProps<Node<SelectedPhotoNodeData>>) {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const { t } = useTranslation();

  useEffect(() => {
    if (data.selectedPhotoName === previewPhotoObj) return;

    data.selectedPhotoName = previewPhotoObj;
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  }, [data, previewPhotoObj]);

  return (
    <>
      <InputHandle id="image" position={Position.Left} />
      <NodeWrapper title={t('pipelineSelectedPhoto')} type="selected-photo">
        <small>{previewPhotoObj ?? t('pipelineNoPhotoSelected')}</small>
      </NodeWrapper>
      <OutputHandle id="image" position={Position.Right} />
    </>
  );
}

export default SelectedPhotoNode;
