import { Box, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface HistogramProps {
  imageUrl?: string;
  imageBase64?: string;
  width?: number;
  height?: number;
}

type Channel = 'r' | 'g' | 'b';

interface HistogramData {
  r: Uint32Array;
  g: Uint32Array;
  b: Uint32Array;
  max: number;
  totalPixels: number;
}

interface HoverInfo {
  channel: Channel;
  level: number;
  pixels: number;
  percentage: number;
  r: number;
  g: number;
  b: number;
}

const CHANNELS: {
  id: Channel;
  label: string;
  color: string;
}[] = [
  {
    id: 'r',
    label: 'Red',
    color: '#ff3030',
  },
  {
    id: 'g',
    label: 'Green',
    color: '#30ff70',
  },
  {
    id: 'b',
    label: 'Blue',
    color: '#30bfff',
  },
];

export default function RGBHistogram({
  imageUrl,
  imageBase64,
  width = 200,
  height = 200,
}: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const histogramRef = useRef<HistogramData | null>(null);

  const [hoveredChannel, setHoveredChannel] =
    useState<Channel | null>(null);

  const [hoverInfo, setHoverInfo] =
    useState<HoverInfo | null>(null);

  function drawHistogram() {
    const histogram = histogramRef.current;
    const canvas = canvasRef.current;

    if (!histogram || !canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const { r, g, b, max } = histogram;

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / 256;

    const channels = [
      { id: 'r' as Channel, data: r, color: '#ff3030' },
      { id: 'g' as Channel, data: g, color: '#30ff70' },
      { id: 'b' as Channel, data: b, color: '#30bfff' },
    ];

    /*
     * Draw non-hovered channels first.
     * The hovered channel is deliberately drawn last.
     */
    const orderedChannels = hoveredChannel
      ? [
        ...channels.filter(
          ({ id }) => id !== hoveredChannel,
        ),
        ...channels.filter(
          ({ id }) => id === hoveredChannel,
        ),
      ]
      : channels;

    for (const { id, data, color } of orderedChannels) {
      const hovered = id === hoveredChannel;

      /*
       * -------------------------
       * Fill
       * -------------------------
       */

      ctx.beginPath();

      for (let i = 0; i < 256; i++) {
        const x = i * barWidth;
        const h = (data[i] / max) * height;
        const y = height - h;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      ctx.fillStyle = hexToRgba(
        color,
        hovered ? 0.5 : 0.25,
      );

      ctx.fill();

      /*
       * -------------------------
       * Stroke
       * -------------------------
       */

      ctx.beginPath();

      for (let i = 0; i < 256; i++) {
        const x = i * barWidth;
        const h = (data[i] / max) * height;
        const y = height - h;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = hovered ? 2 : 1;
      ctx.globalAlpha = 1;

      ctx.stroke();
    }
  }

  useEffect(() => {
    let cancelled = false;

    const source = imageBase64 || imageUrl;

    if (!source) return;

    const load = async () => {
      const img = new Image();

      /*
       * Base64 data URLs are same-origin, so
       * crossOrigin isn't needed (and can break some browsers).
       */
      if (!imageBase64) {
        img.crossOrigin = 'anonymous';
      }

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = source;
      });

      if (cancelled) return;

      const off = document.createElement('canvas');

      off.width = img.naturalWidth;
      off.height = img.naturalHeight;

      const ctx = off.getContext('2d', {
        willReadFrequently: true,
      });

      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(
        0,
        0,
        off.width,
        off.height,
      );

      const r = new Uint32Array(256);
      const g = new Uint32Array(256);
      const b = new Uint32Array(256);

      for (let i = 0; i < data.length; i += 4) {
        r[data[i]]++;
        g[data[i + 1]]++;
        b[data[i + 2]]++;
      }

      histogramRef.current = {
        r,
        g,
        b,
        max: Math.max(...r, ...g, ...b),
        totalPixels: data.length / 4,
      };

      drawHistogram();
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, imageBase64]);

  useEffect(() => {
    drawHistogram();
  }, [hoveredChannel, width, height]);


  const handleMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    const histogram = histogramRef.current;

    if (!canvas || !histogram) return;

    const rect = canvas.getBoundingClientRect();

    /*
     * Convert CSS coordinates back into histogram coordinates.
     */
    const x =
      ((event.clientX - rect.left) / rect.width) * width;

    const y =
      ((event.clientY - rect.top) / rect.height) * height;

    const level = Math.max(
      0,
      Math.min(
        255,
        Math.floor((x / width) * 256),
      ),
    );

    const {
      r,
      g,
      b,
      max,
    } = histogram;

    const values = {
      r: r[level],
      g: g[level],
      b: b[level],
    };

    /*
     * Find which curve is physically closest
     * to the mouse.
     */
    let closestChannel: Channel | null = null;
    let closestDistance = Infinity;

    for (const channel of CHANNELS) {
      const value = values[channel.id];

      const curveHeight =
        (value / max) * height;

      const curveY = height - curveHeight;

      const distance = Math.abs(
        y - curveY,
      );

      /*
       * Scale tolerance slightly with the
       * histogram size.
       */
      const tolerance = Math.max(
        5,
        height * 0.04,
      );

      if (
        distance < closestDistance &&
        distance <= tolerance
      ) {
        closestDistance = distance;
        closestChannel = channel.id;
      }
    }

    if (!closestChannel) {
      setHoveredChannel(null);
      setHoverInfo(null);
      return;
    }

    const pixels = values[closestChannel];

    setHoveredChannel(closestChannel);

    setHoverInfo({
      channel: closestChannel,
      level,
      pixels,
      percentage: (pixels / max) * 100,
      r: level,
      g: level,
      b: level,
    });
  };

  const handleMouseLeave = () => {
    setHoveredChannel(null);
    setHoverInfo(null);
  };

  const tooltipTitle = hoverInfo
    ? (() => {
      const channel = CHANNELS.find(
        ({ id }) => id === hoverInfo.channel,
      )!;

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.25,
            minWidth: 145,
            fontSize: 12,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              fontWeight: 700,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: channel.color,
                boxShadow: `0 0 5px ${channel.color}`,
              }}
            />

            {channel.label}
          </Box>

          <Box
            sx={{
              mt: 0.5,
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1.5,
              rowGap: 0.15,
              fontFamily: 'monospace',
            }}
          >
            <span>Level</span>
            <strong>{hoverInfo.level}</strong>

            <span>Pixels</span>
            <strong>
              {hoverInfo.pixels.toLocaleString()}
            </strong>

            <span>Relative</span>
            <strong>
              {hoverInfo.percentage.toFixed(2)}%
            </strong>
          </Box>

          <Box
            sx={{
              mt: 0.5,
              pt: 0.5,
              borderTop: '1px solid',
              borderColor: 'rgba(255,255,255,0.2)',
              fontFamily: 'monospace',
            }}
          >
              RGB&nbsp;&nbsp;
            {hoverInfo.level}&nbsp;&nbsp;
            {hoverInfo.level}&nbsp;&nbsp;
            {hoverInfo.level}
          </Box>
        </Box>
      );
    })()
    : 'RGB Histogram';

  return (
    <Tooltip
      title={tooltipTitle}
      placement="left"
      arrow
      followCursor
      open={Boolean(hoverInfo)}
      disableFocusListener
      disableTouchListener
      enterDelay={40}
      slotProps={{
        tooltip: {
          sx: {
            p: 1,
            maxWidth: 'none',
          },
        },
      }}
    >
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: 1,
          overflow: 'hidden',
          width,
          height,
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width,
            height,
            display: 'block',
            borderRadius: 8,
            cursor: hoveredChannel
              ? 'crosshair'
              : 'default',
          }}
        />
      </Box>
    </Tooltip>
  );
}

function hexToRgba(
  hex: string,
  alpha: number,
) {
  const value = hex.replace('#', '');

  const r = parseInt(
    value.slice(0, 2),
    16,
  );

  const g = parseInt(
    value.slice(2, 4),
    16,
  );

  const b = parseInt(
    value.slice(4, 6),
    16,
  );

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
