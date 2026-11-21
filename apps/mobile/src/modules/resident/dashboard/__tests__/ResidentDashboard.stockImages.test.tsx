import { residentAmenityImageById } from '../../media/residentImageUsageMap';
import { residentImageRegistry } from '../../media/residentImageRegistry';

describe('Resident dashboard stock image wiring', () => {
  it('uses reusable registry assets for dashboard amenity cards', () => {
    expect(residentAmenityImageById).toEqual({
      'amenity-1': residentImageRegistry.amenityPool,
      'amenity-2': residentImageRegistry.amenityClubhouse,
      'amenity-3': residentImageRegistry.amenityCourt,
    });
  });
});
