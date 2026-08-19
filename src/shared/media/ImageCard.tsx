import { ImageBackground, ImageSourcePropType, Text, View, ViewStyle } from "react-native";
import { ImageTokens } from "../theme/imageTokens";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createImageBackgroundHeightBackgroundColorStyle } from "./styles/ImageCard.styles";
type ImageCardProps = {
    image: ImageSourcePropType;
    title: string;
    subtitle?: string;
    height?: number;
    style?: ViewStyle;
};
export function ImageCard({ image, title, subtitle, height = ImageTokens.height.cardImage, style }: ImageCardProps) {
    const { colors } = useAppTheme();
    return (<ImageBackground source={image} imageStyle={styles.image} style={[styles.container, createImageBackgroundHeightBackgroundColorStyle(height, colors.surfaceMuted), style]}>
      <View style={[styles.overlay, styles.viewBackgroundColor]}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
    </ImageBackground>);
}

