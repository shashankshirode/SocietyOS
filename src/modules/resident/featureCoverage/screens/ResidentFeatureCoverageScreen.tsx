import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { Spacing } from "../../../../shared/theme/spacing";
import { residentFeatureRegistry } from "../data/residentFeatureRegistry";
import { useResidentFeatureCoverage } from "../hooks/useResidentFeatureCoverage";
import type { ResidentFeatureRegistryItem, ResidentFeatureStatus } from "../data/residentFeatureRegistry.types";
import { styles, createFlatListPaddingTopPaddingBottomStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createTextColorStyle, createViewBackgroundColorStyle3, createTextColorStyle2, createTextColorStyle3, createViewBackgroundColorStyle4, createTextColorStyle4, createViewBackgroundColorStyle5, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createTextColorStyle8, createTextColorStyle9, createTextColorStyle10, createTextColorStyle11, createTextColorStyle12, createTextColorStyle13, createTextColorStyle14, createTextColorStyle15, createTextColorStyle16, createTextColorStyle17, createTextColorStyle18, createTextColorStyle19, createTextColorStyle20, createTextColorStyle21, createTextColorStyle22, createTextColorStyle23, createTextColorStyle24, createTextColorStyle25, createTextColorStyle26, createTextColorStyle27, createTextColorStyle28, createTextColorStyle29, createTextColorStyle30, createViewBackgroundColorStyle6, createViewWidthBackgroundColorStyle, createTextColorStyle31 } from "../styles/screens/ResidentFeatureCoverageScreen.styles";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
const STATUS_COLORS: Record<ResidentFeatureStatus, string> = {
    implemented: '#22C55E',
    partial: '#F59E0B',
    missing: '#EF4444',
    get notResidentScope() {
        return getActiveUiLiteral("m_7d1217217b38");
    },
    get frontendReadyBackendRequired() {
        return getActiveUiLiteral("m_a2f6f887f294");
    },
    get frontendReadyIntegrationRequired() {
        return getActiveUiLiteral("m_7fcf0b0dd8a9");
    },
};
const STATUS_LABELS: Record<ResidentFeatureStatus, string> = {
    implemented: 'Implemented',
    partial: 'Partial',
    missing: 'Missing',
    get notResidentScope() {
        return getActiveUiLiteral("m_7687e64fef21");
    },
    get frontendReadyBackendRequired() {
        return getActiveUiLiteral("m_48c68a29a6c1");
    },
    get frontendReadyIntegrationRequired() {
        return getActiveUiLiteral("m_cea236bc4665");
    },
};
function FeatureRow({ item }: {
    item: ResidentFeatureRegistryItem;
}) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const statusColor = STATUS_COLORS[item.status];
    return (<View style={[styles.featureCard, createViewBackgroundColorStyle(colors.surface)]}>
      <View style={styles.featureHeader}>
        <View style={[styles.statusDot, createViewBackgroundColorStyle2(statusColor)]}/>
        <Text style={[styles.featureName, createTextColorStyle(colors.textPrimary)]} numberOfLines={1}>
          {item.titleMessageKey}
        </Text>
        <View style={[styles.statusBadge, createViewBackgroundColorStyle3(statusColor + '20')]}>
          <Text style={[styles.statusText, createTextColorStyle2(statusColor)]}>
            {STATUS_LABELS[item.status]}
          </Text>
        </View>
      </View>
      <View style={styles.featureMeta}>
        <Text style={[styles.metaText, createTextColorStyle3(colors.textMuted)]}>
          {item.routeNames.join(', ')}
        </Text>
      </View>
    </View>);
}
export function ResidentFeatureCoverageScreen() {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const coverage = useResidentFeatureCoverage();
    const insets = useSafeAreaInsets();
    return (<View style={[styles.container, createViewBackgroundColorStyle4(colors.background)]}>
      <FlatList data={residentFeatureRegistry} keyExtractor={(item) => item.id} contentContainerStyle={createFlatListPaddingTopPaddingBottomStyle(insets.top + Spacing.lg, insets.bottom + Spacing.lg)} ListHeaderComponent={<View style={styles.headerSection}>
            <Text style={[styles.title, createTextColorStyle4(colors.textPrimary)]}>
              {messages.resident.dashboard.featureCoverage}
            </Text>

            
            <View style={[styles.statsCard, createViewBackgroundColorStyle5(colors.surface)]}>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_4b294a4b6620}</Text>
                <Text style={[styles.statValue, createTextColorStyle6(colors.textPrimary)]}>
                  {coverage.total}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle7(colors.textSecondary)]}>{localizedUiText.m_bf546638ee72}</Text>
                <Text style={[styles.statValue, createTextColorStyle8(STATUS_COLORS.implemented)]}>
                  {coverage.implemented}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle9(colors.textSecondary)]}>{localizedUiText.m_a4d50fb85403}</Text>
                <Text style={[styles.statValue, createTextColorStyle10(STATUS_COLORS.partial)]}>
                  {coverage.partial}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle11(colors.textSecondary)]}>{localizedUiText.m_a4c1e914d237}</Text>
                <Text style={[styles.statValue, createTextColorStyle12(STATUS_COLORS.frontendReadyBackendRequired)]}>
                  {coverage.frontendReadyBackendRequired}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle13(colors.textSecondary)]}>{localizedUiText.m_115a8b15ca39}</Text>
                <Text style={[styles.statValue, createTextColorStyle14(STATUS_COLORS.frontendReadyIntegrationRequired)]}>
                  {coverage.frontendReadyIntegrationRequired}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle15(colors.textSecondary)]}>{localizedUiText.m_7687e64fef21}</Text>
                <Text style={[styles.statValue, createTextColorStyle16(STATUS_COLORS.notResidentScope)]}>
                  {coverage.notResidentScope}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle17(colors.textSecondary)]}>{localizedUiText.m_6be36ca49ee8}</Text>
                <Text style={[styles.statValue, createTextColorStyle18(STATUS_COLORS.missing)]}>
                  {coverage.missing}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle19(colors.textSecondary)]}>{localizedUiText.m_038a89491b69}</Text>
                <Text style={[styles.statValue, createTextColorStyle20(colors.textPrimary)]}>{coverage.missingRoutes.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle21(colors.textSecondary)]}>{localizedUiText.m_d44d13e5ed87}</Text>
                <Text style={[styles.statValue, createTextColorStyle22(colors.textPrimary)]}>{coverage.missingScreens.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle23(colors.textSecondary)]}>{localizedUiText.m_411149fc683e}</Text>
                <Text style={[styles.statValue, createTextColorStyle24(colors.textPrimary)]}>{coverage.missingActions.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle25(colors.textSecondary)]}>{localizedUiText.m_f6cc1bf1b0e0}</Text>
                <Text style={[styles.statValue, createTextColorStyle26(colors.textPrimary)]}>{coverage.missingMessages.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle27(colors.textSecondary)]}>{localizedUiText.m_1fb775fdf8b2}</Text>
                <Text style={[styles.statValue, createTextColorStyle28(colors.textPrimary)]}>{coverage.missingLoadingStates.length}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, createTextColorStyle29(colors.textSecondary)]}>{localizedUiText.m_9abf7cf1d8ad}</Text>
                <Text style={[styles.statValue, createTextColorStyle30(colors.textPrimary)]}>{coverage.missingTests.length}</Text>
              </View>

              
              <View style={[styles.progressBar, createViewBackgroundColorStyle6(colors.surfaceMuted)]}>
                <View style={[
                styles.progressFill,
                createViewWidthBackgroundColorStyle(`${coverage.percentage}%`, coverage.percentage >= 90
                    ? STATUS_COLORS.implemented
                    : coverage.percentage >= 60
                        ? STATUS_COLORS.partial
                        : STATUS_COLORS.missing),
            ]}/>
              </View>
              <Text style={[styles.percentText, createTextColorStyle31(colors.textPrimary)]}>
                {coverage.percentage}{localizedUiText.m_4899563c434e}</Text>
            </View>
          </View>} renderItem={({ item }) => <FeatureRow item={item}/>} ItemSeparatorComponent={() => <View style={styles.viewHeight}/>} extraData={localizedUiText}/>
    </View>);
}
export default ResidentFeatureCoverageScreen;

