import { repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { residentFeatureRegistry } from './residentFeatureRegistry';
import type { ResidentFeatureCoverageSummary, ResidentFeatureRegistryItem } from './residentFeatureRegistry.types';
import type { Absent } from "../../../../shared/types/absence.types";
function getMissingKeys(feature: ResidentFeatureRegistryItem, keys: string[]) {
    return keys
        .filter((key) => key.trim().length === 0)
        .map((key) => ({
        featureId: feature.id,
        featureTitleMessageKey: feature.titleMessageKey,
        key,
    }));
}
export function validateResidentFeatureCoverage(registry: ResidentFeatureRegistryItem[] = residentFeatureRegistry): ResidentFeatureCoverageSummary {
    const total = registry.length;
    const implemented = registry.filter((feature) => feature.status === 'implemented').length;
    const partial = registry.filter((feature) => feature.status === 'partial').length;
    const missing = registry.filter((feature) => feature.status === 'missing').length;
    const frontendReadyBackendRequired = registry.filter((feature) => feature.status === 'frontendReadyBackendRequired').length;
    const frontendReadyIntegrationRequired = registry.filter((feature) => feature.status === 'frontendReadyIntegrationRequired').length;
    const notResidentScope = registry.filter((feature) => feature.status === 'notResidentScope').length;
    return {
        total,
        implemented,
        partial,
        missing,
        frontendReadyBackendRequired,
        frontendReadyIntegrationRequired,
        notResidentScope,
        missingRoutes: registry.flatMap((feature) => getMissingKeys(feature, feature.routeNames)),
        missingScreens: registry.flatMap((feature) => getMissingKeys(feature, feature.screenNames)),
        missingActions: registry.flatMap((feature) => getMissingKeys(feature, feature.requiredActions)),
        missingMessages: registry.flatMap((feature) => getMissingKeys(feature, feature.messageKeyGroups)),
        missingLoadingStates: registry.flatMap((feature) => getMissingKeys(feature, feature.loadingStateKeys)),
        missingMockDataKeys: registry.flatMap((feature) => getMissingKeys(feature, feature.mockDataKeys)),
        missingTests: registry.flatMap((feature) => getMissingKeys(feature, feature.testNames)),
        percentage: total > 0 ? Math.round(((implemented + frontendReadyBackendRequired + frontendReadyIntegrationRequired) / total) * 100) : 0,
    };
}
export const residentFeatureCoverageRepository = {
    async listFeatures(): Promise<RepositoryResult<ResidentFeatureRegistryItem[]>> {
        return repositorySuccess(residentFeatureRegistry);
    },
    async getFeature(featureId: string): Promise<RepositoryResult<ResidentFeatureRegistryItem | Absent>> {
        return repositorySuccess(residentFeatureRegistry.find((feature) => feature.id === featureId));
    },
    async getCoverageSummary(): Promise<RepositoryResult<ResidentFeatureCoverageSummary>> {
        return repositorySuccess(validateResidentFeatureCoverage());
    },
};

