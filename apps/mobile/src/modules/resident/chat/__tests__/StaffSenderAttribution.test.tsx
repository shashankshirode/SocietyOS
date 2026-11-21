import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { StaffSenderAttribution } from '../components/StaffSenderAttribution';

describe('StaffSenderAttribution', () => {
  it('shows immutable staff name, role and gate without contact information', async () => {
    const { getByText, queryByText } = await renderWithProviders(
      <StaffSenderAttribution sender={{
        senderUserId: 'guard-amit', senderType: 'securityGuard', displayNameAtSend: 'Amit Jadhav',
        roleTitleAtSend: 'Security Guard', channelNameAtSend: 'Security Gate', gateNameAtSend: 'Main Gate',
      }} />,
    );
    expect(getByText('Sent by Amit Jadhav · Security Guard · Main Gate')).toBeTruthy();
    expect(queryByText(/@|\+91|guard-amit/)).toBeNull();
  });
});
