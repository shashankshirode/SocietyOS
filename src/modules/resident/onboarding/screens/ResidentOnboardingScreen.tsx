import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useResidentOnboarding, type OnboardingStep } from '../hooks/useResidentOnboarding';
import { VerifyMobileStep } from './steps/VerifyMobileStep';
import { FindSocietyStep } from './steps/FindSocietyStep';
import { ConfirmSocietyStep } from './steps/ConfirmSocietyStep';
import { FindUnitStep } from './steps/FindUnitStep';
import { ConfirmUnitStep } from './steps/ConfirmUnitStep';
import { ResidentTypeStep } from './steps/ResidentTypeStep';
import { RoleSpecificStep } from './steps/RoleSpecificStep';
import { AboutYouStep } from './steps/AboutYouStep';
import { DocumentsStep } from './steps/DocumentsStep';
import { ReviewStep } from './steps/ReviewStep';
import { VerificationStateStep } from './steps/VerificationStateStep';
import { PermissionsStep } from './steps/PermissionsStep';
import { WelcomeHomeStep } from './steps/WelcomeHomeStep';
interface ResidentOnboardingScreenProps {
    onComplete: () => void;
    onCancel?: () => void;
}
export function ResidentOnboardingScreen({ onComplete, onCancel, }: ResidentOnboardingScreenProps) {
    const { state, requestOtp, verifyOtp, resendOtp, selectSociety, confirmSociety, loadUnitsForSociety, selectUnit, confirmUnit, selectResidentRole, submitRoleSpecific, updateProfile, uploadDocument, removeDocument, proceedToReview, submitForReview, createRegistration, goToStep, reset, setError, } = useResidentOnboarding();
    const handleHelp = () => {
        Alert.alert('Resident Support', 'Need help with your society onboarding? Contact the society management desk at support@societyos.in or +91 80000 12345.', [{ text: 'OK' }]);
    };
    const handleBack = () => {
        switch (state.step) {
            case 'VERIFY_MOBILE':
                onCancel?.();
                break;
            case 'FIND_SOCIETY':
                goToStep('VERIFY_MOBILE');
                break;
            case 'CONFIRM_SOCIETY':
                goToStep('FIND_SOCIETY');
                break;
            case 'FIND_UNIT':
                goToStep(state.selectedSociety ? 'CONFIRM_SOCIETY' : 'FIND_SOCIETY');
                break;
            case 'CONFIRM_UNIT':
                goToStep('FIND_UNIT');
                break;
            case 'RESIDENT_TYPE':
                goToStep('CONFIRM_UNIT');
                break;
            case 'ROLE_SPECIFIC':
                goToStep('RESIDENT_TYPE');
                break;
            case 'ABOUT_YOU':
                goToStep(state.claimedRelationship === 'OWNER' || state.claimedRelationship === 'CO_OWNER' ? 'RESIDENT_TYPE' : 'ROLE_SPECIFIC');
                break;
            case 'DOCUMENTS':
                goToStep('ABOUT_YOU');
                break;
            case 'REVIEW':
                goToStep('DOCUMENTS');
                break;
            case 'ADMIN_REVIEW':
            case 'RESUBMIT':
            case 'REJECTED':
                goToStep('REVIEW');
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        if (state.step === 'FIND_UNIT' && state.selectedSociety) {
            loadUnitsForSociety(state.selectedSociety.id);
        }
    }, [state.step, state.selectedSociety, loadUnitsForSociety]);
    useEffect(() => {
        if (state.step === 'CONFIRM_UNIT' && state.selectedSociety && state.selectedUnit) {
            confirmUnit();
        }
    }, [state.step, state.selectedSociety, state.selectedUnit, confirmUnit]);
    const renderCurrentStep = () => {
        const commonProps = {
            onBack: handleBack,
            onHelp: handleHelp,
        };
        switch (state.step) {
            case 'VERIFY_MOBILE':
                return (<VerifyMobileStep {...commonProps} maskedMobile={state.maskedMobile} onVerify={verifyOtp} onRequestOtp={requestOtp} onResendOtp={resendOtp} mobileNumber={state.mobileNumber} countryCode={state.countryCode} isMobileVerified={state.isMobileVerified}/>);
            case 'FIND_SOCIETY':
                return (<FindSocietyStep {...commonProps} onSelectSociety={selectSociety}/>);
            case 'CONFIRM_SOCIETY':
                return state.selectedSociety ? (<ConfirmSocietyStep {...commonProps} society={state.selectedSociety} onConfirm={confirmSociety} onChooseAnother={() => goToStep('FIND_SOCIETY')}/>) : null;
            case 'FIND_UNIT':
                return (<FindUnitStep {...commonProps} society={state.selectedSociety} selectedUnit={state.selectedUnit} onSelectUnit={selectUnit} {...(state.selectedSociety ? { onLoadUnits: () => loadUnitsForSociety(state.selectedSociety!.id) } : {})}/>);
            case 'CONFIRM_UNIT':
                return state.selectedUnit ? (<ConfirmUnitStep {...commonProps} society={state.selectedSociety} unit={state.selectedUnit} onConfirm={confirmUnit} onChooseAnother={() => goToStep('FIND_UNIT')}/>) : null;
            case 'RESIDENT_TYPE':
                return (<ResidentTypeStep {...commonProps} unit={state.selectedUnit} selectedRole={state.claimedRelationship} onSelectRole={selectResidentRole}/>);
            case 'ROLE_SPECIFIC':
                return state.claimedRelationship ? (<RoleSpecificStep {...commonProps} role={state.claimedRelationship} onSubmit={submitRoleSpecific}/>) : null;
            case 'ABOUT_YOU':
                return (<AboutYouStep {...commonProps} profile={state.profile} onUpdateProfile={updateProfile}/>);
            case 'DOCUMENTS':
                return (<DocumentsStep {...commonProps} documents={state.documents} requirements={state.requirements} requirementResolution={state.requirementResolution} onUploadDocument={uploadDocument} onRemoveDocument={removeDocument} onProceedToReview={proceedToReview}/>);
            case 'REVIEW':
                return (<ReviewStep {...commonProps} profile={state.profile} claimedRelationship={state.claimedRelationship} selectedSociety={state.selectedSociety} selectedUnit={state.selectedUnit} documents={state.documents} requirements={state.requirements} requirementResolution={state.requirementResolution} onEditSection={goToStep} onSubmit={async () => {
                        const reg = await createRegistration();
                        await submitForReview(reg?.registrationId);
                    }} isSubmitting={state.isSubmitting} {...(state.error ? { error: state.error } : {})}/>);
            case 'ADMIN_REVIEW':
                return (<VerificationStateStep {...commonProps} isChecking={true} outcome="PENDING" onProceedToPermissions={() => { }} onContinueToHomeLimited={onComplete} onUpdateDetails={() => goToStep('DOCUMENTS')}/>);
            case 'RESUBMIT':
                return (<VerificationStateStep {...commonProps} isChecking={false} outcome="NEEDS_ACTION" onProceedToPermissions={() => { }} onContinueToHomeLimited={onComplete} onUpdateDetails={() => goToStep('DOCUMENTS')}/>);
            case 'REJECTED':
                return (<VerificationStateStep {...commonProps} isChecking={false} outcome="NEEDS_ACTION" onProceedToPermissions={() => { }} onContinueToHomeLimited={onComplete} onUpdateDetails={() => goToStep('DOCUMENTS')}/>);
            case 'APPROVED':
                return (<VerificationStateStep {...commonProps} isChecking={false} outcome="APPROVED" onProceedToPermissions={() => goToStep('PERMISSIONS')} onContinueToHomeLimited={onComplete} onUpdateDetails={() => goToStep('DOCUMENTS')}/>);
            case 'PERMISSIONS':
                return (<PermissionsStep {...commonProps} onAllow={() => goToStep('COMPLETED')} onSkip={() => goToStep('COMPLETED')}/>);
            case 'ACTIVE':
            case 'COMPLETED':
                return (<WelcomeHomeStep {...commonProps} onEnterApp={onComplete}/>);
            default:
                return null;
        }
    };
    return (<View style={styles.container}>
      {renderCurrentStep()}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF8F1',
    },
});

