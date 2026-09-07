import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSidebar, useSidebarStoreSelector } from '@/context/sidebarStore';

import { sectionIcons } from '@/icons/IconsIndex';

import WebMCPDataRun from '@/components/WebMCPDataRun';
import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { SectionType } from '@/hooks/sections/sectionTypes';
import SidebarSectionHeader from '@/middleware/interface/sidebar/SidebarSectionHeader';
import SidebarSectionItem from '@/middleware/interface/sidebar/SidebarSectionItem';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

type Section = ReturnType<typeof useSections_GLOBAL>[number];

type SidebarRow =
  | {
      type: 'header';
      key: string;
      section: Section;
    }
  | {
      type: 'item';
      key: string;
      section: Section;
      item: Section['data'][number];
    };


const excludedSections = [ SectionType.Ignored, SectionType.Private, SectionType.Selected];
export default function SidebarList() {
  const sections = useSections_GLOBAL();
  const sidebarOpen = useSidebarStoreSelector((s) => s.sidebarOpen);
  const modules = useSettingsStoreSelector((s) => s.modules);
  const navigate = useNavigate();
  const { setSidebarOpen } = useSidebar()
  const location = useLocation();
  const { t } = useTranslation()

  const rows = useMemo<SidebarRow[]>(() => {
    const result: SidebarRow[] = [];

    for (const section of sections) {
      if (excludedSections.includes(section.type)) continue;
      if(modules && !modules[section.type as keyof typeof modules]) continue;

      result.push({
        type: 'header',
        key: `header-${section.type}`,
        section,
      });

      if (!sidebarOpen?.[section.type as keyof typeof sidebarOpen]) continue;

      for (const item of section.data) {
        result.push({
          type: 'item',
          key: `${section.type}-${item.name}`,
          section,
          item,
        });
      }
    }

    return result;
  }, [sections, sidebarOpen, modules]);


  const availableSections = useMemo(
    () => rows
      .filter(row => row.type === 'header')
      .map(row => row.section.type),
    [rows],
  );

  const availableSubSections = useMemo(
    () => rows
      .filter(row => row.type === 'item')
      .filter(row => String(location.pathname).includes(row.section.type))
      .map(row => row.item.name),
    [rows, location.pathname],
  );

  return <>
    <WebMCPDataRun
      name="navigate_sidebar_to_section"
      description="Navigate the sidebar to a specific section."
      inputSchema={{
        type: 'object',
        properties: {
          sectionType: {
            type: 'string',
            enum: availableSections,
            description: 'The type of the section to navigate to.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ sectionType }: { sectionType?: string }) => {
        const isOpen = sidebarOpen?.[sectionType as keyof typeof sidebarOpen] ?? false
        if(!isOpen) {
          setSidebarOpen(sectionType as keyof typeof sidebarOpen, true)
        }
        navigate('/selectedType/' + sectionType);
        return 'Sidebar navigated to section ' + sectionType;
      }}
      deps={[availableSections]}
    />

    <WebMCPDataRun
      name="navigate_sidebar_to_sub_section"
      description="Navigate the sidebar to a specific sub-section."
      inputSchema={{
        type: 'object',
        properties: {
          subSectionName: {
            type: 'string',
            enum: availableSubSections,
            description: 'The name of the sub-section to navigate to.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ subSectionName }: { subSectionName?: string }) => {
        navigate('/selectedPhotos/' + location.pathname.split('/')[2] + '/' + encodeURIComponent(subSectionName ?? ''));
        return 'Sidebar navigated to sub-section ' + subSectionName + ' in section ' + location.pathname.split('/')[2];
      }}
      deps={[location.pathname, availableSubSections]}
    />

    <WebMCPDataView
      name="check_current_navigation_state"
      description="Get current navigation state"
      execute={async () => ({
        content: [{
          type: 'text',
          text: `Current navigation state is ${JSON.stringify(sidebarOpen)}. Current location is ${location.pathname}.`
        }]
      })}
    />

    <Virtuoso
      data={rows}
      computeItemKey={(_, row) => row.key}
      itemContent={(_, row) => {
        const icon = sectionIcons[row.section.type];

        if (row.type === 'header') {
          return (
            <SidebarSectionHeader
              title={t(row.section.type)}
              icon={icon}
              data={row.section.data}
              type={row.section.type}
            />
          );
        }

        return (
          <SidebarSectionItem
            section={row.section}
            item={row.item}
            type={row.section.type}
            icon={icon}
          />
        );
      }}
    />
  </>;
}
