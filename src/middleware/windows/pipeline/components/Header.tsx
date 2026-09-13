import { alpha, Box, Typography, useTheme } from '@mui/material';
import { GalleryHorizontalEnd, Users2, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SolidChip from '@/components/SolidChip';
import type { SavedPipeline } from '@/context/pipelineStore';
import DarkLightStatus from '@/middleware/tools/ActionTools/DarkLightStatus';
import FullscreenToggle from '@/middleware/tools/ActionTools/FullscreenToggle';
import SettingsWindowToggle from '@/middleware/tools/ActionTools/SettingsWindowToggle';
import TutorialToggle from '@/middleware/tools/ActionTools/TutorialToggle';
import ExtendedMenu from '@/middleware/tools/PopoverTools/ExtendedMenu';
import PipelineSelector from './PipelineSelector';

type HeaderProps = {
  currentPipelineId: string;
  pipelines: SavedPipeline[];
  loadPipeline: (id: string) => void;
};

export default function Header({ currentPipelineId, pipelines, loadPipeline }: HeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 2, pr: 1.5, py: 1.5, bgcolor: 'background.paper', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
      boxShadow: theme => `0px 4px 4px -2px ${theme.palette.divider}`,
      zIndex: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img
          src="./couchLogoMini.png"
          alt={t('logoAlt')}
          width={45}
          height={30}
          style={{ width: 45, height: 30 }}
          fetchPriority="high"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: 17, lineHeight: 1 }}>{t('couchEditor')}</Typography>
            <SolidChip label={t('beta')} variant="header" />
          </Box>
          <Typography variant="caption" color="textDisabled" sx={{ lineHeight: 1 }}>{t('headerTagline')}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled', borderRadius: 2, p: 2, height: 42,
          bgcolor: alpha(theme.palette.divider, 0.03),
        }}>
          <Workflow size={16} />
          <Typography variant="subtitle2">{t('editor')}</Typography>
        </Box>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main', borderRadius: 2, p: 2, height: 42,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.07),
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
        }}>
          <GalleryHorizontalEnd size={16} />
          <Typography variant="subtitle2" sx={{ mr: 2 }}>{t('templates')}</Typography>
          <PipelineSelector
            currentPipelineId={currentPipelineId}
            pipelines={pipelines}
            loadPipeline={loadPipeline}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main', borderRadius: 2, p: 2, height: 42,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: alpha(theme.palette.secondary.main, 0.3),
          '&:hover': {
            bgcolor: alpha(theme.palette.secondary.main, 0.2),
          },

        }}>
          <Users2 size={16} />
          <Typography variant="subtitle2">{t('community')}</Typography>
          <Box sx={{ color: 'text.primary', bgcolor: theme => alpha(theme.palette.secondary.main, 0.2) }}>
            <SolidChip label={t('comingSoon')} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <SettingsWindowToggle />
        <DarkLightStatus />
        <FullscreenToggle />
        <TutorialToggle />
        <ExtendedMenu />
      </Box>
    </Box>
  );
}
