import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { ImageWithFallback } from '../ImageWithFallback';
import type { AppImageAsset } from '../image.types';

const imageAsset: AppImageAsset = {
  id: 'test-amenity',
  kind: 'remoteMock',
  uri: 'https://example.com/amenity.jpg',
  altMessageKey: 'resident.images.amenityPoolAlt',
  usage: 'amenity',
};

describe('ImageWithFallback', () => {
  it('renders an accessible image for available assets', async () => {
    const result = await renderWithProviders(
      <ImageWithFallback
        asset={imageAsset}
        accessibilityLabel="Resident amenity"
        height={180}
      />,
    );

    expect(result.getByLabelText('Resident amenity')).toBeTruthy();
  });

  it('shows an accessible fallback when the source is unavailable', async () => {
    const result = await renderWithProviders(
      <ImageWithFallback
        accessibilityLabel="Resident amenity"
        height={180}
      />,
    );

    expect(result.getByText('Resident amenity')).toBeTruthy();
  });
});
