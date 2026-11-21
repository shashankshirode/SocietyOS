import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { AppImage } from '../AppImage';
import { residentImageRegistry } from '../../../modules/resident/media/residentImageRegistry';

describe('AppImage', () => {
  it('uses message-backed accessibility copy for resident image assets', async () => {
    const result = await renderWithProviders(
      <AppImage asset={residentImageRegistry.amenityPool} height={180} />,
    );

    expect(result.getByLabelText('Calm swimming pool amenity visual')).toBeTruthy();
  });

  it('uses the shared fallback message when an asset is missing', async () => {
    const result = await renderWithProviders(<AppImage height={180} />);

    expect(result.getByLabelText('Image unavailable')).toBeTruthy();
  });
});
