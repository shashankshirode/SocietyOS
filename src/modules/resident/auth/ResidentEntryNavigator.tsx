import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LoadingState } from '../../../shared/feedback/LoadingState';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { clearCurrentSession, restoreCurrentSession } from '../../../core/auth/sessionStore';
import { ResidentNavigator } from '../../../app/navigation/ResidentNavigator';
import { ResidentAuthenticationScreen } from './screens/ResidentAuthenticationScreen';
import { ResidenceAccessExperienceScreen } from '../../../features/residenceAccess/screens/ResidenceAccessExperienceScreen';
import { residenceAccessRepository } from '../../../features/residenceAccess/repositories/residenceAccess.repository';
import { establishResidentResidenceSession } from '../../../features/residenceAccess/services/ResidentResidenceSessionService';
import { residenceAccessMessages } from '../../../messages/en/residenceAccess.messages';
import type { ResidenceAccessDetail } from '../../../features/residenceAccess/models/residenceAccess.types';

type ActiveAccessState = 'CHECKING' | 'ALLOWED' | 'BLOCKED';

export function ResidentEntryNavigator() {
  const { session } = useAuthSession();
  const [restored, setRestored] = useState(false);
  const [activeAccessState, setActiveAccessState] = useState<ActiveAccessState>('CHECKING');
  const checkInFlight = useRef(false);

  useEffect(() => {
    let active = true;
    restoreCurrentSession().finally(() => {
      if (active) setRestored(true);
    });
    return () => { active = false; };
  }, []);

  const checkActiveResidence = useCallback(async () => {
    if (checkInFlight.current) return;
    if (!session?.societyId || !session.unitId) {
      setActiveAccessState('ALLOWED');
      return;
    }
    checkInFlight.current = true;
    try {
      const page = await residenceAccessRepository.getResidences({
        userId: session.userId,
        pageSize: 100,
        statusFilter: 'ALL',
        roleFilter: 'ALL',
      });
      if (!page.ok) {
        setActiveAccessState('ALLOWED');
        return;
      }
      const match = page.data.items.find((item) =>
        item.residence.societyId === session.societyId && item.residence.unitId === session.unitId,
      );
      if (!match) {
        setActiveAccessState('ALLOWED');
        return;
      }
      const refreshed = await residenceAccessRepository.refreshResidence(
        session.userId,
        match.accessRecord.residenceAccessId,
      );
      if (refreshed.ok) {
        setActiveAccessState(refreshed.data.eligibility.canEnterResidence ? 'ALLOWED' : 'BLOCKED');
      } else {
        setActiveAccessState('ALLOWED');
      }
    } finally {
      checkInFlight.current = false;
    }
  }, [session]);

  useEffect(() => {
    if (!restored || !session) {
      setActiveAccessState('CHECKING');
      return undefined;
    }
    void checkActiveResidence();
    const unsubscribe = residenceAccessRepository.subscribe(() => { void checkActiveResidence(); });
    const interval = setInterval(() => { void checkActiveResidence(); }, 30_000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkActiveResidence, restored, session]);

  if (!restored) return <LoadingState message={residenceAccessMessages.common.loading} />;
  if (!session) return <ResidentAuthenticationScreen />;
  if (activeAccessState === 'CHECKING') {
    return <LoadingState message={residenceAccessMessages.common.loading} />;
  }
  if (activeAccessState === 'BLOCKED') {
    const enterResidence = async (detail: ResidenceAccessDetail) => {
      const entered = await establishResidentResidenceSession(
        { userId: session.userId, fullName: session.name },
        detail,
      );
      if (entered) setActiveAccessState('ALLOWED');
      return entered;
    };
    return (
      <ResidenceAccessExperienceScreen
        userId={session.userId}
        residentName={session.name}
        mobileNumber={residenceAccessMessages.common.verifiedMobile}
        onEnterResidence={enterResidence}
        onSignOut={clearCurrentSession}
      />
    );
  }
  return <ResidentNavigator />;
}
