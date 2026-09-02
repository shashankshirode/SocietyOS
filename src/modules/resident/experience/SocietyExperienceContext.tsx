import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { EmergencyExperience } from '../emergency/components/EmergencyExperience';

type SocietyExperienceController = {
  providerMounted: boolean;
  identityCenterVisible: boolean;
  residenceSwitcherVisible: boolean;
  crisisModeVisible: boolean;
  openIdentityCenter: () => void;
  closeIdentityCenter: () => void;
  openResidenceSwitcher: () => void;
  closeResidenceSwitcher: () => void;
  openCrisisMode: () => void;
  closeCrisisMode: () => void;
};

const ambientFallback: SocietyExperienceController = {
  providerMounted: false,
  identityCenterVisible: false,
  residenceSwitcherVisible: false,
  crisisModeVisible: false,
  openIdentityCenter: () => undefined,
  closeIdentityCenter: () => undefined,
  openResidenceSwitcher: () => undefined,
  closeResidenceSwitcher: () => undefined,
  openCrisisMode: () => undefined,
  closeCrisisMode: () => undefined,
};

const SocietyExperienceContext = createContext<SocietyExperienceController>(ambientFallback);

export function SocietyExperienceProvider({ children }: { children: React.ReactNode }) {
  const [identityCenterVisible, setIdentityCenterVisible] = useState(false);
  const [residenceSwitcherVisible, setResidenceSwitcherVisible] = useState(false);
  const [crisisModeVisible, setCrisisModeVisible] = useState(false);
  const openIdentityCenter = useCallback(() => {
    setResidenceSwitcherVisible(false);
    setIdentityCenterVisible(true);
  }, []);
  const closeIdentityCenter = useCallback(() => setIdentityCenterVisible(false), []);
  const openResidenceSwitcher = useCallback(() => {
    setIdentityCenterVisible(false);
    setResidenceSwitcherVisible(true);
  }, []);
  const closeResidenceSwitcher = useCallback(() => setResidenceSwitcherVisible(false), []);
  const openCrisisMode = useCallback(() => {
    setIdentityCenterVisible(false);
    setResidenceSwitcherVisible(false);
    setCrisisModeVisible(true);
  }, []);
  const closeCrisisMode = useCallback(() => setCrisisModeVisible(false), []);
  const value = useMemo(() => ({
    providerMounted: true,
    identityCenterVisible,
    residenceSwitcherVisible,
    crisisModeVisible,
    openIdentityCenter,
    closeIdentityCenter,
    openResidenceSwitcher,
    closeResidenceSwitcher,
    openCrisisMode,
    closeCrisisMode,
  }), [closeCrisisMode, closeIdentityCenter, closeResidenceSwitcher, crisisModeVisible, identityCenterVisible, openCrisisMode, openIdentityCenter, openResidenceSwitcher, residenceSwitcherVisible]);

  return <SocietyExperienceContext.Provider value={value}>{children}<EmergencyExperience visible={crisisModeVisible} onClose={closeCrisisMode}/></SocietyExperienceContext.Provider>;
}

export function useSocietyExperience() {
  return useContext(SocietyExperienceContext);
}
