import type { AppImageUsage } from './image.types';

export const imageAspectRatioByUsage: Record<AppImageUsage, number> = {
  amenity: 16 / 10,
  marketplace: 4 / 3,
  emptyState: 1,
  document: 4 / 3,
  emergency: 4 / 3,
  weather: 16 / 9,
  onboarding: 4 / 3,
  notice: 16 / 9,
  billing: 1,
};

export function getImageAspectRatio(usage: AppImageUsage): number {
  return imageAspectRatioByUsage[usage];
}
