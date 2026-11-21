import React from "react";
import { View } from "react-native";
import { SurfaceCard } from "./SurfaceCard";
import { SafeText } from "./SafeText";
import { styles } from "./styles/FormSectionPanel.styles";
type FormSectionPanelProps = {
    title: string;
    description?: string;
    errorSummary?: string;
    stepLabel?: string;
    children: React.ReactNode;
};
export function FormSectionPanel({ title, description, errorSummary, stepLabel, children }: FormSectionPanelProps) {
    return (<SurfaceCard variant="elevated">
      <View style={styles.header}>
        {stepLabel ? <SafeText variant="tiny" color="info">{stepLabel}</SafeText> : null}
        <SafeText variant="title">{title}</SafeText>
        {description ? <SafeText variant="caption" color="secondary">{description}</SafeText> : null}
        {errorSummary ? <SafeText variant="caption" color="danger">{errorSummary}</SafeText> : null}
      </View>
      {children}
    </SurfaceCard>);
}

