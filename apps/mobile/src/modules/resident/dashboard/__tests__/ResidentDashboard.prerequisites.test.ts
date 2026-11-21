import { evaluatePrerequisites } from '../../../../shared/prerequisites';
import { residentPrerequisiteScenarios } from '../fixtures/residentPrerequisiteScenarios';

describe('Resident dashboard prerequisite scenarios', () => {
  it('keeps blocked resident actions actionable without backend assumptions', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'tenant',
      actionKey: 'addTenant',
      context: residentPrerequisiteScenarios.tenantBlockedByPreviousNoc,
    });

    expect(result.canContinue).toBe(false);
    expect(result.blockingChecks[0]?.action?.type).toBe('waitForApproval');
  });

  it('treats missing local context as a non-blocking warning', () => {
    const result = evaluatePrerequisites({
      moduleKey: 'contextualInsights',
      actionKey: 'showLocalSuggestion',
      context: residentPrerequisiteScenarios.missingWeatherArea,
    });

    expect(result.canContinue).toBe(false);
    expect(result.warningChecks.map((check) => check.id)).toEqual(['area', 'weather']);
  });
});
