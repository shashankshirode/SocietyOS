import type { AppImageAsset } from '../../../ui/media';
import { getResidentImageAsset } from './residentImageRegistry';

export const residentAmenityImageById: Record<string, AppImageAsset> = {
  'amenity-1': getResidentImageAsset('amenityPool'),
  'amenity-2': getResidentImageAsset('amenityClubhouse'),
  'amenity-3': getResidentImageAsset('amenityCourt'),
};

export const residentAmenityImageByName: Record<string, AppImageAsset> = {
  'swimming pool': getResidentImageAsset('amenityPool'),
  clubhouse: getResidentImageAsset('amenityClubhouse'),
  'badminton court': getResidentImageAsset('amenityCourt'),
  gym: getResidentImageAsset('amenityGym'),
  'tennis court': getResidentImageAsset('amenityTennis'),
  'indoor games room': getResidentImageAsset('amenityIndoorGames'),
  'skating area': getResidentImageAsset('amenitySkating'),
  'multipurpose hall': getResidentImageAsset('amenityHall'),
  'guest room': getResidentImageAsset('amenityGuestRoom'),
  'children’s play area': getResidentImageAsset('amenityPlayArea'),
};

export const residentModuleImageById: Record<string, AppImageAsset> = {
  documents: getResidentImageAsset('documentVault'),
  marketplace: getResidentImageAsset('marketplaceServices'),
};
