import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useMapMarkerThumbnails } from '@/hooks/useTransform_Photos2Thumbnails';
import type { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Fix default marker icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const THUMB_SIZE = 44

const CENTER_PADDING_PX = 24

const createPhotoIcon = (photo: GalleryPhoto) => {
  const content = photo.title
    ? `<img src="${composeUrl(photo)}" style="width:${THUMB_SIZE}px;height:${THUMB_SIZE}px;object-fit:cover;border-radius:4px;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.5);" />`
    : `<div style="width:${THUMB_SIZE}px;height:${THUMB_SIZE}px;border-radius:4px;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.5);background:#888;"></div>`
  return L.divIcon({
    html: content,
    className: '',
    iconSize: [THUMB_SIZE, THUMB_SIZE],
    iconAnchor: [THUMB_SIZE / 2, THUMB_SIZE / 2],
    popupAnchor: [0, -(THUMB_SIZE / 2)],
  })
}

const getMaxSensibleZoomForCenter = (
  map: L.Map,
  positions: L.LatLngExpression[],
  center: L.LatLngExpression,
): number => {
  if (positions.length === 0) {
    return map.getZoom()
  }

  const size = map.getSize()
  const halfWidth = Math.max(size.x / 2 - CENTER_PADDING_PX, 1)
  const halfHeight = Math.max(size.y / 2 - CENTER_PADDING_PX, 1)
  const minZoom = map.getMinZoom()
  const maxZoom = map.getMaxZoom()
  const zoomStep = map.options.zoomSnap ?? 1

  for (let zoom = maxZoom; zoom >= minZoom; zoom -= zoomStep) {
    const centerPoint = map.project(L.latLng(center), zoom)
    const allPositionsFit = positions.every((position) => {
      const point = map.project(L.latLng(position), zoom)
      return (
        Math.abs(point.x - centerPoint.x) <= halfWidth &&
        Math.abs(point.y - centerPoint.y) <= halfHeight
      )
    })

    if (allPositionsFit) {
      return zoom
    }
  }

  return minZoom
}

type AlbumMapPanelProps = {
  photos: GalleryPhoto[]
  height?: number
}

type GeoTaggedPhoto = GalleryPhoto & { latitude: number; longitude: number }

type SyncViewportOptions = {
  animate?: boolean
  force?: boolean
}

export default function AlbumMapPanel({ photos, height = 320, interactive = true }: AlbumMapPanelProps & { interactive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const markerByPhotoIdRef = useRef<Map<string, L.Marker>>(new Map())
  const markerImageByPhotoIdRef = useRef<Map<string, string | null>>(new Map())
  const lastViewportSignatureRef = useRef('')
  const hasAnimatedInitialViewportRef = useRef(false)
  const [visiblePhotoIds, setVisiblePhotoIds] = useState<string[]>([])
  const focusedPhoto = useSettingsStoreSelector((state) => state.focusedPhoto)

  const photosWithGps = useMemo(
    () =>
      photos.filter(
        (p): p is GeoTaggedPhoto =>
          p.latitude != null && p.longitude != null && (p.latitude !== 0 || p.longitude !== 0),
      ),
    [photos],
  )

  const photoPositions = useMemo(
    () => photosWithGps.map((photo) => [photo.latitude, photo.longitude] as [number, number]),
    [photosWithGps],
  )

  const boundsKey = useMemo(
    () => photosWithGps.map((photo) => `${photo.id}:${photo.latitude}:${photo.longitude}`).join('|'),
    [photosWithGps],
  )

  const visiblePriorityImageUrls = useMemo(() => {
    if (visiblePhotoIds.length === 0) {
      return []
    }

    const visibleIdSet = new Set(visiblePhotoIds)
    return Array.from(
      new Set(
        photosWithGps
          .filter((photo) => visibleIdSet.has(photo.id))
          .map((photo) => photo.imageUrl)
          .filter((url): url is string => url !== null),
      ),
    )
  }, [photosWithGps, visiblePhotoIds])

  const thumbnailByImageUrl = useMapMarkerThumbnails(photosWithGps, {
    priorityImageUrls: visiblePriorityImageUrls,
  })

  const averageCenter = useMemo(() => {
    if (photosWithGps.length === 0) return null

    const totals = photosWithGps.reduce(
      (acc, photo) => {
        acc.latitude += photo.latitude
        acc.longitude += photo.longitude
        return acc
      },
      { latitude: 0, longitude: 0 },
    )

    return {
      latitude: totals.latitude / photosWithGps.length,
      longitude: totals.longitude / photosWithGps.length,
    }
  }, [photosWithGps])

  const syncMapViewport = useCallback(
    ({ animate = false, force = false }: SyncViewportOptions = {}): boolean => {
      const map = mapRef.current
      if (!map || photoPositions.length === 0) {
        return false
      }

      map.invalidateSize({ pan: false })

      const size = map.getSize()
      if (size.x <= 0 || size.y <= 0) {
        return false
      }

      const signature = `${boundsKey}:${size.x}x${size.y}`
      if (!force && lastViewportSignatureRef.current === signature) {
        return false
      }

      if (averageCenter) {
        const center: L.LatLngExpression = [averageCenter.latitude, averageCenter.longitude]
        const zoom = getMaxSensibleZoomForCenter(map, photoPositions, center)
        map.setView(center, zoom - 2, { animate, duration: animate ? 0.35 : undefined })
      } else {
        map.fitBounds(L.latLngBounds(photoPositions), {
          animate,
          padding: [CENTER_PADDING_PX, CENTER_PADDING_PX],
        })
      }

      lastViewportSignatureRef.current = signature
      return true
    },
    [averageCenter, boundsKey, photoPositions],
  )

  useEffect(() => {
    if (!containerRef.current) return

    const markerMap = markerByPhotoIdRef.current
    const markerImageMap = markerImageByPhotoIdRef.current

    const map = L.map(containerRef.current, {
      preferCanvas: true,
      zoomControl: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      touchZoom: interactive,
      boxZoom: interactive,
      dragging: interactive,
      zoomSnap: 0.25,
      maxZoom: 19,
      minZoom: 2,
      keyboard: false,
    }).setView([20, 0], 2)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    markersLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      markerMap.clear()
      markerImageMap.clear()
      markersLayerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const observer = new ResizeObserver(() => {
      syncMapViewport({ animate: false })
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [syncMapViewport])

  useEffect(() => {
    const map = mapRef.current
    if (!map) {
      return
    }

    const updateVisiblePhotoIds = () => {
      const bounds = map.getBounds()
      const nextVisibleIds = photosWithGps
        .filter((photo) => bounds.contains([photo.latitude, photo.longitude]))
        .map((photo) => photo.id)

      setVisiblePhotoIds((previousIds) => {
        if (
          previousIds.length === nextVisibleIds.length &&
          previousIds.every((id, index) => id === nextVisibleIds[index])
        ) {
          return previousIds
        }

        return nextVisibleIds
      })
    }

    updateVisiblePhotoIds()
    map.on('moveend zoomend resize', updateVisiblePhotoIds)

    return () => {
      map.off('moveend zoomend resize', updateVisiblePhotoIds)
    }
  }, [photosWithGps])

  useEffect(() => {
    const map = mapRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    markersLayer.clearLayers()
    markerByPhotoIdRef.current.clear()
    markerImageByPhotoIdRef.current.clear()

    const markers: L.Marker[] = []
    for (const photo of photosWithGps) {
      const markerImageUrl = null

      const marker = L.marker([photo.latitude, photo.longitude], {
        icon: createPhotoIcon(photo),
      })
        .addTo(markersLayer)
        .bindPopup(`<strong>${photo.title}</strong><br/>${photo.takenAt || ''}`)

      markerByPhotoIdRef.current.set(photo.id, marker)
      markerImageByPhotoIdRef.current.set(photo.id, markerImageUrl)
      markers.push(marker)
    }

    if (markers.length > 0) {
      const didSyncViewport = syncMapViewport({
        animate: !hasAnimatedInitialViewportRef.current,
      })

      if (didSyncViewport) {
        hasAnimatedInitialViewportRef.current = true
      }
    } else if (markers.length === 0) {
      lastViewportSignatureRef.current = ''
      hasAnimatedInitialViewportRef.current = false
    }
  }, [photosWithGps, syncMapViewport])

  useEffect(() => {
    for (const photo of photosWithGps) {
      if (!photo.imageUrl) {
        continue
      }

      const thumbnail = thumbnailByImageUrl[photo.imageUrl]
      if (!thumbnail) {
        continue
      }

      const marker = markerByPhotoIdRef.current.get(photo.id)
      if (!marker) {
        continue
      }

      const currentImage = markerImageByPhotoIdRef.current.get(photo.id) || null
      if (currentImage === thumbnail) {
        continue
      }

      marker.setIcon(createPhotoIcon(photo))
      markerImageByPhotoIdRef.current.set(photo.id, thumbnail)
    }
  }, [photosWithGps, thumbnailByImageUrl])

  useEffect(() => {
    if (!focusedPhoto) return

    const leafletMap = mapRef.current
    if (!leafletMap) return

    const photo = photosWithGps.find((p) => p.id === focusedPhoto)
    if (!photo) return

    const targetZoom = Math.max(leafletMap.getZoom(), 19)
    leafletMap.flyTo([photo.latitude, photo.longitude], targetZoom - 2, {
      animate: false,
      // duration: 1.8,
    })
  }, [focusedPhoto, photosWithGps])

  return (
    <Box ref={containerRef} sx={{ width: '100%', height, overflow: 'hidden', borderRadius: 2 }} />
  )
}
