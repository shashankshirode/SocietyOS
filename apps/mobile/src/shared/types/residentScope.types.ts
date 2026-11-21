import type { Absent } from './absence.types';

export type ResidentScopedEntity = {
  homeContextId?: string | Absent;
  societyId?: string | Absent;
  unitId?: string | Absent;
  dataScopeKey?: string | Absent;
};
