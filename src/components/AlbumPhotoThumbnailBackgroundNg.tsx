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

export default React.memo(function AlbumPhotoThumbnailBackgroundNg({
  photo,
  width,
  height,
  style,
  className,
}: Props) {
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);
  const isSelected = useSettingsStoreSelector(
    s => s.previewPhotoObj === photo?.name
  );
  const { setPreviewPhotoObj } = useSettings();
  const theme = useTheme();

  const handleClick = React.useCallback(() => {
    setPreviewPhotoObj(photo?.name);
  }, [setPreviewPhotoObj, photo?.name]);

  const imgStyle = React.useMemo<React.CSSProperties>(() => ({
    width: '100%',
    height,
    display: 'block',
    objectFit: thumbnailFormat === 'cover' ? 'cover' : 'contain',
    objectPosition: 'center',
    border: isSelected
      ? `2px solid ${theme.palette.primary.main}`
      : '2px solid transparent',
    ...style,
  }), [height, thumbnailFormat, isSelected, theme.palette.primary.main, style]);

  return (
    <img
      src={photo.src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onClick={handleClick}
      draggable={false}
      className={className}
      style={imgStyle}
    />
  );
});
