import { useSettingsStoreSelector } from '@/context/settingsStore';
import NodeHeader from '@/middleware/windows/pipeline/components/NodeHeader';
import { Box, IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { NodeToolbar, Position, useNodeId, useReactFlow } from '@xyflow/react';
import { Copy, Info, Trash2 } from 'lucide-react';
import { useState } from 'react';

type NodeWrapperProps = {
  children: React.ReactNode;
  type: string;
  helper?: React.ReactNode;
  tools?: React.ReactNode;
};

function NodeWrapper({
  children,
  type,
  helper,
  tools,
}: NodeWrapperProps) {
  const [showHelper, setShowHelper] = useState(false);
  const nodeId = useNodeId();
  const { addNodes, deleteElements, getNode, getNodes } = useReactFlow();
  const performanceMode = useSettingsStoreSelector(
    s => s.performanceMode
  );

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
              borderColor: theme => alpha(theme.palette.primary.main, 0.5),
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              {tools && tools}
              {helper && (
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.disabled',
                  }}
                  onClick={() =>
                    setShowHelper(prev => !prev)
                  }
                >
                  <Info size={16} />
                </IconButton>
              )}

            </Box>
          </NodeHeader>
        )}

        <Box
          className="nodrag"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            bgcolor: theme =>
              alpha(theme.palette.background.paper, 1),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
            }}
          >
            {children}
          </Box>

          {showHelper && (
            <Box sx={{ pb: 1 }}>
              {helper}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default NodeWrapper;
