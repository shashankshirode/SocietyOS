import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { DocumentVaultItem, DocumentCategory, DocumentStatus } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createViewBorderTopColorBorderBottomColorStyle, createViewBorderBottomColorStyle, createViewBackgroundColorStyle } from "./styles/DocumentVaultPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface DocumentVaultPanelProps {
    documents: DocumentVaultItem[];
    onDocumentPress: (id: string) => void;
    onAddDocumentPress: () => void;
    onOpenVaultPress?: () => void;
    sectionTitle?: string;
    sectionSubtitle?: string;
    securityNote?: string;
    addDocumentLabel?: string;
    openVaultLabel?: string;
    summaryLabels?: {
        verified: string;
        pending: string;
        required: string;
        expiring: string;
    };
    emptyTitle?: string;
    emptyDescription?: string;
    statusLabels?: Partial<Record<DocumentStatus, string>>;
}
const statusTones: Record<DocumentStatus, StatusTone> = {
    verified: 'success',
    pending: 'warning',
    expiring: 'warning',
    expired: 'danger',
    missing: 'muted',
};
const categoryIcons: Record<DocumentCategory, keyof typeof Ionicons.glyphMap> = {
    rentAgreement: 'document-text-outline',
    policeVerification: 'shield-checkmark-outline',
    noc: 'document-attach-outline',
    certificate: 'ribbon-outline',
    kyc: 'id-card-outline',
    vehicle: 'car-outline',
};
export function DocumentVaultPanel({ documents, onDocumentPress, onAddDocumentPress, onOpenVaultPress, sectionTitle = getActiveUiLiteral("m_0394ca262c99"), sectionSubtitle = getActiveUiLiteral("m_2c3ff5bf6fad"), securityNote = getActiveUiLiteral("m_7d2fcc8b9837"), addDocumentLabel = getActiveUiLiteral("m_2aa491e69954"), openVaultLabel, summaryLabels, emptyTitle, emptyDescription, statusLabels: statusLabelsProp, }: DocumentVaultPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const resolvedStatusLabels: Record<DocumentStatus, string> = {
        verified: 'VERIFIED',
        pending: 'PENDING',
        expiring: 'EXPIRING SOON',
        expired: 'EXPIRED',
        missing: 'MISSING',
        ...statusLabelsProp,
    };
    const readinessCounts = {
        verified: documents.filter((document) => document.status === 'verified').length,
        pending: documents.filter((document) => document.status === 'pending').length,
        required: documents.filter((document) => document.status === 'missing').length,
        expiring: documents.filter((document) => document.status === 'expiring').length,
    };
    return (<View style={styles.container}>
      <DashboardSectionHeader title={sectionTitle} subtitle={sectionSubtitle} actionLabel={openVaultLabel ?? addDocumentLabel} onActionPress={onOpenVaultPress ?? onAddDocumentPress}/>

      <View style={[styles.vault, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
        
        <View style={styles.vaultHeader}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted}/>
          <SafeText variant="tiny" color="muted">
            {securityNote}
          </SafeText>
        </View>

        {summaryLabels ? (<View style={[styles.summaryRow, createViewBorderTopColorBorderBottomColorStyle(colors.divider, colors.divider)]}> 
            {([
                ['verified', summaryLabels.verified],
                ['pending', summaryLabels.pending],
                ['required', summaryLabels.required],
                ['expiring', summaryLabels.expiring],
            ] as const).map(([key, label]) => (<View key={key} style={styles.summaryItem}>
                <SafeText variant="bodyStrong" color="primary">{readinessCounts[key]}</SafeText>
                <SafeText variant="tiny" color="muted" numberOfLines={1}>{label}</SafeText>
              </View>))}
          </View>) : null}

        
        {documents.length === 0 ? (<View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={28} color={colors.textMuted}/>
            {emptyTitle ? <SafeText variant="bodyStrong" color="primary">{emptyTitle}</SafeText> : null}
            {emptyDescription ? <SafeText variant="caption" color="muted" align="center">{emptyDescription}</SafeText> : null}
          </View>) : documents.map((doc, index) => {
            const isLast = index === documents.length - 1;
            return (<PressableScale key={doc.id} onPress={() => onDocumentPress(doc.id)}>
              <View style={[styles.docRow, !isLast && createViewBorderBottomColorStyle(colors.border)]}> 
                <View style={[styles.docIcon, createViewBackgroundColorStyle(colors.primarySoft)]}> 
                  <Ionicons name={categoryIcons[doc.category]} size={16} color={colors.primary}/>
                </View>
                <View style={styles.docText}>
                  <SafeText variant="caption" color="primary" numberOfLines={1} style={styles.safeTextFontWeight}>
                    {doc.title}
                  </SafeText>
                  <View style={styles.docMeta}>
                    <StatusPill label={resolvedStatusLabels[doc.status]} tone={statusTones[doc.status]} small/>
                    {doc.sensitive && (<Ionicons name="eye-off-outline" size={12} color={colors.textMuted}/>)}
                  </View>
                  {doc.readinessLabel ? (<SafeText variant="tiny" color="muted" numberOfLines={1}>{doc.readinessLabel}</SafeText>) : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted}/>
              </View>
            </PressableScale>);
        })}

        
        <Pressable onPress={onOpenVaultPress ?? onAddDocumentPress} style={styles.addRow}>
          <Ionicons name="lock-open-outline" size={18} color={colors.primary}/>
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)}>{openVaultLabel ?? addDocumentLabel}</SafeText>
        </Pressable>
      </View>
    </View>);
}

