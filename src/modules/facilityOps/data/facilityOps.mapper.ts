import type { FacilityOpsHome } from './facilityOps.dto';

export const mapFacilityOpsHomeDtoToDomain = (dto: FacilityOpsHome): FacilityOpsHome => ({ ...dto });
export const mapIdentity = <T>(dto: T): T => ({ ...dto });
