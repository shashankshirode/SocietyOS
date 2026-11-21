import { useState } from "react";
import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { AppCheckbox } from "../../../shared/forms/AppCheckbox";
import { AppTextInput } from "../../../ui/forms/AppTextInput";
import { formatFileSize } from "../../../shared/files/fileSizeFormatter";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError, ResidenceDocumentSelection } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { DecisionReasonPanel } from "../components/DecisionReasonPanel";
import { CorrectionRequiredPanel } from "../components/CorrectionRequiredPanel";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { pickResidenceDocumentFile } from "../services/ResidenceDocumentPickerService";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ResidenceDecisionScreen.styles";
interface ResidenceDecisionScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onCorrect: () => void;
    readonly onReviewCorrection: () => void;
    readonly onSubmitAppeal: (value: {
        readonly reason: string;
        readonly explanation?: string;
        readonly supportingDocument?: ResidenceDocumentSelection;
        readonly acknowledgementAccepted: boolean;
    }) => Promise<boolean>;
    readonly onContact: () => void;
    readonly onRefresh: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceDecisionScreen({ detail, activeMutation, error, onBack, onCorrect, onReviewCorrection, onSubmitAppeal, onContact, onRefresh, onDismissError, }: ResidenceDecisionScreenProps) {
    const [appealExpanded, setAppealExpanded] = useState(false);
    const [appealReason, setAppealReason] = useState('');
    const [appealExplanation, setAppealExplanation] = useState('');
    const [acknowledged, setAcknowledged] = useState(false);
    const [appealDocument, setAppealDocument] = useState<ResidenceDocumentSelection | null>(null);
    const [appealDocumentError, setAppealDocumentError] = useState<ResidenceAccessRepositoryError | null>(null);
    const decision = detail.decisions[0];
    const affectedReady = decision?.affectedRequirementIds.every((requirementId) => {
        const requirement = detail.requirements.find((entry) => entry.requirementId === requirementId);
        return requirement?.verificationStatus === 'UPLOADED' || requirement?.verificationStatus === 'VERIFIED';
    }) ?? false;
    const submitAppeal = async () => {
        const didSubmit = await onSubmitAppeal({
            reason: appealReason.trim(),
            ...includeWhenPresent("explanation", appealExplanation.trim() || undefined),
            ...includeWhenPresent("supportingDocument", appealDocument ?? undefined),
            acknowledgementAccepted: acknowledged
        });
        if (didSubmit) {
            setAppealExpanded(false);
            setAppealDocument(null);
        }
    };
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.decision.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <StatusExplanationPanel title={residenceAccessMessages.decision.title} body={residenceAccessMessages.decision.body} tone="danger"/>
      {decision ? (<>
          <DecisionReasonPanel decision={decision}/>
          <CorrectionRequiredPanel decision={decision} requirements={detail.requirements}/>
          <View style={styles.actions}>
            {decision.correctionAllowed ? (<>
                <AppButton title={residenceAccessMessages.decision.correctAffected} onPress={onCorrect} fullWidth/>
                <AppButton title={residenceAccessMessages.decision.resubmitReview} onPress={onReviewCorrection} disabled={!affectedReady} variant="outline" fullWidth/>
              </>) : (<StatusExplanationPanel title={residenceAccessMessages.decision.cannotCorrect} body={decision.residentVisibleReason} tone="warning"/>)}
            {detail.eligibility.canAppeal ? (<AppButton title={residenceAccessMessages.appeal.title} onPress={() => setAppealExpanded((value) => !value)} variant="outline" fullWidth/>) : null}
            <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="ghost" fullWidth/>
          </View>
        </>) : (<View style={styles.actions}>
          <StatusExplanationPanel title={detail.ownerConsent?.status === 'DECLINED'
                ? residenceAccessMessages.consent.declinedTitle
                : residenceAccessMessages.decision.noDecision} body={detail.ownerConsent?.residentVisibleDecisionReason ?? detail.accessRecord.statusReason} tone="warning"/>
          <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="outline" fullWidth/>
        </View>)}
      {appealExpanded ? (<View style={styles.appeal}>
          <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.appeal.title}</AppText>
          <AppText variant="bodySmall" tone="secondary">{residenceAccessMessages.appeal.reviewNotice}</AppText>
          <AppText variant="caption" weight="700">{residenceAccessMessages.appeal.reason}</AppText>
          <AppTextInput value={appealReason} onChangeText={setAppealReason} placeholder={residenceAccessMessages.appeal.reasonPlaceholder} maxLength={160}/>
          <AppText variant="caption" weight="700">{residenceAccessMessages.appeal.explanation}</AppText>
          <AppTextInput value={appealExplanation} onChangeText={setAppealExplanation} placeholder={residenceAccessMessages.appeal.explanation} maxLength={240}/>
          <AppText variant="caption" weight="700">{residenceAccessMessages.appeal.supportingDocument}</AppText>
          <AppText variant="bodySmall" tone="secondary">{residenceAccessMessages.appeal.supportingDocumentHelp}</AppText>
          {appealDocumentError ? (<ResidenceAccessErrorBanner error={appealDocumentError} onDismiss={() => setAppealDocumentError(null)}/>) : null}
          {appealDocument ? (<View style={styles.attachment}>
              <AppText variant="bodySmall" weight="700">{appealDocument.fileName}</AppText>
              <AppText variant="caption" tone="secondary">{formatFileSize(appealDocument.fileSizeBytes)}</AppText>
              <AppButton title={residenceAccessMessages.appeal.removeSupportingDocument} onPress={() => setAppealDocument(null)} variant="ghost" size="sm"/>
            </View>) : (<AppButton title={residenceAccessMessages.appeal.attachSupportingDocument} onPress={() => {
                    void pickResidenceDocumentFile(['image/jpeg', 'image/png', 'image/heic', 'application/pdf'], 'SINGLE').then((result) => {
                        if (result.ok) {
                            if (result.data)
                                setAppealDocument(result.data);
                            setAppealDocumentError(null);
                        }
                        else {
                            setAppealDocumentError(result.error);
                        }
                    });
                }} variant="outline" fullWidth/>)}
          <AppCheckbox checked={acknowledged} onPress={() => setAcknowledged((value) => !value)} label={residenceAccessMessages.appeal.acknowledgement}/>
          <AppButton title={residenceAccessMessages.appeal.submit} onPress={() => { void submitAppeal(); }} disabled={!appealReason.trim() || !acknowledged} loading={activeMutation === 'SUBMIT_APPEAL'} fullWidth/>
        </View>) : null}
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.statusSheet.timelineTitle}</AppText>
        <ResidenceAccessTimeline events={detail.timeline} initiallyExpanded/>
      </View>
    </ScreenScaffold>);
}

