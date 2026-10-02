import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import type { Society } from './society.types';

interface SocietyContextValue {
  currentSociety: Society | null;
  availableSocieties: Society[];
  setCurrentSociety: (society: Society) => void;
  clearCurrentSociety: () => void;
  isLoading: boolean;
}

const SocietyContext = createContext<SocietyContextValue | null>(null);

const MOCK_SOCIETIES: Society[] = [
  {
    id: 'soc-palm-grove-01',
    name: 'Palm Grove Heights',
    city: 'Pune',
    state: 'Maharashtra',
    planCode: 'PREMIUM',
    status: 'ACTIVE',
    totalUnits: 300,
    activeUsers: 280,
  },
  {
    id: 'soc-green-valley-02',
    name: 'Green Valley Residency',
    city: 'Bangalore',
    state: 'Karnataka',
    planCode: 'STANDARD',
    status: 'ACTIVE',
    totalUnits: 150,
    activeUsers: 130,
  },
  {
    id: 'soc-sunrise-03',
    name: 'Sunrise Apartments',
    city: 'Mumbai',
    state: 'Maharashtra',
    planCode: 'BASIC',
    status: 'ACTIVE',
    totalUnits: 200,
    activeUsers: 180,
  },
];

export function SocietyProvider({ children }: { children: React.ReactNode }) {
  const { session, isAuthenticated, userRole } = useAuth();
  const [currentSociety, setCurrentSocietyState] = useState<Society | null>(null);
  const [availableSocieties, setAvailableSocieties] = useState<Society[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userRole === 'SUPER_ADMIN') {
      setAvailableSocieties(MOCK_SOCIETIES);
      setIsLoading(false);
    } else if (isAuthenticated && session?.societyId) {
      const society = MOCK_SOCIETIES.find((s) => s.id === session.societyId) ?? {
        id: session.societyId ?? '',
        name: session.societyName ?? '',
        city: '',
        state: '',
        planCode: '',
        status: 'ACTIVE',
        totalUnits: 0,
        activeUsers: 0,
      };
      setAvailableSocieties([society]);
      setCurrentSocietyState(society);
      setIsLoading(false);
    } else {
      setAvailableSocieties([]);
      setCurrentSocietyState(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, userRole, session?.societyId, session?.societyName, setAvailableSocieties, setCurrentSocietyState, setIsLoading]);

  const setCurrentSociety = useCallback((society: Society) => {
    setCurrentSocietyState(society);
  }, []);

  const clearCurrentSociety = useCallback(() => {
    setCurrentSocietyState(null);
  }, []);

  const value = useMemo(() => ({
    currentSociety,
    availableSocieties,
    setCurrentSociety,
    clearCurrentSociety,
    isLoading,
  }), [currentSociety, availableSocieties, setCurrentSociety, clearCurrentSociety, isLoading]);

  return (
    <SocietyContext.Provider value={value}>
      {children}
    </SocietyContext.Provider>
  );
}

export function useSociety(): SocietyContextValue {
  const context = React.useContext(SocietyContext);
  if (!context) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
}