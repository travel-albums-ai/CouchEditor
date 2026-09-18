import NewChip from '@/components/NewChip';
import { Workflow } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PIPELINE_NODE_COUNT_EVENT = 'pipeline:node-count';
const PIPELINE_NODE_COUNT_REQUEST_EVENT = 'pipeline:node-count-request';

export default function PipelineNodeCounter() {
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
    <NewChip
      count={count}
      icon={<Workflow />}
      label={"Nodes"}
      variant={count > 0 ? 'important' : 'text'}
      fontSize={14}
      tooltip={t('pipelineNodesTooltip')}
    />
  )
}
