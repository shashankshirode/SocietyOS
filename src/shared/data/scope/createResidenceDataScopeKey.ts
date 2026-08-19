import type { ResidentHomeRole } from '../../../modules/resident/homeContext/data/residentHomeContext.types';

export type ResidenceDataScope = {
  residentId: string;
  societyId: string;
  unitId: string;
  residentRole: ResidentHomeRole;
};

export const createResidenceDataScopeKey = (
  scope: ResidenceDataScope
): string => {
  return `${scope.residentId}:${scope.societyId}:${scope.unitId}:${scope.residentRole}`;
};
