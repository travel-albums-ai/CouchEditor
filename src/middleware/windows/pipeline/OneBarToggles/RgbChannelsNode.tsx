import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { paletteItemsByType } from '@/middleware/windows/pipeline/NodePalette';
import { Typography } from '@mui/material';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToneNodeLayout from './ToneNodeLayout';

type RgbChannelsData = {
  red?: number;
  green?: number;
  blue?: number;
};

type RgbChannelsNodeConfig = {
  type: string;
  titleKey: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

function createRgbChannelsNode(config: RgbChannelsNodeConfig) {
  function RgbChannelsNode({
    id,
    data,
  }: NodeProps<Node<RgbChannelsData>>) {
    const paletteItem = paletteItemsByType[config.type];
    const { setNodes } = useReactFlow();
    const { t } = useTranslation();
    const [values, setValues] = useState({
      red: data.red ?? config.defaultValue,
      green: data.green ?? config.defaultValue,
      blue: data.blue ?? config.defaultValue,
    });

    return (
      <ToneNodeLayout id={id} type={config.type} runningConfig={data}>
        {paletteItem.configs?.map((config, index) => (
          <AdjustmentSlider
            description={<Typography variant="caption" color="textSecondary">{config.labelKey ? config.labelKey : ""}</Typography>}
            min={config.min ?? 0}
            max={config.max ?? 100}
            throttleMs={1000}
            step={config.step ?? 1}
            value={data[config.key] ?? 0}
            onChange={(value) => {
              setNodes((current) => current.map((node) => node.id === id
                ? { ...node, data: { ...node.data, [config.key]: value } }
                : node
              ));
            }}
          />
        ))}
      </ToneNodeLayout>
    );
  }

  return RgbChannelsNode;
}

export const RgbBlackPointNode = createRgbChannelsNode({
  type: 'rgb-black-point',
  titleKey: 'pipelineRgbBlackPoint',
  min: 0,
  max: 255,
  step: 1,
  defaultValue: 0,
});

export const RgbWhitePointNode = createRgbChannelsNode({
  type: 'rgb-white-point',
  titleKey: 'pipelineRgbWhitePoint',
  min: 1,
  max: 255,
  step: 1,
  defaultValue: 255,
});

export const RgbMidtonesNode = createRgbChannelsNode({
  type: 'rgb-midtones',
  titleKey: 'pipelineRgbMidtones',
  min: 0.1,
  max: 3,
  step: 0.01,
  defaultValue: 1,
});
