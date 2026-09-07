import WebMCPDataView from '@/components/WebMCPDataView';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { usePinned, usePinnedStoreSelector } from '@/context/pinnedStore';
import { sectionIcons } from '@/icons/IconsIndex';
import SidebarCoreButton from '@/middleware/interface/sidebar/SidebarCoreButton';
import {
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { PinOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

export default function SidebarPins() {
  const sections = useSections_GLOBAL()
  const location = useLocation();
  const { remove } = usePinned()
  const pins = usePinnedStoreSelector(s => s.pins)
  const { t } = useTranslation();

  const withPins = pins.length > 0
    ? sections
      .filter(section => section?.data?.length > 0)
      .filter(section => section?.data !== undefined)
    : sections

  const filteredPins = withPins?.flatMap(section => section?.data?.filter(d => pins?.some(p => p.type_name === section.type && p.id === d.name))
    .map(d => ({
      section,
      data: d,
    }))) || []

  return <>
    <WebMCPDataView
      name="check_current_pins_state"
      description="Get current pins state"
      execute={async () => ({
        content: [{
          type: 'text',
          text: `Current pins state is ${JSON.stringify(pins)}.`
        }]
      })}
    />

    {pins.length > 0 && filteredPins.length > 0 && <Divider sx={{ my: 0.5 }} />}
    {filteredPins.length > 0 &&
        filteredPins?.map((item) => {
          const section = item?.section;
          const d = item?.data;

          if (!section?.type || !d?.name) return null;

          return (
            <Box
              key={`${section.type}-${d.name}`}
              component={NavLink}
              to={`/selectedPhotos/${section.type}/${encodeURIComponent(d.name)}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                gap: 0.25,
              }}
            >
              <SidebarCoreButton
                title={d.name}
                typographySx={{ opacity: 0.5 }}
                icon={sectionIcons?.[section.type]}
                isActive={
                  decodeURIComponent(location.pathname) ===
                  `/selectedPhotos/${section.type}/${d.name}`
                }
                count={d.photos?.length ?? 0}
              />

              <Tooltip title={t('unpinTooltip')} arrow placement="right">
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();

                    remove({
                      type_name: section.type,
                      id: d.name,
                    });
                  }}
                  size="small"
                  sx={{ opacity: 0.8, p: 0.5, ml: 0.5 }}
                >
                  <PinOff size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          );
        })}
    {pins.length > 0 && filteredPins.length > 0 && <Divider sx={{ my: 0.5 }} />}
  </>
}
