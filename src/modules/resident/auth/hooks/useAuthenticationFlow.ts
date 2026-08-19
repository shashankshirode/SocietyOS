import { useState, useEffect, useCallback, useMemo } from 'react';
import { resolveAuthenticatedState, supportedCountries, type AuthenticatedResidentState, type SupportedCountry, } from '../data/membership.types';
import { residentAuthRepository } from '../data/residentAuth.repository';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { Absent } from "../../../../shared/types/absence.types";
export function useAuthenticationFlow() {
    const [country, setCountry] = useState<SupportedCountry>(getRequiredItem(supportedCountries, 0, "useAuthenticationFlow.ts"));
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [fullName, setFullName] = useState('');
    const [challengeId, setChallengeId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState<string | Absent>();
    const [authState, setAuthState] = useState<AuthenticatedResidentState | null>(null);
    useEffect(() => {
        if (resendTimer <= 0)
            return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);
    const validatePhone = useCallback(() => {
        if (!phoneNumber)
            return 'Phone number is required.';
        if (phoneNumber.length < country.phoneNumberMinLength) {
            return `Phone number must be at least ${country.phoneNumberMinLength} digits.`;
        }
        if (phoneNumber.length > country.phoneNumberMaxLength) {
            return `Phone number must be at most ${country.phoneNumberMaxLength} digits.`;
        }
        return undefined;
    }, [phoneNumber, country]);
    const requestOtp = useCallback(async () => {
        const validationError = validatePhone();
        if (validationError) {
            setError(validationError);
            return false;
        }
        setIsSubmitting(true);
        setError(undefined);
        try {
            const result = await residentAuthRepository.requestOtp({
                countryCode: country.callingCode,
                mobileNumber: phoneNumber,
            });
            if (result.status === 'rateLimited') {
                setError(`Too many requests. Please try again in ${result.retryAfterSeconds} seconds.`);
                setIsSubmitting(false);
                return false;
            }
            setChallengeId(result.challengeId);
            setResendTimer(result.retryAfterSeconds);
            setIsSubmitting(false);
            return true;
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to send verification code. Please check your network.');
            setIsSubmitting(false);
            return false;
        }
    }, [country, phoneNumber, validatePhone]);
    const verifyOtp = useCallback(async (codeToVerify?: string) => {
        const finalOtp = codeToVerify ?? otp;
        if (finalOtp.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            return null;
        }
        setIsSubmitting(true);
        setError(undefined);
        try {
            const result = await residentAuthRepository.verifyOtp({
                challengeId,
                otp: finalOtp,
            });
            setIsSubmitting(false);
            if (result.status === 'incorrectOtp') {
                setError(`Incorrect code. ${result.attemptsRemaining} attempts remaining.`);
                return null;
            }
            if (result.status === 'expiredOtp') {
                setError('Verification code has expired. Please request a new one.');
                return null;
            }
            if (result.status === 'challengeNotFound') {
                setError('Verification session expired. Please start over.');
                return null;
            }
            const state = resolveAuthenticatedState(result.memberships, result.purpose === 'newRegistration');
            setAuthState(state);
            return { profile: result.profile, state };
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
            setIsSubmitting(false);
            return null;
        }
    }, [challengeId, otp]);
    const resendOtp = useCallback(async () => {
        if (resendTimer > 0)
            return false;
        setIsSubmitting(true);
        setError(undefined);
        try {
            const result = await residentAuthRepository.resendOtp(challengeId);
            if (result.status === 'rateLimited') {
                setError(`Please wait ${result.retryAfterSeconds} seconds before requesting a new code.`);
                setIsSubmitting(false);
                return false;
            }
            setChallengeId(result.challengeId);
            setResendTimer(result.retryAfterSeconds);
            setOtp('');
            setIsSubmitting(false);
            return true;
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to resend code. Please try again.');
            setIsSubmitting(false);
            return false;
        }
    }, [challengeId, resendTimer]);
    const registerProfile = useCallback(async () => {
        if (fullName.trim().length < 2) {
            setError('Please enter your full name (minimum 2 characters).');
            return null;
        }
        setIsSubmitting(true);
        setError(undefined);
        try {
            const result = await residentAuthRepository.registerResident({
                challengeId,
                fullName: fullName.trim(),
            });
            setIsSubmitting(false);
            if (result.status !== 'verified') {
                setError('Registration session expired. Please start again.');
                return null;
            }
            const state = resolveAuthenticatedState(result.memberships, false);
            setAuthState(state);
            return { profile: result.profile, state };
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to complete registration.');
            setIsSubmitting(false);
            return null;
        }
    }, [challengeId, fullName]);
    const resetFlow = useCallback(() => {
        setOtp('');
        setError(undefined);
        setChallengeId('');
        setAuthState(null);
    }, []);
    const maskedPhoneNumber = useMemo(() => {
        if (phoneNumber.length <= 4)
            return phoneNumber;
        const hideLen = phoneNumber.length - 4;
        return '•'.repeat(hideLen) + phoneNumber.slice(-4);
    }, [phoneNumber]);
    return {
        country,
        setCountry,
        phoneNumber,
        setPhoneNumber,
        otp,
        setOtp,
        fullName,
        setFullName,
        isSubmitting,
        resendTimer,
        error,
        setError,
        authState,
        requestOtp,
        verifyOtp,
        resendOtp,
        registerProfile,
        resetFlow,
        maskedPhoneNumber,
    };
}

