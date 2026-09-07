import { AISinkProvider } from '@/context/aiSinkStore';
import { BYOKProvider } from '@/context/byokStore';
import { DescriptionsProvider } from '@/context/descriptionsStore';
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
            <AISinkProvider>
              <DescriptionsProvider>
                <SelectedProvider>
                  <PipelineProvider>
                    <AlbumPhotoCardProvider>
                      {children}
                    </AlbumPhotoCardProvider>
                  </PipelineProvider>
                </SelectedProvider>
              </DescriptionsProvider>
            </AISinkProvider>
          </BYOKProvider>
        </NotificationsProvider>
      </ThemeContextProvider>
    </SettingsProvider>
  );
}
