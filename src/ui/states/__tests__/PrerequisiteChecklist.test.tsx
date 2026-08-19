import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { enMessages } from '../../../messages/en';
import { evaluatePrerequisites } from '../../../shared/prerequisites';
import { residentPrerequisiteScenarios } from '../../../modules/resident/dashboard/fixtures/residentPrerequisiteScenarios';
import { PrerequisiteChecklist } from '../PrerequisiteChecklist';

describe('PrerequisiteChecklist', () => {
  it('renders prerequisite checklist rows', async () => {
    const result = evaluatePrerequisites({
      moduleKey: 'tenant',
      actionKey: 'addTenant',
      context: residentPrerequisiteScenarios.tenantBlockedByPreviousNoc,
    });

    await renderWithProviders(<PrerequisiteChecklist checks={result.checks} />);

    expect(screen.getByTestId('prerequisite-checklist')).toBeTruthy();
    expect(screen.getByText(enMessages.resident.prerequisites.tenantPreviousNocTitle)).toBeTruthy();
  });
});
