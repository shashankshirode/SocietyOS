import type { ImageSourcePropType } from 'react-native';

export interface AuthenticationVisualAsset {
  id: string;
  uri: string;
  fallbackSource?: ImageSourcePropType;
  focalPointX: number;
  focalPointY: number;
  accessibilityLabel: string;
  appearance: 'light' | 'dark' | 'universal';
}

export const authAssets = {
  lobby: {
    id: 'lobby',
    uri: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    focalPointX: 50,
    focalPointY: 45,
    accessibilityLabel: 'Luxury residential building facade with warm lights',
    appearance: 'universal',
  },
  community: {
    id: 'community',
    uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    focalPointX: 50,
    focalPointY: 50,
    accessibilityLabel: 'Premium property landscaping and social area',
    appearance: 'universal',
  },
} as const;
