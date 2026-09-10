import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
import { Box, IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { NodeToolbar, Position, useNodeId, useReactFlow } from '@xyflow/react';
import { Copy, Trash2 } from 'lucide-react';
import stc from 'string-to-color';

type NodeWrapperProps = {
  children: React.ReactNode;
  type: string;
  helper?: React.ReactNode;
  tools?: React.ReactNode;
};

export default function NodeWrapper({
  children,
  type,
  helper,
  tools,
}: NodeWrapperProps) {
  const nodeId = useNodeId();
  const { addNodes, deleteElements, getNode, getNodes } = useReactFlow();

  const deleteNode = () => {
    if (nodeId) {
      void deleteElements({ nodes: [{ id: nodeId }] });
    }
  };

  const cloneNode = () => {
    if (!nodeId) return;

    const node = getNode(nodeId);
    if (!node) return;

    const existingIds = new Set(getNodes().map(existingNode => existingNode.id));
    const baseId = `${node.id}-copy`;
    let cloneId = baseId;
    let suffix = 2;

    while (existingIds.has(cloneId)) {
      cloneId = `${baseId}-${suffix++}`;
    }

    addNodes({
      ...node,
      id: cloneId,
      position: {
        x: node.position.x + 540,
        y: node.position.y + 40,
      },
      data: { ...node.data },
      selected: true,
    });
  };

  return (
    <>
      <NodeToolbar position={Position.Top} offset={8}>
        <Box
          className="nodrag nopan"
          sx={{
            display: 'flex',
            gap: 0.5,
            p: 0.25,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            boxShadow: 2,
          }}
        >
          <Tooltip title="Clone node">
            <IconButton size="small" aria-label="Clone node" onClick={cloneNode}>
              <Copy size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete node">
            <IconButton size="small" aria-label="Delete node" onClick={deleteNode}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </NodeToolbar>

      {helper && <NodeToolbar position={Position.Bottom} offset={8}>
        <Box
          className="nodrag nopan"
          sx={{
            p: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 4,
          }}
        >
          {helper}
        </Box>
      </NodeToolbar>}

      <Box
        sx={[
          {
            cursor: 'grab',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            minWidth: 280,
            borderRadius: 2,
            border: 1,

            borderColor: 'divider',
            boxShadow: theme => `0 0 8px 0px ${theme.palette.divider}`,
            transition: 'border-color 0.25s ease, box-shadow 0.25s ease',

            '&:hover': {
              borderColor: theme => `color-mix(in srgb, ${stc(type)} 45%, ${theme.palette.divider} 75%)`,
              boxShadow: theme => `0 0 12px 2px ${theme.palette.divider}`,
            },
          },
        ]}
      >
        {type && (
          <NodeHeader
            type={type}
            sx={{
              width: '100%',
              border: 0,
              borderRadius: 2,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            {tools && tools}
          </NodeHeader>
        )}

        <Box
          className="nodrag"
          sx={{
            display: 'flex',
            cursor: 'default',
            flexDirection: 'column',
            borderRadius: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            gap: 2,
            p: 2,
            pr: 1.5,
            bgcolor: theme =>
              alpha(theme.palette.background.paper, 1),
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
