import SolidChip from '@/components/SolidChip';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PIPELINE_NODE_COUNT_EVENT = 'pipeline:node-count';
const PIPELINE_NODE_COUNT_REQUEST_EVENT = 'pipeline:node-count-request';

export default function PipelineNodeCountStatus() {
  const [count, setCount] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    const handleNodeCount = (event: Event) => {
      const count = (event as CustomEvent<number>).detail;
      if (typeof count === 'number') {
        setCount(count)
      }
    }

    window.addEventListener(PIPELINE_NODE_COUNT_EVENT, handleNodeCount)
    window.dispatchEvent(new Event(PIPELINE_NODE_COUNT_REQUEST_EVENT))
    return () => window.removeEventListener(PIPELINE_NODE_COUNT_EVENT, handleNodeCount)
  }, [])

  return (
    <SolidChip
      count={count}
      label={"PL/n"}
      variant="text"
      minWidth={80}
      tooltip={t('pipelineNodesTooltip')}
    />
  )
}
