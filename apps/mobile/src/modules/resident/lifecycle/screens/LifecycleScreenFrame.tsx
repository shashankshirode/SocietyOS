import React from "react";
import { ScrollView, View } from "react-native";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/screens/LifecycleScreenFrame.styles";
export function LifecycleScreenFrame({ title, subtitle, children }: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    const { colors } = useAppTheme();
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ResidentPageHeader title={title} subtitle={subtitle} showBackButton variant="workflow"/>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <ContentFrame style={styles.content}>{children}</ContentFrame>
      </ScrollView>
    </View>);
}
export function LifecycleCard({ title, description, children }: {
    title: string;
    description?: string;
    children?: React.ReactNode;
}) {
    const { colors } = useAppTheme();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" color="primary">{title}</SafeText>
      {description ? <SafeText variant="caption" color="secondary">{description}</SafeText> : null}
      {children}
    </View>);
}

