import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SettingsSection from '@/components/SettingsSection';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useFetch_Config } from '@/hooks/remote/useFetch_Config';
import usePost_Config from '@/hooks/remote/useFetch_PostConfig';
import SettingsGeneralRow from '@/middleware/windows/settings/components/SettingsGeneralRow';
import { Box, InputAdornment, TextField, useTheme } from '@mui/material';
import { Code, Database, Folder, FolderOpen, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function IndexerSettings({ asIs = false }: { asIs?: boolean }) {
  const { data } = useFetch_Config();
  const theme = useTheme();
  const { mutate } = usePost_Config();
  const indexing = useSettingsStoreSelector((state) => state.indexing);

  const [newRoot, setNewRoot] = useState('');
  const [targetRoot, setTargetRoot] = useState('');

  useEffect(() => {
    if (data?.TARGET_ROOT !== undefined) {
      setTargetRoot(data.TARGET_ROOT);
    }
  }, [data?.TARGET_ROOT]);

  const deleteRoot = (root: string) => {
    const newRoots =
      data?.TAKEOUT_ROOTS?.filter((r: string) => r !== root) || [];

    mutate({ TAKEOUT_ROOTS: newRoots });
  };

  const addRoot = (root: string) => {
    const newRoots = [...(data?.TAKEOUT_ROOTS || []), root];
    mutate({ TAKEOUT_ROOTS: newRoots });
  };

  const updateTargetRoot = (root: string) => {
    mutate({ TARGET_ROOT: root });
  };

  return (
    <>
      <SettingsSection
        divider
        title="Cache & Takeout"
        icon={<Code />}
        uuid="indexer-settings"
      >
        <SettingsGeneralRow icon={<Database />} label="Cache">
          <Box
            sx={{
              width: '450px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyContent: 'space-between',
            }}
          >
            <TextField
              value={targetRoot}
              size="small"
              fullWidth
              disabled={!data || indexing}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Database size={16} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) => setTargetRoot(event.target.value)}
              onBlur={() => {
                if (targetRoot && targetRoot !== data?.TARGET_ROOT) {
                  updateTargetRoot(targetRoot);
                }
              }}
            />
          </Box>
        </SettingsGeneralRow>

        <SettingsGeneralRow icon={<Folder />} label="Takeout sources">
          <Box
            sx={{
              width: '450px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              justifyContent: 'space-between',
            }}
          >

            {data?.TAKEOUT_ROOTS?.map((root: string) => (
              <Box
                key={root}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  justifyContent: 'space-between',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  opacity: 0.8,
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <FolderOpen size={16} />

                {root}

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  {!indexing && <GenericToggleButtonGroup variant="standard" items={[
                    {
                      disabled: indexing,
                      tooltip: "Delete folder",
                      icon: <Trash size={16} color={theme.palette.error.main} />,
                      onClick: () => deleteRoot(root),
                    },
                  ] satisfies GenericToggleButtonProps[]} />}
                </Box>
              </Box>
            ))}
            <TextField
              value={newRoot}
              size="small"
              fullWidth
              disabled={!data || indexing}
              placeholder="Add new root path..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Plus size={16} />
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) => setNewRoot(event.target.value)}
              onBlur={() => {
                if (newRoot && !data?.TAKEOUT_ROOTS?.includes(newRoot)) {
                  addRoot(newRoot);
                  setNewRoot('');
                }
              }}
            />

          </Box>
        </SettingsGeneralRow>

      </SettingsSection>
    </>
  );
}
