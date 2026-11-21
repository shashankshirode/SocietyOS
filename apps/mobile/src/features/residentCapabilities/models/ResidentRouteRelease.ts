import type { ResidentCapabilityId } from './ResidentCapability';
import type { ResidentScenarioId } from './ResidentScenario';

export type ResidentNavigatorReleasePolicy = {
  file: string;
  defaultCapability: ResidentCapabilityId;
};

export type ResidentRouteReleaseRecord = {
  navigatorFile: string;
  navigatorTag: string;
  routeName: string;
  componentName: string;
  capabilityId: ResidentCapabilityId;
  scenarios: readonly ResidentScenarioId[];
};

export type ResidentScenarioEvidence = Record<ResidentScenarioId, readonly string[]>;
