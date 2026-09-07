import { useMemo } from 'react';

import { useSections_GLOBAL } from '@/context/globals/sectionsStore';

import { sectionIcons } from '@/icons/IconsIndex';

import { useSettingsStoreSelector } from '@/context/settingsStore';
import { SectionType } from '@/hooks/sections/sectionTypes';
import SidebarSectionItem from '@/middleware/interface/sidebar/SidebarSectionItem';

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

export default function SidebarListPermanent() {
  const sections = useSections_GLOBAL();
  const modules = useSettingsStoreSelector((s) => s.modules);

  const rows = useMemo<SidebarRow[]>(() => {
    const result: SidebarRow[] = [];

    for (const section of sections) {
      if (!excludedSections.includes(section.type)) continue;
      if (modules && !modules[section.type as keyof typeof modules]) continue;

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
  }, [sections, modules]);

  return <>
    {rows.map((row) => {
      const icon = sectionIcons[row.section.type];

      return (
        <SidebarSectionItem
          isInside={false}
          key={row.key}
          section={row.section}
          item={row.item}
          type={row.section.type}
          icon={icon}
        />
      );
    })}
  </>;
}
