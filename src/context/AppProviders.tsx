import { AISinkProvider } from '@/context/aiSinkStore';
import { BYOKProvider } from '@/context/byokStore';
import { DescriptionsProvider } from '@/context/descriptionsStore';
import { FilterPresetProvider } from '@/context/filterPresetStore';
import { FilteredGpsPhotosProvider } from '@/context/globals/filteredGpsPhotosStore';
import { FilteredPhotosProvider } from '@/context/globals/filteredPhotosStore';
import { SectionsProvider } from '@/context/globals/sectionsStore';
import { SectionsProviderForced } from '@/context/globals/sectionsStoreForced';
import { UnfilteredPhotosProvider } from '@/context/globals/unfilteredPhotosStore';
import { LayoutProvider } from '@/context/layoutStore';
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
                  <LayoutProvider>
                    <FilterPresetProvider>
                      <PipelineProvider>
                        <AlbumPhotoCardProvider>
                          <UnfilteredPhotosProvider>
                            <FilteredPhotosProvider>
                              <FilteredGpsPhotosProvider>
                                <SectionsProvider>
                                  <SectionsProviderForced>
                                    {children}
                                  </SectionsProviderForced>
                                </SectionsProvider>
                              </FilteredGpsPhotosProvider>
                            </FilteredPhotosProvider>
                          </UnfilteredPhotosProvider>
                        </AlbumPhotoCardProvider>
                      </PipelineProvider>
                    </FilterPresetProvider>
                  </LayoutProvider>
                </SelectedProvider>
              </DescriptionsProvider>
            </AISinkProvider>
          </BYOKProvider>
        </NotificationsProvider>
      </ThemeContextProvider>
    </SettingsProvider>
  );
}
