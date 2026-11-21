import { useState } from "react";
import { Pressable, View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { AppTextInput } from "../../../ui/forms/AppTextInput";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { reactivationReasonLabels, residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError, ResidenceReactivationReason } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { AccessExpiryPanel } from "../components/AccessExpiryPanel";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createPressableBorderColorBackgroundColorStyle } from "../styles/screens/ResidenceAccessRenewalScreen.styles";
const renewalReasons: readonly ResidenceReactivationReason[] = [
    'RENEWED_TENANCY',
    'RETURNING_FAMILY_MEMBER',
    'OWNER_REACTIVATION',
    'INCORRECT_DEACTIVATION',
    'TEMPORARY_ABSENCE_ENDED',
    'OTHER',
];
interface ResidenceAccessRenewalScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onUploadRenewal: () => void;
    readonly onSubmit: (value: {
        readonly reason: ResidenceReactivationReason;
        readonly residentMessage?: string;
        readonly supportingDocumentIds: readonly string[];
    }) => Promise<boolean>;
    readonly onPreviousOccupancy: () => void;
    readonly onContact: () => void;
    readonly onRefresh: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceAccessRenewalScreen({ detail, activeMutation, error, onBack, onUploadRenewal, onSubmit, onPreviousOccupancy, onContact, onRefresh, onDismissError, }: ResidenceAccessRenewalScreenProps) {
    const { colors } = useAppTheme();
    const [reason, setReason] = useState<ResidenceReactivationReason>('RENEWED_TENANCY');
    const [message, setMessage] = useState('');
    const underReview = Boolean(detail.reactivationRequest) || detail.accessRecord.status === 'SOCIETY_APPROVAL_PENDING';
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.expiry.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <AccessExpiryPanel record={detail.accessRecord}/>
      {underReview ? (<StatusExplanationPanel title={residenceAccessMessages.expiry.submittedTitle} body={residenceAccessMessages.expiry.submittedBody} tone="info"/>) : detail.eligibility.canRequestReactivation ? (<View style={styles.form}>
          <AppButton title={residenceAccessMessages.expiry.uploadRenewal} onPress={onUploadRenewal} variant="outline" fullWidth/>
          <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.expiry.reason}</AppText>
          <View style={styles.options}>
            {renewalReasons.map((entry) => {
                const selected = entry === reason;
                return (<Pressable key={entry} onPress={() => setReason(entry)} accessibilityRole="radio" accessibilityState={{ selected }} style={[
                        styles.option,
                        createPressableBorderColorBackgroundColorStyle(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface),
                    ]}>
                  <AppText variant="bodySmall" weight={selected ? '800' : '600'}>{reactivationReasonLabels[entry]}</AppText>
                </Pressable>);
            })}
          </View>
          <AppText variant="caption" weight="700">{residenceAccessMessages.expiry.message}</AppText>
          <AppTextInput value={message} onChangeText={setMessage} placeholder={residenceAccessMessages.expiry.messagePlaceholder} maxLength={240}/>
          <AppText variant="caption" tone="secondary">{residenceAccessMessages.expiry.requestNotAutomatic}</AppText>
          <AppButton title={residenceAccessMessages.expiry.submit} onPress={() => { void onSubmit({ reason, ...includeWhenPresent("residentMessage", message.trim() || undefined), supportingDocumentIds: [] }); }} loading={activeMutation === 'REQUEST_REACTIVATION'} fullWidth/>
        </View>) : (<StatusExplanationPanel title={residenceAccessMessages.inactive.unavailable} body={detail.accessRecord.statusReason} tone="warning"/>)}
      <View style={styles.actions}>
        <AppButton title={residenceAccessMessages.expiry.viewPrevious} onPress={onPreviousOccupancy} variant="outline" fullWidth/>
        <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="ghost" fullWidth/>
      </View>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">{residenceAccessMessages.statusSheet.timelineTitle}</AppText>
        <ResidenceAccessTimeline events={detail.timeline} initiallyExpanded/>
      </View>
    </ScreenScaffold>);
}

