import type { ImageSourcePropType } from 'react-native';
import type { MessageKey } from '../../modules/resident/navigation/residentHeader.types';

export type AppImageSourceKind = 'local' | 'remoteMock' | 'remoteCdn';

export type AppImageUsage =
  | 'amenity'
  | 'marketplace'
  | 'emptyState'
  | 'document'
  | 'emergency'
  | 'weather'
  | 'onboarding'
  | 'notice'
  | 'billing';

export type AppImageAttribution = {
  provider: string;
  author?: string;
  license?: string;
  sourceUrl?: string;
};

export type AppImageAsset = {
  id: string;
  kind: AppImageSourceKind;
  uri?: string;
  localAssetName?: string;
  source?: ImageSourcePropType;
  altMessageKey: MessageKey;
  attribution?: AppImageAttribution;
  usage: AppImageUsage;
};

export type AppImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center';
