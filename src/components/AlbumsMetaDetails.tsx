import SolidChip from '@/components/SolidChip';
import { Box, Divider, Skeleton, Stack, Tooltip } from '@mui/material';
import { Camera, Eye, Heart, MapPin, MessagesSquare, Users } from 'lucide-react';
import { JSX } from 'react';
import { useTranslation } from 'react-i18next';

export default function AlbumsMetaDetails({ id, photos, minWidth = 50, filterEmpty = false, extraItems = [], showCount = true, showLocation = true }: { id?: string, photos?: any[], minWidth?: number, filterEmpty?: boolean, extraItems?: { label: string, value: number, icon: JSX.Element }[] , showCount?: boolean, showLocation?: boolean }) {
  const albumPhotos = photos
  const { t } = useTranslation()

  const determinePeople = () => photos ? Array.from(new Set(albumPhotos
    .filter(photo => photo.people && photo.people.length > 0)
    .map(photo => photo.people.flatMap(person => person.name))
    .flat())) : []

  const items = [
    {
      label: t('metaPhotos'),
      value: photos?.length,
      icon: <Camera size={14} />,
      visible: showCount
    },
    {
      label: t('metaComments'),
      value: (photos?.filter(photo => photo.social.some(comment => comment.text)) || [])?.length,
      icon: <MessagesSquare size={14} />
    },
    {
      label: t('metaLikes'),
      value: (photos?.filter(photo => photo.social.some(comment => comment.liked > 0)) || [])?.length,
      icon: <Heart size={14} />
    },
    {
      label: t('metaPeople'),
      value: determinePeople().length || 0,
      icon: <Users size={14} />
    },
    {
      label: t('metaGeotagged'),
      value: photos ? photos?.filter(photo => typeof photo.latitude === 'number' && typeof photo.longitude === 'number' && photo.latitude > 0 && photo.longitude > 0).length || 0 : 0,
      icon: <MapPin size={14} />,
      visible: showLocation
    },
    {
      label: t('metaViewed'),
      value: photos ? photos?.map(photo => photo.views).reduce((a, b) => a + b, 0) || 0 : 0,
      icon: <Eye size={14} />
    },
    ...extraItems
  ]

  return (
    <Stack
      id={id}
      direction="row"
      divider={<Divider orientation="vertical" sx={{ borderStyle: 'dotted' }} flexItem />}
      spacing={1}
    >
      {items
        .filter(item => !filterEmpty || (item.value !== undefined && item.value > 0))
        .filter(item => item.visible === undefined || item.visible)
        .map(item => (<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }} key={item.label}>
          {item.icon}
          {item.value !== undefined
            ? <Tooltip title={item.label} arrow>
              <span>
                <SolidChip count={item.value} variant="text" fontSize={12} borderless minWidth={minWidth} />
              </span>
            </Tooltip>
            : <Skeleton variant="text" width={minWidth} height={20} />}
        </Box>)) }
    </Stack>
  )
}
