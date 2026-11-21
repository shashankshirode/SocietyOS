export type BlueprintPhase =
  | 'MVP'
  | 'PHASE_1A'
  | 'PHASE_2'
  | 'PHASE_3'
  | 'PHASE_4'
  | 'Frontend Ready / Backend Required'
  | 'Frontend Ready / Integration Required';

export type BlueprintFeatureStatus =
  | 'IMPLEMENTED'
  | 'PARTIAL'
  | 'MISSING'
  | 'FRONTEND_READY_BACKEND_REQUIRED'
  | 'FRONTEND_READY_INTEGRATION_REQUIRED';

export type BlueprintFeature = {
  id: string;
  title: string;
  phase: BlueprintPhase;
  moduleName: string;
  featureFlag: string;
  permissions: string[];
  roles: string[];
  routeNames: string[];
  screenNames: string[];
  hookNames: string[];
  repositoryMethods: string[];
  mockDataKeys: string[];
  requiredActions: string[];
  status: BlueprintFeatureStatus;
};
