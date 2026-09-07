import { useAISink } from '@/context/aiSinkStore';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { useEffect, useState } from 'react';

type Photo = {
  imageUrl: string
  id: string
}

type Props = {
  photos: GalleryPhoto[]
  tileSize: number
  columns: number
  gap?: number
}

const loadBitmap = async (src: string) => {
  const res = await fetch(src, { mode: 'cors' })
  if (!res.ok) throw new Error(`Failed to load image: ${res.status}`)
  return createImageBitmap(await res.blob())
}

const drawCover = (
  ctx: OffscreenCanvasRenderingContext2D,
  img: ImageBitmap,
  x: number,
  y: number,
  w: number,
  h: number,
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
    h,
  )
}

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

export default function AutoTileCanvas({
  photos,
  tileSize,
  columns,
  gap = 2,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { setSetting } = useAISink()

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    const build = async () => {
      if (!photos.length || tileSize <= 0 || columns <= 0) {
        setPreviewUrl(null)
        return
      }

      const rows = Math.ceil(photos.length / columns)
      const width = columns * tileSize + (columns - 1) * gap
      const height = rows * tileSize + (rows - 1) * gap

      const canvas = new OffscreenCanvas(width, height)
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not create 2D canvas context')

      const bitmaps: (ImageBitmap | null)[] = []
      const BATCH_SIZE = 6

      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        if (cancelled) return

        const batch = photos.slice(i, i + BATCH_SIZE)

        bitmaps.push(
          ...(await Promise.all(
            batch.map(async photo => {
              try {
                return await loadBitmap(composeUrl(photo))
              } catch {
                return null
              }
            }),
          )),
        )
      }

      bitmaps.forEach((bitmap, i) => {
        if (!bitmap) return

        const col = i % columns
        const row = Math.floor(i / columns)

        drawCover(
          ctx,
          bitmap,
          col * (tileSize + gap),
          row * (tileSize + gap),
          tileSize,
          tileSize,
        )

        bitmap.close()
      })

      if (cancelled) return

      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 })

      if (cancelled) return

      const dataUrl = await blobToDataUrl(blob)
      setSetting({ autoDescriptionPreview: dataUrl })

      objectUrl = URL.createObjectURL(blob)
      setPreviewUrl(objectUrl)
    }

    build().catch(error => {
      if (!cancelled) {
        console.error('Failed to build tile canvas:', error)
        setPreviewUrl(null)
      }
    })



    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [photos, tileSize, columns, gap, setSetting])

  if (!previewUrl) return null

  return (
    <img
      src={previewUrl}
      alt=""
      draggable={false}
      style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, overflow: 'hidden' }}
    />
  )
}
