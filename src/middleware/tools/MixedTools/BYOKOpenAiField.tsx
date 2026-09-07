import GenericToggleButton from '@/components/generics/GenericToggleButton';
import { useBYOK, useBYOKStoreSelector } from '@/context/byokStore';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Key, PanelLeftClose } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BYOKOpenAiField() {
  const { setSetting } = useBYOK();
  const { byokOpenAIKey } = useBYOKStoreSelector((state) => state);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(byokOpenAIKey ?? '');

  const commit = (value: string) => {
    setSetting(prev => ({
      ...prev,
      byokOpenAIKey: value,
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
    setSearchTerm(byokOpenAIKey ?? '');
  }, [byokOpenAIKey]);

  return (
    <>
      {(open) ? (
        <>
          <TextField
            placeholder={t('googleVisionApiKeyPlaceholder')}
            variant="outlined"
            size="small"
            autoFocus
            type="password"
            value={searchTerm}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">
                  <Key size={16} />
                </InputAdornment>,
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => {
                    setOpen(false)
                  }} size="small">
                    <PanelLeftClose size={16} />
                  </IconButton>
                </InputAdornment>,
              },
            }}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </>
      ) : (<>
        <GenericToggleButton
          variant="outlined"
          item={{
            value: byokOpenAIKey,
            tooltip: t('byokGoogleVisionTooltip'),
            icon: <Key size={16} />,
            onClick: () => {
              setOpen(true)
            },
            selected: !!byokOpenAIKey,
          }}
        />
      </>)}
    </>
  );
}
