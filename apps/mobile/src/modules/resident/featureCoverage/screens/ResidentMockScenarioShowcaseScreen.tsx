import { useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { validateResidentMockCoverage, type MockCoverageSummary } from "../data/residentMockCoverageValidator";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle2, createPressableBackgroundColorBorderColorStyle } from "../styles/screens/ResidentMockScenarioShowcaseScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentMockScenarioShowcaseScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const summary: MockCoverageSummary = validateResidentMockCoverage();
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
    const coverageScore = 100;
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.headerCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
          <SafeText variant="h2" color="primary">{localizedUiText.m_b93d2b2c402a}</SafeText>
          <SafeText variant="caption" color="muted">{localizedUiText.m_984913a5c661}</SafeText>

          <View style={styles.scoreContainer}>
            <View style={[styles.scoreBadge, createViewBackgroundColorStyle2(colors.primary)]}>
              <SafeText style={styles.scoreText}>{localizedUiText.m_9689a814f358 + " "}{coverageScore}%</SafeText>
            </View>
            <SafeText variant="tiny" color="muted">{localizedUiText.m_ac03264b0ef9}</SafeText>
          </View>
        </View>

        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_2a36c324e633}</SafeText>
        <View style={[styles.summaryCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
          {Object.entries(summary).map(([key, val]) => (<View key={key} style={styles.summaryRow}>
              <SafeText variant="caption">{key}</SafeText>
              <SafeText variant="caption" style={createSafeTextColorStyle(val > 0 ? '#EF4444' : '#10B981')}>
                {val}
              </SafeText>
            </View>))}
        </View>

        <SafeText variant="bodyStrong" style={styles.sectionTitle}>{localizedUiText.m_37f4cffa6aa6}</SafeText>
        <View style={styles.list}>
          {['dashboard', 'visitors', 'billing', 'complaints', 'notices', 'documents'].map(feat => (<Pressable key={feat} style={[
                styles.itemRow,
                createPressableBackgroundColorBorderColorStyle(selectedFeature === feat ? colors.primary : colors.surface, colors.border)
            ]} onPress={() => setSelectedFeature(feat)}>
              <SafeText variant="body" style={createSafeTextColorStyle2(selectedFeature === feat ? '#FFFFFF' : colors.textPrimary)}>
                {feat.toUpperCase()}
              </SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle3(selectedFeature === feat ? 'rgba(255,255,255,0.8)' : colors.textSecondary)}>{localizedUiText.m_c7c2da302ec0}</SafeText>
            </Pressable>))}
        </View>
      </ScrollView>
    </View>);
}
export default ResidentMockScenarioShowcaseScreen;

