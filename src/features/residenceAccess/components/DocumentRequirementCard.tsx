import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceDocumentStatusLabels } from "../../../messages/en/residenceAccess.messages";
import { formatFileSize } from "../../../shared/files/fileSizeFormatter";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceDocument, ResidenceDocumentRequirement } from "../models/residenceAccess.types";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/DocumentRequirementCard.styles";
interface DocumentRequirementCardProps {
    readonly requirement: ResidenceDocumentRequirement;
    readonly document?: ResidenceDocument;
    readonly onUpload: (requirement: ResidenceDocumentRequirement) => void;
    readonly onView: (requirement: ResidenceDocumentRequirement, document?: ResidenceDocument) => void;
    readonly onRemove: (documentId: string) => void;
    readonly removing?: boolean;
}
function statusTone(status: ResidenceDocumentRequirement['verificationStatus']): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    switch (status) {
        case 'VERIFIED':
            return 'success';
        case 'UPLOADING':
        case 'UPLOADED':
        case 'SUBMITTED':
        case 'UNDER_REVIEW':
            return 'info';
        case 'CHANGES_REQUIRED':
        case 'REJECTED':
        case 'EXPIRED':
            return 'danger';
        case 'NOT_SUBMITTED':
            return 'warning';
    }
}
export function DocumentRequirementCard({ requirement, document, onUpload, onView, onRemove, removing = false, }: DocumentRequirementCardProps) {
    const { colors } = useAppTheme();
    const submitted = presentResidenceDate(requirement.submittedAt);
    const expiry = presentResidenceDate(requirement.expiryDate);
    const formats = requirement.acceptedFileTypes
        .map((type) => type === 'application/pdf' ? 'PDF' : getRequiredItem(type.split('/'), 1, "DocumentRequirementCard.tsx").toLocaleUpperCase())
        .join(', ');
    const canUpload = requirement.verificationStatus === 'NOT_SUBMITTED' ||
        requirement.verificationStatus === 'CHANGES_REQUIRED' ||
        requirement.verificationStatus === 'REJECTED' ||
        requirement.verificationStatus === 'EXPIRED';
    const canRemove = requirement.verificationStatus === 'UPLOADED' && Boolean(document);
    const uploadLabel = requirement.submittedDocumentId
        ? residenceAccessMessages.requirements.replace
        : residenceAccessMessages.requirements.upload;
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]} accessible accessibilityLabel={residenceAccessMessages.accessibility.documentRequirement(requirement.title, residenceDocumentStatusLabels[requirement.verificationStatus], requirement.mandatory)}>
      <View style={styles.titleRow}>
        <View style={styles.titleText}>
          <AppText variant="body" weight="800">
            {requirement.title}
          </AppText>
          <AppText variant="caption" tone="secondary">
            {requirement.description}
          </AppText>
        </View>
        <StatusBadge label={residenceDocumentStatusLabels[requirement.verificationStatus]} type={statusTone(requirement.verificationStatus)}/>
      </View>
      <View style={styles.labels}>
        <StatusBadge label={requirement.mandatory
            ? residenceAccessMessages.requirements.mandatory
            : residenceAccessMessages.requirements.optional} type={requirement.mandatory ? 'warning' : 'neutral'}/>
      </View>
      {requirement.rejectionReason ? (<View style={[styles.reason, createViewBackgroundColorStyle(colors.dangerSoft)]}>
          <AppText variant="caption" tone="danger" weight="700">
            {requirement.rejectionReason.residentVisibleReason}
          </AppText>
        </View>) : null}
      <View style={styles.metadata}>
        <AppText variant="tiny" tone="secondary">
          {`${residenceAccessMessages.requirements.acceptedFormats}: ${formats}`}
        </AppText>
        <AppText variant="tiny" tone="secondary">
          {`${residenceAccessMessages.requirements.maximumSize}: ${formatFileSize(requirement.maximumFileSizeBytes)}`}
        </AppText>
        {requirement.submittedAt ? (<AppText variant="tiny" tone="secondary">
            {`${residenceAccessMessages.requirements.submitted}: ${submitted.absolute}`}
          </AppText>) : null}
        {requirement.expiryDate ? (<AppText variant="tiny" tone="secondary">
            {`${residenceAccessMessages.requirements.expires}: ${expiry.absolute}`}
          </AppText>) : null}
      </View>
      <View style={styles.actions}>
        {canUpload ? (<AppButton title={uploadLabel} onPress={() => onUpload(requirement)} size="sm"/>) : null}
        {document ? (<AppButton title={residenceAccessMessages.requirements.view} onPress={() => onView(requirement, document)} variant="outline" size="sm"/>) : null}
        {canRemove && document ? (<AppButton title={residenceAccessMessages.requirements.remove} onPress={() => onRemove(document.documentId)} variant="ghost" size="sm" loading={removing}/>) : null}
      </View>
    </View>);
}

