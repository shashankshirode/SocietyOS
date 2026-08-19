import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { AmenityBookingCarousel } from '../AmenityBookingCarousel';
import { residentDashboardMockData } from '../../../modules/resident/dashboard/data/dashboard.mockData';
import { residentAmenityImageById } from '../../../modules/resident/media/residentImageUsageMap';

const noop = () => undefined;

describe('AmenityBookingCarousel stock images', () => {
  it('renders mapped amenity images with message-backed accessibility labels', async () => {
    const result = await renderWithProviders(
      <AmenityBookingCarousel
        amenities={residentDashboardMockData.amenities.slice(0, 3)}
        onAmenityPress={noop}
        onBookPress={noop}
        imageAssetsByAmenityId={residentAmenityImageById}
      />,
    );

    expect(result.getByLabelText('Calm swimming pool amenity visual')).toBeTruthy();
    expect(result.getByLabelText('Clubhouse lounge amenity visual')).toBeTruthy();
    expect(result.getByLabelText('Sports court booking visual')).toBeTruthy();
  });
});
