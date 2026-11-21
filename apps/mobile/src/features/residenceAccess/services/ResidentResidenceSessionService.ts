import { getCurrentSession, setCurrentSession } from '../../../core/auth/sessionStore';
import { mapContextRoleToAppRole } from '../../../modules/resident/homeContext/utils/residentHomeContextPermissions';
import { switchHomeAction } from '../../../modules/resident/homeContext/state/residentHomeContext.actions';
import type { ResidentHomeRole } from '../../../modules/resident/homeContext/data/residentHomeContext.types';
import type { ResidenceAccessDetail, ResidenceRole } from '../models/residenceAccess.types';

interface VerifiedResidentIdentity {
  readonly userId: string;
  readonly fullName: string;
}

function mapResidenceRole(role: ResidenceRole): ResidentHomeRole {
  switch (role) {
    case 'OWNER': return 'owner';
    case 'CO_OWNER': return 'coOwner';
    case 'TENANT': return 'tenant';
    case 'FAMILY_MEMBER': return 'familyMember';
    case 'AUTHORIZED_OCCUPANT':
    case 'MINOR':
    case 'STAFF':
      return 'authorizedOccupant';
  }
}

export async function establishResidentResidenceSession(
  resident: VerifiedResidentIdentity,
  detail: ResidenceAccessDetail,
): Promise<boolean> {
  if (!detail.eligibility.canEnterResidence || !detail.accessRecord.homeContextId) {
    return false;
  }
  try {
    const switched = await switchHomeAction(detail.accessRecord.homeContextId);
    if (!switched) return false;
    const current = getCurrentSession();
    await setCurrentSession({
      userId: resident.userId,
      name: resident.fullName,
      role: mapContextRoleToAppRole(mapResidenceRole(detail.accessRecord.role)),
      societyId: detail.residence.societyId,
      societyName: detail.residence.societyName,
      unitId: detail.residence.unitId,
      unitLabel: `${detail.residence.unitNumber} · ${detail.residence.buildingName}`,
      token: current?.token ?? `mock-token-${resident.userId}`,
      refreshToken: current?.refreshToken ?? `mock-refresh-${resident.userId}`,
      expiresAt: current?.expiresAt ?? new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      isMockSession: current?.isMockSession ?? true,
    });
    return true;
  } catch {
    return false;
  }
}
