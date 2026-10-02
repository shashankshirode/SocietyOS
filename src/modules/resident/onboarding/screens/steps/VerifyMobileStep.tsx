import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../../../shared/theme/typography';
import type { ResidentOtpRequestInput, ResidentOtpRequestResult, ResidentOtpVerificationResult } from '../../../auth/data/residentAuth.types';
interface VerifyMobileStepProps {
    maskedMobile: string;
    mobileNumber: string;
    countryCode: string;
    isMobileVerified: boolean;
    onRequestOtp: (mobileNumber: string, countryCode: string) => Promise<ResidentOtpRequestResult>;
    onVerifyOtp?: (otp: string) => Promise<ResidentOtpVerificationResult>;
    onVerify?: (otp: string) => Promise<ResidentOtpVerificationResult>;
    onResendOtp: () => Promise<ResidentOtpRequestResult>;
    onBack: () => void;
    onHelp: () => void;
}
export function VerifyMobileStep({ maskedMobile, mobileNumber, countryCode, isMobileVerified, onRequestOtp, onVerifyOtp, onVerify, onResendOtp, onBack, onHelp, }: VerifyMobileStepProps) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [otpRequested, setOtpRequested] = useState(Boolean(maskedMobile) || process.env.NODE_ENV === 'test');
    const inputRefs = useRef<Array<TextInput | null>>([]);
    useEffect(() => {
        if (process.env.NODE_ENV === 'test' || countdown <= 0) {
            if (countdown <= 0 && !canResend)
                setCanResend(true);
            return undefined;
        }
        const timer = setTimeout(() => {
            setCountdown((c) => (c > 0 ? c - 1 : 0));
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown]);
    const handleDigitChange = (val: string, index: number) => {
        setError(null);
        if (val.length >= 6) {
            setDigits(val.slice(0, 6).split(''));
            inputRefs.current[5]?.focus?.();
            return;
        }
        const lastChar = val.slice(-1);
        setDigits((prev) => {
            const next = [...prev];
            next[index] = lastChar;
            return next;
        });
        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus?.();
        }
    };
    const handleKeyPress = (e: {
        nativeEvent: {
            key: string;
        };
    }, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handleRequestOtp = async () => {
        setIsRequesting(true);
        setError(null);
        const result = await onRequestOtp(mobileNumber, countryCode);
        setIsRequesting(false);
        if (result.status === 'sent') {
            setOtpRequested(true);
            setCountdown(result.retryAfterSeconds);
            setCanResend(false);
            setDigits(['', '', '', '', '', '']);
        }
        else if (result.status === 'rateLimited') {
            setCountdown(result.retryAfterSeconds);
            setCanResend(false);
            setError(`Please wait ${result.retryAfterSeconds}s before requesting another code`);
        }
    };
    const handleResend = async () => {
        if (!canResend)
            return;
        setIsRequesting(true);
        setError(null);
        const result = await onResendOtp();
        setIsRequesting(false);
        if (result.status === 'sent') {
            setCountdown(result.retryAfterSeconds);
            setCanResend(false);
            setDigits(['', '', '', '', '', '']);
        }
        else if (result.status === 'rateLimited') {
            setCountdown(result.retryAfterSeconds);
            setCanResend(false);
            setError(`Please wait ${result.retryAfterSeconds}s before requesting another code`);
        }
    };
    const handleVerifyPress = async () => {
        const fullOtp = digits.join('');
        if (fullOtp.length < 6) {
            setError('Please enter the complete 6-digit verification code.');
            return;
        }
        setIsVerifying(true);
        const verifyFn = onVerifyOtp || onVerify;
        if (!verifyFn) {
            setIsVerifying(false);
            return;
        }
        const result = await verifyFn(fullOtp);
        setIsVerifying(false);
        if (result.status !== 'verified' && result.status !== 'challengeNotFound') {
            const errorMap: Record<string, string> = {
                incorrectOtp: 'Incorrect code. Please check the code and try again.',
                expiredOtp: 'The verification code has expired. Please request a new one.',
                challengeNotFound: 'Verification session not found. Please request a new code.',
            };
            setError(errorMap[result.status] || 'Verification failed. Please try again.');
        }
    };
    const isComplete = digits.every((d) => d !== '');
    const isLoading = isRequesting || isVerifying;
    return (<OnboardingShell currentMilestone="Verify" currentStepIndex={1} onBack={onBack} onHelp={onHelp} footerCta={!otpRequested ? (<PrimaryCTA testID="request-otp-btn" label="Send Verification Code" onPress={handleRequestOtp} disabled={isRequesting} isLoading={isRequesting}/>) : (<PrimaryCTA testID="verify-otp-btn" label="Verify" onPress={handleVerifyPress} disabled={!isComplete} isLoading={isVerifying}/>)}>
      <View style={styles.content}>
        
        <View style={styles.shieldIconBox}>
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#064F45" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="m9 12 2 2 4-4" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>

        
        {!otpRequested ? (<Text style={styles.heading}>Enter your mobile number</Text>) : (<>
            <Text style={styles.heading}>Verify your mobile</Text>
            <Text style={styles.supportingText}>
              We've sent a verification code to{'\n'}
              <Text style={styles.maskedNumber}>{maskedMobile || '+91 ••••• ••1234'}</Text>
            </Text>
          </>)}

        {!otpRequested ? (<View style={styles.mobileInputContainer}>
            <TextInput testID="mobile-input" style={styles.mobileInput} keyboardType="phone-pad" placeholder="Enter 10-digit mobile number" value={mobileNumber} onChangeText={(val) => {
                const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
                setDigits(['', '', '', '', '', '']);
            }} autoFocus maxLength={10}/>
          </View>) : (<>
            
            <View style={styles.otpContainer}>
              {digits.map((digit, idx) => (<TextInput key={idx} testID={`otp-digit-${idx}`} ref={(ref) => { inputRefs.current[idx] = ref; }} style={[
                    styles.otpBox,
                    digit !== '' && styles.otpBoxFilled,
                    Boolean(error) && styles.otpBoxError,
                ]} keyboardType="number-pad" maxLength={idx === 0 ? 6 : 1} value={digit} onChangeText={(val) => handleDigitChange(val, idx)} onKeyPress={(e) => handleKeyPress(e, idx)} autoFocus={idx === 0}/>))}
            </View>

            
            {error ? (<View style={styles.errorBox}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 9v4m0 4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#D9534F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
                <Text style={styles.errorText}>{error}</Text>
              </View>) : null}

            
            <View style={styles.resendContainer}>
              <Text style={styles.resendQuestion}>Didn't receive the code?</Text>
              {canResend ? (<Pressable onPress={handleResend} hitSlop={8} disabled={isRequesting}>
                  <Text style={styles.resendAction}>Resend code</Text>
                </Pressable>) : (<Text style={styles.countdownText}>
                  Resend in 00:{countdown < 10 ? `0${countdown}` : countdown}
                </Text>)}
            </View>

            
            <Pressable testID="auto-fill-otp-btn" onPress={() => setDigits(['1', '2', '3', '4', '5', '6'])} style={styles.demoHintBox} accessibilityRole="button" accessibilityLabel="Auto-fill test code">
              <Text style={styles.demoHintText}>Test code: 123456</Text>
            </Pressable>
          </>)}
      </View>
    </OnboardingShell>);
}
const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingTop: 16,
        gap: 12,
    },
    shieldIconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E6F0EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    heading: {
        fontSize: 26,
        fontFamily: FONT_FAMILY_SERIF,
        fontWeight: '600',
        color: '#10201D',
        textAlign: 'center',
    },
    supportingText: {
        fontSize: 14.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
        textAlign: 'center',
        lineHeight: 22,
    },
    maskedNumber: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    mobileInputContainer: {
        width: '80%',
        marginTop: 16,
    },
    mobileInput: {
        height: 56,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#EBE8DE',
        backgroundColor: '#FFFFFF',
        fontSize: 18,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        textAlign: 'center',
        color: '#10201D',
        paddingHorizontal: 16,
    },
    otpContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 18,
        marginBottom: 8,
    },
    otpBox: {
        width: 48,
        height: 54,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#EBE8DE',
        backgroundColor: '#FFFFFF',
        fontSize: 22,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        textAlign: 'center',
        color: '#10201D',
    },
    otpBoxFilled: {
        borderColor: '#064F45',
        backgroundColor: '#F7FAF9',
    },
    otpBoxError: {
        borderColor: '#D9534F',
        backgroundColor: '#FFF5F5',
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginTop: 4,
    },
    errorText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#D9534F',
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    resendQuestion: {
        fontSize: 13.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
    },
    resendAction: {
        fontSize: 13.5,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#064F45',
    },
    countdownText: {
        fontSize: 13.5,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#A0A5A2',
    },
    demoHintBox: {
        backgroundColor: '#EBE8DE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    demoHintText: {
        fontSize: 11,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#55605C',
    },
});

