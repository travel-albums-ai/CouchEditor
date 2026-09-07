import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
import { Box, IconButton, useTheme } from '@mui/material';
import { Info } from 'lucide-react';
import { useState } from 'react';

function NodeWrapper({ children, type, helper } : { children: React.ReactNode, type: string, helper?: React.ReactNode }) {
  const theme = useTheme();
  const [showHelper, setShowHelper] = useState<boolean>(false);

  return <>

    <Box
      sx={{
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        mx: 0.25,
        gap: 0,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 0 0px transparent`,
        transition: 'box-shadow 0.25s ease',
        '&:hover': {
          boxShadow: `0 0px 3px ${theme.palette.primary.main}`,
          border: `1px solid ${theme.palette.primary.main}42`,
        },
      }}
      key={type}
    >
      {type && <NodeHeader
        type={type}
        sx={{
          borderRadius: 2,
          width: '100%',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: 'unset'
        }}
      >
        {helper && <IconButton
          sx={{ color: theme.palette.text.disabled }}
          onClick={() => setShowHelper((prev) => !prev)} size="small">
          <Info size={16} />
        </IconButton>}
      </NodeHeader>}

      <Box className="nodrag" sx={{
        borderRadius: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        bgcolor: `color-mix(in srgb, ${theme.palette.background.paper} 100%, transparent 10%)`,
      }}>
        <Box sx={{
          display: 'flex',
          p: 2,
          flexDirection: 'column',
          gap: 2,
        }}>
          {children}
        </Box>

        {showHelper && <Box sx={{
          pb: 1,
        }}>{helper}</Box>}
      </Box>

    </Box>
  </>
}

export default NodeWrapper;
