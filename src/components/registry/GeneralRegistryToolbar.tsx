import { ensureToolGroupPreload } from '@/discovery/toolDiscovery';
import {
  ToolMeta,
  toolRegistry,
} from '@/discovery/toolRegistry';
import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface GeneralRegistryToolbarProps {
  group: string;
  noDivider?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  context?: unknown;
  noGhost?: boolean;
}

function getToolConfig(item: ToolMeta, side: 'left' | 'right') {
  return item.tool?.find((g) => g.side === side);
}

export default function GeneralRegistryToolbar({ group, noDivider = true, fullWidth = true, sx, context, noGhost = false }: GeneralRegistryToolbarProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      if (mounted) {
        setReady(false);
      }
    });

    ensureToolGroupPreload(group)
      .then(() => {
        if (mounted) {
          setError(null);
          setReady(true);
        }
      })
      .catch((cause) => {
        if (!mounted) {
          return;
        }

        const discoveryError = cause instanceof Error
          ? cause
          : new Error('Tool discovery failed');
        setError(discoveryError);
      });

    return () => {
      mounted = false;
    };
  }, [group, retryToken]);

  if (!ready) {
    if (error) {
      return (
        <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Failed to load tool controls.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setError(null);
                setReady(false);
                setRetryToken((value) => value + 1);
              }}
            >
              Retry
            </Button>
          </Stack>
        </Box>
      );
    }

    return !noGhost ? (
      <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx, }}>
        <Skeleton variant="rounded" width="100%" animation="wave" height={38} />
      </Box>
    ) : null;
  }

  const leftItems = toolRegistry
    .toolBySide(group, 'left')
    .filter((item) => {
      const config = getToolConfig(item, 'left');
      return config?.visible ? config.visible(context) : true;
    });

  const rightItems = toolRegistry
    .toolBySide(group, 'right')
    .filter((item) => {
      const config = getToolConfig(item, 'right');
      return config?.visible ? config.visible(context) : true;
    });

  return <>
    {(leftItems.length > 0 || rightItems.length > 0) && <>
      <Stack sx={{ ...wrapperSx, ...sx, width: fullWidth ? '100%' : 'auto' }} data-group={group} divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} direction="row" id="header">
        {leftItems.length > 0 && <Stack  direction="row" data-side="left" divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} data-items={leftItems.map(item => item.id).join(',')} sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
          {leftItems.map((item) => {
            const Component = toolRegistry.resolve(item);

            return !Component ? null : <Component key={item.id} context={context} />
          })}
        </Stack>}
        {rightItems.length > 0 && <Stack  direction="row" data-side="right" divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} data-items={rightItems.map(item => item.id).join(',')} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {rightItems.map((item) => {
            const Component = toolRegistry.resolve(item);

            return !Component ? null : <Component key={item.id} context={context} />
          })}
        </Stack>}
      </Stack>
    </>}
  </>
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  overflow: 'auto',
  gap: 1,
}
