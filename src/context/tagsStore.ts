import { createLocalStorageStoreNg } from '@/lib/createLocalStorageStoreNg';

type TagStore = {
  tags: {
    id: string
    name: string
    color: string
  }[],
  taggedPhotos: {
    id: string
    tags: string[]
  }[]
}

const defaults: TagStore = {
  tags: [
    {
      id: '1',
      name: 'Family',
      color: '#ff0000',
    }
  ],
  taggedPhotos: []
}

const {
  Provider: TagsProvider,
  useSetStore,
  useStoreSelector: useTagsStoreSelector
} = createLocalStorageStoreNg<TagStore>(defaults, 'tagsStore')

export const useTagsStore = () => {
  const setSetting = useSetStore()

  return {
    createTag: (name: string, color: string) => {
      const newTag = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        color,
      }
      setSetting((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
    },
    deleteTag: (id: string) => {
      setSetting((prev) => ({
        ...prev,
        tags: prev.tags.filter(tag => tag.id !== id),
        taggedPhotos: prev.taggedPhotos.map(tp => ({
          ...tp,
          tags: tp.tags.filter(tagId => tagId !== id)
        }))
      }))
    },
    addTagToPhotos: (tagId: string, photoIds: string[]) => {
      setSetting((prev) => ({
        ...prev,
        taggedPhotos: [
          ...prev.taggedPhotos.filter(tp => !photoIds.includes(tp.id)),
          ...photoIds.map(id => ({
            id,
            tags: [...(prev.taggedPhotos.find(tp => tp.id === id)?.tags || []).filter(tp => tp !== tagId), tagId]
          }))
        ]
      }))
    },
    removeTagFromPhotos: (tagId: string, photoIds: string[]) => {
      setSetting((prev) => ({
        ...prev,
        taggedPhotos: prev.taggedPhotos.map(tp => photoIds.includes(tp.id) ? ({
          ...tp,
          tags: tp.tags.filter(tid => tid !== tagId)
        }) : tp)
      }))
    },
    updateTagName: (id: string, name: string) => {
      setSetting((prev) => ({
        ...prev,
        tags: prev.tags.map(tag => tag.id === id ? { ...tag, name } : tag)
      }))
    },
    removeAllTagsFromPhotos: (photoIds: string[]) => {
      setSetting((prev) => ({
        ...prev,
        taggedPhotos: prev.taggedPhotos.map(tp => photoIds.includes(tp.id) ? ({
          ...tp,
          tags: []
        }) : tp).filter(tp => tp.tags.length > 0)
      }))
    }
  }
}

export { TagsProvider, useTagsStoreSelector };
