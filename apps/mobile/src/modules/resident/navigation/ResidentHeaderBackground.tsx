import { StyleSheet, View } from "react-native";
import type { ResidentHeaderResolvedTheme } from "./residentHeader.types";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3 } from "./styles/ResidentHeaderBackground.styles";
export type ResidentHeaderBackgroundProps = {
    theme: ResidentHeaderResolvedTheme;
};
export function ResidentHeaderBackground({ theme }: ResidentHeaderBackgroundProps) {
    const [startColor, endColor] = theme.backgroundColors;
    return (<View style={[StyleSheet.absoluteFill, styles.background, createViewBackgroundColorStyle2(startColor)]}>
      <View style={[styles.endLayer, createViewBackgroundColorStyle3(endColor)]}/>
      <View style={[styles.accentLayer, createViewBackgroundColorStyle(theme.accentColor)]}/>
    </View>);
}

