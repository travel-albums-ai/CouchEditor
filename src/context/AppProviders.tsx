import { AdjustmentsProvider } from '@/context/adjustmentsStore';
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
import { SidebarProvider } from '@/context/sidebarStore';
import { TagsProvider } from '@/context/tagsStore';
import React from 'react';
import { AlbumPhotoCardProvider } from './albumPhotoCardStore';
import { FavoritesProvider } from './favoritesStore';
import { FilterProvider } from './filterStore';
import { IgnoredProvider } from './ignoredStore';
import { LabelsProvider } from './labelsStore';
import { PinnedProvider } from './pinnedStore';
import { PipelineProvider } from './pipelineStore';
import { PrivateProvider } from './privateStore';
import { SettingsProvider } from './settingsStore';
import { ThemeContextProvider } from './ThemeContext';

type Props = { children: React.ReactNode };

export default function AppProviders({ children }: Props) {
  return (
    <SettingsProvider>
      <ThemeContextProvider>
        <NotificationsProvider>
          <TagsProvider>
            <BYOKProvider>
              <AISinkProvider>
                <DescriptionsProvider>
                  <SidebarProvider>
                    <FavoritesProvider>
                      <PinnedProvider>
                        <SelectedProvider>
                          <LabelsProvider>
                            <IgnoredProvider>
                              <LayoutProvider>
                                <PrivateProvider>
                                  <FilterPresetProvider>
                                    <PipelineProvider>
                                      <FilterProvider>
                                        <AlbumPhotoCardProvider>
                                          <AdjustmentsProvider>
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
                                          </AdjustmentsProvider>
                                        </AlbumPhotoCardProvider>
                                      </FilterProvider>
                                    </PipelineProvider>
                                  </FilterPresetProvider>
                                </PrivateProvider>
                              </LayoutProvider>
                            </IgnoredProvider>
                          </LabelsProvider>
                        </SelectedProvider>
                      </PinnedProvider>
                    </FavoritesProvider>
                  </SidebarProvider>
                </DescriptionsProvider>
              </AISinkProvider>
            </BYOKProvider>
          </TagsProvider>
        </NotificationsProvider>
      </ThemeContextProvider>
    </SettingsProvider>
  );
}
