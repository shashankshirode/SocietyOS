import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { ChatStatusTicks } from '../components/ChatStatusTicks';

describe('ChatStatusTicks', () => {
  it.each(['queued', 'sending', 'sent', 'delivered', 'seen', 'failed'] as const)('exposes the %s status accessibly', async (status) => {
    const { getByLabelText } = await renderWithProviders(<ChatStatusTicks status={status} />);
    const label = status === 'failed' ? 'Not sent' : status.charAt(0).toLocaleUpperCase() + status.slice(1);
    expect(getByLabelText(label)).toBeTruthy();
  });
});
