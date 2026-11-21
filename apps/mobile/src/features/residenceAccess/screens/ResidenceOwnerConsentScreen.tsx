import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { OwnerConsentPanel } from "../components/OwnerConsentPanel";
import { ResidenceAccessTimeline } from "../components/ResidenceAccessTimeline";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { styles } from "../styles/screens/ResidenceOwnerConsentScreen.styles";
interface ResidenceOwnerConsentScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onRequestConsent: () => Promise<boolean>;
    readonly onUploadWrittenConsent: () => void;
    readonly onContact: () => void;
    readonly onCancel: () => void;
    readonly onRefresh: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceOwnerConsentScreen({ detail, activeMutation, error, onBack, onRequestConsent, onUploadWrittenConsent, onContact, onCancel, onRefresh, onDismissError, }: ResidenceOwnerConsentScreenProps) {
    const consent = detail.ownerConsent;
    if (!consent) {
        return null;
    }
    const pending = consent.status === 'REQUESTED' || consent.status === 'VIEWED';
    return (<ScreenScaffold scroll contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={pending ? residenceAccessMessages.consent.pendingTitle : residenceAccessMessages.consent.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onRetry={onRefresh} onDismiss={onDismissError}/> : null}
      <OwnerConsentPanel consent={consent}/>
      <View style={styles.section}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.statusSheet.timelineTitle}
        </AppText>
        <ResidenceAccessTimeline events={detail.timeline}/>
      </View>
      <View style={styles.actions}>
        <AppButton title={pending ? residenceAccessMessages.consent.resend : residenceAccessMessages.consent.request} onPress={() => { void onRequestConsent(); }} loading={activeMutation === 'REQUEST_OWNER_CONSENT'} disabled={pending && Boolean(consent.nextResendAllowedAt && new Date(consent.nextResendAllowedAt).getTime() > Date.now())} fullWidth/>
        <AppButton title={residenceAccessMessages.consent.uploadWritten} onPress={onUploadWrittenConsent} variant="outline" fullWidth/>
        {consent.alternativeOfficeVerificationAllowed ? (<AppButton title={residenceAccessMessages.consent.alternative} onPress={onContact} variant="outline" fullWidth/>) : null}
        <AppButton title={residenceAccessMessages.common.contact} onPress={onContact} variant="ghost" fullWidth/>
        {detail.accessRecord.canWithdraw ? (<AppButton title={residenceAccessMessages.consent.cancel} onPress={onCancel} variant="danger" fullWidth/>) : null}
      </View>
    </ScreenScaffold>);
}

