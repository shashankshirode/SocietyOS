import { ScrollView, View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { ResidentAppHeader } from "../../navigation/ResidentAppHeader";
import { resolveResidentMessage, type MessageTree } from "../../navigation/ResidentHeaderTitle";
import { useResidentReleaseReadiness } from "../hooks/useResidentReleaseReadiness";
import type { ResidentReleaseCheckItem, ResidentReleaseCheckStatus, ResidentReleaseGap, ResidentReleaseReadinessSummary, ResidentReleaseStaticViolation } from "../data/residentReleaseChecklist.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createViewBorderColorBackgroundColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle10, createViewBackgroundColorStyle2, createSafeTextColorStyle11, createViewBackgroundColorStyle3, createSafeTextColorStyle12, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createSafeTextColorStyle13, createSafeTextColorStyle14, createSafeTextColorStyle15, createSafeTextColorStyle16, createSafeTextColorStyle17 } from "../styles/screens/ResidentReleaseReadinessScreen.styles";
type GapGroup = {
    labelKey: string;
    gaps: ResidentReleaseGap[];
};
type StaticViolationGroup = {
    labelKey: string;
    emptyLabelKey: string;
    violations: ResidentReleaseStaticViolation[];
};
function getStatusColor(status: ResidentReleaseCheckStatus, colors: ReturnType<typeof useAppTheme>['colors']) {
    switch (status) {
        case 'passed':
            return colors.success;
        case 'failed':
            return colors.danger;
        case 'partial':
            return colors.warning;
        case 'notApplicable':
            return colors.textMuted;
        default:
            return colors.textMuted;
    }
}
function getStatusLabelKey(status: ResidentReleaseCheckStatus) {
    switch (status) {
        case 'passed':
            return 'resident.releaseReadiness.passedLabel';
        case 'failed':
            return 'resident.releaseReadiness.failedLabel';
        case 'partial':
            return 'resident.releaseReadiness.partialLabel';
        case 'notApplicable':
            return 'resident.releaseReadiness.notApplicableLabel';
        default:
            return 'resident.releaseReadiness.notApplicableLabel';
    }
}
function SummaryMetric({ labelKey, value, toneColor, messageTree, }: {
    labelKey: string;
    value: number;
    toneColor: string;
    messageTree: MessageTree;
}) {
    return (<View style={styles.metric}>
      <SafeText variant="tiny" style={styles.metricLabel}>
        {resolveResidentMessage(messageTree, labelKey)}
      </SafeText>
      <SafeText variant="bodyStrong" style={[styles.metricValue, createSafeTextColorStyle9(toneColor)]}>
        {value}
      </SafeText>
    </View>);
}
function ChecklistItemRow({ item, messageTree, }: {
    item: ResidentReleaseCheckItem;
    messageTree: MessageTree;
}) {
    const { colors } = useAppTheme();
    const statusColor = getStatusColor(item.status, colors);
    return (<View style={[styles.checkRow, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
      <View style={[styles.statusDot, createViewBackgroundColorStyle(statusColor)]}/>
      <View style={styles.checkContent}>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)} numberOfLines={1}>
          {resolveResidentMessage(messageTree, item.titleMessageKey)}
        </SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.textSecondary)} numberOfLines={1}>
          {item.moduleKey}
        </SafeText>
      </View>
      <SafeText variant="tiny" style={[styles.statusText, createSafeTextColorStyle10(statusColor)]}>
        {resolveResidentMessage(messageTree, getStatusLabelKey(item.status))}
      </SafeText>
    </View>);
}
function GapGroupSection({ group, messageTree, }: {
    group: GapGroup;
    messageTree: MessageTree;
}) {
    const { colors } = useAppTheme();
    return (<View style={[styles.groupCard, createViewBackgroundColorStyle2(colors.surface)]}>
      <SafeText variant="bodyStrong" style={[styles.groupTitle, createSafeTextColorStyle11(colors.textPrimary)]}>
        {resolveResidentMessage(messageTree, group.labelKey)}
      </SafeText>
      {group.gaps.length === 0 ? (<SafeText variant="tiny" style={createSafeTextColorStyle3(colors.textSecondary)}>
          {resolveResidentMessage(messageTree, 'resident.releaseReadiness.noGaps')}
        </SafeText>) : (group.gaps.map((gap) => (<SafeText key={`${gap.checkId}-${gap.key}`} variant="tiny" style={createSafeTextColorStyle4(colors.danger)}>
            {gap.key}
          </SafeText>)))}
    </View>);
}
function StaticViolationSection({ group, messageTree, }: {
    group: StaticViolationGroup;
    messageTree: MessageTree;
}) {
    const { colors } = useAppTheme();
    return (<View style={[styles.groupCard, createViewBackgroundColorStyle3(colors.surface)]}>
      <SafeText variant="bodyStrong" style={[styles.groupTitle, createSafeTextColorStyle12(colors.textPrimary)]}>
        {resolveResidentMessage(messageTree, group.labelKey)}
      </SafeText>
      {group.violations.length === 0 ? (<SafeText variant="tiny" style={createSafeTextColorStyle5(colors.success)}>
          {resolveResidentMessage(messageTree, group.emptyLabelKey)}
        </SafeText>) : (group.violations.map((violation) => (<View key={violation.id} style={styles.violationRow}>
            <SafeText variant="tiny" style={createSafeTextColorStyle6(colors.danger)}>
              {resolveResidentMessage(messageTree, violation.messageKey)}
            </SafeText>
            <SafeText variant="tiny" style={createSafeTextColorStyle7(colors.textSecondary)}>
              {violation.source}
            </SafeText>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(colors.danger)}>
              {violation.count}
            </SafeText>
          </View>)))}
    </View>);
}
function buildGapGroups(summary: ResidentReleaseReadinessSummary): GapGroup[] {
    return [
        { labelKey: 'resident.releaseReadiness.missingScreens', gaps: summary.missingScreens },
        { labelKey: 'resident.releaseReadiness.missingRoutes', gaps: summary.missingRoutes },
        { labelKey: 'resident.releaseReadiness.missingActions', gaps: summary.missingActions },
        { labelKey: 'resident.releaseReadiness.missingRepositoryMethods', gaps: summary.missingRepositoryMethods },
        { labelKey: 'resident.releaseReadiness.missingMockData', gaps: summary.missingMockDataKeys },
        { labelKey: 'resident.releaseReadiness.missingMessages', gaps: summary.missingMessageGroups },
        { labelKey: 'resident.releaseReadiness.missingLoadingStates', gaps: summary.missingLoadingStates },
        { labelKey: 'resident.releaseReadiness.missingModals', gaps: summary.missingModalKeys },
        { labelKey: 'resident.releaseReadiness.missingRoleVariants', gaps: summary.missingRoleVariants },
        { labelKey: 'resident.releaseReadiness.missingFeatureFlags', gaps: summary.missingFeatureFlags },
    ];
}
function buildStaticViolationGroups(summary: ResidentReleaseReadinessSummary): StaticViolationGroup[] {
    return [
        {
            labelKey: 'resident.releaseReadiness.centralizedDataSourceViolations',
            emptyLabelKey: 'resident.releaseReadiness.noCentralizedDataSourceViolations',
            violations: summary.centralizedDataSourceViolations,
        },
        {
            labelKey: 'resident.releaseReadiness.hardcodedStringViolations',
            emptyLabelKey: 'resident.releaseReadiness.noGaps',
            violations: summary.hardcodedStringViolations,
        },
        {
            labelKey: 'resident.releaseReadiness.forbiddenTypeViolations',
            emptyLabelKey: 'resident.releaseReadiness.noGaps',
            violations: summary.forbiddenTypeViolations,
        },
    ];
}
export function ResidentReleaseReadinessScreen() {
    const messages = useMessages();
    const messageTree = messages as MessageTree;
    const { colors } = useAppTheme();
    const summary = useResidentReleaseReadiness();
    const releaseStatusKey = summary.blockingIssueCount === 0
        ? 'resident.releaseReadiness.releaseReady'
        : 'resident.releaseReadiness.releaseBlocked';
    return (<View style={[styles.container, createViewBackgroundColorStyle4(colors.background)]}>
      <ResidentAppHeader variant="secure" titleKey="resident.releaseReadiness.screenTitle" subtitleKey="resident.releaseReadiness.screenSubtitle" roleLabelKey="resident.header.roles.owner" showBackButton/>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.scoreCard, createViewBackgroundColorStyle5(colors.surfaceElevated)]}>
          <SafeText variant="tiny" style={[styles.metricLabel, createSafeTextColorStyle13(colors.textSecondary)]}>
            {resolveResidentMessage(messageTree, 'resident.releaseReadiness.scoreLabel')}
          </SafeText>
          <SafeText variant="display" style={[styles.scoreValue, createSafeTextColorStyle14(colors.textPrimary)]}>
            {summary.releaseScore}
          </SafeText>
          <SafeText variant="bodyStrong" style={[
            styles.releaseState,
            createSafeTextColorStyle15(summary.blockingIssueCount === 0 ? colors.success : colors.danger),
        ]}>
            {resolveResidentMessage(messageTree, releaseStatusKey)}
          </SafeText>
          <View style={styles.metricsRow}>
            <SummaryMetric labelKey="resident.releaseReadiness.passedLabel" value={summary.passed} toneColor={colors.success} messageTree={messageTree}/>
            <SummaryMetric labelKey="resident.releaseReadiness.failedLabel" value={summary.failed} toneColor={colors.danger} messageTree={messageTree}/>
            <SummaryMetric labelKey="resident.releaseReadiness.partialLabel" value={summary.partial} toneColor={colors.warning} messageTree={messageTree}/>
            <SummaryMetric labelKey="resident.releaseReadiness.notApplicableLabel" value={summary.notApplicable} toneColor={colors.textMuted} messageTree={messageTree}/>
          </View>
        </View>

        <SafeText variant="h3" style={[styles.sectionTitle, createSafeTextColorStyle16(colors.textPrimary)]}>
          {resolveResidentMessage(messageTree, 'resident.releaseReadiness.gapsTitle')}
        </SafeText>
        {buildGapGroups(summary).map((group) => (<GapGroupSection key={group.labelKey} group={group} messageTree={messageTree}/>))}

        {buildStaticViolationGroups(summary).map((group) => (<StaticViolationSection key={group.labelKey} group={group} messageTree={messageTree}/>))}

        <SafeText variant="h3" style={[styles.sectionTitle, createSafeTextColorStyle17(colors.textPrimary)]}>
          {resolveResidentMessage(messageTree, 'resident.releaseReadiness.checklistTitle')}
        </SafeText>
        {summary.items.map((item) => (<ChecklistItemRow key={item.id} item={item} messageTree={messageTree}/>))}
      </ScrollView>
    </View>);
}
export default ResidentReleaseReadinessScreen;

