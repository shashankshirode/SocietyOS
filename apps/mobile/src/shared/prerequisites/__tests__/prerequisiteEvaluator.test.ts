import { evaluatePrerequisites } from '../prerequisiteEvaluator';
import { residentPrerequisiteScenarios } from '../../../modules/resident/dashboard/fixtures/residentPrerequisiteScenarios';

describe('prerequisiteEvaluator', () => {
  it('returns no-bill prerequisite text when current bill is missing', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'billing',
      actionKey: 'payBill',
      context: residentPrerequisiteScenarios.missingBill,
    });

    expect(result.canContinue).toBe(false);
    expect(result.blockingChecks[0]?.titleMessageKey).toBe('resident.prerequisites.billMissingTitle');
  });

  it('blocks tenant onboarding when previous NOC is pending', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'tenant',
      actionKey: 'addTenant',
      context: residentPrerequisiteScenarios.tenantBlockedByPreviousNoc,
    });

    expect(result.canContinue).toBe(false);
    expect(result.blockingChecks.map((check) => check.id)).toContain('previous-noc');
  });

  it('restricts document access without exposing sensitive document data', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'documents',
      actionKey: 'viewDocument',
      context: residentPrerequisiteScenarios.restrictedDocument,
    });

    expect(result.blockingChecks[0]?.status).toBe('restricted');
    expect(result.blockingChecks[0]?.descriptionMessageKey).toBe('resident.prerequisites.documentPermissionDescription');
  });

  it('returns calm fallback for missing area weather data', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'contextualInsights',
      actionKey: 'showLocalSuggestion',
      context: residentPrerequisiteScenarios.missingWeatherArea,
    });

    expect(result.warningChecks[0]?.titleMessageKey).toBe('resident.prerequisites.weatherAreaTitle');
  });
});
