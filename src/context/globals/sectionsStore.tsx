/* eslint-disable react-refresh/only-export-components */
import { Section, useTransform_AllSections } from '@/hooks/sections/useTransform_AllSections';
import { createContext, useContext, type ReactNode } from 'react';

const SectionsContext = createContext<Section[]>([]);

export function SectionsProvider({ children }: { children: ReactNode }) {
  const sections = useTransform_AllSections();

  return (
    <SectionsContext.Provider value={sections}>
      {children}
    </SectionsContext.Provider>
  );
}

export const useSections_GLOBAL = () => useContext(SectionsContext);
