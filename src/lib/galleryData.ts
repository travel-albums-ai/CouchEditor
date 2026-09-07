export type PeopleMetadata = {
  name: string
}

export type GalleryPhoto = {
  id: string
  albumName: string
  title: string
  batch: string
  likes: number
  people: PeopleMetadata[],
  imageUrl: string | null
  description: string
  rootIndex: string
  folder: string;
  views: number,
  social: { text: string, liked: boolean }[],
  takenAt: string
  width: number
  height: number
  takenAtTs: number
  latitude?: number
  longitude?: number
  sourceUrl: string
  tiny: string | null
}
