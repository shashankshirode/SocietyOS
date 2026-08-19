import type { ImageSourcePropType } from 'react-native';

export type AppImageKey =
  | 'residentHero'
  | 'guardHero'
  | 'adminHero'
  | 'treasurerHero'
  | 'facilityHero'
  | 'superAdminHero'
  | 'emptyState'
  | 'documents'
  | 'community';

export const appImages: Record<AppImageKey, ImageSourcePropType> = {
  residentHero: { uri: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80' },
  guardHero: { uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  adminHero: { uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  treasurerHero: { uri: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80' },
  facilityHero: { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80' },
  superAdminHero: { uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  emptyState: { uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80' },
  documents: { uri: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80' },
  community: { uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80' },
};

export function getAppImage(key: AppImageKey): ImageSourcePropType {
  return appImages[key];
}
