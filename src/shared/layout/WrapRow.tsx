import React from "react";
import { View, ViewProps } from "react-native";
import { styles, createViewGapStyle } from "./styles/WrapRow.styles";
export type WrapRowProps = ViewProps & {
    children: React.ReactNode;
    gap?: number;
};
export function WrapRow({ children, gap = 8, style, ...props }: WrapRowProps) {
    return (<View style={[styles.row, createViewGapStyle(gap), style]} {...props}>
      {children}
    </View>);
}

