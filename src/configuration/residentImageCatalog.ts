import type { ImageSourcePropType } from 'react-native';

export type CatalogImage = {
  readonly uri?: string;
  readonly localSource?: ImageSourcePropType;
  readonly accessibilityLabel: string;
  readonly fallbackGradient?: readonly string[];
  readonly fallbackIcon?: string;
};

export const residentImageCatalog = {
  onboarding: {
    hero: {
      uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Society OS residential community entrance and towers',
      fallbackGradient: ['#0f2027', '#203a43', '#2c5364'],
      fallbackIcon: 'business-outline',
    },
  },
  facilities: {
    gym: {
      uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Premium community gym with modern workout equipment',
      fallbackGradient: ['#1e3c72', '#2a5298'],
      fallbackIcon: 'barbell-outline',
    },
    pool: {
      uri: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Vibrant outdoor swimming pool with clean blue water',
      fallbackGradient: ['#00c6ff', '#0072ff'],
      fallbackIcon: 'water-outline',
    },
    clubhouse: {
      uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Luxurious resident community clubhouse lounge',
      fallbackGradient: ['#3a7bd5', '#3a6073'],
      fallbackIcon: 'home-outline',
    },
    badminton: {
      uri: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Indoor professional badminton court',
      fallbackGradient: ['#11998e', '#38ef7d'],
      fallbackIcon: 'trophy-outline',
    },
    tennis: {
      uri: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4b1fa?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Outdoor synthetic tennis court',
      fallbackGradient: ['#134e5e', '#71b280'],
      fallbackIcon: 'tennisball-outline',
    },
  },
  community: {
    marketplace: {
      uri: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Resident marketplace shared items board',
      fallbackGradient: ['#ff9966', '#ff5e62'],
      fallbackIcon: 'cart-outline',
    },
    seniorCare: {
      uri: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Senior citizen care assistance group',
      fallbackGradient: ['#7f00ff', '#e100ff'],
      fallbackIcon: 'heart-outline',
    },
    childSafety: {
      uri: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=80',
      accessibilityLabel: 'Safe children playing area and monitoring zone',
      fallbackGradient: ['#ffc0cb', '#ff1493'],
      fallbackIcon: 'happy-outline',
    },
  },
} as const;
