import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View, ViewStyle, StyleProp, ImageStyle, DimensionValue } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Radius } from "../../shared/theme/radius";
import type { CatalogImage } from "../../configuration/residentImageCatalog";
import { styles, createViewBackgroundColorStyle, createViewWidthAspectRatioStyle } from "./styles/ResponsiveImage.styles";
type ResponsiveImageProps = {
    image: CatalogImage;
    style?: StyleProp<ImageStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    aspectRatio?: number;
    width?: number | string;
    height?: number | string;
};
export function ResponsiveImage({ image, style, containerStyle, aspectRatio = 16 / 9, width = '100%', height, }: ResponsiveImageProps) {
    const { colors } = useAppTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const resolvedSource = image.localSource || (image.uri ? { uri: image.uri } : null);
    const handleLoadStart = () => {
        setLoading(true);
        setError(false);
    };
    const handleLoadEnd = () => {
        setLoading(false);
    };
    const handleLoadError = () => {
        setLoading(false);
        setError(true);
    };
    const renderFallback = () => {
        const gradient = image.fallbackGradient || [colors.primarySoft, colors.border];
        const iconName = (image.fallbackIcon || 'image-outline') as React.ComponentProps<typeof Ionicons>['name'];
        return (<View style={[
                styles.fallbackContainer,
                createViewBackgroundColorStyle(gradient[0]),
                style as StyleProp<ViewStyle>,
            ]} accessibilityLabel={image.accessibilityLabel}>
        <Ionicons name={iconName} size={36} color={colors.textSecondary}/>
      </View>);
    };
    if (error || !resolvedSource) {
        return renderFallback();
    }
    const imageStyle: ImageStyle = {
        aspectRatio: aspectRatio,
        width: width as DimensionValue,
        height: height as DimensionValue,
        borderRadius: Radius.card,
    };
    return (<View style={[styles.container, createViewWidthAspectRatioStyle(width as DimensionValue, aspectRatio), containerStyle]}>
      <Image source={resolvedSource} style={[imageStyle, style]} onLoadStart={handleLoadStart} onLoadEnd={handleLoadEnd} onError={handleLoadError} accessibilityLabel={image.accessibilityLabel} resizeMode="cover"/>
      {loading && (<View style={[StyleSheet.absoluteFill, styles.spinnerContainer]}>
          <ActivityIndicator size="small" color={colors.primary}/>
        </View>)}
    </View>);
}
export default ResponsiveImage;

