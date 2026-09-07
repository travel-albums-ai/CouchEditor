import { SectionType } from '@/hooks/sections/sectionTypes';
import { Bookmark, Building, Eye, EyeClosed, Folder, FolderClock, Heart, Map, MessageSquareText, SquareLibrary, Star, Tag, Timeline, Trash, Users } from 'lucide-react';

export const routeIcons: Record<string, React.ReactElement> = {
  '/allPhotos': <SquareLibrary size={16} />,
  '/selectedPhotos/:type_name/:id': <SquareLibrary size={16} />,
  '/selectedType/:type_name': <SquareLibrary size={16} />,
}

export const sectionIcons: Record<string, React.ReactElement> = {
  [SectionType.PeopleAndPets]: <Users size={16} />,
  [SectionType.Cities]: <Building size={ 16} />,
  [SectionType.NowAndThen]: <FolderClock size={16} />,
  [SectionType.Folders]: <Folder size={16} />,
  [SectionType.Views]: <Eye size={16} />,
  [SectionType.Timeline]: <Timeline size={16} />,
  [SectionType.Likes]: <Heart size={16} />,
  [SectionType.Comments]: <MessageSquareText size={16} />,
  [SectionType.Favorites]: <Star size={16} />,
  [SectionType.Countries]: <Map size={16} />,
  [SectionType.Ignored]: <Trash size={16} />,
  [SectionType.Private]: <EyeClosed size={16} />,
  [SectionType.Selected]: <SquareLibrary size={16} />,
  [SectionType.Tags]: <Tag size={16} />,
  [SectionType.Labels]: <Bookmark size={16} />
}
