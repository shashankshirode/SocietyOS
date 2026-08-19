import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { SafeText } from "../typography/SafeText";
import { styles, createViewGapStyle } from "./styles/SafeTextRow.styles";
export interface SafeTextRowProps {
    title?: string;
    subtitle?: string;
    left?: React.ReactNode;
    right?: React.ReactNode;
    children?: React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
}
export function SafeTextRow({ title, subtitle, left, right, children, gap = 8, style, }: SafeTextRowProps) {
    return (<View style={[styles.row, createViewGapStyle(gap), style]}>
      {left}
      {children ? (children) : (<View style={styles.textContainer}>
          {title ? (<SafeText variant="bodyStrong" color="primary" numberOfLines={1}>
              {title}
            </SafeText>) : null}
          {subtitle ? (<SafeText variant="caption" color="secondary" numberOfLines={1}>
              {subtitle}
            </SafeText>) : null}
        </View>)}
      {right}
    </View>);
}

