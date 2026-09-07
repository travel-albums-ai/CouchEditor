import SettingsSection from '@/components/SettingsSection';
import SolidChip from '@/components/SolidChip';
import { useBYOKStoreSelector } from '@/context/byokStore';
import CostAnalyzer from '@/robot/CostAnalyzer';
import { Box, Typography } from '@mui/material';
import { Astroid, BoxIcon, Clock, Coins, FileQuestionMark, LogIn, LogOut } from 'lucide-react';


export default function BYOKCosts() {
  const { usageStats } = useBYOKStoreSelector((state) => state)

  const totalInputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.input_tokens || 0), 0) || 0;
  const totalOutputTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.output_tokens || 0), 0) || 0;
  const totalTokens = usageStats?.reduce((acc, stat) => acc + (stat.usage.total_tokens || 0), 0) || 0;

  const convertToHumanReadable = (date: number) => {
    const dateObj = new Date(date * 1000); // Convert seconds to milliseconds
    return dateObj.toLocaleString(); // Format the date to a human-readable string
  };

  return <>
    <SettingsSection title="Costs estimation" icon={<Coins />} transparent={true} uuid="byok-costs">

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, p: 1, justifyContent: 'flex-start', height: '300px', overflowY: 'auto' }}>

        {usageStats?.map((usageStat, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.5, p: 0.25, justifyContent: 'space-between', flexWrap: 'nowrap', borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <Typography variant="caption" color="textDisabled" sx={{ width: '30px' }}>{index}.</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {usageStat.call_type && <SolidChip label={`${usageStat.call_type}`} icon={<FileQuestionMark size={16} />} fontSize={13} borderless />}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
              <SolidChip label={`${usageStat.model} model`} icon={<Astroid size={16} />}  />
              {usageStat.service_tier && <SolidChip label={`${usageStat.service_tier}`} icon={<Coins size={16} />} />}
              <SolidChip label={`${convertToHumanReadable(Number(usageStat.created_at))}`} icon={<Clock size={16} />} borderless  />
              <SolidChip count={usageStat.usage.total_tokens / 1000} label={`M tokens`} icon={<BoxIcon size={16} />} fontSize={13} minWidth={140} />
            </Box>
          </Box>
        ))}

      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5, p: 1, flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'center' }}>
        <SolidChip count={totalInputTokens / 1000} label={`M Input`} icon={<LogIn size={16} />} />
        <SolidChip count={totalOutputTokens / 1000} label={`M Output`} icon={<LogOut size={16} />} />
        <SolidChip count={totalTokens / 1000} label={`M tokens`} icon={<BoxIcon size={16} />} fontSize={13} />
        <CostAnalyzer />
      </Box>
    </SettingsSection>
  </>
}
