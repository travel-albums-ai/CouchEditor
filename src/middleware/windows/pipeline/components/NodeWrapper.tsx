import { useSettingsStoreSelector } from '@/context/settingsStore';
import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
import { Box, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Info } from 'lucide-react';
import { useState } from 'react';

type NodeWrapperProps = {
  children: React.ReactNode;
  type: string;
  helper?: React.ReactNode;
  tools?: React.ReactNode;
};

function NodeWrapper({
  children,
  type,
  helper,
  tools,
}: NodeWrapperProps) {
  const [showHelper, setShowHelper] = useState(false);
  const performanceMode = useSettingsStoreSelector(
    s => s.performanceMode
  );

  return (
    <Box
      sx={[
        {
          cursor: 'grab',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          // mx: 0.25,
          minWidth: 250,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: 'none',

          '&:hover': {
            borderColor: theme =>
              alpha(
                theme.palette.primary.main,
                performanceMode ? 0.26 : 0.53
              ),
          },
        },

        performanceMode && {
          transition:
            'border-color 0.25s ease, box-shadow 0.25s ease',

          '&:hover': {
            boxShadow: theme =>
              `0 0 3px ${alpha(theme.palette.primary.main, 0.8)}`,
          },
        },
      ]}
    >
      {type && (
        <NodeHeader
          type={type}
          sx={{
            width: '100%',
            border: 0,
            borderRadius: 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {tools && tools}
            {helper && (
              <IconButton
                size="small"
                sx={{
                  color: 'text.disabled',
                }}
                onClick={() =>
                  setShowHelper(prev => !prev)
                }
              >
                <Info size={16} />
              </IconButton>
            )}

          </Box>
        </NodeHeader>
      )}

      <Box
        className="nodrag"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          bgcolor: theme =>
            alpha(theme.palette.background.paper, 1),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
          }}
        >
          {children}
        </Box>

        {showHelper && (
          <Box sx={{ pb: 1 }}>
            {helper}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default NodeWrapper;
