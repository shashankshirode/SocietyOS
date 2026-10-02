import { useState } from "react";
import { Alert } from "react-native";
import { useAuthSession } from "../../../../core/auth/useAuthSession";
import { clearCurrentSession } from "../../../../core/auth/sessionStore";
import type { ResidenceAccessDetail } from "../../../../features/residenceAccess/models/residenceAccess.types";
import { ResidenceAccessExperienceScreen } from "../../../../features/residenceAccess/screens/ResidenceAccessExperienceScreen";
import { establishResidentResidenceSession } from "../../../../features/residenceAccess/services/ResidentResidenceSessionService";
import { WelcomeScreen } from "./WelcomeScreen";
import { ResidentLoginScreen } from "./ResidentLoginScreen";
import { ResidentOnboardingScreen } from "../../onboarding/screens/ResidentOnboardingScreen";

type AuthStep = 'welcome' | 'login' | 'onboarding' | 'residenceAccess';

interface VerifiedResident {
  readonly userId: string;
  readonly fullName: string;
  readonly mobileNumber: string;
}

export function ResidentAuthenticationScreen() {
  const [step, setStep] = useState<AuthStep>('welcome');
  const [resident, setResident] = useState<VerifiedResident | null>(null);
  const { startMockSessionForRole } = useAuthSession();

  const handleGetStarted = () => {
    setStep('login');
  };

  const handleSkip = () => {
    setStep('login');
  };

  const handleLoginSuccess = async () => {
    // Session is updated by ResidentLoginScreen via AuthProvider
  };

  const handleRegister = () => {
    setStep('onboarding');
  };

  const handleOnboardingComplete = async () => {
    await startMockSessionForRole('RESIDENT_OWNER');
  };

  const handleNeedHelp = () => {
    Alert.alert(
      'Resident Support',
      'For assistance logging in or onboarding to your society, contact support@societyos.in or +91 80000 12345.',
      [{ text: 'OK' }]
    );
  };

  const handleEnterResidence = async (detail: ResidenceAccessDetail): Promise<boolean> => {
    return resident ? establishResidentResidenceSession(resident, detail) : false;
  };

  const handleLogout = async () => {
    await clearCurrentSession();
    setResident(null);
    setStep('welcome');
  };

  if (step === 'residenceAccess' && resident) {
    return (
      <ResidenceAccessExperienceScreen
        userId={resident.userId}
        residentName={resident.fullName}
        mobileNumber={resident.mobileNumber}
        onEnterResidence={handleEnterResidence}
        onSignOut={handleLogout}
      />
    );
  }

  if (step === 'onboarding') {
    return (
      <ResidentOnboardingScreen
        onComplete={handleOnboardingComplete}
        onCancel={() => setStep('login')}
      />
    );
  }

  if (step === 'login') {
    return (
      <ResidentLoginScreen
        onBack={() => setStep('welcome')}
        onSuccess={handleLoginSuccess}
        onRegister={handleRegister}
        onNeedHelp={handleNeedHelp}
      />
    );
  }

  return (
    <WelcomeScreen
      onGetStarted={handleGetStarted}
      onSkip={handleSkip}
    />
  );
}

export default ResidentAuthenticationScreen;

