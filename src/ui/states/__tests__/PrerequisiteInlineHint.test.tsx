import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { enMessages } from '../../../messages/en';
import { PrerequisiteInlineHint } from '../PrerequisiteInlineHint';

describe('PrerequisiteInlineHint', () => {
  it('renders a short prerequisite hint from messages', async () => {
    await renderWithProviders(
      <PrerequisiteInlineHint messageKey="resident.prerequisites.weatherAreaDescription" tone="warning" />
    );

    expect(screen.getByText(enMessages.resident.prerequisites.weatherAreaDescription)).toBeTruthy();
  });
});
