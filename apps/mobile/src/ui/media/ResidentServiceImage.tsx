import React from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { AppImage } from './AppImage';
import type { AppImageAsset } from './image.types';

type ResidentServiceImageProps = {
  asset?: AppImageAsset;
  height: number;
  imageStyle?: StyleProp<ImageStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
};

export function ResidentServiceImage(props: ResidentServiceImageProps) {
  return <AppImage {...props} fallbackIconName="construct-outline" />;
}
