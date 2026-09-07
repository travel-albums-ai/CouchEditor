import exifr from 'exifr';
import { useEffect, useState } from 'react';

export default function useTransform_Photo2Exif(imageUrl?: string | null) {
  const [exif, setExif] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!imageUrl) {
      setExif(null)
      return
    }

    let cancelled = false

    async function loadExif() {
      try {
        setLoading(true)
        setError(null)

        const result = await exifr.parse(imageUrl, {
          tiff: true,
          exif: true,
          gps: true,
          xmp: false,
          icc: false,
          iptc: false,
        })

        if (cancelled) return

        setExif(result)
      } catch (err: any) {
        if (cancelled) return

        setError(err?.message ?? 'Failed reading EXIF')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadExif()

    return () => {
      cancelled = true
    }
  }, [imageUrl])

  return { exif, loading, error }
}
