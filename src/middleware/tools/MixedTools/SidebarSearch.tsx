import GenericToggleButton from '@/components/generics/GenericToggleButton';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useHotkey } from '@tanstack/react-hotkeys';
import { CircleX, Search, SearchCode } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SidebarSearch() {
  const { setSetting } = useSettings();
  const { sidebarTerm, sidebarSearchOpen } = useSettingsStoreSelector((state) => state);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState(sidebarTerm ?? '');

  useHotkey('Shift+F', () => {
    setSetting(prev => ({ ...prev, sidebarSearchOpen: true }))
  }, {
    enabled: !sidebarSearchOpen,
    meta: {
      name: t('searchSectionsName'),
      description: t('searchSectionsOpenDescription'),
      icon: <SearchCode />,
      group: 'Sidebar'
    }
  })

  useHotkey('Escape', () => {
    setSetting(prev => ({ ...prev, sidebarSearchOpen: false }))
  }, {
    enabled: sidebarSearchOpen,
    meta: {
      name: t('closeSearchSectionsName'),
      description: t('closeSearchSectionsDescription'),
      icon: <SearchCode />,
      group: 'Sidebar'
    }
  })

  const commit = (value: string) => {
    setSetting(prev => ({
      ...prev,
      sidebarTerm: value,
    }));
  };

  const handleChange = (value: string) => {
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      commit(value);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      commit(searchTerm);
    }
  };

  useEffect(() => {
    setSearchTerm(sidebarTerm ?? '');
  }, [sidebarTerm]);

  return (
    <>
      {(sidebarSearchOpen || searchTerm !== '') ? (
        <>
          <TextField
            placeholder={t('searchSectionsPlaceholder')}
            variant="outlined"
            size="small"
            fullWidth
            autoFocus
            value={searchTerm}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => {
                    handleChange('')
                    setSetting(prev => ({ ...prev, sidebarSearchOpen: false }));
                  }} size="small">
                    <CircleX size={16} />
                  </IconButton>
                </InputAdornment>,
              },
            }}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            // onDoubleClick={() => {
            //   handleChange('')
            //   setSetting(prev => ({ ...prev, sidebarSearchOpen: false }));
            // }}
          />
        </>
      ) : (<>
        <GenericToggleButton
          variant="outlined"
          item={{
            value: sidebarTerm,
            tooltip: t('searchSectionsName'),
            icon: <Search size={16} />,
            onClick: () => setSetting(prev => ({ ...prev, sidebarSearchOpen: true })),
            selected: !!sidebarTerm,
          }}
        />
      </>)}
    </>
  );
}
