import SolidChip from '@/components/SolidChip';
import { useSettings } from '@/context/settingsStore';
import { useFetch_TakeoutMetadata } from '@/hooks/remote/useFetch_TakeoutMetadata';
import { Box, Button, Card, Typography } from '@mui/material';
import { Astroid, Database, DatabaseSearch, PersonStanding } from 'lucide-react';
import stc from 'string-to-color';

export default function DashboardSuggestions() {
  const { setSetting } = useSettings()
  const { refetch } = useFetch_TakeoutMetadata();

  const items = [
    {
      title: 'Enable AI',
      description: 'Enable AI features for better suggestions and insights.',
      icon: <PersonStanding />,
      labels: ['annotate photos', 'generate stories'],
      actionTitle: 'Open Settings',
      action: () => setSetting((prev) => ({ ...prev, showSettings: !prev.showSettings}))
    },
    {
      title: 'Refresh Database',
      description: 'Refresh the database to ensure all data is up-to-date.',
      icon: <Database />,
      labels: ['refresh data'],
      actionTitle: 'Clear Cache',
      action: () => refetch()
    },
    {
      title: 'SpotAI Mascot',
      description: 'Show the AI Mascot companion to help you along',
      icon: <Astroid />,
      actionTitle: 'Toggle Mascot',
      labels: ['companion', 'mascot'],
      action: () => setSetting((prev) => ({ ...prev, mascot: !prev.mascot}))
    },
    {
      title: 'Trigger Indexer',
      description: 'Open the indexing tool to find new photos',
      icon: <DatabaseSearch />,
      actionTitle: 'Open Indexer',
      labels: ['discovery'],
      action: () => setSetting((prev) => ({ ...prev, showSettings: !prev.showSettings}))
    }

  ]

  return (
    <Box sx={{
      width: '800px',
      // display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: 2, flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <Card key={index} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2, p: 2, mb: 2, bgcolor: `${stc(item.title)}22` }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {item.icon}
            <Typography variant="subtitle2" color="textPrimary">{item.title}</Typography>
          </Box>
          <div>
            <Typography variant="caption" color="textDisabled">{item.description}</Typography>
            <Box sx={{ display: 'flex', gap: 1, pt: 2 }}>
              {item.labels?.map(label => <SolidChip key={label} label={label} fontSize={14} height={28} minWidth={140} />)}
            </Box>
          </div>
          <Box sx={{ pt: 2, mt: 0.5, borderTop: '1px dotted', borderColor: 'divider' }}>
            {item.action && <Button variant="outlined" size="small" sx={{
              borderColor: `${stc(item.title)}88`,
              color: `${stc(item.title)}88`,

            }} onClick={item.action}>{item.actionTitle}</Button>}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
