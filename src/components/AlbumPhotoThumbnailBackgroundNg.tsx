import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { ImageValue } from '@/middleware/windows/pipeline/types';
import { useTheme } from '@mui/material';
import React from 'react';

type Props = {
  photo: ImageValue;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
};

export default function AlbumPhotoThumbnailBackgroundNg({
  photo,
  width,
  height,
  style,
  className,
}: Props) {
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj);
  const { setPreviewPhotoObj } = useSettings();
  const theme = useTheme()

  const src = photo.src;

  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onClick={() => {
        setPreviewPhotoObj(photo?.name);
      }}
      draggable={false}
      className={className}
      style={{
        width: '100%',
        height,
        display: 'block',
        objectFit: thumbnailFormat === 'cover' ? 'cover' : 'contain',
        objectPosition: 'center',
        border: previewPhotoObj === photo?.name ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        ...style,
      }}
    />
  );
}
