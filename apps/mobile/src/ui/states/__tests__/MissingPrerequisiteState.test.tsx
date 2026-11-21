import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { enMessages } from '../../../messages/en';
import { evaluatePrerequisites } from '../../../shared/prerequisites';
import { residentPrerequisiteScenarios } from '../../../modules/resident/dashboard/fixtures/residentPrerequisiteScenarios';
import { MissingPrerequisiteState } from '../MissingPrerequisiteState';

describe('MissingPrerequisiteState', () => {
  it('renders missing bill setup and steps', async () => {
    const result = evaluatePrerequisites({
      moduleKey: 'billing',
      actionKey: 'payBill',
      context: residentPrerequisiteScenarios.missingBill,
    });

    await renderWithProviders(<MissingPrerequisiteState result={result} />);

    expect(screen.getByTestId('missing-prerequisite-state')).toBeTruthy();
    expect(screen.getAllByText(enMessages.resident.prerequisites.billMissingTitle).length).toBeGreaterThan(0);
    expect(screen.getByText(enMessages.resident.prerequisites.billMissingStep)).toBeTruthy();
  });
});
