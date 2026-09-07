import { Box, Typography } from '@mui/material';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import SolidChip from '@/components/SolidChip';
import { ChevronsDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import AlbumPhotoCollageCanvas from '../../components/AlbumPhotoCollageCanvas';
import AlbumMapPanel from './AlbumMapPanel';

type Props = {
  index: number
  photos: any[]
  title?: string
  count?: number
  description?: string
  showMap?: boolean
  children?: React.ReactNode
  type?: string,
  details?: string[]
}

export default function GroupingPreviewItemNg({
  index,
  photos,
  title,
  count,
  description,
  showMap = false,
  children,
  type,
  details
}: Props) {
  const [mapOpen, setMapOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { inView, ref } = useInView()

  const toggleMap = useCallback(() => {
    setMapOpen(v => !v)
  }, [])

  const samples = useMemo(() => {
    const out: any[] = []

    for (let i = 0; i < photos.length && out.length < 100; i++) {
      const p = photos[i]
      if (p.latitude && p.longitude) out.push(p)
    }

    return out
  }, [photos])

  return (
    <>
      <Box
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          overflow: 'hidden',
          minHeight: 180,
          cursor: 'pointer',
          width: '100%',
          p: 1,
          borderRadius: 2,
          bgcolor: 'background.default',
          // border: '1px solid',
          boxShadow: 2,
          // borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <Box
          component={Link}
          to={`/selectedPhotos/${type}/${encodeURIComponent(title || "")}`}
          sx={{
            aspectRatio: '2 / 1',
            overflow: 'hidden',
            opacity: hovered ? 1 : 0.95,
            filter: hovered ? 'saturate(1.1)' : 'grayscale(20%)',
            transition: 'opacity .2s, filter .2s',
          }}
        >
          {inView && <AlbumPhotoCollageCanvas photos={photos} />}

        </Box>
        {inView && <Box
          sx={{

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pt: 1,
            px: 1.5,
            pb: 0.75
          }}
        >
          <Box sx={{ flex: '1 1 auto', width: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            <Typography
              title={title}
              variant="subtitle2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="caption"
              color="textDisabled"
              title={details?.join(' • ')}
              sx={{ opacity: 0.8 }}
            >
              {details && details.map((d, index) => (
                <Fragment key={d}>
                  {d.length > 150 ? `${d.substring(0, 150)}...` : d} {index < details.length - 1 && ' • '}
                </Fragment>
              ))}
            </Typography>
          </Box>

          {showMap && (
            <ChevronsDown onClick={toggleMap} size={16} style={{ cursor: 'pointer', opacity: 0.7 }} />
          )}

          {count !== undefined && (
            <SolidChip count={count} height={32} fontSize={14} minWidth={60} />
          )}
        </Box>}

        {inView && showMap && mapOpen && (
          <Box sx={{ width: '100%', height: 300, mt: 1 }}>
            <AlbumMapPanel
              height={300}
              interactive={false}
              photos={samples}
            />
          </Box>
        )}

        {children}
      </Box>
    </>
  )
}
