import GenericPanel from '@/components/generics/GenericPanel';
import NoPhotos from '@/components/NoPhotos';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import GroupingPreviewItemNg from '@/pages/components/GroupingPreviewItemNg';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function SelectedPage_type() {
  const { type_name = '' } = useParams()
  const sidebarTerm = useSettingsStoreSelector((state) => state.sidebarTerm)
  const sections = useSections_GLOBAL()
  const { width } = useAlbumPhotoCardStoreSelector((state) => state)

  const foundSection = sections?.find((s) => s.type === type_name)

  return (
    <>
      <GenericPanel id="selected-page-drawer">
        {foundSection?.data.length > 0 && <Box sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${width * 1.5}px, 1fr))`,
          gap: 2
        }}>
          {foundSection?.data?.filter(item => sidebarTerm === '' ? true : item.name.toLowerCase().includes(sidebarTerm.toLowerCase()))
            .map((item: any, index: number) => (
              <GroupingPreviewItemNg
                index={index}
                key={item.name + item.description}
                type={type_name} details={item.details}
                photos={item.photos} title={item.name} description={item.description} count={item.photos.length} />
            ))}


        </Box>}
        {(foundSection === undefined || foundSection?.data?.length === 0) && <NoPhotos />}
      </GenericPanel>
    </>
  )
}
