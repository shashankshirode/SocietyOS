import React from 'react';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { useMessages } from '../../shared/constants/useMessages';
import { t } from '../../modules/resident/household/components/householdComponentUtils';
import { ImageWithFallback } from './ImageWithFallback';
import type { AppImageAsset, AppImageResizeMode } from './image.types';
import type Ionicons from '@expo/vector-icons/Ionicons';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
export interface AppImageProps {
    asset?: AppImageAsset;
    height: number;
    resizeMode?: AppImageResizeMode;
    imageStyle?: StyleProp<ImageStyle>;
    fallbackStyle?: StyleProp<ViewStyle>;
    fallbackIconName?: keyof typeof Ionicons.glyphMap;
}
export function AppImage({ asset, height, resizeMode = 'cover', imageStyle, fallbackStyle, fallbackIconName }: AppImageProps) {
    const messages = useMessages();
    const fallbackLabel = t(messages, 'resident.images.fallback');
    const accessibilityLabel = asset ? t(messages, asset.altMessageKey) : fallbackLabel;
    return (<ImageWithFallback {...includeWhenPresent("asset", asset)} accessibilityLabel={accessibilityLabel} height={height} resizeMode={resizeMode} {...includeWhenPresent("imageStyle", imageStyle)} {...includeWhenPresent("fallbackStyle", fallbackStyle)} {...includeWhenPresent("fallbackIconName", fallbackIconName)}/>);
}

