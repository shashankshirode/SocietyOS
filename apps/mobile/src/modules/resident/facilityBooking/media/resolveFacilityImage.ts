import type { CatalogImage } from '../../../../configuration/residentImageCatalog';
import { residentImageCatalog } from '../../../../configuration/residentImageCatalog';
import type { Facility } from '../models/facilityBooking.models';

const fallbackImage: CatalogImage = {
  accessibilityLabel: 'Society facility illustration',
  fallbackGradient: ['#0F766E', '#164E63'],
  fallbackIcon: 'business-outline',
};

export function resolveFacilityImage(facility: Facility): CatalogImage {
  return facility.images.find((image) => image.isPrimary) ?? facility.images[0] ?? fallbackImage;
}

export function resolveFacilityBookingImage(facilityId: string): CatalogImage {
  if (facilityId.includes('badminton')) return residentImageCatalog.facilities.badminton;
  if (facilityId.includes('tennis')) return residentImageCatalog.facilities.tennis;
  if (facilityId.includes('gym') || facilityId.includes('yoga')) return residentImageCatalog.facilities.gym;
  if (facilityId.includes('pool')) return residentImageCatalog.facilities.pool;
  return residentImageCatalog.facilities.clubhouse;
}
