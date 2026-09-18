import { IconButton, Tooltip } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';

export type PictureInPicturePhoto = {
  name: string;
  src: string;
  width: number;
  height: number;
};

type PictureInPictureButtonProps = {
  photo?: PictureInPicturePhoto;
};

export default function PictureInPictureButton({ photo }: PictureInPictureButtonProps) {
  const imageWindowRef = useRef<Window | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const openingRef = useRef(false);
  const windowName = `couch-editor-image-${useId().replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    image.src = photo?.src ?? '';
    image.alt = photo?.name ?? '';

    if (photo && imageWindowRef.current) {
      imageWindowRef.current.document.title = photo.name;
    }
  }, [photo?.name, photo?.src]);

  useEffect(() => () => {
    imageWindowRef.current?.close();
    imageWindowRef.current = null;
    imageRef.current = null;
  }, []);

  const openImageWindow = () => {
    if (!photo || openingRef.current || (imageWindowRef.current && !imageWindowRef.current.closed)) {
      imageWindowRef.current?.focus();
      return;
    }

    openingRef.current = true;

    try {
      const imageWindow = window.open(
        '',
        windowName,
        `popup=yes,width=${Math.min(photo.width, 600)},height=${Math.min(photo.height, 600)},resizable=yes,scrollbars=no`
      );

      if (!imageWindow) {
        console.error('Failed to open image window. The browser may have blocked the popup.');
        return;
      }

      const image = imageWindow.document.createElement('img');

      imageWindow.document.title = photo.name;
      imageWindow.document.body.style.margin = '0';
      imageWindow.document.body.style.background = '#000';
      imageWindow.document.body.style.display = 'grid';
      imageWindow.document.body.style.placeItems = 'center';
      image.src = photo.src;
      image.alt = photo.name;
      image.style.display = 'block';
      image.style.maxWidth = '100vw';
      image.style.maxHeight = '100vh';
      image.style.objectFit = 'contain';
      imageWindow.document.body.append(image);

      imageWindowRef.current = imageWindow;
      imageRef.current = image;
      imageWindow.addEventListener('pagehide', () => {
        imageWindowRef.current = null;
        imageRef.current = null;
      }, { once: true });
    } catch (error) {
      console.error('Failed to open image window:', error);
    } finally {
      openingRef.current = false;
    }
  };

  return (
    <Tooltip title="Open image in a separate window">
      <span>
        <IconButton
          aria-label="Open image in a separate window"
          size="small"
          disabled={!photo}
          onClick={openImageWindow}
        >
          <ExternalLink size={18} />
        </IconButton>
      </span>
    </Tooltip>
  );
}
