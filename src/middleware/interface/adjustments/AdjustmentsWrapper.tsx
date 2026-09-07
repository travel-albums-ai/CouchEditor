import { Box } from '@mui/material';

import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import GenericPanel from '@/components/generics/GenericPanel';
import Histogram from '@/components/Histogram';
import { useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import { composeUrl } from '@/lib/thumbnailService';
import AdjustmentsPresetSelector from '@/middleware/interface/adjustments/AdjustmentsPresetSelector';
import AdjustmentsProcess from '@/middleware/interface/adjustments/AdjustmentsProcess';
import AdjustmentsToolbox from '@/middleware/interface/adjustments/AdjustmentsToolbox';
import GeneticBreedingGrid from '@/middleware/interface/adjustments/GeneticBreedingGrid';
import ImageUrlToBase64 from '@/middleware/interface/adjustments/ImageUrlToBase64';
import { Adjustments } from '@/middleware/interface/adjustments/types';
import AIColorizer from '@/robot/AIColorizer';
import AIDenoiser from '@/robot/AIDenoiser';
import AIRestoring from '@/robot/AIRestoring';
import { useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

type AdjustmentsWrapperProps = {
  previewPhotoObj: any;
  url: string;
  initialPreset?: Partial<Adjustments>;
  hasToolbox?: boolean;
  hasPresetSelector?: boolean;
  sxCanvas?: Record<string, unknown>;
  hasGeneticBreeding?: boolean;
};

export default function AdjustmentsWrapper({
  previewPhotoObj,
  url,
  initialPreset,
  hasToolbox,
  hasPresetSelector,
  sxCanvas,
  hasGeneticBreeding,
}: AdjustmentsWrapperProps) {
  const { adj, applyPreset, pipeline, preset, presets, set } = useAdjustmentsState({ initialPreset });
  const showGenetic = useAdjustmentsStoreSelector((state) => state.showGenetic)
  const processedBase64 = useAdjustmentsStoreSelector((state) => state.processedBase64)

  const [selectedAdj, setSelectedAdj] = useState<Adjustments | null>(null);

  return (
    <GenericPanel id="adjustments-drawer" defaultTool>
      <Box id="adjustments-wrapper"
        sx={{
          alignItems: 'stretch',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
          width: '100%',
        }}
      >

        {(hasGeneticBreeding && showGenetic) ? (
          <Box
            sx={{
              display: 'flex',
              flex: '0 0 50%',
              height: '0',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GeneticBreedingGrid
              propagateSelection={(adj) => setSelectedAdj(adj)}
              key={JSON.stringify(adj)}
              url={url}
              basePreset={adj}
            />
          </Box>
        ) :  <Box
          sx={{
            display: 'flex',
            flex: '0 0 50%',
            height: '0',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box
            sx={{
              aspectRatio: previewPhotoObj.width / previewPhotoObj.height * -1, // or 4/3, 16/9...
              maxWidth: '100%',
            }}
          >
            <ReactCompareSlider
              itemOne={<AlbumPhotoThumbnailBackgroundNg photo={previewPhotoObj} original={false} />}
              itemTwo={<Box
                component="img"
                src={processedBase64}
                alt="Colorized"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />}
            />
          </Box>
        </Box>}

        <AdjustmentsProcess pipeline={pipeline} />
        <ImageUrlToBase64 imageUrl={composeUrl(previewPhotoObj, false)} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
          }}
        >
          <AIColorizer />
          <AIDenoiser />
          <AIRestoring />
        </Box>

        {(hasPresetSelector || hasToolbox) &&
          <AdjustmentsToolbox
            adj={selectedAdj || adj}
            set={set}
            histogram={<Histogram imageUrl={composeUrl(previewPhotoObj)} width={160} height={80} />}
            presetSelector={hasPresetSelector ? <AdjustmentsPresetSelector onChange={applyPreset} previewPhotoObj={previewPhotoObj} preset={preset} presets={presets} /> : undefined}
          />
        }
      </Box>
    </GenericPanel>
  );
}
