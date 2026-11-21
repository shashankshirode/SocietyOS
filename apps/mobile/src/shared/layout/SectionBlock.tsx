import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { AppText } from "../components/AppText";
import { Spacing } from "../theme/spacing";
import { styles, createViewGapStyle } from "./styles/SectionBlock.styles";
export interface SectionBlockProps {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function SectionBlock({ title, action, children, gap = Spacing.md, style, testID, }: SectionBlockProps) {
    return (<View testID={testID} style={[styles.container, style]}>
      <View style={styles.header}>
        <AppText variant="sectionTitle" tone="primary" style={styles.title}>
          {title}
        </AppText>
        {action && <View style={styles.action}>{action}</View>}
      </View>
      <View style={createViewGapStyle(gap)}>{children}</View>
    </View>);
}
export default SectionBlock;

