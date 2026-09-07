import { useMemo } from 'react';

export interface Viewport {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom: number;
}

function isInsideViewport(
  lat: number,
  lng: number,
  viewport: Viewport
) {
  const withinLat =
    lat >= viewport.south &&
    lat <= viewport.north;

  const withinLng =
    viewport.west <= viewport.east
      ? lng >= viewport.west && lng <= viewport.east
      : lng >= viewport.west || lng <= viewport.east;

  return withinLat && withinLng;
}

function zoomToCellSize(zoom: number, multiplier: number) {
  return zoom < 5 ? Math.max(0.001, 180 / Math.pow(2.65 * multiplier, zoom)) : Math.max(0.001, 180 / Math.pow(2 * multiplier, zoom));
}

export default function useRelevantAlbumsByProximity(
  photos?: any[],
  viewport?: Viewport,
  multiplier = 1
) {
  return useMemo(() => {
    if (!photos?.length || !viewport) {
      return [];
    }

    let count = 0;

    if (viewport.zoom > 15) {
      const albumMap = new Map<string, any[]>();

      for (const photo of photos) {
        const lat = photo.latitude;
        const lng = photo.longitude;

        if (lat == null || lng == null) continue;

        if (!isInsideViewport(lat, lng, viewport)) {
          continue;
        }

        count++;

        if (count > 1000) {
          break;
        }

        const albumName = photo.albumName;

        let album = albumMap.get(albumName);

        if (!album) {
          album = [];
          albumMap.set(albumName, album);
        }

        album.push(photo);
      }

      return Array.from(albumMap.entries()).map(
        ([batchName, photos]) => ({
          batchName,
          photos,
        })
      );
    }

    const cellSize = zoomToCellSize(viewport.zoom, multiplier);

    const clusters = new Map<string, any[]>();

    for (const photo of photos) {
      const lat = photo.latitude;
      const lng = photo.longitude;

      if (lat == null || lng == null) continue;

      if (!isInsideViewport(lat, lng, viewport)) {
        continue;
      }

      const key =
        `${Math.floor(lat / cellSize)}|${Math.floor(lng / cellSize)}`;

      let cluster = clusters.get(key);

      if (!cluster) {
        cluster = [];
        clusters.set(key, cluster);
      }

      cluster.push(photo);
    }

    const albumMap = new Map<string, any[]>();

    for (const cluster of clusters.values()) {
      const representative = cluster[0];

      const albumName = representative.albumName;

      let album = albumMap.get(albumName);

      if (!album) {
        album = [];
        albumMap.set(albumName, album);
      }

      album.push(representative);
    }

    return Array.from(albumMap.entries()).map(
      ([batchName, photos]) => ({
        batchName,
        photos,
      })
    );
  }, [photos, viewport]);
}
