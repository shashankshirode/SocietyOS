import { useMemo, useState } from "react";
import { usePreventScreenCapture } from "expo-screen-capture";
import { View } from "react-native";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail, ResidenceAccessRepositoryError, ResidenceDocument, ResidenceDocumentRequirement, ResidenceDocumentSelection, ResidenceRecoveredUpload } from "../models/residenceAccess.types";
import type { ResidenceAccessMutationName } from "../hooks/useResidenceAccessExperience";
import { ResidenceAccessPageHeader } from "../components/ResidenceAccessPageHeader";
import { ResidenceAccessProgress } from "../components/ResidenceAccessProgress";
import { DocumentRequirementCard } from "../components/DocumentRequirementCard";
import { ResidenceDocumentPickerSheet } from "../components/ResidenceDocumentPickerSheet";
import { ResidenceDocumentDetailSheet } from "../components/ResidenceDocumentDetailSheet";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { StatusExplanationPanel } from "../components/StatusExplanationPanel";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/screens/ResidenceDocumentRequirementsScreen.styles";
interface RequirementSection {
    readonly title: string;
    readonly requirements: readonly ResidenceDocumentRequirement[];
}
interface ResidenceDocumentRequirementsScreenProps {
    readonly detail: ResidenceAccessDetail;
    readonly activeMutation: ResidenceAccessMutationName | null;
    readonly uploadProgress: number;
    readonly recoveredUploads: readonly ResidenceRecoveredUpload[];
    readonly error: ResidenceAccessRepositoryError | null;
    readonly onBack: () => void;
    readonly onUpload: (requirementId: string, selection: ResidenceDocumentSelection, expiryDate?: string) => Promise<boolean>;
    readonly onCancelUpload: () => void;
    readonly onRemove: (documentId: string) => Promise<boolean>;
    readonly onContinue: () => void;
    readonly onDismissError: () => void;
}
export function ResidenceDocumentRequirementsScreen({ detail, activeMutation, uploadProgress, recoveredUploads, error, onBack, onUpload, onCancelUpload, onRemove, onContinue, onDismissError, }: ResidenceDocumentRequirementsScreenProps) {
    usePreventScreenCapture('residence-verification-documents');
    const { colors } = useAppTheme();
    const [uploadRequirement, setUploadRequirement] = useState<ResidenceDocumentRequirement | null>(null);
    const [viewing, setViewing] = useState<{
        requirement: ResidenceDocumentRequirement;
        document: ResidenceDocument;
    } | null>(null);
    const sections = useMemo<readonly RequirementSection[]>(() => {
        const correction = detail.requirements.filter((requirement) => requirement.verificationStatus === 'CHANGES_REQUIRED' ||
            requirement.verificationStatus === 'REJECTED' ||
            requirement.verificationStatus === 'EXPIRED');
        const required = detail.requirements.filter((requirement) => requirement.mandatory &&
            requirement.verificationStatus !== 'VERIFIED' &&
            !correction.includes(requirement));
        const optional = detail.requirements.filter((requirement) => !requirement.mandatory && requirement.verificationStatus !== 'VERIFIED');
        const verified = detail.requirements.filter((requirement) => requirement.verificationStatus === 'VERIFIED');
        return [
            { title: residenceAccessMessages.requirements.correctionTitle, requirements: correction },
            { title: residenceAccessMessages.requirements.requiredTitle, requirements: required },
            { title: residenceAccessMessages.requirements.optionalTitle, requirements: optional },
            { title: residenceAccessMessages.requirements.verifiedTitle, requirements: verified },
        ].filter((section) => section.requirements.length > 0);
    }, [detail.requirements]);
    const mandatoryReady = detail.requirements
        .filter((requirement) => requirement.mandatory)
        .every((requirement) => requirement.verificationStatus === 'UPLOADED' ||
        requirement.verificationStatus === 'VERIFIED');
    const subtitle = `${detail.residence.societyName} · ${detail.residence.unitNumber}`;
    return (<ScreenScaffold scroll keyboardAvoiding contentStyle={styles.content}>
      <ResidenceAccessPageHeader title={residenceAccessMessages.requirements.title} subtitle={subtitle} onBack={onBack}/>
      {error ? <ResidenceAccessErrorBanner error={error} onDismiss={onDismissError}/> : null}
      <View style={[styles.progressCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
        <AppText variant="sectionTitle" weight="800">
          {residenceAccessMessages.requirements.progressTitle}
        </AppText>
        <ResidenceAccessProgress completed={detail.completedRequirementCount} total={detail.totalRequirementCount}/>
      </View>
      {recoveredUploads.length > 0 ? (<StatusExplanationPanel title={residenceAccessMessages.requirements.uploadRecovered} body={residenceAccessMessages.requirements.offlineSaved} tone="warning"/>) : null}
      {sections.map((section) => (<View key={section.title} style={styles.section}>
          <AppText variant="sectionTitle" weight="800">
            {section.title}
          </AppText>
          {section.requirements.map((requirement) => {
                const document = detail.documents.find((entry) => entry.requirementId === requirement.requirementId);
                return (<DocumentRequirementCard key={requirement.requirementId} requirement={requirement} {...includeWhenPresent("document", document)} onUpload={setUploadRequirement} onView={(selectedRequirement, selectedDocument) => {
                        if (selectedDocument) {
                            setViewing({ requirement: selectedRequirement, document: selectedDocument });
                        }
                    }} onRemove={(documentId) => {
                        void onRemove(documentId);
                    }} removing={activeMutation === 'REMOVE_DOCUMENT'}/>);
            })}
        </View>))}
      <StatusExplanationPanel title={mandatoryReady
            ? residenceAccessMessages.requirements.allMandatoryReady
            : residenceAccessMessages.requirements.mandatoryMissing} body={mandatoryReady
            ? residenceAccessMessages.review.submit
            : detail.accessRecord.statusReason} tone={mandatoryReady ? 'success' : 'warning'}/>
      <AppButton title={detail.accessRecord.status === 'DOCUMENTS_REQUIRED'
            ? residenceAccessMessages.common.continue
            : residenceAccessMessages.decision.resubmitReview} onPress={onContinue} disabled={!mandatoryReady} fullWidth/>
      <ResidenceDocumentPickerSheet visible={uploadRequirement !== null} requirement={uploadRequirement} uploading={activeMutation === 'UPLOAD_DOCUMENT'} uploadProgress={uploadProgress} onUpload={onUpload} onCancelUpload={onCancelUpload} onDismiss={() => setUploadRequirement(null)}/>
      <ResidenceDocumentDetailSheet visible={viewing !== null} requirement={viewing?.requirement ?? null} document={viewing?.document ?? null} onDismiss={() => setViewing(null)}/>
    </ScreenScaffold>);
}

