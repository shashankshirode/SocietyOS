import { useMemo } from 'react';
import { useActiveResidentHome } from '../../homeContext';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import type { EmergencyActorContext, EmergencyActorRole, EmergencyPermission, DeviceContext } from '../data/emergencyActor.types';
import { mapResidentRoleToEmergencyRole, getEmergencyPermissionsForRole } from '../data/emergencyActor.types';

export function useEmergencyActorContext(): EmergencyActorContext | null {
  const { activeContext } = useActiveResidentHome();
  const { session } = useAuthSession();

  return useMemo(() => {
    if (!activeContext || !session) {
      return null;
    }

    const actorRole = mapResidentRoleToEmergencyRole(activeContext.residentRole);
    const emergencyPermissions = getEmergencyPermissionsForRole(actorRole);

    const deviceContext: DeviceContext = {
      deviceId: 'unknown',
      platform: 'ios',
      appVersion: '1.0.0',
      hasLocationPermission: false,
      isOnline: true,
    };

    return {
      actorId: session.userId,
      actorName: session.name ?? 'Unknown',
      actorRole,
      sessionId: session.userId,
      societyId: activeContext.societyId ?? '',
      societyName: activeContext.societyName ?? '',
      residenceId: activeContext.homeContextId,
      unitId: activeContext.unitId,
      flatNumber: activeContext.flatNumber,
      tower: activeContext.towerName ?? activeContext.wingName ?? activeContext.buildingName ?? '',
      residentRole: activeContext.residentRole,
      emergencyPermissions,
      deviceContext,
      isTestMode: false,
    };
  }, [activeContext, session]);
}

export function useEmergencyActorContextOrThrow(): EmergencyActorContext {
  const context = useEmergencyActorContext();
  if (!context) {
    throw new Error('Emergency actor context unavailable: no active session or residence');
  }
  return context;
}

export function useEmergencyPermissions(): EmergencyPermission[] {
  const context = useEmergencyActorContext();
  return context?.emergencyPermissions ?? [];
}

export function useCanTriggerSos(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('TRIGGER_SOS');
}

export function useCanDeclareIncident(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('DECLARE_INCIDENT');
}

export function useCanAcknowledgeIncident(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('ACKNOWLEDGE_INCIDENT');
}

export function useCanManageResponsePlans(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('MANAGE_RESPONSE_PLANS');
}

export function useCanPublishCriticalBroadcast(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('PUBLISH_CRITICAL_BROADCAST');
}

export function useCanStartEvacuation(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('START_EVACUATION');
}

export function useCanCloseIncident(): boolean {
  const permissions = useEmergencyPermissions();
  return permissions.includes('CLOSE_INCIDENT');
}