import React, { useMemo } from "react";

import {
  Angle,
  Astroid,
  ChartColumn,
  Contrast,
  EyeDashed,
  Film,
  GalleryVerticalEnd,
  Gem,
  Group,
  HardDrive,
  Image,
  ImageUpscale,
  Images,
  Landmark,
  Lightbulb,
  Mountain,
  Palette,
  Pipette,
  Slice,
  SquareCenterlineDashedHorizontal,
  SquareCenterlineDashedVertical,
  SquaresExclude,
  Sun,
  SwatchBook,
  Theater,
  Wheat,
} from "lucide-react";

type LucideIcon = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
}>;

const ICONS: LucideIcon[] = [
  HardDrive,
  GalleryVerticalEnd,
  Group,
  Astroid,
  SquaresExclude,
  Landmark,
  Film,
  SquareCenterlineDashedHorizontal,
  SquareCenterlineDashedVertical,
  Angle,
  Lightbulb,
  Palette,
  Sun,
  Contrast,
  SwatchBook,
  Pipette,
  Theater,
  Wheat,
  Slice,
  Gem,
  Mountain,
  EyeDashed,
  ImageUpscale,
  Images,
  Image,
  ChartColumn,
];

/**
 * Deterministic random generator.
 * Same seed = exactly the same wallpaper.
 */
function random(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type IconData = {
  Icon: LucideIcon;
  rotation: number;
  scale: number;
  opacity: number;
};

function createIconData(index: number): IconData {
  const r1 = random(index * 17.137);
  const r2 = random(index * 31.731);
  const r3 = random(index * 53.219);

  return {
    Icon: ICONS[index % ICONS.length],
    rotation: r1 * 360,
    scale: r2 > 0.5 ? 1.05 : 0.85,
    opacity: r3 > 0.5 ? 1 : 0.9,
  };
}

export interface IconDoodleBackgroundProps {
  size?: number;
  iconSize?: number;
  opacity?: number;
  strokeWidth?: number;
  seed?: number;
  background?: string;
  foreground?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IconDoodleBackground({
  size = 40,
  iconSize = 28,
  opacity = 0.02,
  strokeWidth = 1.4,
  seed = 1337,
  background = "#151515",
  foreground = "#d0d0d0",
  className,
  style,
}: IconDoodleBackgroundProps) {
  const horizontalSpacing = size * 0.8660254;
  const verticalSpacing = size * 0.75;

  const cells = useMemo(() => {
    const columns = Math.ceil(2000 / horizontalSpacing);
    const rows = Math.ceil(2000 / verticalSpacing);

    return Array.from({ length: rows * columns }, (_, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;

      const x =
        column * horizontalSpacing +
        (row % 2 === 1 ? horizontalSpacing / 2 : 0);

      const y = row * verticalSpacing;

      const data = createIconData(index + seed);

      return {
        ...data,
        x,
        y,
      };
    });
  }, [horizontalSpacing, verticalSpacing, seed]);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background,
        pointerEvents: "none",
        userSelect: "none",

        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -size,
          top: -size,
          width: 2000,
          height: 2000,
          pointerEvents: "none",
        }}
      >
        {cells.map((cell, index) => {
          const Icon = cell.Icon;

          return (
            <Icon
              key={index}
              size={iconSize}
              strokeWidth={strokeWidth}
              style={{
                position: "absolute",
                left: cell.x,
                top: cell.y,
                transform: `
                  translate(-50%, -50%)
                  rotate(${cell.rotation}deg)
                  scale(${cell.scale})
                `,
                transformOrigin: "center",
                color: foreground,
                opacity: opacity * cell.opacity,
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
