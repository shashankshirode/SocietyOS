import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResponsiveContainer } from "./ResponsiveContainer";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles } from "./styles/ScreenContainer.styles";
interface ScreenContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentStyle?: ViewStyle;
    edges?: ('top' | 'bottom' | 'left' | 'right')[];
}
export function ScreenContainer({ children, style, contentStyle, edges = [], }: ScreenContainerProps) {
    return (<SafeAreaView style={[styles.safeArea, style]} edges={edges}>
      <ResponsiveContainer {...includeWhenPresent("contentStyle", contentStyle)}>
        {children}
      </ResponsiveContainer>
    </SafeAreaView>);
}
export default ScreenContainer;

