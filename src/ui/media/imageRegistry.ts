import type { AppImageAsset } from './image.types';

export const appImageRegistry = {
  emptySetup: {
    id: 'emptySetup',
    kind: 'remoteMock',
    uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    altMessageKey: 'resident.images.emptyStateAlt',
    attribution: {
      provider: 'Unsplash',
      license: 'Unsplash License',
      sourceUrl: 'https://unsplash.com/photos/1497366754035-f200968a6e72',
    },
    usage: 'emptyState',
  },
  documentVault: {
    id: 'documentVault',
    kind: 'remoteMock',
    uri: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
    altMessageKey: 'resident.images.documentVaultAlt',
    attribution: {
      provider: 'Unsplash',
      license: 'Unsplash License',
      sourceUrl: 'https://unsplash.com/photos/1450101499163-c8848c66ca85',
    },
    usage: 'document',
  },
} satisfies Record<string, AppImageAsset>;

export type AppImageId = keyof typeof appImageRegistry;

export function getAppImageAsset(id: AppImageId): AppImageAsset {
  return appImageRegistry[id];
}
