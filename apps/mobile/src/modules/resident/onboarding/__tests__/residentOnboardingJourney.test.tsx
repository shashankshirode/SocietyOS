import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentOnboardingScreen } from '../screens/ResidentOnboardingScreen';
import { resetGlobalDraft } from '../hooks/useResidentOnboardingDraft';
describe('Resident Onboarding Complete Journey (Flow 1)', () => {
    beforeEach(() => {
        resetGlobalDraft();
    });
    it('navigates through the complete Owner journey from mobile verify to welcome home', async () => {
        const onCompleteMock = jest.fn();
        const onCancelMock = jest.fn();
        const screen = await renderWithProviders(<ResidentOnboardingScreen onComplete={onCompleteMock} onCancel={onCancelMock}/>);
        expect(screen.getByText('Verify your mobile')).toBeTruthy();
        expect(screen.getByText('+91 ••••• ••1234')).toBeTruthy();
        fireEvent.changeText(screen.getByTestId('otp-digit-0'), '123456');
        await waitFor(() => {
            expect(screen.getByTestId('verify-otp-btn')).not.toBeDisabled();
        });
        fireEvent.press(screen.getByTestId('verify-otp-btn'));
        await waitFor(() => {
            expect(screen.getByText('Find your community')).toBeTruthy();
            expect(screen.getByText('Green Valley Heights')).toBeTruthy();
        });
        const societyCard = screen.getByText('Green Valley Heights');
        fireEvent.press(societyCard);
        await waitFor(() => {
            expect(screen.getByText('Is this your community?')).toBeTruthy();
        });
        const confirmSocietyBtn = screen.getByText('Yes, continue');
        fireEvent.press(confirmSocietyBtn);
        await waitFor(() => {
            expect(screen.getByText('Find your home')).toBeTruthy();
            expect(screen.getByText('Tower A')).toBeTruthy();
            expect(screen.getByText('A-1204')).toBeTruthy();
        });
        const unitPill = screen.getByText('A-1204');
        fireEvent.press(unitPill);
        await waitFor(() => {
            expect(screen.getByText('Is this your home?')).toBeTruthy();
        });
        const confirmUnitBtn = screen.getByText('Yes, this is my home');
        fireEvent.press(confirmUnitBtn);
        await waitFor(() => {
            expect(screen.getByText('How are you connected to this home?')).toBeTruthy();
            expect(screen.getByText('Owner')).toBeTruthy();
            expect(screen.getByText('Tenant')).toBeTruthy();
            expect(screen.getByText('Family member')).toBeTruthy();
        });
        const ownerOption = screen.getByText('Owner');
        fireEvent.press(ownerOption);
        await waitFor(() => {
            expect(screen.getByTestId('primary-cta-btn')).not.toBeDisabled();
        });
        fireEvent.press(screen.getByTestId('primary-cta-btn'));
        await waitFor(() => {
            expect(screen.getByText('Tell us a little about you')).toBeTruthy();
            expect(screen.getByText('Full legal name *')).toBeTruthy();
            expect(screen.getByText('Verified')).toBeTruthy();
        });
        const continueDocsBtn = screen.getByText('Continue to documents');
        fireEvent.press(continueDocsBtn);
        await waitFor(() => {
            expect(screen.getByText('A few documents are needed')).toBeTruthy();
        });
        const uploadButtons = screen.getAllByText('Upload');
        const firstUploadBtn = uploadButtons[0];
        expect(firstUploadBtn).toBeDefined();
        if (firstUploadBtn) fireEvent.press(firstUploadBtn);
        await waitFor(() => {
            expect(screen.getByText('Take a photo')).toBeTruthy();
        });
        const cameraOption = screen.getByText('Take a photo');
        fireEvent.press(cameraOption);
        await waitFor(() => {
            expect(screen.getByText('Confirm & Upload')).toBeTruthy();
        });
        const confirmUploadBtn = screen.getByText('Confirm & Upload');
        fireEvent.press(confirmUploadBtn);
        await waitFor(() => {
            expect(screen.getAllByText('Upload').length).toBeGreaterThan(0);
        });
        const secondUploadBtn = screen.getAllByText('Upload')[0];
        expect(secondUploadBtn).toBeDefined();
        if (secondUploadBtn) fireEvent.press(secondUploadBtn);
        await waitFor(() => {
            expect(screen.getByText('Choose from device')).toBeTruthy();
        });
        const deviceOption = screen.getByText('Choose from device');
        fireEvent.press(deviceOption);
        await waitFor(() => {
            expect(screen.getByText('Confirm & Upload')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Confirm & Upload'));
        await waitFor(() => {
            expect(screen.getByText('Continue to review')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Continue to review'));
        await waitFor(() => {
            expect(screen.getByText('Review your details')).toBeTruthy();
            expect(screen.getByText('YOUR HOME')).toBeTruthy();
            expect(screen.getByText('YOUR ROLE')).toBeTruthy();
            expect(screen.getByText('YOUR DETAILS')).toBeTruthy();
            expect(screen.getByText('DOCUMENTS')).toBeTruthy();
        });
        const submitBtn = screen.getByText('Submit for verification');
        fireEvent.press(submitBtn);
        await waitFor(() => {
            expect(screen.getByText("You're all set.")).toBeTruthy();
        }, { timeout: 3000 });
        const proceedPermissionsBtn = screen.getByText('Continue');
        fireEvent.press(proceedPermissionsBtn);
        await waitFor(() => {
            expect(screen.getByText('Stay connected to your home')).toBeTruthy();
            expect(screen.getByText('Allow notifications')).toBeTruthy();
        });
        const allowBtn = screen.getByText('Allow notifications');
        fireEvent.press(allowBtn);
        await waitFor(() => {
            expect(screen.getByText('Welcome home.')).toBeTruthy();
            expect(screen.getByText('Enter Society OS')).toBeTruthy();
        });
        const enterAppBtn = screen.getByText('Enter Society OS');
        fireEvent.press(enterAppBtn);
        expect(onCompleteMock).toHaveBeenCalledTimes(1);
    }, 15000);
    it('shows error state when incorrect OTP is entered (Screen 04)', async () => {
        const screen = await renderWithProviders(<ResidentOnboardingScreen onComplete={jest.fn()}/>);
        fireEvent.changeText(screen.getByTestId('otp-digit-0'), '999999');
        await waitFor(() => {
            expect(screen.getByTestId('verify-otp-btn')).not.toBeDisabled();
        });
        fireEvent.press(screen.getByTestId('verify-otp-btn'));
        await waitFor(() => {
            expect(screen.getByText('Incorrect code. Please check the code and try again.')).toBeTruthy();
        });
    });
    it('handles Tenant flow with agreement details, owner verification disclaimer, and pending approval', async () => {
        const onCompleteMock = jest.fn();
        const screen = await renderWithProviders(<ResidentOnboardingScreen onComplete={onCompleteMock}/>);
        fireEvent.changeText(screen.getByTestId('otp-digit-0'), '123456');
        await waitFor(() => expect(screen.getByTestId('verify-otp-btn')).not.toBeDisabled());
        fireEvent.press(screen.getByTestId('verify-otp-btn'));
        await waitFor(() => expect(screen.getByText('Green Valley Heights')).toBeTruthy());
        fireEvent.press(screen.getByText('Green Valley Heights'));
        await waitFor(() => expect(screen.getByText('Yes, continue')).toBeTruthy());
        fireEvent.press(screen.getByText('Yes, continue'));
        await waitFor(() => expect(screen.getByText('A-1204')).toBeTruthy());
        fireEvent.press(screen.getByText('A-1204'));
        await waitFor(() => expect(screen.getByText('Yes, this is my home')).toBeTruthy());
        fireEvent.press(screen.getByText('Yes, this is my home'));
        await waitFor(() => expect(screen.getByText('Tenant')).toBeTruthy());
        fireEvent.press(screen.getByText('Tenant'));
        await waitFor(() => expect(screen.getByTestId('primary-cta-btn')).not.toBeDisabled());
        fireEvent.press(screen.getByTestId('primary-cta-btn'));
        await waitFor(() => {
            expect(screen.getByText('Tenancy details')).toBeTruthy();
            expect(screen.getByText(/Your society requires owner verification before your resident access can be activated/i)).toBeTruthy();
        });
        fireEvent.press(screen.getByTestId('primary-cta-btn'));
        await waitFor(() => {
            expect(screen.getByText('Tell us a little about you')).toBeTruthy();
        });
    });
    it('handles Family Member flow with relationship selection (Screen 10C)', async () => {
        const screen = await renderWithProviders(<ResidentOnboardingScreen onComplete={jest.fn()}/>);
        fireEvent.changeText(screen.getByTestId('otp-digit-0'), '123456');
        await waitFor(() => expect(screen.getByTestId('verify-otp-btn')).not.toBeDisabled());
        fireEvent.press(screen.getByTestId('verify-otp-btn'));
        await waitFor(() => expect(screen.getByText('Green Valley Heights')).toBeTruthy());
        fireEvent.press(screen.getByText('Green Valley Heights'));
        await waitFor(() => expect(screen.getByText('Yes, continue')).toBeTruthy());
        fireEvent.press(screen.getByText('Yes, continue'));
        await waitFor(() => expect(screen.getByText('A-1204')).toBeTruthy());
        fireEvent.press(screen.getByText('A-1204'));
        await waitFor(() => expect(screen.getByText('Yes, this is my home')).toBeTruthy());
        fireEvent.press(screen.getByText('Yes, this is my home'));
        await waitFor(() => expect(screen.getByText('Family member')).toBeTruthy());
        fireEvent.press(screen.getByText('Family member'));
        await waitFor(() => expect(screen.getByTestId('primary-cta-btn')).not.toBeDisabled());
        fireEvent.press(screen.getByTestId('primary-cta-btn'));
        await waitFor(() => {
            expect(screen.getByText('Relationship to household')).toBeTruthy();
            expect(screen.getByText('Spouse')).toBeTruthy();
            expect(screen.getByText('Parent')).toBeTruthy();
            expect(screen.getByText('Child')).toBeTruthy();
        });
        fireEvent.press(screen.getByText('Spouse'));
        fireEvent.press(screen.getByText('Continue to profile'));
        await waitFor(() => {
            expect(screen.getByText('Tell us a little about you')).toBeTruthy();
        });
    });
});

