import { useSidebar, useSidebarStoreSelector } from '@/context/sidebarStore';
import SidebarCoreButton from '@/middleware/interface/sidebar/SidebarCoreButton';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SidebarSectionHeader({ title, icon, data, type }: { title: string, icon: React.ReactNode, data?: any[], type: string }) {
  const { setSidebarOpen } = useSidebar()
  const sidebarOpen = useSidebarStoreSelector(s => s.sidebarOpen)
  const isOpen = sidebarOpen?.[type as keyof typeof sidebarOpen] ?? false
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex',  alignItems: 'center', gap: 0, py: 0.25 }} id={`sidebar-section-${type}`}>
      <SidebarCoreButton
        onClick={() => {
          if(!isOpen) {
            setSidebarOpen(type as keyof typeof sidebarOpen, true)
          }
          navigate('/selectedType/' + type)
        }}
        variant="header"
        icon={icon}
        typographySx={{ fontWeight: 'bold', fontSize: 11 }}
        title={title}
        isActive={decodeURIComponent(location.pathname) === `/selectedType/${type}`}
        count={data?.length}
      />

      <Tooltip title={isOpen ? 'Collapse' : 'Expand'} arrow placement="right">
        <IconButton onClick={() => setSidebarOpen(type as keyof typeof sidebarOpen, !isOpen)} size="small" sx={{ ml: 0.5, p: 0.5}}>
          {isOpen
            ? <ChevronUp size={16} style={{ opacity: 0.4 }} color={theme.palette.text.primary} />
            : <ChevronDown size={16} style={{ opacity: 0.8 }} color={theme.palette.text.primary} />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
