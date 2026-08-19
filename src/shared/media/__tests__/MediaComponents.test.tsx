import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { HeroImagePanel } from '../HeroImagePanel';
import { IllustrationEmptyState } from '../IllustrationEmptyState';
import { ImageCard } from '../ImageCard';
import { appImages } from '../appImages';

describe('premium media components', () => {
  it('renders image-backed hero and image cards', async () => {
    const screen = await renderWithProviders(
      <>
        <HeroImagePanel image={appImages.residentHero} title="Resident dashboard" subtitle="Premium home view" icon="resident" />
        <ImageCard image={appImages.documents} title="Document vault" subtitle="Verified files" />
      </>
    );

    expect(screen.getByText('Resident dashboard')).toBeTruthy();
    expect(screen.getByText('Document vault')).toBeTruthy();
  });

  it('renders the illustrated empty state copy', async () => {
    const screen = await renderWithProviders(
      <IllustrationEmptyState title="No records" message="New items will appear here." icon="empty" />
    );

    expect(screen.getByText('No records')).toBeTruthy();
    expect(screen.getByText('New items will appear here.')).toBeTruthy();
  });
});
