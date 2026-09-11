import { useBYOKStoreSelector } from '@/context/byokStore';
import { InputHandle } from '@/middleware/windows/pipeline/components/InputHandle';
import NodeWrapper from '@/middleware/windows/pipeline/components/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/components/OutputHandle';
import PipelineStageTiming from '@/middleware/windows/pipeline/components/PipelineStageTiming';
import { Alert, Box, Button, LinearProgress, TextField, Typography } from '@mui/material';
import { Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type AskAIProgress = {
  runId: number;
  completed: number;
  total: number;
};

function AskAINode({ id, data }: NodeProps<Node<{ passthru?: boolean; apiKey?: string; question?: string }>>) {
  const { t } = useTranslation();
  const { setNodes } = useReactFlow();
  const byokOpenAIKey = useBYOKStoreSelector((state) => state.byokOpenAIKey);
  const [engaged, setEngaged] = useState(data.passthru === false);
  const [question, setQuestion] = useState(data.question ?? '');
  const [progress, setProgress] = useState<AskAIProgress | null>(null);

  useEffect(() => {
    setNodes((current) => current.map((node) => node.id === id
      ? {
        ...node,
        data: {
          ...node.data,
          apiKey: byokOpenAIKey,
          passthru: !engaged,
          question,
        },
      }
      : node
    ));
    window.dispatchEvent(new CustomEvent('pipeline:changed'));
  }, [id, setNodes, byokOpenAIKey, engaged, question]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<AskAIProgress & { nodeId: string }>).detail;

      if (detail?.nodeId === id) setProgress(detail);
    };

    window.addEventListener('ask-ai:progress', handler);
    return () => window.removeEventListener('ask-ai:progress', handler);
  }, [id]);

  const percent = progress && progress.total > 0
    ? Math.min(100, (progress.completed / progress.total) * 100)
    : 0;

  return <>
    <InputHandle id="image" position={Position.Left} />
    <NodeWrapper type="ask-ai" tools={<PipelineStageTiming nodeId={id} nodeType={'ask-ai'} />}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant={engaged ? 'contained' : 'outlined'}
          size="small"
          startIcon={<Sparkles size={14} />}
          onClick={() => setEngaged((current) => !current)}
        >
          {engaged ? t('aiEngaged') : t('aiPassthru')}
        </Button>
      </Box>

      <TextField
        className="nodrag nopan"
        label={t('pipelineAskAIQuestion')}
        placeholder={t('pipelineAskAIQuestionPlaceholder')}
        value={question}
        onChange={(event) => {
          const nextQuestion = event.target.value;
          setQuestion(nextQuestion);
          setEngaged(false);
          window.dispatchEvent(new CustomEvent('pipeline:changed'));
        }}
        multiline
        minRows={3}
        size="small"
        fullWidth
      />

      {engaged && !byokOpenAIKey && (
        <Alert severity="warning" sx={{ py: 0, mt: 1 }}>
          {t('aiNoOpenAiKey')}
        </Alert>
      )}

      {engaged && !question.trim() && (
        <Alert severity="info" sx={{ py: 0, mt: 1 }}>
          {t('pipelineAskAIQuestionRequired')}
        </Alert>
      )}

      {engaged && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <LinearProgress variant="determinate" value={percent} />
          <Typography variant="caption" color="text.secondary">
            {progress
              ? `${progress.completed}/${progress.total} ${t('pipelineAskAIProgress')}`
              : t('aiIdle')}
          </Typography>
        </Box>
      )}
    </NodeWrapper>
    <OutputHandle id="positive" position={Position.Right} />
    <OutputHandle id="negative" position={Position.Right} style={{ top: '70%' }} />
  </>;
}

export default AskAINode;
