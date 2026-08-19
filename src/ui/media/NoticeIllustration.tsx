import React from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { AppImage } from './AppImage';
import type { AppImageAsset } from './image.types';

type NoticeIllustrationProps = {
  asset?: AppImageAsset;
  height: number;
  imageStyle?: StyleProp<ImageStyle>;
  fallbackStyle?: StyleProp<ViewStyle>;
};

export function NoticeIllustration(props: NoticeIllustrationProps) {
  return <AppImage {...props} fallbackIconName="newspaper-outline" />;
}
