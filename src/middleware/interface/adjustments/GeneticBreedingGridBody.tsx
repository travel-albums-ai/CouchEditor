import AdjustmentsNaked from '@/middleware/interface/adjustments/AdjustmentsNaked';
import { Adjustments } from '@/middleware/interface/adjustments/types';
import { Box } from '@mui/material';
import { useKeyHold } from '@tanstack/react-hotkeys';

export default function GeneticBreedingGridBody({
  url,
  basePreset,
  population,
  selected,
  setSelected,
  hoveredIndex,
  setHoveredIndex,
}: {
  url: string;
  basePreset: Adjustments;
  population: Adjustments[];
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const isShiftHeld = useKeyHold('Shift')

  function toggleSelect(i: number) {
    setSelected(prev =>
      prev.includes(i)
        ? prev.filter(x => x !== i)
        : [...prev, i].slice(0, 5)
    );
  }

  const extractedGenome = (genome: Adjustments): Partial<Adjustments> => {
    const extracted: Partial<Adjustments> = {};
    for (const key in genome) {
      if (Object.prototype.hasOwnProperty.call(genome, key)) {
        const value = genome[key as keyof Adjustments];
        if (value !== basePreset[key as keyof Adjustments]) {
          extracted[key as keyof Adjustments] = value;
        }
      }
    }
    return extracted;
  }

  return (
    <Box sx={{ position: 'relative',  }}>
      <Box sx={{
        display: 'grid',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(3, minmax(100px, 160px))',
        gap: 0 }}>
        {population.slice(0, 9).map((g, i) => {
          const x = i % 3
          const y = Math.floor(i / 3)

          return <Box
            key={`${i}-${JSON.stringify(g)}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => toggleSelect(i)}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              border: theme => selected.includes(i)
                ? `2px solid ${theme.palette.primary.main}`
                : `1px solid ${theme.palette.divider}`,
              '&:hover': {
                border: theme => `2px solid ${theme.palette.secondary.main}`,
              }
            }}
          >
            <Box
              title={`Genome ${i + 1} - ${JSON.stringify(extractedGenome(g))}`}
              sx={{
                width: '300%',
                // height: '300%',
                transform: `translate(${-x * 100 / 3}%, ${-y * 100 / 3}%)`,
                transformOrigin: 'center',
              }}>
              <AdjustmentsNaked
                sxCanvas={{ width: '100%' }}
                url={url}
                initialPreset={g}  />
            </Box>
          </Box>
        })}
      </Box>

      {hoveredIndex !== null && isShiftHeld && <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <AdjustmentsNaked
          sxCanvas={{ width: '100%' }}
          url={url}
          initialPreset={population.at(hoveredIndex )}  />
      </Box>}

    </Box>
  );
}
