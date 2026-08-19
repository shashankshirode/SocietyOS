import type {
  ResidenceOnboardingConfiguration,
  ResidenceOnboardingState,
  ResidenceOnboardingCompletion,
  SaveOnboardingStepRequest,
  CompleteOnboardingRequest,
} from './membership.types';

export interface ResidenceOnboardingRepository {
  getOnboardingConfiguration(
    membershipId: string,
    signal?: AbortSignal,
  ): Promise<ResidenceOnboardingConfiguration>;

  saveOnboardingStep(
    membershipId: string,
    request: SaveOnboardingStepRequest,
    signal?: AbortSignal,
  ): Promise<ResidenceOnboardingState>;

  completeOnboarding(
    membershipId: string,
    request: CompleteOnboardingRequest,
    signal?: AbortSignal,
  ): Promise<ResidenceOnboardingCompletion>;
}
