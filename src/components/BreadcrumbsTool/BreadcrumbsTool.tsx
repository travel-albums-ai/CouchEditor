import { routeIcons, sectionIcons } from '@/icons/IconsIndex';
import { getRouteDetailsByPath } from '@/routes';
import { Box, Breadcrumbs, Link, Theme, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

export default function BreadcrumbsTool({ asIs = false }: { asIs?: boolean }) {
  const { pathname } = useLocation()
  const { type_name = '', id = '' } = useParams()
  const { t } = useTranslation()

  const routeDetails = useMemo(
    () => getRouteDetailsByPath(pathname),
    [pathname],
  )

  const breadcrumbTitle = routeDetails?.title ?? 'Page'
  const breadcrumbIcon = routeIcons[routeDetails?.path ?? '']

  const foundSection = t(type_name) || type_name
  const foundSectionIcon = sectionIcons[type_name]

  return (
    <Box sx={asIs ? {} : wrapperSx}>
      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Link
          component={RouterLink}
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
          color="inherit"
          variant='body2'
          to="/dashboard"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <img src="/logo_new_48.png" alt="TravelAlbums" style={{ width: 16, height: 16 }} />
            TravelAlbums
          </Box>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {breadcrumbIcon ? <>{breadcrumbIcon}</> : null}
          <Typography variant='body2'>{breadcrumbTitle}</Typography>
        </Box>
        {type_name && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {foundSectionIcon ? <>{foundSectionIcon}</> : null}
          <Typography variant='body2'>{foundSection}</Typography>
        </Box>}
        {id !== '' && <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant='body2' color="primary" sx={{ fontWeight: 'bold'}}>{id}</Typography>
        </Box>}
      </Breadcrumbs>
    </Box>
  )
}

const wrapperSx = {
  display: 'flex', alignItems: 'center',
  zIndex: (theme: Theme) => theme.zIndex.appBar,
  boxShadow: 1,
  m: 0.75,
  borderRadius: 2,
  minHeight: '48px',
  bgcolor: 'background.default',
  justifyContent: 'space-between',
  py: 0,
  px: 2,
  pr: 1,
}
