import type { FeatureFlagKey } from '../../core/featureFlags/featureFlags';
import type {
  ResidentCapabilityAction,
  ResidentCapabilityId,
  ResidentCapabilityState,
  ResidentFeatureArea,
  ResidentRepositoryId,
} from '../residentCapabilities/models/ResidentCapability';
import type { ResidentCapabilityAudience } from '../residentCapabilities/models/ResidentRoleCapability';
import type { ResidentScenarioId } from '../residentCapabilities/models/ResidentScenario';

export type ResidentImplementationStatus =
  | 'complete'
  | 'partial'
  | 'missing'
  | 'broken'
  | 'featureFlagged';

export type ResidentReleaseCapability = {
  id: ResidentCapabilityId;
  featureArea: ResidentFeatureArea;
  roles: readonly ResidentCapabilityAudience[];
  featureFlag: FeatureFlagKey;
  routes: readonly string[];
  screens: readonly string[];
  components: readonly string[];
  repository: ResidentRepositoryId;
  mockScenarios: readonly ResidentScenarioId[];
  supportedStates: readonly ResidentCapabilityState[];
  supportedActions: readonly ResidentCapabilityAction[];
  tests: readonly ResidentScenarioId[];
  implementationStatus: ResidentImplementationStatus;
  remainingVerification: readonly string[];
};

export type ResidentReleaseSummary = {
  blueprintVersion: string;
  total: number;
  complete: number;
  partial: number;
  missing: number;
  broken: number;
  featureFlagged: number;
  releaseCandidateReady: boolean;
};
