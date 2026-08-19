import type {
  ResidentContextualInsightsResult,
  AreaWeatherSnapshot,
  LocalAreaAdvisory,
} from './residentContextualInsights.types';

export interface GetResidentContextualInsightsInput {
  userId: string;
  societyId: string;
  unitId: string;
}

export interface GetAreaWeatherSnapshotInput {
  areaId: string;
}

export interface GetLocalAdvisoriesInput {
  areaId: string;
  societyId?: string;
}

export interface DismissContextualSuggestionInput {
  userId: string;
  societyId: string;
  unitId: string;
  suggestionId: string;
}

export type ResidentContextualInsightsRepository = {
  getContextualInsights: (
    input: GetResidentContextualInsightsInput,
  ) => Promise<ResidentContextualInsightsResult>;

  getAreaWeatherSnapshot: (
    input: GetAreaWeatherSnapshotInput,
  ) => Promise<AreaWeatherSnapshot>;

  getLocalAdvisories: (
    input: GetLocalAdvisoriesInput,
  ) => Promise<LocalAreaAdvisory[]>;

  dismissSuggestion: (
    input: DismissContextualSuggestionInput,
  ) => Promise<ResidentContextualInsightsResult>;
};
