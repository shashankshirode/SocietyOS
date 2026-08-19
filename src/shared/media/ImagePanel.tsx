import { useState } from "react";
import { ImageBackground, View, ViewStyle } from "react-native";
import { SafeText } from "../components/SafeText";
import { AppIconBubble } from "../icons/AppIconBubble";
import type { AppIconName } from "../icons/icon.types";
import { ImageTokens } from "../theme/imageTokens";
import { useAppTheme } from "../theme/useAppTheme";
import { appVisuals, type AppVisualKey } from "./appVisuals";
import { GradientFallback } from "./GradientFallback";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createImageBackgroundHeightStyle } from "./styles/ImagePanel.styles";
type ImagePanelProps = {
    visual: AppVisualKey;
    title: string;
    subtitle?: string;
    icon?: AppIconName;
    height?: number;
    style?: ViewStyle;
};
export function ImagePanel({ visual, title, subtitle, icon, height = ImageTokens.height.dashboardHero, style }: ImagePanelProps) {
    const { colors, dark } = useAppTheme();
    const [hasImageError, setHasImageError] = useState(false);
    const config = appVisuals[visual];
    const content = (<View style={[styles.overlay, createViewBackgroundColorStyle(dark ? ImageTokens.overlay.strong : ImageTokens.overlay.medium)]}>
      {icon ? <AppIconBubble name={icon} size={44} iconSize={22} color={colors.white} backgroundColor={colors.primaryPressed}/> : null}
      <SafeText variant="h2" color="inverse" numberOfLines={2}>{title}</SafeText>
      {subtitle ? <SafeText variant="caption" color="inverse" numberOfLines={3}>{subtitle}</SafeText> : null}
    </View>);
    if (!config.image || hasImageError) {
        return <GradientFallback colors={config.gradient} height={height} {...includeWhenPresent("style", style)}>{content}</GradientFallback>;
    }
    return (<ImageBackground source={config.image} onError={() => setHasImageError(true)} imageStyle={styles.image} style={[styles.container, createImageBackgroundHeightStyle(height), style]}>
      {content}
    </ImageBackground>);
}

