import type { AppRole } from '../permissions/permission.types';

export type RequestContext = {
  societyId?: string;
  unitId?: string;
  actorUserId?: string;
  roles?: AppRole[];
  activeRole?: AppRole;
  residentProfileId?: string;
  locale?: string;
  timezone?: string;
  correlationId?: string;
};

export function createCorrelationId(prefix = 'corr'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getMockRequestContext(): RequestContext {
  return {
    societyId: 'society-001',
    unitId: 'unit-a-1204',
    actorUserId: 'resident-001',
    roles: ['RESIDENT_OWNER'],
    activeRole: 'RESIDENT_OWNER',
    correlationId: createCorrelationId(),
  };
}
