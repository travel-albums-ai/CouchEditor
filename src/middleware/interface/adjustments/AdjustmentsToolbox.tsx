import { Box } from '@mui/material';
import { AudioLines, BicepsFlexed, BrickWall, Camera, CircleDotDashed, Contrast, DraftingCompass, EyeDashed, Gem, Lightbulb, Mountain, Paintbrush, Palette, Pipette, Slice, SlidersHorizontal, Sun, SwatchBook, Theater, Thermometer, Wheat } from 'lucide-react';

import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SolidChip from '@/components/SolidChip';
import AdjustmentsToolboxItem from '@/middleware/interface/adjustments/AdjustmentsToolboxItem';
import { numberSlider } from '@/middleware/interface/adjustments/sliderBuilders';
import { ADJUSTMENTS_RANGES } from '@/middleware/interface/adjustments/state';
import { Adjustments } from '@/middleware/interface/adjustments/types';
import { useState } from 'react';

function ChannelDot({ color, style }: { color: string; style?: React.CSSProperties }) {
  return <Box sx={{ backgroundColor: color, borderRadius: '50%', height: 16, width: 16, ...style }} />;
}

function ComposedDots({firstChild, children} : {firstChild: React.ReactNode; children: React.ReactNode}) {
  return <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
    {firstChild}
    {Array.isArray(children) ? children : [children].filter(Boolean).map((child, index) => <Box key={index} sx={{ marginLeft: -1 }}>{child}</Box>)}
  </Box>
}

export default function AdjustmentsToolbox({
  adj,
  set,
  histogram,
  presetSelector
}: {
  adj: Adjustments;
  set: <K extends keyof Adjustments>(_key: K, _value: Adjustments[K]) => void;
  histogram?: React.ReactNode;
  presetSelector?: React.ReactNode;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const items = [
    {
      key: 'base',
      title: 'Base',
      icon: <Camera size={16} />,
      list: [
        {
          title: 'Invert',
          checked: adj.invert,
          onChange: (checked: boolean) => set('invert', checked),
          sliders: [],
        },
        {
          title: 'Film Base Color',
          checked: adj.baseColorOn,
          onChange: (checked: boolean) => set('baseColorOn', checked),
          sliders: [
            numberSlider({
              label: 'Film Base Red',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<BrickWall size={16} />} children={<ChannelDot color="red" />} />,
              value: adj.baseColorR,
              ...ADJUSTMENTS_RANGES.baseColorR,
              onValueChange: (value) => set('baseColorR', value),
            }),
            numberSlider({
              label: 'Film Base Green',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<BrickWall size={16} />} children={<ChannelDot color="green" />} />,
              value: adj.baseColorG,
              ...ADJUSTMENTS_RANGES.baseColorG,
              onValueChange: (value) => set('baseColorG', value),
            }),
            numberSlider({
              label: 'Film Base Blue',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<BrickWall size={16} />} children={<ChannelDot color="blue" />} />,
              value: adj.baseColorB,
              ...ADJUSTMENTS_RANGES.baseColorB,
              onValueChange: (value) => set('baseColorB', value),
            }),
            numberSlider({
              label: 'Orange Mask Strength Red',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<ChannelDot color="orange" />} children={<ChannelDot color="red" />} />,
              value: adj.orangeMaskStrengthR,
              ...ADJUSTMENTS_RANGES.orangeMaskStrengthR,
              onValueChange: (value) => set('orangeMaskStrengthR', value),
            }),
            numberSlider({
              label: 'Orange Mask Strength Green',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<ChannelDot color="orange" />} children={<ChannelDot color="green" />} />,
              value: adj.orangeMaskStrengthG,
              ...ADJUSTMENTS_RANGES.orangeMaskStrengthG,
              onValueChange: (value) => set('orangeMaskStrengthG', value),
            }),
            numberSlider({
              label: 'Orange Mask Strength Blue',
              skipLabel: true,
              preIcon: <ComposedDots firstChild={<ChannelDot color="orange" />} children={<ChannelDot color="blue" />} />,
              value: adj.orangeMaskStrengthB,
              ...ADJUSTMENTS_RANGES.orangeMaskStrengthB,
              onValueChange: (value) => set('orangeMaskStrengthB', value),
            }),
          ]
        }
      ],
    },
    {
      key: 'basics',
      icon: <SlidersHorizontal size={16} />,
      list: [
        {
          title: 'Exposure',
          checked: adj.exposureOn,
          onChange: (checked: boolean) => set('exposureOn', checked),
          sliders: [
            numberSlider({
              label: 'Exposure',
              preIcon: <Sun size={16} />,
              skipLabel: true,
              value: adj.exposure,
              onValueChange: (value) => set('exposure', value),
              ...ADJUSTMENTS_RANGES.exposure,
            }),
          ],
        },
        {
          title: 'Brightness',
          checked: adj.brightnessOn,
          onChange: (checked: boolean) => set('brightnessOn', checked),
          sliders: [
            numberSlider({
              label: 'Brightness',
              ...ADJUSTMENTS_RANGES.brightness,
              preIcon: <Lightbulb size={16} />,
              skipLabel: true,
              value: adj.brightness,
              onValueChange: (value) => set('brightness', value),
            }),
          ],
        },
        {
          title: 'Contrast',
          checked: adj.contrastOn,
          onChange: (checked: boolean) => set('contrastOn', checked),
          sliders: [
            numberSlider({
              label: 'Contrast',
              ...ADJUSTMENTS_RANGES.contrast,
              preIcon: <Contrast size={16} />,
              skipLabel: true,
              value: adj.contrast,
              onValueChange: (value) => set('contrast', value),
            }),
          ],
        },
        {
          title: 'Pop',
          checked: adj.popOn,
          onChange: (checked: boolean) => set('popOn', checked),
          sliders: [
            numberSlider({
              label: 'Pop',
              ...ADJUSTMENTS_RANGES.pop,
              preIcon: <Gem size={16} />,
              skipLabel: true,
              value: adj.pop,
              onValueChange: (value) => set('pop', value),
            }),
          ],
        },
        {
          title: 'HDR Effect',
          checked: adj.hdrEffectOn,
          onChange: (checked: boolean) => set('hdrEffectOn', checked),
          sliders: [
            numberSlider({
              label: 'HDR Effect',
              preIcon: <Mountain size={16} />,
              ...ADJUSTMENTS_RANGES.hdrEffect,
              skipLabel: true,
              value: adj.hdrEffect,
              onValueChange: (value) => set('hdrEffect', value),
            }),
            numberSlider({
              label: 'HDR Radius',
              preIcon: <DraftingCompass size={16} />,
              ...ADJUSTMENTS_RANGES.hdrRadius,
              skipLabel: true,
              value: adj.hdrRadius,
              onValueChange: (value) => set('hdrRadius', value),
            }),
          ],
        },
      ],
      title: "Basics"
    },
    {
      key: 'levels',
      icon: <AudioLines size={16} />,
      title: 'Levels',
      list: [
        {
          title: 'Split Toning',
          checked: adj.splitToneOn,
          onChange: (checked: boolean) => set('splitToneOn', checked),
          sliders: [
            numberSlider({
              label: 'Strength',
              skipLabel: true,
              preIcon: <BicepsFlexed size={16} />,
              value: adj.splitToneStrength,
              ...ADJUSTMENTS_RANGES.splitToneStrength,
              onValueChange: (value) => set('splitToneStrength', value),
            }),
            numberSlider({
              label: 'Shadow tint',
              value: adj.shadowTintR,
              preIcon: <ChannelDot color="red" />,
              ...ADJUSTMENTS_RANGES.shadowTintR,
              onValueChange: (value) => set('shadowTintR', value),
            }),
            numberSlider({
              label: 'Shadow tint',
              value: adj.shadowTintG,
              preIcon: <ChannelDot color="green" />,
              ... ADJUSTMENTS_RANGES.shadowTintG,
              onValueChange: (value) => set('shadowTintG', value),
            }),
            numberSlider({
              label: 'Shadow tint',
              value: adj.shadowTintB,
              preIcon: <ChannelDot color="blue" />,
              skipLabel: true,
              ...ADJUSTMENTS_RANGES.shadowTintB,
              onValueChange: (value) => set('shadowTintB', value),
            }),
            numberSlider({
              label: 'Highlight tint',
              value: adj.highlightTintR,
              ...ADJUSTMENTS_RANGES.highlightTintR,
              preIcon: <ChannelDot color="red" />,
              onValueChange: (value) => set('highlightTintR', value),
            }),
            numberSlider({
              label: 'Highlight tint',
              value: adj.highlightTintG,
              preIcon: <ChannelDot color="green" />,
              ...ADJUSTMENTS_RANGES.highlightTintG,
              onValueChange: (value) => set('highlightTintG', value),
            }),
            numberSlider({
              label: 'Highlight tint',
              preIcon: <ChannelDot color="blue" />,
              value: adj.highlightTintB,
              ...ADJUSTMENTS_RANGES.highlightTintB,
              onValueChange: (value) => set('highlightTintB', value),
            }),
          ],
        }
      ],
    },
    {
      key: 'colors',
      title: 'Colors',
      icon: <SwatchBook size={16} />,
      list: [
        {
          title: 'Per-channel Gamma',
          checked: adj.perChannelGammaOn,
          onChange: (checked: boolean) => set('perChannelGammaOn', checked),
          sliders: [
            numberSlider({
              label: 'Red',
              preIcon: <ChannelDot color="red" />,
              skipLabel: true,
              value: adj.gammaR,
              ...ADJUSTMENTS_RANGES.gammaR,
              onValueChange: (value) => set('gammaR', value),
            }),
            numberSlider({
              label: 'Green',
              preIcon: <ChannelDot color="green" />,
              skipLabel: true,
              value: adj.gammaG,
              ...ADJUSTMENTS_RANGES.gammaG,
              onValueChange: (value) => set('gammaG', value),
            }),
            numberSlider({
              label: 'Blue',
              preIcon: <ChannelDot color="blue" />,
              skipLabel: true,
              value: adj.gammaB,
              ...ADJUSTMENTS_RANGES.gammaB,
              onValueChange: (value) => set('gammaB', value),
            }),
          ]
        },
        {
          title: 'Temperature / Tint',
          checked: adj.temperatureOn,
          onChange: (checked: boolean) => set('temperatureOn', checked),
          sliders: [
            numberSlider({
              label: 'Temperature',
              preIcon: <Thermometer size={16} />,
              skipLabel: true,
              value: adj.temperature,
              onValueChange: (value) => set('temperature', value),
              ...ADJUSTMENTS_RANGES.temperature,
            }),
            numberSlider({
              label: 'Tint',
              preIcon: <Paintbrush size={16} />,
              skipLabel: true,
              value: adj.tint,
              onValueChange: (value) => set('tint', value),
              ...ADJUSTMENTS_RANGES.tint,
            }),
          ]
        },
        {
          title: 'Gamma',
          checked: adj.gammaOn,
          onChange: (checked: boolean) => set('gammaOn', checked),
          sliders: [
            numberSlider({
              label: 'Gamma',
              value: adj.gamma,
              preIcon: <Palette size={16} />,
              onValueChange: (value) => set('gamma', value),
              ...ADJUSTMENTS_RANGES.gamma,
            }),
          ]
        },
        {
          title: 'Saturation',
          checked: adj.saturationOn,
          onChange: (checked: boolean) => set('saturationOn', checked),
          sliders: [
            numberSlider({
              label: 'Saturation',
              preIcon: <SwatchBook size={16} />,
              skipLabel: true,
              value: adj.saturation,
              ...ADJUSTMENTS_RANGES.saturation,
              onValueChange: (value) => set('saturation', value),
            }),
          ]
        },
        {
          title: 'Vibrance',
          checked: adj.vibranceOn,
          onChange: (checked: boolean) => set('vibranceOn', checked),
          sliders: [
            numberSlider({
              label: 'Vibrance',
              preIcon: <Pipette size={16} />,
              skipLabel: true,
              value: adj.vibrance,
              ...ADJUSTMENTS_RANGES.vibrance,
              onValueChange: (value) => set('vibrance', value),
            }),
          ]
        }
      ],
    },
    {
      key: 'blackAndWhite',
      icon: <Contrast size={16} />,
      list: [
        {
          title: 'Black/White',
          checked: adj.wbkOn,
          onChange: (checked: boolean) => set('wbkOn', checked),
          sliders: [
            numberSlider({
              label: 'Blacks',
              preIcon: <ChannelDot color="black" />,
              skipLabel: true,
              value: adj.blacks,
              ...ADJUSTMENTS_RANGES.blacks,
              onValueChange: (value) => set('blacks', value),
            }),
            numberSlider({
              label: 'Whites',
              preIcon: <ChannelDot color="white" />,
              skipLabel: true,
              value: adj.whites,
              ...ADJUSTMENTS_RANGES.whites,
              onValueChange: (value) => set('whites', value),
            }),
          ]
        },
        {
          title: "White Point RGB",
          checked: adj.whitePointOn,
          onChange: (checked: boolean) => set('whitePointOn', checked),
          sliders: [
            numberSlider({
              label: 'Red',
              preIcon: <ComposedDots firstChild={<ChannelDot color="white" />} children={<ChannelDot color="red" />} />,
              skipLabel: true,
              value: adj.whiteR,
              ...ADJUSTMENTS_RANGES.whiteR,
              onValueChange: (value) => set('whiteR', value),
            }),
            numberSlider({
              label: 'Green',
              preIcon: <ComposedDots firstChild={<ChannelDot color="white" />} children={<ChannelDot color="green" />} />,
              skipLabel: true,
              value: adj.whiteG,
              ...ADJUSTMENTS_RANGES.whiteG,
              onValueChange: (value) => set('whiteG', value),
            }),
            numberSlider({
              label: 'Blue',
              preIcon: <ComposedDots firstChild={<ChannelDot color="white" />} children={<ChannelDot color="blue" />} />,
              skipLabel: true,
              value: adj.whiteB,
              ...ADJUSTMENTS_RANGES.whiteB,
              onValueChange: (value) => set('whiteB', value),
            }),
          ]
        },
        {
          title: "Midtones RGB",
          checked: adj.midtonesOn,
          onChange: (checked: boolean) => set('midtonesOn', checked),
          sliders: [
            numberSlider({
              label: 'Red',
              preIcon: <ChannelDot color="red" />,
              skipLabel: true,
              value: adj.midtonesR,
              ...ADJUSTMENTS_RANGES.midtonesR,
              onValueChange: (value) => set('midtonesR', value),
            }),
            numberSlider({
              label: 'Green',
              preIcon: <ChannelDot color="green" />,
              skipLabel: true,
              value: adj.midtonesG,
              ...ADJUSTMENTS_RANGES.midtonesG,
              onValueChange: (value) => set('midtonesG', value),
            }),
            numberSlider({
              label: 'Blue',
              preIcon: <ChannelDot color="blue" />,
              skipLabel: true,
              value: adj.midtonesB,
              ...ADJUSTMENTS_RANGES.midtonesB,
              onValueChange: (value) => set('midtonesB', value),
            }),
          ]
        },
        {
          title: "Black Point RGB",
          checked: adj.blackPointOn,
          onChange: (checked: boolean) => set('blackPointOn', checked),
          sliders: [
            numberSlider({
              label: 'Red',
              preIcon: <ComposedDots firstChild={<ChannelDot color="black" />} children={<ChannelDot color="red" />} />,
              skipLabel: true,
              value: adj.blackR,
              ...ADJUSTMENTS_RANGES.blackR,
              onValueChange: (value) => set('blackR', value),
            }),
            numberSlider({
              label: 'Green',
              preIcon: <ComposedDots firstChild={<ChannelDot color="black" />} children={<ChannelDot color="green" />} />,
              skipLabel: true,
              value: adj.blackG,
              ...ADJUSTMENTS_RANGES.blackG,
              onValueChange: (value) => set('blackG', value),
            }),
            numberSlider({
              label: 'Blue',
              preIcon: <ComposedDots firstChild={<ChannelDot color="black" />} children={<ChannelDot color="blue" />} />,
              skipLabel: true,
              value: adj.blackB,
              ...ADJUSTMENTS_RANGES.blackB,
              onValueChange: (value) => set('blackB', value),
            }),
          ]
        }
      ],
      title: 'Black & White',
    },
    {
      key: 'decorative',
      icon: <CircleDotDashed size={16} />,
      list: [
        {
          title: 'Sharpen',
          checked: adj.sharpenOn,
          onChange: (checked: boolean) => set('sharpenOn', checked),
          sliders: [
            numberSlider({
              label: 'Sharpen',
              preIcon: <Slice size={16} />,
              value: adj.sharpen,
              onValueChange: (value) => set('sharpen', value),
              ...ADJUSTMENTS_RANGES.sharpen,
            }),
          ],
        },
        {
          title: 'Fade',
          checked: adj.fadeOn,
          onChange: (checked: boolean) => set('fadeOn', checked),
          sliders: [
            numberSlider({
              label: 'Fade',
              preIcon: <EyeDashed size={16} />,
              value: adj.fade,
              onValueChange: (value) => set('fade', value),
              ...ADJUSTMENTS_RANGES.fade,
            }),
          ],
        },
        {
          title: 'Vignette',
          checked: adj.vignetteOn,
          onChange: (checked: boolean) => set('vignetteOn', checked),
          sliders: [
            numberSlider({
              label: 'Vignette',
              preIcon: <Theater size={16} />,
              value: adj.vignette,
              onValueChange: (value) => set('vignette', value),
              ...ADJUSTMENTS_RANGES.vignette,
            }),
          ],
        },
        {
          title: 'Grain',
          checked: adj.grainOn,
          onChange: (checked: boolean) => set('grainOn', checked),
          sliders: [
            numberSlider({
              label: 'Grain',
              value: adj.grain,
              preIcon: <Wheat size={16} />,
              onValueChange: (value) => set('grain', value),
              ...ADJUSTMENTS_RANGES.grain,
            }),
          ],
        },
      ],
      title: 'Decorative',
    },
  ]

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, overflow: 'auto', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

          {presetSelector}
          <GenericToggleButtonGroup items={[
            ...items.map((item, index) => ({
              tooltip: item.title,
              icon: item.icon,
              onClick: () => setSelectedIndex(index),
              title: <><SolidChip
                height={16}
                count={item.list.filter((subItem) => subItem.checked).length}
                variant={item.list.filter((subItem) => subItem.checked).length > 0 ? 'header' : 'text'}
                minWidth={20}
              /></>,
              selected: index === selectedIndex,
            })),
          ] satisfies GenericToggleButtonProps[]} />
        </Box>
        {histogram}
      </Box>
      <Box sx={{ overflow: 'auto', flexGrow: 1, height: '0' }}>
        {items
          .filter((item, index) => index === selectedIndex)
          .map((item) => <Box key={item.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <AdjustmentsToolboxItem item={item} />
          </Box>)}
      </Box>
    </>
  );
}
