import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createViewBackgroundColorBorderColorStyle, createViewBorderColorStyle, createSafeTextColorStyle7, createSafeTextColorStyle8, createViewBorderTopColorStyle, createViewBorderColorStyle2, createViewBackgroundColorStyle } from "./styles/CertificatePreview.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface CertificatePreviewProps {
    title: string;
    certificateNumber: string;
    residentName: string;
    unitLabel: string;
    issueDate: string;
    validTill?: string;
    authorizedSignatory?: string;
    verificationCode?: string;
}
export function CertificatePreview({ title, certificateNumber, residentName, unitLabel, issueDate, validTill = 'Indefinite', authorizedSignatory = getActiveUiLiteral("m_35a069333903"), verificationCode = 'SEC-OS-82847', }: CertificatePreviewProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      
      <View style={[styles.innerBorder, createViewBorderColorStyle(theme.border)]}/>

      <View style={styles.header}>
        <Ionicons name="ribbon-outline" size={32} color={theme.accent}/>
        <SafeText variant="bodyStrong" style={[styles.certTitle, createSafeTextColorStyle7(theme.accent)]}>
          {title.toUpperCase()}
        </SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>{localizedUiText.m_38178a20b470}{certificateNumber}
        </SafeText>
      </View>

      <View style={styles.body}>
        <SafeText variant="tiny" color="muted" align="center">{localizedUiText.m_175bc956b1ed}</SafeText>
        <SafeText variant="bodyStrong" style={[styles.name, createSafeTextColorStyle8(theme.textPrimary)]} align="center">
          {residentName}
        </SafeText>
        <SafeText variant="caption" color="secondary" align="center">{localizedUiText.m_7c0e8fa6eb25}<SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{unitLabel}</SafeText>
        </SafeText>
        <SafeText variant="tiny" color="muted" align="center" style={styles.statement}>{localizedUiText.m_c03ecfc7cb31}</SafeText>
      </View>

      
      <View style={[styles.verifiableSection, createViewBorderTopColorStyle(theme.border)]}>
        <View style={[styles.qrContainer, createViewBorderColorStyle2(theme.border)]}>
          <Ionicons name="qr-code-outline" size={54} color={theme.textPrimary}/>
        </View>
        <View style={styles.verifiableText}>
          <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>{localizedUiText.m_7048935c58ff}</SafeText>
          <SafeText variant="tiny" color="muted">{localizedUiText.m_5f09e1f74a6d}{verificationCode}
          </SafeText>
          <SafeText variant="tiny" color="muted">{localizedUiText.m_c75f32443fa2}</SafeText>
        </View>
      </View>

      
      <View style={styles.footer}>
        <View>
          <SafeText variant="tiny" color="muted">{localizedUiText.m_a352bd9557bc}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textPrimary)}>{issueDate}</SafeText>
          <SafeText variant="tiny" color="muted" style={styles.safeTextMarginTop}>{localizedUiText.m_e655d1eb1e21}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle5(theme.textPrimary)}>{validTill}</SafeText>
        </View>

        <View style={styles.sigContainer}>
          <View style={[styles.sigLine, createViewBackgroundColorStyle(theme.textSecondary)]}/>
          <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.textPrimary)}>
            {authorizedSignatory}
          </SafeText>
          <SafeText variant="tiny" color="muted">{localizedUiText.m_7009abe34964}</SafeText>
        </View>
      </View>
    </View>);
}
export default CertificatePreview;

