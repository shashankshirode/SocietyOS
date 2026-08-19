import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { getPlatformKeyboardConfig } from "../../../shared/platform/platformKeyboard";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { residenceAccessBlockerLabels, residenceAccessMessages, residenceAccessStatusLabels, residenceRoleLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessAction, ResidenceAccessEligibility, ResidenceAccessRecord, ResidenceAccessTimelineEvent, ResidenceSummary } from "../models/residenceAccess.types";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import { ResidenceStatusBadge } from "./ResidenceStatusBadge";
import { ResidenceAccessTimeline } from "./ResidenceAccessTimeline";
import { ResidenceAccessActionPanel } from "./ResidenceAccessActionPanel";
import { StatusExplanationPanel } from "./StatusExplanationPanel";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/ResidenceAccessStatusSheet.styles";
export interface ResidenceAccessStatusSheetProps {
    readonly visible: boolean;
    readonly residence: ResidenceSummary;
    readonly accessRecord: ResidenceAccessRecord;
    readonly eligibility: ResidenceAccessEligibility;
    readonly timeline: readonly ResidenceAccessTimelineEvent[];
    readonly primaryAction?: ResidenceAccessAction;
    readonly secondaryActions: readonly ResidenceAccessAction[];
    readonly onAction: (action: ResidenceAccessAction) => void;
    readonly onDismiss: () => void;
}
function SectionList({ title, items, empty }: {
    readonly title: string;
    readonly items: readonly string[];
    readonly empty: string;
}) {
    const { colors } = useAppTheme();
    return (<View style={styles.section}>
      <AppText variant="sectionTitle" weight="800">
        {title}
      </AppText>
      {items.length === 0 ? (<AppText variant="bodySmall" tone="secondary">
          {empty}
        </AppText>) : items.map((item) => (<View key={item} style={styles.bulletRow}>
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.info}/>
          <AppText variant="bodySmall" style={styles.bulletText}>
            {item}
          </AppText>
        </View>))}
    </View>);
}
function MetadataRow({ label, value }: {
    readonly label: string;
    readonly value: string;
}) {
    return (<View style={styles.metadataRow}>
      <AppText variant="caption" tone="secondary" style={styles.metadataLabel}>
        {label}
      </AppText>
      <AppText variant="bodySmall" weight="700" style={styles.metadataValue}>
        {value}
      </AppText>
    </View>);
}
export function ResidenceAccessStatusSheet({ visible, residence, accessRecord, eligibility, timeline, primaryAction, secondaryActions, onAction, onDismiss, }: ResidenceAccessStatusSheetProps) {
    const { colors } = useAppTheme();
    const keyboard = getPlatformKeyboardConfig();
    const focusRef = useRef<View>(null);
    const submitted = presentResidenceDate(accessRecord.submittedAt);
    const updated = presentResidenceDate(accessRecord.statusUpdatedAt);
    const expected = presentResidenceDate(accessRecord.expectedReviewAt);
    const location = [residence.unitNumber, residence.buildingName, residence.wingName]
        .filter(Boolean)
        .join(' · ');
    useEffect(() => {
        if (!visible) {
            return;
        }
        const timer = setTimeout(() => {
            const node = findNodeHandle(focusRef.current);
            if (node) {
                AccessibilityInfo.setAccessibilityFocus(node);
            }
        }, 320);
        return () => clearTimeout(timer);
    }, [visible]);
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss} testID="residence-access-status-sheet" header={(<ModalHeader title={residenceAccessStatusLabels[accessRecord.status]} subtitle={`${residence.societyName} · ${location}`} onClose={onDismiss}/>)}>
      <KeyboardAvoidingView {...includeWhenPresent("behavior", keyboard.behavior)} keyboardVerticalOffset={keyboard.keyboardVerticalOffset}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View ref={focusRef} accessible accessibilityRole="header" accessibilityLabel={residenceAccessStatusLabels[accessRecord.status]} style={styles.statusHeader}>
            <ResidenceStatusBadge status={accessRecord.status}/>
            <View style={styles.roleRow}>
              <AppText variant="caption" tone="secondary">
                {residenceRoleLabels[residence.role]}
              </AppText>
              <AppText variant="caption" tone="muted">
                {accessRecord.referenceNumber}
              </AppText>
            </View>
          </View>

          <StatusExplanationPanel title={residenceAccessStatusLabels[accessRecord.status]} body={accessRecord.statusReason} tone={eligibility.canEnterResidence ? 'success' : accessRecord.status === 'SUSPENDED' || accessRecord.status === 'REJECTED' || accessRecord.status === 'ACCESS_REVOKED' ? 'danger' : 'info'}/>

          <View style={[styles.metadataCard, createViewBackgroundColorBorderColorStyle(colors.surfaceMuted, colors.border)]}>
            {accessRecord.submittedAt ? (<MetadataRow label={residenceAccessMessages.statusSheet.submitted} value={submitted.absolute}/>) : null}
            {accessRecord.expectedReviewAt ? (<MetadataRow label={residenceAccessMessages.statusSheet.expectedTimeline} value={expected.absolute}/>) : null}
            <MetadataRow label={residenceAccessMessages.statusSheet.updated} value={updated.absolute}/>
            <MetadataRow label={residenceAccessMessages.statusSheet.reference} value={accessRecord.referenceNumber}/>
          </View>

          <SectionList title={residenceAccessMessages.statusSheet.pendingTitle} items={eligibility.blockingReasons.map((blocker) => residenceAccessBlockerLabels[blocker])} empty={residenceAccessMessages.empty.allCaughtUpBody}/>
          <SectionList title={residenceAccessMessages.statusSheet.residentActionTitle} items={accessRecord.residentPendingActions} empty={residenceAccessMessages.statusSheet.noResidentAction}/>
          <SectionList title={residenceAccessMessages.statusSheet.societyActionTitle} items={accessRecord.societyPendingActions} empty={residenceAccessMessages.statusSheet.noSocietyAction}/>
          <SectionList title={residenceAccessMessages.statusSheet.completedTitle} items={accessRecord.completedSteps} empty={residenceAccessMessages.empty.allCaughtUpBody}/>

          <View style={styles.section}>
            <AppText variant="sectionTitle" weight="800">
              {residenceAccessMessages.statusSheet.timelineTitle}
            </AppText>
            <ResidenceAccessTimeline events={timeline}/>
          </View>

          <ResidenceAccessActionPanel {...includeWhenPresent("primaryAction", primaryAction)} secondaryActions={secondaryActions} onAction={onAction}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBottomSheet>);
}

