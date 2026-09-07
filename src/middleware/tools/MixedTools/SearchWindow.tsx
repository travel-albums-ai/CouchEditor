import BreadcrumbsTool from '@/components/BreadcrumbsTool/BreadcrumbsTool';
import SearchFiles from '@/components/SearchFiles';
import { Box } from '@mui/material';
import { CircleX } from 'lucide-react';
import { useState } from 'react';

export default function SearchWindow() {
  const [breadcrumbs, setBreadcrumbs] = useState<boolean>(true);

  return (<Box sx={{ display: 'inline-flex', gap: 1, flexGrow: 1 }}>
    <Box
      id="search-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: (theme) => theme.zIndex.appBar,
        boxShadow: 1,
        borderRadius: 2,
        flex: 1,
        bgcolor: 'background.paper',
        justifyContent: 'space-between',
        px: 2, py: 0.5,
        transition: 'background-color 0.25s',
        '&:hover': { bgcolor: 'action.hover' },
      }}>

      <Box sx={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }} onClick={(prev) => breadcrumbs && setBreadcrumbs(!prev)}>
        <Box
          onClick={e => e.stopPropagation()}
          sx={{
            display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap',
            zIndex: breadcrumbs ? 1 : -1,
            opacity: breadcrumbs ? 1 : 0,
          }}
        >
          <BreadcrumbsTool asIs />
        </Box>
        {!breadcrumbs && <Box
          sx={{
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap',
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            gap: 1,
            zIndex: breadcrumbs ? 0 : 1,
            opacity: breadcrumbs ? 0 : 1,
          }}
        >
          <SearchFiles />
          <CircleX size={16} onClick={() => setBreadcrumbs((prev) => !prev)} />
        </Box>}
      </Box>

    </Box>
  </Box>)
}
