import { ImageBackground, ImageSourcePropType, Text, View, ViewStyle } from "react-native";
import { AppIconBubble } from "../icons/AppIconBubble";
import type { AppIconName } from "../icons/icon.types";
import { ImageTokens } from "../theme/imageTokens";
import { styles, createImageBackgroundHeightStyle } from "./styles/HeroImagePanel.styles";
type HeroImagePanelProps = {
    image: ImageSourcePropType;
    title: string;
    subtitle: string;
    eyebrow?: string;
    icon?: AppIconName;
    height?: number;
    style?: ViewStyle;
};
export function HeroImagePanel({ image, title, subtitle, eyebrow, icon, height = ImageTokens.height.dashboardHero, style, }: HeroImagePanelProps) {
    return (<ImageBackground source={image} imageStyle={styles.image} style={[styles.container, createImageBackgroundHeightStyle(height), style]}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {icon ? <AppIconBubble name={icon} size={44} iconSize={22} color="#FFFFFF" backgroundColor="rgba(255,255,255,0.18)"/> : null}
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82}>{title}</Text>
          <Text style={styles.subtitle} numberOfLines={3}>{subtitle}</Text>
        </View>
      </View>
    </ImageBackground>);
}

