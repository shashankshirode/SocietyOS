import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpVerificationScreen } from '../screens/OtpVerificationScreen';
import { authMessages } from '../messages/auth.messages';
import { ResidentAccessShell } from '../components/ResidentAccessShell';
describe('Resident Authentication Screen Visuals & Actions', () => {
    it('renders login screen elements correctly without duplicate headers', async () => {
        const mockSubmit = jest.fn();
        const mockSetPhoneNumber = jest.fn();
        await renderWithProviders(<ResidentAccessShell isPhoneValid={true}>
        <LoginScreen country={{
                isoCode: 'IN',
                displayName: 'India',
                flag: '🇮🇳',
                callingCode: '+91',
                phoneNumberMinLength: 10,
                phoneNumberMaxLength: 10,
                phoneNumberExample: '98765 43210',
                defaultTimeZone: 'Asia/Kolkata',
                defaultLocale: 'en-IN',
            }} setCountry={jest.fn()} phoneNumber="7276834907" setPhoneNumber={mockSetPhoneNumber} isSubmitting={false} onSubmit={mockSubmit}/>
      </ResidentAccessShell>);
        expect(screen.getByText(authMessages.welcomeEyebrow)).toBeTruthy();
        expect(screen.getByText(authMessages.welcomeTitle)).toBeTruthy();
        expect(screen.getByText(authMessages.welcomeSubtitle)).toBeTruthy();
        expect(screen.getByText(authMessages.continueButton)).toBeTruthy();
        expect(screen.getByText(authMessages.brandTrust)).toBeTruthy();
    });
    it('renders OTP screen elements and verify action exactly once', async () => {
        const mockVerify = jest.fn();
        const mockChangeNumber = jest.fn();
        const mockResend = jest.fn();
        await renderWithProviders(<ResidentAccessShell>
        <OtpVerificationScreen callingCode="+91" maskedPhone="••••••4907" otp="12345" setOtp={jest.fn()} isSubmitting={false} resendTimer={21} onChangeNumber={mockChangeNumber} onVerify={mockVerify} onResend={mockResend}/>
      </ResidentAccessShell>);
        const headings = screen.getAllByText(authMessages.otpTitle);
        expect(headings).toHaveLength(1);
        const subtitles = screen.getAllByText(authMessages.otpSubtitle('+91 ••••••4907'));
        expect(subtitles).toHaveLength(1);
        expect(screen.getByText(authMessages.otpExpiryText)).toBeTruthy();
        const verifyBtn = screen.getByText('Verify and continue');
        expect(verifyBtn).toBeTruthy();
        const changeBtn = screen.getByText(authMessages.otpChangeNumber);
        expect(changeBtn).toBeTruthy();
        fireEvent.press(changeBtn);
        expect(mockChangeNumber).toHaveBeenCalled();
    });
});

