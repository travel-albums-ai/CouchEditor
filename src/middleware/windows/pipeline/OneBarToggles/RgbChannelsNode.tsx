import AdjustmentSlider from '@/middleware/windows/pipeline/components/AdjustmentSlider';
import { Box, Typography } from '@mui/material';
import { type Node, type NodeProps } from '@xyflow/react';
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

const CHANNELS = [
  { key: 'red', labelKey: 'pipelineRed', color: 'red' },
  { key: 'green', labelKey: 'pipelineGreen', color: 'green' },
  { key: 'blue', labelKey: 'pipelineBlue', color: 'blue' },
] as const;

function createRgbChannelsNode(config: RgbChannelsNodeConfig) {
  function RgbChannelsNode({
    id,
    data,
  }: NodeProps<Node<RgbChannelsData>>) {
    const { t } = useTranslation();
    const [values, setValues] = useState({
      red: data.red ?? config.defaultValue,
      green: data.green ?? config.defaultValue,
      blue: data.blue ?? config.defaultValue,
    });

    return (
      <ToneNodeLayout id={id} type={config.type}>
        {CHANNELS.map(({ key, labelKey, color }) => (
          <label key={key}>

            <AdjustmentSlider
              description={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ backgroundColor: color, width: '16px',
                  border: '1px solid',
                  borderColor: 'background.paper',
                  display: 'inline-block', height: '16px', borderRadius: 4, opacity: 0.5 }} />
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 0 }}>{t(labelKey)}</Typography>
              </Box>}
              min={config.min}
              max={config.max}
              step={config.step}
              value={values[key]}
              onChange={(value) => {
                Object.assign(data, { [key]: value });
                setValues((current) => ({ ...current, [key]: value }));
              }}
            />
          </label>
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
