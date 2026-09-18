import SectionHeader from '@/components/SectionHeader';
import { usePipelineStore } from '@/context/pipelineStore';
import PipelineSelectorItems from '@/pipeline/components/PipelineSelectorItems';
import PipelineSelectorItem from '@/windows/templates/PipelineSelectorItem';
import { Box, Chip, TextField } from '@mui/material';
import { Astroid, Camera, GalleryHorizontalEnd, User } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Templates() {
  const { pipelines, loadById, setCurrentPipeline } = usePipelineStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('all');
  const { t } = useTranslation();

  const handleSelect = (pipelineId: string) => {
    const pipeline = loadById(pipelineId);
    if (!pipeline) return;

    setCurrentPipeline({ ...pipeline, isDirty: false });
  };

  const pipelineGroupings = [
    {
      name: 'templatesSampleName',
      description: 'templatesSampleDescription',
      icon: <Astroid />,
      type: 'sample',
      data: pipelines
        .filter(p => p.type === 'sample')
    },
    {
      type: 'instagram',
      name: 'templatesInstagramName',
      description: 'templatesInstagramDescription',
      icon: <Camera />,
      data: pipelines
        .filter(p => p.type === 'instagram')
    },
    {
      type: 'user',
      name: 'templatesUserName',
      description: 'templatesUserDescription',
      icon: <User />,
      data: pipelines
        .filter(p => p.type === 'user')
    }
  ]

  const chips = [
    {
      label: 'templatesFilterAll', value: 'all'
    },
    {
      label: 'templatesFilterSample', value: 'sample'
    },
    {
      label: 'templatesFilterInstagram', value: 'instagram'
    },
    {
      label: 'templatesFilterUser', value: 'user'
    },
  ]

  return (
    <>
      <SectionHeader
        sx={{ py: 2, px: 1, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', }}
        image="templates_header.png"
        icon={GalleryHorizontalEnd}
        iconSize={64}
        bgSize="500px"
        bgPosition="650px center"
        title={t('templatesTitle')}
        subTitle={t('templatesDescription')}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 0, justifyContent: 'space-between', px: 2, py: 1 }}>
        <TextField
          autoFocus
          color="primary"
          variant="outlined"
          size="small"
          placeholder={t('templatesSearchPlaceholder')}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          sx={{ flex: 1 }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          {chips.map((chip) => (
            <Chip
              key={chip.value}
              label={t(chip.label)}
              color={selectedView === chip.value ? 'primary' : 'default'}
              onClick={() => setSelectedView(chip.value)}
              variant={selectedView === chip.value ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ overflowY: 'auto' }}>
        {pipelineGroupings
          .filter((grouping) => selectedView === 'all' || grouping.type === selectedView)
          .filter((grouping) => grouping.data.some((pipeline) => pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())))
          .map((grouping) => (
            <PipelineSelectorItems
              key={grouping.name}
              title={t(grouping.name)}
              icon={grouping.icon}
              description={t(grouping.description)}
              isSelected={grouping.type === selectedView}
              onClick={() => setSelectedView(grouping.type)}
            >
              {grouping.data
                .filter((pipeline) => pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter((_, index) => grouping.type !== selectedView ? index < 9 : true)
                .map((pipeline) => (
                  <PipelineSelectorItem pipeline={pipeline} onClick={() => handleSelect(pipeline.id)} key={pipeline.id} />
                ))}
            </PipelineSelectorItems>
          ))}
      </Box>
    </>
  );
}
