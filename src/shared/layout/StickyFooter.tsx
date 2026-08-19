import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createSafeAreaViewBackgroundColorBorderTopColorStyle } from "./styles/StickyFooter.styles";
type StickyFooterProps = {
    children: React.ReactNode;
};
export function StickyFooter({ children }: StickyFooterProps) {
    const { colors } = useAppTheme();
    return (<SafeAreaView edges={['bottom']} style={[styles.safe, createSafeAreaViewBackgroundColorBorderTopColorStyle(colors.surface, colors.border)]}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>);
}

