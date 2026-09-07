import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { SectionType } from '@/hooks/sections/sectionTypes';
import { Section } from '@/hooks/sections/useTransform_AllSections';
import SidebarCoreButton from '@/middleware/interface/sidebar/SidebarCoreButton';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SidebarSectionItem({ section, item, type, icon, isInside = true }: {  section: Section, item: any, type: string, icon: React.ReactNode, isInside?: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarCoreButton
      sx={{ pr: isInside ? 4.25 : 1, py: isInside ? 2 : 1 }}
      onClick={() => navigate('/selectedPhotos/' + type + '/' + encodeURIComponent(item.name))}
      typographySx={{ opacity: 0.75 }}
      title={item.name}
      beforeSlot={section.preview === true ? <>
        {section.type === SectionType.PeopleAndPets && <Box sx={{ width: 16, height: 16, flex: '0 0 16px', borderRadius: 10, overflow: 'hidden' }}>
          {/* <AlbumPhotoThumbnailBackground imageUrl={item.photos[0].id} tiny={item.photos[0].tiny} /> */}
          <AlbumPhotoThumbnailBackgroundNg photo={item.photos[0]} />
        </Box>}
        {section.type === SectionType.Tags && <Box sx={{ width: 16, height: 16, flex: '0 0 16px', borderRadius: 10, overflow: 'hidden', backgroundColor: item.color }} />}
        {(section.type === SectionType.Countries || section.type === 'places' || section.type === SectionType.Cities) && <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />}
      </> : undefined}
      icon={section.preview !== true ? icon : undefined}
      isActive={decodeURIComponent(location.pathname) === `/selectedPhotos/${type}/${item.name}`}
      count={item.photos?.length}
    />
  );
}
