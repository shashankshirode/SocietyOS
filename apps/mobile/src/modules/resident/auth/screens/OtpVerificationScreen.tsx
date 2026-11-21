import { View } from "react-native";
import { authMessages } from "../messages/auth.messages";
import { OtpVerificationPanel } from "../components/OtpVerificationPanel";
import { AuthenticationSurface } from "../components/AuthenticationSurface";
import { AuthenticationErrorBanner } from "../components/AuthenticationErrorBanner";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/OtpVerificationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface OtpVerificationScreenProps {
    callingCode: string;
    maskedPhone: string;
    otp: string;
    setOtp: (text: string) => void;
    isSubmitting: boolean;
    resendTimer: number;
    error?: string;
    onChangeNumber: () => void;
    onVerify: (code?: string) => void;
    onResend: () => void;
}
export function OtpVerificationScreen({ callingCode, maskedPhone, otp, setOtp, isSubmitting, resendTimer, error, onChangeNumber, onVerify, onResend, }: OtpVerificationScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      
      <AuthenticationErrorBanner visible={!!error} message={error || ''}/>

      
      <AuthenticationSurface eyebrow={authMessages.otpEyebrow} title={authMessages.otpTitle} description={authMessages.otpSubtitle(`${callingCode} ${maskedPhone}`)} accessibilityLabel={localizedUiText.m_19c79ab896cb}>
        <OtpVerificationPanel otp={otp} setOtp={setOtp} isSubmitting={isSubmitting} resendTimer={resendTimer} {...includeWhenPresent("error", error)} callingCode={callingCode} maskedPhone={maskedPhone} onChangeNumber={onChangeNumber} onVerify={onVerify} onResend={onResend}/>
      </AuthenticationSurface>
    </View>);
}

