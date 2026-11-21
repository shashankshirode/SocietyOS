import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentModuleShelf } from '../../../../ui/patterns/ResidentModuleShelf';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

const noop = () => undefined;

describe('ResidentModuleShelf', () => {
  it('renders resident essentials with module identity', async () => {
    const personalization = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    await renderWithProviders(
      <ResidentModuleShelf
        title={enMessages.resident.experience.modulesTitle}
        subtitle={enMessages.resident.experience.modulesSubtitle}
        items={personalization.moduleShelfItems}
        onModulePress={noop}
      />
    );

    expect(screen.getByText(enMessages.resident.experience.visitorModule)).toBeTruthy();
    expect(screen.getByText(enMessages.resident.experience.billingModule)).toBeTruthy();
    expect(screen.getByText(enMessages.resident.experience.documentsModule)).toBeTruthy();
  });
});
