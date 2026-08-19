import { useState } from "react";
import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { AppTextInput } from "../../../ui/forms/AppTextInput";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { SuspensionResolutionPanel } from "../components/SuspensionResolutionPanel";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { styles } from "../styles/screens/ResidenceSuspensionResolutionScreen.styles";
interface ResidenceSuspensionResolutionScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onUploadClarification: () => void;
    readonly onSubmit: (value: {
        readonly explanation: string;
        readonly supportingDocumentIds: readonly string[];
    }) => Promise<boolean>;
    readonly onContact: () => void;
    readonly onSwitchResidence: () => void;
    readonly onRefresh: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceSuspensionResolutionScreen({ detail, activeMutation, error, onBack, onUploadClarification, onSubmit, onContact, onSwitchResidence, onRefresh, onDismissError, }: ResidenceSuspensionResolutionScreenProps) {
    const [explanation, setExplanation] = useState('');
    const suspension = detail.suspension;
    if (!suspension) {
        return null;
    }
    const resolutionSubmitted = detail.accessRecord.status === 'SOCIETY_APPROVAL_PENDING';
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.suspension.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <StatusExplanationPanel title={residenceAccessMessages.suspension.dashboardBlocked} body={detail.accessRecord.statusReason} tone="danger"/>
      <SuspensionResolutionPanel suspension={suspension}/>
      {resolutionSubmitted ? (<StatusExplanationPanel title={residenceAccessMessages.suspension.awaitingTitle} body={residenceAccessMessages.suspension.successBody} tone="info"/>) : (<View style={styles.form}>
          <AppButton title={residenceAccessMessages.suspension.addDocument} onPress={onUploadClarification} variant="outline" fullWidth/>
          <AppText variant="caption" weight="700">{residenceAccessMessages.suspension.explanation}</AppText>
          <AppTextInput value={explanation} onChangeText={setExplanation} placeholder={residenceAccessMessages.suspension.explanationPlaceholder} maxLength={300}/>
          <AppButton title={residenceAccessMessages.suspension.submit} onPress={() => { void onSubmit({ explanation: explanation.trim(), supportingDocumentIds: [] }); }} disabled={explanation.trim().length < 10} loading={activeMutation === 'SUBMIT_SUSPENSION_RESOLUTION'} fullWidth/>
        </View>)}
      <View style={styles.actions}>
        <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="outline" fullWidth/>
        <AppButton title={residenceAccessMessages.approval.switchResidence} onPress={onSwitchResidence} variant="ghost" fullWidth/>
      </View>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.statusSheet.timelineTitle}</AppText>
        <ResidenceAccessTimeline events={detail.timeline} initiallyExpanded/>
      </View>
    </ScreenScaffold>);
}

