import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';

type ViewerProps = {
  photo: any;
};

export default function LightboxViewer({ photo }: ViewerProps) {
  if (!photo) return null;

  return (
    <AlbumPhotoThumbnailBackgroundNg
      photo={photo}
      original={true}
      style={{
        width: 'fit-content',
        zIndex: 1,
        height: '100%',
        overflow: 'hidden',
        borderRadius: 16,
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
      }}
    />
  );
}
