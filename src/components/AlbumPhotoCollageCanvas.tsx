import { composeUrl } from '@/lib/thumbnailService';
import localforage from 'localforage';
import { useEffect, useState } from 'react';

type Props = {
  photos: { imageUrl: string; id: string }[]
  size?: number
}

type Tile = { x: number; y: number; w: number; h: number }

const GRID = 4
const GAP = 16
const RADIUS = 10


const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}


const PATTERNS: Record<number, Tile[]> = {
  1: [{ x: 0, y: 0, w: 4, h: 4 }],

  2: [
    { x: 0, y: 0, w: 2, h: 4 },
    { x: 2, y: 0, w: 2, h: 4 },
  ],

  3: [
    { x: 0, y: 0, w: 2, h: 4 },
    { x: 2, y: 0, w: 2, h: 2 },
    { x: 2, y: 2, w: 2, h: 2 },
  ],

  4: [
    { x: 0, y: 0, w: 2, h: 2 },
    { x: 2, y: 0, w: 2, h: 2 },
    { x: 0, y: 2, w: 2, h: 2 },
    { x: 2, y: 2, w: 2, h: 2 },
  ],

  5: [
    { x: 0, y: 0, w: 2, h: 2 },
    { x: 2, y: 0, w: 2, h: 2 },
    { x: 0, y: 2, w: 1, h: 2 },
    { x: 1, y: 2, w: 1, h: 2 },
    { x: 2, y: 2, w: 2, h: 2 },
  ],

  6: [
    { x: 0, y: 0, w: 2, h: 2 },
    { x: 2, y: 0, w: 2, h: 2 },
    { x: 0, y: 2, w: 2, h: 1 },
    { x: 0, y: 3, w: 2, h: 1 },
    { x: 2, y: 2, w: 1, h: 2 },
    { x: 3, y: 2, w: 1, h: 2 },
  ],

  7: [
    { x: 0, y: 0, w: 2, h: 2 },
    { x: 2, y: 0, w: 1, h: 2 },
    { x: 3, y: 0, w: 1, h: 2 },
    { x: 0, y: 2, w: 2, h: 1 },
    { x: 0, y: 3, w: 2, h: 1 },
    { x: 2, y: 2, w: 1, h: 2 },
    { x: 3, y: 2, w: 1, h: 2 },
  ],

  8: Array.from({ length: 8 }, (_, i) => ({
    x: i % 4,
    y: Math.floor(i / 4) * 2,
    w: 1,
    h: 2,
  })),

  9: [
    { x: 0, y: 0, w: 2, h: 2 },
    ...Array.from({ length: 7 }, (_, i) => ({
      x: 2 + (i % 2),
      y: Math.floor(i / 2),
      w: 1,
      h: 1,
    })),
    { x: 0, y: 2, w: 2, h: 2 },
  ],

  10: Array.from({ length: 10 }, (_, i) => ({
    x: i % 5,
    y: Math.floor(i / 5),
    w: 1,
    h: 1,
  })),

  11: [
    { x: 0, y: 0, w: 2, h: 2 },
    ...Array.from({ length: 7 }, (_, i) => ({
      x: 2 + (i % 2),
      y: Math.floor(i / 2),
      w: 1,
      h: 1,
    })),
    { x: 0, y: 2, w: 1, h: 1 },
    { x: 1, y: 2, w: 1, h: 1 },
    { x: 0, y: 3, w: 2, h: 1 },
  ],
}
// ... (roundedRect, drawCover, PATTERNS unchanged)

const collageCache = localforage.createInstance({ name: 'album-collage-cache' })

const buildCacheKey = (photos: { imageUrl: string }[], size: number) =>
  `collage:${size}:${photos.slice(0, 11).map(p => p.imageUrl).join('|')}`

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

const drawCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const scale = Math.max(w / img.width, h / img.height)

  const sw = w / scale
  const sh = h / scale

  ctx.drawImage(
    img,
    (img.width - sw) / 2,
    (img.height - sh) / 2,
    sw,
    sh,
    x,
    y,
    w,
    h
  )
}

export default function AlbumPhotoCollageCanvas({ photos, size = 600 }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  // No canvasRef needed — we create the canvas off-screen and discard it

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    const run = async () => {
      if (!photos.length) return

      const count = Math.min(11, photos.length)
      const layout = PATTERNS[count]
      const cacheKey = buildCacheKey(photos, size)

      // Check cache first
      const cached = await collageCache.getItem<Blob>(cacheKey)
      if (cached) {
        if (!cancelled) {
          objectUrl = URL.createObjectURL(cached)
          setUrl(objectUrl)
        }
        return
      }

      // Load images sequentially in small batches to avoid RAM spike
      const photoSlice = photos.slice(0, count)
      const imgs: (HTMLImageElement | null)[] = []

      for (let i = 0; i < photoSlice.length; i += 3) {
        if (cancelled) return
        const batch = await Promise.all(
          photoSlice.slice(i, i + 3).map(p =>
            loadImage(composeUrl(p)).catch(() => null)
          )
        )
        imgs.push(...batch)
      }

      if (cancelled) return

      // Create a throw-away off-screen canvas (never attached to DOM)
      const canvas = new OffscreenCanvas(size, size / 2)
      const ctx = canvas.getContext('2d')!

      const unit = size / GRID

      layout.forEach((tile, i) => {
        const img = imgs[i]
        if (!img) return

        const x = tile.x * unit + GAP / 2
        const y = tile.y * unit + GAP / 2
        const w = tile.w * unit - GAP
        const h = tile.h * unit - GAP

        ctx.save()
        roundedRect(ctx, x, y, w, h, Math.min(RADIUS, w / 2, h / 2))
        ctx.clip()
        drawCover(ctx, img, x, y, w, h)
        ctx.restore()
      })

      if (cancelled) return

      // toBlob is much cheaper than toDataURL — no base64 encoding overhead
      const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.85 })

      if (cancelled) return

      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)

      // Cache the Blob directly — no base64 bloat in storage
      await collageCache.setItem(cacheKey, blob)
    }

    run()

    return () => {
      cancelled = true
      // Revoke the object URL to free the Blob from memory
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [photos, size])

  if (!url) return null

  return (
    <img
      src={url}
      alt=""
      draggable={false}
      style={{ height: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block' }}
    />
  )
}
