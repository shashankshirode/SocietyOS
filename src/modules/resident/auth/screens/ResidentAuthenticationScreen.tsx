import { useState, useEffect } from "react";
import { AccessibilityInfo, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { useAuthenticationFlow } from "../hooks/useAuthenticationFlow";
import { LoginScreen } from "./LoginScreen";
import { OtpVerificationScreen } from "./OtpVerificationScreen";
import { RegistrationScreen } from "./RegistrationScreen";
import { clearCurrentSession } from "../../../../core/auth/sessionStore";
import type { ResidenceAccessDetail } from "../../../../features/residenceAccess/models/residenceAccess.types";
import { ResidenceAccessExperienceScreen } from "../../../../features/residenceAccess/screens/ResidenceAccessExperienceScreen";
import { establishResidentResidenceSession } from "../../../../features/residenceAccess/services/ResidentResidenceSessionService";
import { ResidentAccessShell } from "../components/ResidentAccessShell";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/ResidentAuthenticationScreen.styles";
type AuthStep = 'login' | 'otp' | 'registration' | 'residenceAccess';
interface VerifiedResident {
    readonly userId: string;
    readonly fullName: string;
    readonly mobileNumber: string;
}
export function ResidentAuthenticationScreen() {
    const [step, setStep] = useState<AuthStep>('login');
    const [resident, setResident] = useState<VerifiedResident | null>(null);
    const authFlow = useAuthenticationFlow();
    const [activeStep, setActiveStep] = useState<AuthStep>('login');
    const [prevStep, setPrevStep] = useState<AuthStep | null>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const transitionVal = useSharedValue(0);
    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    }, []);
    useEffect(() => {
        if (step === 'login' && activeStep === 'otp') {
            setPrevStep('otp');
            transitionVal.value = withTiming(0, { duration: reducedMotion ? 0 : 250 }, (finished) => {
                if (finished) {
                    runOnJS(setActiveStep)('login');
                    runOnJS(setPrevStep)(null);
                }
            });
        }
        else if (step === 'otp' && activeStep === 'login') {
            setPrevStep('login');
            transitionVal.value = withTiming(1, { duration: reducedMotion ? 0 : 250 }, (finished) => {
                if (finished) {
                    runOnJS(setActiveStep)('otp');
                    runOnJS(setPrevStep)(null);
                }
            });
        }
        else if (step === 'registration' || step === 'residenceAccess') {
            setActiveStep(step);
            setPrevStep(null);
            transitionVal.value = step === 'registration' ? 2 : 0;
        }
    }, [step, activeStep, reducedMotion, transitionVal]);
    const animatedLoginStyle = useAnimatedStyle(() => {
        return {
            opacity: 1 - transitionVal.value,
            transform: [{ translateX: -12 * transitionVal.value }]
        };
    });
    const animatedOtpStyle = useAnimatedStyle(() => {
        return {
            opacity: transitionVal.value,
            transform: [{ translateX: 12 * (1 - transitionVal.value) }]
        };
    });
    const handleLoginSubmit = async () => {
        if (await authFlow.requestOtp()) {
            setStep('otp');
        }
    };
    const handleOtpVerify = async (code?: string) => {
        const result = await authFlow.verifyOtp(code);
        if (!result)
            return;
        setResident({
            userId: result.profile.userId,
            fullName: result.profile.fullName,
            mobileNumber: `${result.profile.countryCode} ${result.profile.mobileNumber}`
        });
        setStep(result.state.type === 'newResident' ? 'registration' : 'residenceAccess');
    };
    const handleRegistrationSubmit = async () => {
        const result = await authFlow.registerProfile();
        if (!result)
            return;
        setResident({
            userId: result.profile.userId,
            fullName: result.profile.fullName,
            mobileNumber: `${result.profile.countryCode} ${result.profile.mobileNumber}`
        });
        setStep('residenceAccess');
    };
    const handleEnterResidence = async (detail: ResidenceAccessDetail): Promise<boolean> => {
        return resident ? establishResidentResidenceSession(resident, detail) : false;
    };
    const handleLogout = async () => {
        await clearCurrentSession();
        authFlow.resetFlow();
        setResident(null);
        setStep('login');
    };
    if (step === 'residenceAccess' && resident) {
        return (<ResidenceAccessExperienceScreen userId={resident.userId} residentName={resident.fullName} mobileNumber={resident.mobileNumber} onEnterResidence={handleEnterResidence} onSignOut={handleLogout}/>);
    }
    const isFormValid = authFlow.phoneNumber.length >= authFlow.country.phoneNumberMinLength &&
        authFlow.phoneNumber.length <= authFlow.country.phoneNumberMaxLength;
    const renderLogin = activeStep === 'login' || prevStep === 'login';
    const renderOtp = activeStep === 'otp' || prevStep === 'otp';
    return (<ResidentAccessShell isPhoneValid={isFormValid}>
      <View style={styles.container}>
        {renderLogin && (<Animated.View style={[
                activeStep !== 'login' ? styles.absoluteForm : styles.relativeForm,
                animatedLoginStyle,
            ]} pointerEvents={activeStep === 'login' ? 'auto' : 'none'}>
            <LoginScreen country={authFlow.country} setCountry={authFlow.setCountry} phoneNumber={authFlow.phoneNumber} setPhoneNumber={authFlow.setPhoneNumber} isSubmitting={authFlow.isSubmitting} {...includeWhenPresent("error", authFlow.error)} onSubmit={handleLoginSubmit}/>
          </Animated.View>)}

        {renderOtp && (<Animated.View style={[
                activeStep !== 'otp' ? styles.absoluteForm : styles.relativeForm,
                animatedOtpStyle,
            ]} pointerEvents={activeStep === 'otp' ? 'auto' : 'none'}>
            <OtpVerificationScreen callingCode={authFlow.country.callingCode} maskedPhone={authFlow.maskedPhoneNumber} otp={authFlow.otp} setOtp={authFlow.setOtp} isSubmitting={authFlow.isSubmitting} resendTimer={authFlow.resendTimer} {...includeWhenPresent("error", authFlow.error)} onChangeNumber={() => setStep('login')} onVerify={handleOtpVerify} onResend={authFlow.resendOtp}/>
          </Animated.View>)}

        {activeStep === 'registration' && (<RegistrationScreen fullName={authFlow.fullName} setFullName={authFlow.setFullName} isSubmitting={authFlow.isSubmitting} {...includeWhenPresent("error", authFlow.error)} onSubmit={handleRegistrationSubmit}/>)}
      </View>
    </ResidentAccessShell>);
}

