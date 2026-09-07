import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  id: string;
  defaultTool?: boolean;
  toolContext?: any;
  tool?: React.ReactNode;
  children?: React.ReactNode
}

export default function GenericPanel({
  id,
  defaultTool = false,
  toolContext,
  tool,
  children
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { ref, inView } = useInView();

  return (
    <Box id={id} ref={ref} sx={{
      display: 'flex',
      flexDirection: 'column',
      width: 'auto',
      height: '100%',
      flex: '1 1 auto',
    }}>
      {!collapsed && inView && (tool || defaultTool) && <Box sx={wrapperSx} >
        {defaultTool && <GeneralRegistryToolbar group={id} context={toolContext} />}
        {tool}
      </Box>}
      {tool && inView && <Box sx={{
        width: '100%',
        height: '2px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        position: 'relative',
        zIndex: 999,

      }}>
        <Box onClick={() => setCollapsed(!collapsed)} sx={{
          position: 'absolute', top: !collapsed ? '-4px' : '0px', bgcolor: 'background.default', zIndex: 1, '&:hover': { bgcolor: 'background.default' },
          border: '1px solid', borderColor: 'divider',
          boxShadow: 2,
          borderRadius: '2px 2px 8px 8px',
          px: 1,
          py: 0,
          lineHeight: '16px',
          opacity: 0.2,
          '&:hover': { opacity: 1 }
        }}>
          -
        </Box>
      </Box>}
      {inView && <Box sx={boxSx}>
        {children}
      </Box>}
    </Box>
  )
}

const wrapperSx = {
  display: 'flex',
  alignItems: 'center',
  // boxShadow: 2,
  m: 0.75,
  mb: 0.5,
  borderRadius: 2,
  bgcolor: 'background.default',
  justifyContent: 'space-between',
  py: 0.75,
  px: 0.75
}

const boxSx = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  overflow: 'auto',
  position: 'relative',
  gap: 0.5,
  flex: '1 1 auto',
  pt: 0.5,
  px: 1,
}
