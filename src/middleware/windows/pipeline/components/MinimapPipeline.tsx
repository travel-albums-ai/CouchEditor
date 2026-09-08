import { SavedPipeline } from '@/context/pipelineStore';
import { Box, useTheme } from '@mui/material';

export function MinimapPipeline({ pipeline }: { pipeline: SavedPipeline }) {
  const theme = useTheme();

  const nodes = pipeline.nodes ?? [];

  if (!nodes.length) {
    return null;
  }

  const SIZE = 50;
  const PADDING = 5;

  const getNodeWidth = (node: typeof nodes[number]) =>
    node.measured?.width ?? node.width ?? 150;

  const getNodeHeight = (node: typeof nodes[number]) =>
    node.measured?.height ?? node.height ?? 80;

  // Bounding box including the actual node dimensions.
  const minX = Math.min(...nodes.map(node => node.position.x));
  const minY = Math.min(...nodes.map(node => node.position.y));

  const maxX = Math.max(
    ...nodes.map(node => node.position.x + getNodeWidth(node)),
  );

  const maxY = Math.max(
    ...nodes.map(node => node.position.y + getNodeHeight(node)),
  );

  const contentWidth = Math.max(maxX - minX, 1);
  const contentHeight = Math.max(maxY - minY, 1);

  const availableWidth = SIZE - PADDING * 2;
  const availableHeight = SIZE - PADDING * 2;

  // One uniform scale keeps the pipeline's proportions intact.
  const scale = Math.min(
    availableWidth / contentWidth,
    availableHeight / contentHeight,
  );

  const renderedWidth = contentWidth * scale;
  const renderedHeight = contentHeight * scale;

  // Center the complete pipeline in the minimap.
  const offsetX = (SIZE - renderedWidth) / 2;
  const offsetY = (SIZE - renderedHeight) / 2;

  return (
    <Box
      sx={{
        width: SIZE,
        height: SIZE,
        position: 'relative',
        overflow: 'hidden',
        opacity: 0.5,
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 2,
        transition: 'opacity 0.25s ease',
        '&:hover': {
          opacity: 1,
        },
      }}
    >
      {nodes.map(node => {
        const width = getNodeWidth(node);
        const height = getNodeHeight(node);

        return (
          <Box
            key={node.id}
            sx={{
              position: 'absolute',

              left:
                offsetX +
                (node.position.x - minX) * scale,

              top:
                offsetY +
                (node.position.y - minY) * scale,

              width: Math.max(width * scale, 2),
              height: Math.max(height * scale, 2),

              backgroundColor: theme.palette.primary.main,
              borderRadius: '1px',
            }}
          />
        );
      })}
    </Box>
  );
}
