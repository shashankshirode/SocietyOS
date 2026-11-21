import React from "react";
import { View } from "react-native";
import { SafeText } from "../../../shared/components/SafeText";
import { AppCard } from "../../../shared/cards/AppCard";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2 } from "../styles/components/SettingsSection.styles";
export type SettingsSectionProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
    testID?: string;
};
export function SettingsSection({ title, description, children, testID, }: SettingsSectionProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container} testID={testID}>
      <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle(colors.textPrimary)]}>
        {title}
      </SafeText>
      {description ? (<SafeText variant="caption" style={[styles.sectionDesc, createSafeTextColorStyle2(colors.textSecondary)]}>
          {description}
        </SafeText>) : null}
      <AppCard padding="none" style={styles.card}>
        <View style={styles.cardContent}>
          {children}
        </View>
      </AppCard>
    </View>);
}
export default SettingsSection;

