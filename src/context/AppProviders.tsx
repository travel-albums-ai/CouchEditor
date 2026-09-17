import { BYOKProvider } from '@/context/byokStore';
import React from 'react';
import { PipelineProvider } from './pipelineStore';
import { SettingsProvider } from './settingsStore';
import { ThemeContextProvider } from './ThemeContext';

type Props = { children: React.ReactNode };

export default function AppProviders({ children }: Props) {
  return (
    <SettingsProvider>
      <ThemeContextProvider>
        <BYOKProvider>
          <PipelineProvider>
            {children}
          </PipelineProvider>
        </BYOKProvider>
      </ThemeContextProvider>
    </SettingsProvider>
  );
}
