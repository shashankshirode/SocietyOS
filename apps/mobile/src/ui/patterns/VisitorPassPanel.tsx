import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3, createViewBackgroundColorStyle, createViewBorderBottomColorStyle, createViewBorderColorStyle, createSafeTextColorStyle10, createPressableScaleBackgroundColorStyle, createPressableScaleBorderColorStyle } from "./styles/VisitorPassPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import QRCode from 'react-native-qrcode-svg';
export interface VisitorPassPanelProps {
    visitorName: string;
    visitorType: string;
    purpose: string;
    validFrom: string;
    validTill: string;
    gateName: string;
    otpCode?: string;
    credentialValue?: string;
    onCancelPress?: () => void;
    onSharePress?: () => void;
    onRegenerateOtp?: () => void;
}
export function VisitorPassPanel({ visitorName, visitorType, purpose, validFrom, validTill, gateName, otpCode, credentialValue, onCancelPress, onSharePress, onRegenerateOtp, }: VisitorPassPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      
      <View style={[styles.cutoutLeft, createViewBackgroundColorBorderColorStyle2(theme.background, theme.border)]}/>
      <View style={[styles.cutoutRight, createViewBackgroundColorBorderColorStyle3(theme.background, theme.border)]}/>

      <View style={styles.header}>
        <View style={[styles.iconContainer, createViewBackgroundColorStyle(theme.accentSoft)]}>
          <Ionicons name="people-outline" size={24} color={theme.accent}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{visitorName}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>{(visitorType || '').toUpperCase()} • {purpose || ''}</SafeText>
        </View>
      </View>

      
      {otpCode && credentialValue ? <View style={[styles.passContainer, createViewBorderBottomColorStyle(theme.border)]}>
        <View style={[styles.qrPlaceholder, createViewBorderColorStyle(theme.border)]}>
          <QRCode value={credentialValue} size={132} backgroundColor="#FFFFFF" color="#111813"/>
        </View>

        <View style={styles.otpSection}>
          <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>{localizedUiText.m_27d5469d840a}</SafeText>
          <SafeText variant="display" style={[styles.otpText, createSafeTextColorStyle10(theme.accent)]}>
            {otpCode}
          </SafeText>
          {onRegenerateOtp && (<PressableScale onPress={onRegenerateOtp} style={styles.regenBtn}>
              <Ionicons name="refresh-outline" size={14} color={theme.accent}/>
              <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.accent)}>{localizedUiText.m_a01a8765b6db}</SafeText>
            </PressableScale>)}
        </View>
      </View> : null}

      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={theme.textSecondary}/>
          <View>
            <SafeText variant="tiny" style={createSafeTextColorStyle5(theme.textSecondary)}>{localizedUiText.m_2689e45960f7}</SafeText>
            <SafeText variant="caption" style={createSafeTextColorStyle6(theme.textPrimary)}>
              {validFrom} — {validTill}
            </SafeText>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color={theme.textSecondary}/>
          <View>
            <SafeText variant="tiny" style={createSafeTextColorStyle7(theme.textSecondary)}>{localizedUiText.m_1f449c6a4a53}</SafeText>
            <SafeText variant="caption" style={createSafeTextColorStyle8(theme.textPrimary)}>
              {gateName}
            </SafeText>
          </View>
        </View>
      </View>

      
      <View style={styles.actions}>
        {onSharePress && (<PressableScale onPress={onSharePress} style={[styles.actionBtn, createPressableScaleBackgroundColorStyle(theme.accent)]}>
            <Ionicons name="share-social-outline" size={16} color="#FFFFFF"/>
            <SafeText variant="caption" style={styles.actionBtnText}>{localizedUiText.m_4c1e051eae00}</SafeText>
          </PressableScale>)}
        {onCancelPress && (<PressableScale onPress={onCancelPress} style={[styles.cancelBtn, createPressableScaleBorderColorStyle(theme.danger)]}>
            <SafeText variant="caption" style={createSafeTextColorStyle9(theme.danger)}>{localizedUiText.m_b41de3374fd6}</SafeText>
          </PressableScale>)}
      </View>
    </View>);
}
export default VisitorPassPanel;
