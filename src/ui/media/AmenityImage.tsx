import React from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { AppImage } from './AppImage';
import type { AppImageAsset } from './image.types';

type AmenityImageProps = {
  asset?: AppImageAsset;
  height: number;
  imageStyle?: StyleProp<ImageStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
};

export function AmenityImage(props: AmenityImageProps) {
  return <AppImage {...props} fallbackIconName="calendar-outline" />;
}
