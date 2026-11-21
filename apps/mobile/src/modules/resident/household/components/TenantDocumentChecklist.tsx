import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusBadge, getDocumentStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { TenantDocumentChecklistItem, TenantDocumentType } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { styles, createViewBorderColorBackgroundColorStyle, createSafeTextColorStyle } from "../styles/components/TenantDocumentChecklist.styles";
type TenantDocumentChecklistProps = {
    documents: TenantDocumentChecklistItem[];
    onMockUpload?: (documentType: TenantDocumentType) => void;
};
export function TenantDocumentChecklist({ documents, onMockUpload }: TenantDocumentChecklistProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const uploadedDocs = documents.filter((d) => d.status === 'UPLOADED' || d.status === 'PENDING_VERIFICATION' || d.status === 'VERIFIED');
    const requiredMissingDocs = documents.filter((d) => (d.status === 'MISSING' || d.status === 'REJECTED') && d.required);
    const optionalMissingDocs = documents.filter((d) => (d.status === 'MISSING' || d.status === 'REJECTED') && !d.required);
    const renderDocRow = (document: TenantDocumentChecklistItem) => (<View key={document.documentType} style={[styles.row, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
      <Ionicons name="document-lock-outline" size={18} color={colors.primary}/>
      <View style={styles.content}>
        <SafeText variant="caption" color="primary">{t(messages, `resident.tenant.documents.types.${document.documentType}`)}</SafeText>
        <SafeText variant="tiny" color="muted">
          {document.required ? t(messages, 'resident.tenant.documents.required') : t(messages, 'resident.tenant.documents.optional')}
        </SafeText>
      </View>
      <StatusBadge label={t(messages, `resident.tenant.documents.status.${document.status}`)} type={getDocumentStatusBadgeType(document.status)}/>
      {onMockUpload ? (<Pressable onPress={() => onMockUpload(document.documentType)} accessibilityRole="button" accessibilityLabel={t(messages, 'resident.accessibility.household.mockUploadDocument')}>
          <SafeText variant="tiny" color="info" style={styles.safeTextMarginLeftFontWeight}>
            {t(messages, 'resident.tenant.documents.mockUploadAction')}
          </SafeText>
        </Pressable>) : null}
    </View>);
    return (<View style={styles.list}>
      <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.tenant.documents.title')}</SafeText>

      {uploadedDocs.length > 0 && (<View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionHeader}>{localizedUiText.m_2bdd64098607}</SafeText>
          {uploadedDocs.map(renderDocRow)}
        </View>)}

      {requiredMissingDocs.length > 0 && (<View style={styles.section}>
          <SafeText variant="caption" style={[styles.sectionHeader, createSafeTextColorStyle(colors.danger)]}>{localizedUiText.m_cc913e71fd74}</SafeText>
          {requiredMissingDocs.map(renderDocRow)}
        </View>)}

      {optionalMissingDocs.length > 0 && (<View style={styles.section}>
          <SafeText variant="caption" color="secondary" style={styles.sectionHeader}>{localizedUiText.m_9a247b6fce30}</SafeText>
          {optionalMissingDocs.map(renderDocRow)}
        </View>)}
    </View>);
}
export default TenantDocumentChecklist;

