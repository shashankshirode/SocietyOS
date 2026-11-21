import React, { useState } from 'react';
import {
  Image,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ImageStyle,
  type ViewStyle,
  type DimensionValue,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SocietySkeleton } from '../loading/SocietySkeleton';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Radius } from '../../shared/theme/radius';
import { motionTokens } from '../../shared/theme/motion';
import { Ionicons } from '@expo/vector-icons';

export interface SocietyImageProps {
  readonly source: ImageSourcePropType;
  readonly width?: DimensionValue;
  readonly height?: DimensionValue;
  readonly aspectRatio?: number;
  readonly borderRadius?: number;
  readonly contentFit?: 'cover' | 'contain' | 'fill';
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly imageStyle?: StyleProp<ImageStyle>;
  readonly testID?: string;
}

export function SocietyImage({
  source,
  width = '100%',
  height,
  aspectRatio = 16 / 9,
  borderRadius = Radius.md,
  accessibilityLabel,
  style,
  imageStyle,
  testID,
}: SocietyImageProps) {
  const { semantic } = useAppTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const opacity = useSharedValue(0);

  const handleLoadEnd = () => {
    setHasLoaded(true);
    opacity.value = withTiming(1, { duration: motionTokens.duration.fast });
  };

  const handleError = () => {
    setHasError(true);
    setHasLoaded(true);
  };

  const animatedImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View
      testID={testID}
      style={[
        {
          width,
          height,
          aspectRatio: height ? undefined : aspectRatio,
          borderRadius,
          overflow: 'hidden',
          backgroundColor: semantic.surface.soft,
          position: 'relative',
        },
        style,
      ]}
    >
      {!hasLoaded ? (
        <SocietySkeleton
          width="100%"
          height="100%"
          borderRadius={borderRadius}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : null}

      {!hasError ? (
        <Animated.Image
          source={source}
          accessibilityLabel={accessibilityLabel}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          style={[
            {
              width: '100%',
              height: '100%',
              borderRadius,
            },
            animatedImageStyle,
            imageStyle,
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: semantic.surface.soft,
          }}
        >
          <Ionicons name="image-outline" size={28} color={semantic.text.muted} />
        </View>
      )}
    </View>
  );
}

export default SocietyImage;
