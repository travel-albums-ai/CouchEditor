import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { ImageValue } from '@/types/types';
import { useTheme } from '@mui/material';
import React from 'react';

type Props = {
  photo: Pick<ImageValue, 'src' | 'name'> & Partial<Pick<ImageValue, 'width' | 'height' | 'byteSize'>>;
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
  const [dimensions, setDimensions] = React.useState({
    width: photo.width,
    height: photo.height,
  });
  const [byteSize, setByteSize] = React.useState(photo.byteSize);

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

  React.useEffect(() => {
    setDimensions({ width: photo.width, height: photo.height });
    setByteSize(photo.byteSize);
  }, [photo.width, photo.height, photo.byteSize, photo.src]);

  const formatMegabytes = (size?: number) =>
    size === undefined ? '-- MB' : `${(size / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div style={{ position: 'relative', width: style?.width ?? '100%', height: style?.height ?? height }}>
      <img
        src={photo.src}
        alt=""
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
          setDimensions({
            width: photo.width ?? event.currentTarget.naturalWidth,
            height: photo.height ?? event.currentTarget.naturalHeight,
          });
        }}
        onClick={handleClick}
        draggable={false}
        className={className}
        style={imgStyle}
      />
      <div
        style={{
          position: 'absolute',
          right: 6,
          bottom: 6,
          padding: '3px 6px',
          borderRadius: 4,
          background: 'rgba(0, 0, 0, 0.72)',
          color: '#fff',
          fontSize: 11,
          lineHeight: 1.2,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {dimensions.width ?? '--'} x {dimensions.height ?? '--'} px | {formatMegabytes(byteSize)}
      </div>
    </div>
  );
});
