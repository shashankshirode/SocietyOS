import { residentAmenityImageById, residentModuleImageById } from '../residentImageUsageMap';
import { residentImageRegistry } from '../residentImageRegistry';

describe('residentImageRegistry', () => {
  it('keeps all resident images registered with accessibility and attribution metadata', () => {
    Object.values(residentImageRegistry).forEach((asset) => {
      expect(asset.altMessageKey.startsWith('resident.images.')).toBe(true);
      expect(asset.attribution?.provider).toBeTruthy();
      expect(asset.usage).toBeTruthy();
    });
  });

  it('maps dashboard amenity ids to known stock-image assets', () => {
    expect(residentAmenityImageById['amenity-1']).toBe(residentImageRegistry.amenityPool);
    expect(residentAmenityImageById['amenity-2']).toBe(residentImageRegistry.amenityClubhouse);
    expect(residentAmenityImageById['amenity-3']).toBe(residentImageRegistry.amenityCourt);
  });

  it('maps resident modules to reusable module image assets', () => {
    expect(residentModuleImageById.documents).toBe(residentImageRegistry.documentVault);
    expect(residentModuleImageById.marketplace).toBe(residentImageRegistry.marketplaceServices);
  });
});
