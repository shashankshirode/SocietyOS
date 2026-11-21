import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { AppIcon } from "../../../shared/icons/AppIcon";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { validateBlueprintFeature } from "../../../core/productBlueprint/blueprintCoverageValidator";
import { blueprintFeatures } from "../../../core/productBlueprint/blueprintFeatureRegistry";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { SuperAdminStackParamList } from "../../../app/navigation/navigation.types";
import { styles, createTextColorStyle, createViewBorderColorBackgroundColorStyle, createTextColorStyle2, createTextColorStyle3, createViewBackgroundColorStyle, createTextColorStyle4, createViewBackgroundColorBorderColorStyle, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createViewBorderColorBackgroundColorStyle2, createTextColorStyle8, createTextColorStyle9, createViewBackgroundColorStyle2, createTextColorStyle10, createTextColorStyle11 } from "../styles/screens/BlueprintFeatureDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
type Props = NativeStackScreenProps<SuperAdminStackParamList, 'BlueprintFeatureDetail'>;
export function BlueprintFeatureDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { featureId } = route.params;
    const { colors } = useAppTheme();
    const feature = blueprintFeatures.find((f) => f.id === featureId);
    if (!feature) {
        return (<ScreenContainer>
        <SafeAreaView style={styles.safe}>
          <ResponsivePageHeader title={localizedUiText.m_bccadaf21d43} onBack={() => navigation.goBack()}/>
          <View style={styles.emptyContainer}>
            <Text style={createTextColorStyle(colors.textSecondary)}>{localizedUiText.m_57b678821d6c}</Text>
          </View>
        </SafeAreaView>
      </ScreenContainer>);
    }
    const issues = validateBlueprintFeature(feature);
    const renderSectionList = (title: string, items: string[], type: 'normal' | 'info' | 'warning') => {
        return (<View style={[styles.section, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
        <Text style={[styles.sectionTitle, createTextColorStyle2(colors.textSecondary)]}>{title}</Text>
        {items.length === 0 ? (<Text style={[styles.emptyText, createTextColorStyle3(colors.textMuted)]}>{localizedUiText.m_0f444437ff0e}</Text>) : (<View style={styles.tagContainer}>
            {items.map((item) => (<View key={item} style={[
                        styles.tag,
                        createViewBackgroundColorStyle(type === 'info'
                            ? colors.infoSoft
                            : type === 'warning'
                                ? colors.warningSoft
                                : colors.surfaceSoft),
                    ]}>
                <Text style={[
                        styles.tagText,
                        createTextColorStyle4(type === 'info'
                            ? colors.info
                            : type === 'warning'
                                ? colors.warning
                                : colors.textPrimary),
                    ]}>
                  {item}
                </Text>
              </View>))}
          </View>)}
      </View>);
    };
    let statusBadgeType: 'success' | 'warning' | 'danger' = 'success';
    if (feature.status === 'PARTIAL')
        statusBadgeType = 'warning';
    else if (feature.status === 'MISSING')
        statusBadgeType = 'danger';
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ResponsivePageHeader title={feature.title} subtitle={formatUiLiteral(localizedUiText.m_ec2c7acaac75, [feature.moduleName])} onBack={() => navigation.goBack()}/>

        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={[styles.mainCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.phaseLabel, createTextColorStyle5(colors.textSecondary)]}>{localizedUiText.m_e292f0567976}{feature.phase.replace('_', ' ')}
              </Text>
              <StatusBadge label={feature.status} type={statusBadgeType}/>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, createTextColorStyle6(colors.textSecondary)]}>{localizedUiText.m_a5624952cd97}</Text>
              <Text style={[styles.infoVal, createTextColorStyle7(colors.warning)]}>
                {feature.featureFlag}
              </Text>
            </View>
          </View>

          
          <View style={[styles.section, createViewBorderColorBackgroundColorStyle2(colors.border, colors.surface)]}>
            <Text style={[styles.sectionTitle, createTextColorStyle8(colors.textSecondary)]}>{localizedUiText.m_9718cbf13fce}</Text>
            {issues.length === 0 ? (<View style={styles.successRow}>
                <AppIcon name="checkmark-circle" size={20} color={colors.success}/>
                <Text style={[styles.successText, createTextColorStyle9(colors.success)]}>{localizedUiText.m_01aa087b4bfe}</Text>
              </View>) : (<View style={styles.issueList}>
                {issues.map((issue, idx) => (<View key={idx} style={[
                    styles.issueItem,
                    createViewBackgroundColorStyle2(issue.severity === 'BLOCKER'
                        ? colors.dangerSoft
                        : colors.warningSoft),
                ]}>
                    <View style={styles.issueHeader}>
                      <AppIcon name="alert-circle" size={18} color={issue.severity === 'BLOCKER' ? colors.danger : colors.warning}/>
                      <Text style={[
                    styles.issueSeverity,
                    createTextColorStyle10(issue.severity === 'BLOCKER'
                        ? colors.danger
                        : colors.warning),
                ]}>
                        [{issue.severity}] {issue.issueType}
                      </Text>
                    </View>
                    <Text style={[styles.issueMsg, createTextColorStyle11(colors.textPrimary)]}>
                      {issue.message}
                    </Text>
                  </View>))}
              </View>)}
          </View>

          
          {renderSectionList(String(localizedUiText.m_50a7fa882a76), feature.permissions, 'normal')}
          {renderSectionList(String(localizedUiText.m_8bf3f74fe854), feature.roles, 'normal')}
          {renderSectionList(String(localizedUiText.m_e96d11b3454c), feature.routeNames, 'info')}
          {renderSectionList(String(localizedUiText.m_1ac48d905732), feature.screenNames, 'info')}
          {renderSectionList(String(localizedUiText.m_c0fb9c1bafb4), feature.hookNames, 'warning')}
          {renderSectionList(String(localizedUiText.m_b56d95e06ff2), feature.repositoryMethods, 'warning')}
          {renderSectionList(String(localizedUiText.m_bf718aae63e8), feature.mockDataKeys, 'normal')}
          {renderSectionList(String(localizedUiText.m_6ba198b3dc96), feature.requiredActions, 'normal')}
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>);
}

