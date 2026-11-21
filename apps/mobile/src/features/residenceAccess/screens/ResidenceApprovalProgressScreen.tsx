import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessActionLabels, residenceAccessMessages, residenceAccessStatusLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceStatusBadge } from "../components/ResidenceStatusBadge";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/screens/ResidenceApprovalProgressScreen.styles";
interface ResidenceApprovalProgressScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onRefresh: () => void;
    readonly onReminder: () => void;
    readonly onContact: () => void;
    readonly onWithdraw: () => void;
    readonly onViewDocuments: () => void;
    readonly onSwitchResidence: () => void;
    readonly onSignOut: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceApprovalProgressScreen({ detail, error, onBack, onRefresh, onReminder, onContact, onWithdraw, onViewDocuments, onSwitchResidence, onSignOut, onDismissError, }: ResidenceApprovalProgressScreenProps) {
    const { colors } = useAppTheme();
    const submitted = presentResidenceDate(detail.accessRecord.submittedAt);
    const expected = presentResidenceDate(detail.accessRecord.expectedReviewAt);
    const updated = presentResidenceDate(detail.accessRecord.statusUpdatedAt);
    const pending = detail.accessRecord.status === 'SOCIETY_APPROVAL_PENDING' ||
        detail.accessRecord.status === 'DOCUMENTS_UNDER_REVIEW';
    return (<ScreenScaffold scroll contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessStatusLabels[detail.accessRecord.status]} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <ResidenceStatusBadge status={detail.accessRecord.status}/>
      <StatusExplanationPanel title={pending ? residenceAccessMessages.approval.title : residenceAccessStatusLabels[detail.accessRecord.status]} body={detail.accessRecord.statusReason} tone={detail.accessRecord.status === 'APPROVED' ? 'success' : 'info'}/>
      <View style={[styles.metadata, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        {detail.accessRecord.submittedAt ? (<AppText variant="bodySmall">
            {`${residenceAccessMessages.statusSheet.submitted}: ${submitted.absolute}`}
          </AppText>) : null}
        {detail.accessRecord.expectedReviewAt ? (<AppText variant="bodySmall">
            {`${residenceAccessMessages.statusSheet.expectedTimeline}: ${expected.absolute}`}
          </AppText>) : null}
        <AppText variant="bodySmall">
          {`${residenceAccessMessages.statusSheet.updated}: ${updated.absolute}`}
        </AppText>
        <AppText variant="bodySmall" weight="800">
          {`${residenceAccessMessages.statusSheet.reference}: ${detail.accessRecord.referenceNumber}`}
        </AppText>
      </View>
      <StatusExplanationPanel title={residenceAccessMessages.approval.protectedNotice} body={residenceAccessMessages.approval.body} tone="warning"/>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.approval.actualProgress}
        </AppText>
        <ResidenceAccessTimeline events={detail.timeline} initiallyExpanded/>
      </View>
      <View style={styles.actions}>
        <AppButton title={residenceAccessMessages.review.submittedDocuments} onPress={onViewDocuments} variant="outline" fullWidth/>
        {detail.eligibility.canSendReminder ? (<AppButton title={residenceAccessActionLabels.SEND_REMINDER} onPress={onReminder} fullWidth/>) : null}
        <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="outline" fullWidth/>
        {detail.accessRecord.canWithdraw ? (<AppButton title={residenceAccessMessages.withdraw.title} onPress={onWithdraw} variant="ghost" fullWidth/>) : null}
        <AppButton title={residenceAccessMessages.approval.switchResidence} onPress={onSwitchResidence} variant="outline" fullWidth/>
        <AppButton title={residenceAccessMessages.common.signOut} onPress={onSignOut} variant="ghost" fullWidth/>
      </View>
    </ScreenScaffold>);
}

