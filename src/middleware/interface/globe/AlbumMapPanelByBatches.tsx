import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import L from 'leaflet';
import { useEffect, useMemo, useRef } from 'react';

const THUMB_SIZE = 44
const FIT_PADDING_PX = 36

type Props = {
  allPhotos: any[]
  onPreview?: (photoId: string) => void,
  batches: any
}

const createIcon = (
  img: string | null,
  color: string,
  selected = false,
  width: number,
  height: number,
) => {
  const sizeWidth = selected ? width / 2 : width / 4
  const sizeHeight = selected ? height / 2 : height / 4
  const border = selected ? 4 : 0.5
  const shadow = selected ? '0 0 2px 3px #90caf944' : 'none'

  return L.divIcon({
    html: img
      ? `<img
          src="${img}"
          style="
            width:${sizeWidth}px;
            height:${sizeHeight}px;
            object-fit:cover;
            border-radius:6px;
            opacity: ${selected ? 1 : 0.9};
            border:${border}px solid ${color};
            box-shadow:${shadow};
            z-index: ${selected ? 1000 : 1};
          "
        />`
      : `<div
          style="
            width:${sizeWidth}px;
            height:${sizeHeight}px;
            z-index: ${selected ? 1000 : 1};
          "
        />`,
    className: '',
    iconSize: [sizeWidth, sizeHeight],
    iconAnchor: [sizeWidth / 2, sizeHeight / 2],
  })
}

const iconCache = new Map<string, L.DivIcon>()

function getIcon(
  img: string | null,
  color: string,
  selected = false,
  width: number,
  height: number,
) {
  const key = `${img}|${color}|${selected}`

  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      createIcon(img, color, selected, width, height)
    )
  }

  return iconCache.get(key)!
}

export default function AlbumMapPanelByBatches({ allPhotos, batches, onPreview, viewport, setViewport }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map>()
  const previewPhotoId = useSettingsStoreSelector((state) => state.previewPhotoObj?.id)
  const lastAutoFitKeyRef = useRef('')
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);

  const geotaggedPhotos = useMemo(() => {
    return allPhotos.filter(
      (photo) =>
        photo.latitude != null &&
        photo.longitude != null &&
        (photo.latitude !== 0 || photo.longitude !== 0)
    )
  }, [allPhotos])

  const geotaggedPhotosKey = useMemo(() => {
    return geotaggedPhotos
      .map((photo) => `${photo.id}:${photo.latitude}:${photo.longitude}`)
      .join('|')
  }, [geotaggedPhotos])

  const photos = useMemo(() => {
    return batches.flatMap(batch =>
      batch.photos
        .filter(p => p.latitude && p.longitude && !(p.latitude === 0 && p.longitude === 0))
        .map(p => {
          return {
            ...p,
            batchName: batch.batchName,
            color: previewPhotoId === p.id ? 'navy' : 'gray',
          }
        })
    )
  }, [batches, previewPhotoId])

  // init map
  useEffect(() => {
    if (!ref.current) return

    const map = L.map(ref.current).setView([20, 0], 2)
    mapRef.current = map

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo(map)

    const updateBounds = () => {
      const b = map.getBounds()

      setViewport({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
        zoom: map.getZoom(),
      })
    }

    updateBounds()

    map.on('moveend zoomend', updateBounds)

    return () => {
      map.off('moveend zoomend', updateBounds)
      map.remove()
    }
  }, [])

  const layerRef = useRef<L.LayerGroup | null>(null)
  const markersRef = useRef(new Map<string, L.Marker>())

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    map.setMaxZoom(18)
    map.setMinZoom(3)

    if (!layerRef.current) {
      layerRef.current = L.layerGroup().addTo(map)
    }

    const layer = layerRef.current

    const visibleIds = new Set<string>()

    for (const p of photos) {
      visibleIds.add(p.id)

      let marker = markersRef.current.get(p.id)

      const selected = previewPhotoId === p.id

      const icon = getIcon(
        composeUrl(p),
        selected ? '#90caf9' : 'gray',
        selected,
        width,
        height
      )

      if (!marker) {
        marker = L.marker(
          [p.latitude!, p.longitude!],
          { icon }
        )

        marker.on('click', () => onPreview?.(p))

        markersRef.current.set(p.id, marker)
      } else {
        marker.setIcon(icon)
      }

      if (!layer.hasLayer(marker)) {
        layer.addLayer(marker)
      }
    }

    markersRef.current.forEach((marker, id) => {
      if (!visibleIds.has(id)) {
        layer.removeLayer(marker)
      }
    })
  }, [photos, onPreview, previewPhotoId, width, height])

  useEffect(() => {
    const map = mapRef.current
    if (!map || geotaggedPhotos.length === 0) return

    if (lastAutoFitKeyRef.current === geotaggedPhotosKey) {
      return
    }

    const positions: [number, number][] = geotaggedPhotos.map((photo) => [photo.latitude, photo.longitude])

    map.fitBounds(L.latLngBounds(positions), {
      animate: false,
      padding: [FIT_PADDING_PX, FIT_PADDING_PX],
      maxZoom: 14,
    })

    lastAutoFitKeyRef.current = geotaggedPhotosKey
  }, [geotaggedPhotos, geotaggedPhotosKey])

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <Box
        ref={ref}
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'background.paper',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1000,
          bgcolor: 'background.default',
          color: 'text.primary',
          boxShadow: 4,
          p: 1,
          borderRadius: 2,
          fontSize: 12,
          fontFamily: 'monospace',
        }}
      >
        <div>Zoom: {viewport.zoom}</div>
        <div>Top: {viewport.north.toFixed(4)}</div>
        <div>Bottom: {viewport.south.toFixed(4)}</div>
        <div>Left: {viewport.west.toFixed(4)}</div>
        <div>Right: {viewport.east.toFixed(4)}</div>
      </Box>
    </Box>
  )
}
