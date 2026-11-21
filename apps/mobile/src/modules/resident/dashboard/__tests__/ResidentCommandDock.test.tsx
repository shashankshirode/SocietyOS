import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentCommandDock } from '../../../../ui/patterns/ResidentCommandDock';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

describe('ResidentCommandDock', () => {
  it('renders command actions and dispatches the selected id', async () => {
    const onActionPress = jest.fn<void, [string]>();
    const personalization = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    await renderWithProviders(
      <ResidentCommandDock
        title={enMessages.resident.experience.commandDockTitle}
        subtitle={enMessages.resident.experience.commandDockSubtitle}
        actions={personalization.commandActions}
        onActionPress={onActionPress}
      />
    );

    fireEvent.press(screen.getByText(enMessages.resident.experience.payBill));
    expect(onActionPress).toHaveBeenCalledWith('act-pay');

    expect(screen.queryByText(enMessages.resident.experience.uploadDocument)).toBeNull();
    fireEvent.press(screen.getByText(enMessages.resident.dashboard.actions.moreActions));
    expect(await screen.findByText(enMessages.resident.experience.uploadDocument)).toBeTruthy();
    expect(screen.getByText(enMessages.resident.experience.sos)).toBeTruthy();
  });
});
