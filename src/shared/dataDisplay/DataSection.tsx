import React from "react";
import { Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/DataSection.styles";
interface DataSectionProps {
    title: string;
    children: React.ReactNode;
}
export function DataSection({ title, children }: DataSectionProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <Text style={[styles.title, createTextColorStyle(colors.textSecondary)]}>{title}</Text>
      <View style={[styles.content, createViewBackgroundColorBorderColorStyle(colors.card, colors.border)]}>
        {children}
      </View>
    </View>);
}

