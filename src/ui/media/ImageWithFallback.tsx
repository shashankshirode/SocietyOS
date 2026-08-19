import { useEffect, useState } from "react";
import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { getPlatformImageStyle } from "../../shared/platform/platformImage";
import type { AppImageAsset, AppImageResizeMode } from "./image.types";
import { ImageLoadingSkeleton } from "./imageLoadingSkeleton";
import { styles, createViewHeightBackgroundColorStyle, createViewHeightStyle, createImageHeightStyle } from "./styles/ImageWithFallback.styles";
export interface ImageWithFallbackProps {
    asset?: AppImageAsset;
    accessibilityLabel: string;
    height: number;
    resizeMode?: AppImageResizeMode;
    imageStyle?: StyleProp<ImageStyle>;
    fallbackStyle?: StyleProp<ViewStyle>;
    fallbackIconName?: keyof typeof Ionicons.glyphMap;
}
function resolveSource(asset?: AppImageAsset) {
    if (!asset) {
        return undefined;
    }
    return asset.source ?? (asset.uri ? { uri: asset.uri } : undefined);
}
export function ImageWithFallback({ asset, accessibilityLabel, height, resizeMode = 'cover', imageStyle, fallbackStyle, fallbackIconName = 'image-outline', }: ImageWithFallbackProps) {
    const { colors } = useAppTheme();
    const [failed, setFailed] = useState(false);
    const [loading, setLoading] = useState(Boolean(asset));
    const source = failed ? undefined : resolveSource(asset);
    useEffect(() => {
        setFailed(false);
        setLoading(Boolean(resolveSource(asset)));
    }, [asset]);
    if (!source) {
        return (<View style={[styles.fallback, createViewHeightBackgroundColorStyle(height, colors.surfaceSoft), fallbackStyle]} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
        <Ionicons name={fallbackIconName} size={24} color={colors.textMuted}/>
        <SafeText variant="tiny" color="muted" numberOfLines={1}>
          {accessibilityLabel}
        </SafeText>
      </View>);
    }
    return (<View style={[styles.wrapper, createViewHeightStyle(height)]}>
      {loading ? (<View style={styles.loading} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <ImageLoadingSkeleton height={height}/>
        </View>) : null}
      <Image source={source} accessibilityRole="image" accessibilityLabel={accessibilityLabel} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} onError={() => {
            setLoading(false);
            setFailed(true);
        }} style={[styles.image, createImageHeightStyle(height), getPlatformImageStyle(resizeMode), imageStyle]}/>
    </View>);
}

