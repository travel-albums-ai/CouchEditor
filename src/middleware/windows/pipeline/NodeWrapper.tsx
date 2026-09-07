import NodeHeader from '@/middleware/windows/pipeline/NodeHeader';
import { Box, useTheme } from '@mui/material';

function NodeWrapper({ children, type} : { children: React.ReactNode, type: string }) {
  const theme = useTheme();

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
        }}
      />}

      <Box sx={{
        p: 1, py: 2,
        borderRadius: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: `color-mix(in srgb, ${theme.palette.background.paper} 100%, transparent 10%)`,
      }}>
        {children}
      </Box>

    </Box>
  </>
}

export default NodeWrapper;
