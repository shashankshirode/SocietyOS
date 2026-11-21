import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { formatFileSize } from "../../../shared/files/fileSizeFormatter";
import { residenceAccessMessages, residenceDocumentSideLabels, residenceDocumentStatusLabels } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { ResidenceDocument, ResidenceDocumentRequirement } from "../models/residenceAccess.types";
import { styles, createViewBorderColorBackgroundColorStyle, createViewBackgroundColorStyle } from "../styles/components/ResidenceDocumentDetailSheet.styles";
interface ResidenceDocumentDetailSheetProps {
    readonly visible: boolean;
    readonly requirement: ResidenceDocumentRequirement | null;
    readonly document: ResidenceDocument | null;
    readonly onDismiss: () => void;
}
export function ResidenceDocumentDetailSheet({ visible, requirement, document, onDismiss, }: ResidenceDocumentDetailSheetProps) {
    const { colors } = useAppTheme();
    if (!requirement || !document) {
        return null;
    }
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss} header={(<ModalHeader title={requirement.title} subtitle={residenceAccessMessages.decision.previousVersions} onClose={onDismiss}/>)}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {document.versions.slice().reverse().map((version) => {
            const submitted = presentResidenceDate(version.submittedAt);
            return (<View key={version.versionId} style={[styles.version, createViewBorderColorBackgroundColorStyle(colors.border, colors.surfaceMuted)]}>
              <View style={styles.versionHeader}>
                <View style={[styles.icon, createViewBackgroundColorStyle(colors.surface)]}>
                  <Ionicons name="document-text-outline" size={22} color={colors.primary}/>
                </View>
                <View style={styles.versionTitle}>
                  <AppText variant="bodySmall" weight="800">
                    {residenceAccessMessages.requirements.version(version.versionNumber)}
                  </AppText>
                  <AppText variant="caption" tone="secondary" numberOfLines={2}>
                    {version.fileName}
                  </AppText>
                </View>
                <StatusBadge label={residenceDocumentStatusLabels[version.verificationStatus]} type={version.verificationStatus === 'VERIFIED' ? 'success' : version.verificationStatus === 'REJECTED' || version.verificationStatus === 'CHANGES_REQUIRED' ? 'danger' : 'info'}/>
              </View>
              <AppText variant="caption" tone="secondary">
                {`${formatFileSize(version.fileSizeBytes)} · ${version.mimeType} · ${residenceDocumentSideLabels[version.side]}`}
              </AppText>
              <AppText variant="tiny" tone="muted">
                {`${residenceAccessMessages.requirements.submitted}: ${submitted.absolute}`}
              </AppText>
            </View>);
        })}
      </ScrollView>
    </AppBottomSheet>);
}

