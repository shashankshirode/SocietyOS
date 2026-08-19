import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { styles, createViewGapStyle } from "./styles/SafeTextRow.styles";
export interface SafeTextRowProps {
    children: React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function SafeTextRow({ children, gap = 8, style, testID }: SafeTextRowProps) {
    return (<View style={[styles.row, createViewGapStyle(gap), style]} testID={testID}>
      {children}
    </View>);
}

