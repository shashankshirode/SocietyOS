import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Spacing } from "../theme/spacing";
import { useResponsiveLayout } from "./useResponsiveLayout";
import { createViewFlexDirectionGapStyle } from "./styles/ResponsiveStack.styles";
type ResponsiveStackProps = {
    children: React.ReactNode;
    gap?: number;
    smallPhoneDirection?: 'column' | 'row';
    direction?: 'column' | 'row';
    style?: StyleProp<ViewStyle>;
};
export function ResponsiveStack({ children, gap = Spacing.md, smallPhoneDirection = 'column', direction = 'row', style }: ResponsiveStackProps) {
    const { isSmallPhone } = useResponsiveLayout();
    return (<View style={[createViewFlexDirectionGapStyle(isSmallPhone ? smallPhoneDirection : direction, gap), style]}>
      {children}
    </View>);
}
export default ResponsiveStack;

