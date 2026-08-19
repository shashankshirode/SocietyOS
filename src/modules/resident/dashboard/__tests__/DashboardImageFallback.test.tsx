import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ImageWithFallback } from '../../../../ui/media/ImageWithFallback';
import { residentImageRegistry } from '../../media/residentImageRegistry';

describe('Dashboard image fallbacks', () => {
  it('replaces a failed remote image with an accessible stable fallback', async () => {
    const rendered = await renderWithProviders(
      <ImageWithFallback
        asset={residentImageRegistry.amenityPool}
        accessibilityLabel="Swimming pool amenity"
        height={180}
      />,
    );
    const image = rendered.getByLabelText('Swimming pool amenity');
    fireEvent(image, 'error');
    expect(await rendered.findByText('Swimming pool amenity')).toBeTruthy();
  });

  it('keeps imagery relevant and distinct across unrelated amenities', () => {
    const assets = [
      residentImageRegistry.amenityPool,
      residentImageRegistry.amenityGym,
      residentImageRegistry.amenityTennis,
      residentImageRegistry.amenityClubhouse,
    ];
    expect(new Set(assets.map((asset) => asset.uri)).size).toBe(assets.length);
    assets.forEach((asset) => {
      expect(asset.usage).toBe('amenity');
      expect(asset.attribution?.license).toBe('Unsplash License');
    });
  });
});
