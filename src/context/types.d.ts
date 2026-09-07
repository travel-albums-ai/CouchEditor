export const PHOTO_LABELS = [
  'food',
  'drinks',
  'driving',
  'mountain',
  'beach',
  'hotel',
  'bar',
  'building',
] as const

export type PhotoLabel = (typeof PHOTO_LABELS)[number]
