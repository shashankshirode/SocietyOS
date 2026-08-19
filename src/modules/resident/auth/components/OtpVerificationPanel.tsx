import { Pressable, View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { authMessages } from "../messages/auth.messages";
import { OtpCodeInput } from "./OtpCodeInput";
import { SecureAccessButton } from "./SecureAccessButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3, createAppTextColorStyle4 } from "../styles/components/OtpVerificationPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface OtpVerificationPanelProps {
    otp: string;
    setOtp: (text: string) => void;
    isSubmitting: boolean;
    resendTimer: number;
    error?: string;
    callingCode: string;
    maskedPhone: string;
    onChangeNumber: () => void;
    onVerify: (code?: string) => void;
    onResend: () => void;
}
export function OtpVerificationPanel({ otp, setOtp, isSubmitting, resendTimer, error, onChangeNumber, onVerify, onResend, }: OtpVerificationPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      
      <View style={styles.inputWrapper}>
        <OtpCodeInput value={otp} onChangeText={setOtp} onComplete={onVerify} error={!!error} disabled={isSubmitting}/>
      </View>

      
      <View style={styles.actionRow}>
        <Pressable onPress={onChangeNumber} style={styles.changeBtn} accessibilityRole="button" accessibilityLabel={authMessages.otpChangeNumber} disabled={isSubmitting}>
          <Ionicons name="arrow-back" size={14} color={colors.primary}/>
          <AppText variant="bodySmall" style={createAppTextColorStyle(colors.primary)}>
            {authMessages.otpChangeNumber}
          </AppText>
        </Pressable>

        <View style={styles.resendArea}>
          {resendTimer > 0 ? (<AppText variant="caption" style={createAppTextColorStyle2(colors.textSecondary)}>
              {authMessages.otpResendCountdown(resendTimer)}
            </AppText>) : (<Pressable onPress={onResend} disabled={isSubmitting} accessibilityRole="button" accessibilityLabel={authMessages.otpResendAction}>
              <AppText variant="bodySmall" style={createAppTextColorStyle3(colors.primary)}>
                {authMessages.otpResendAction}
              </AppText>
            </Pressable>)}
        </View>
      </View>

      
      <AppText variant="caption" style={[styles.disclaimer, createAppTextColorStyle4(colors.textMuted)]}>
        {authMessages.otpExpiryText}
      </AppText>

      
      <SecureAccessButton title={localizedUiText.m_f6778950d77c} onPress={() => onVerify()} loading={isSubmitting} disabled={otp.length < 6 || isSubmitting}/>
    </View>);
}

