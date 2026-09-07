import { BYOKProvider } from '@/context/byokStore';
import { NotificationsProvider } from '@/context/notificationsProvider';
import { SelectedProvider } from '@/context/selectedStore';
import React from 'react';
import { AlbumPhotoCardProvider } from './albumPhotoCardStore';
import { PipelineProvider } from './pipelineStore';
import { SettingsProvider } from './settingsStore';
import { ThemeContextProvider } from './ThemeContext';

type Props = { children: React.ReactNode };

export default function AppProviders({ children }: Props) {
  return (
    <SettingsProvider>
      <ThemeContextProvider>
        <NotificationsProvider>
          <BYOKProvider>
            <SelectedProvider>
              <PipelineProvider>
                <AlbumPhotoCardProvider>
                  {children}
                </AlbumPhotoCardProvider>
              </PipelineProvider>
            </SelectedProvider>
          </BYOKProvider>
        </NotificationsProvider>
      </ThemeContextProvider>
    </SettingsProvider>
  );
}
