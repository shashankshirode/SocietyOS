import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ChannelMembershipSelector } from '../components/ChannelMembershipSelector';
import type { ChatChannelDefinition, RequestedChannelAssignment } from '../../chat/domain/chat.types';

const channels: ChatChannelDefinition[] = [
  {
    channelId: 'society-gv-accounts', societyId: 'society-gv', code: 'accounts',
    displayNameMessageKey: 'chat.channel.accounts.title', descriptionMessageKey: 'chat.channel.accounts.description',
    historyModeMessageKey: 'chat.channel.accounts.historyMode', historyMode: 'sharedChannelHistory',
    audience: 'residentAndStaff', isEnabled: true, isPinned: true, sortOrder: 1, iconAssetId: 'receipt',
    createdAtIso: '2026-01-01T00:00:00.000Z', updatedAtIso: '2026-01-01T00:00:00.000Z',
  },
  {
    channelId: 'society-gv-societyOffice', societyId: 'society-gv', code: 'societyOffice',
    displayNameMessageKey: 'chat.channel.societyOffice.title', descriptionMessageKey: 'chat.channel.societyOffice.description',
    historyModeMessageKey: 'chat.channel.societyOffice.historyMode', historyMode: 'sharedChannelHistory',
    audience: 'residentAndStaff', isEnabled: true, isPinned: true, sortOrder: 2, iconAssetId: 'business',
    createdAtIso: '2026-01-01T00:00:00.000Z', updatedAtIso: '2026-01-01T00:00:00.000Z',
  },
];

describe('ChannelMembershipSelector', () => {
  it('supports multi-channel selection', async () => {
    let selected: RequestedChannelAssignment[] = [];
    const onChange = (next: RequestedChannelAssignment[]) => { selected = next; };
    const first = await renderWithProviders(<ChannelMembershipSelector channels={channels} roleCode="treasurer" assignments={selected} onChange={onChange} />);
    await act(async () => { fireEvent.press(first.getByRole('checkbox', { name: 'Accounts' })); });
    expect(selected.map((item) => item.channelId)).toEqual(['society-gv-accounts']);
    await first.rerender(<ChannelMembershipSelector channels={channels} roleCode="treasurer" assignments={selected} onChange={onChange} />);
    await act(async () => { fireEvent.press(first.getByRole('checkbox', { name: 'Society Office' })); });
    expect(selected.map((item) => item.channelId)).toEqual(['society-gv-accounts', 'society-gv-societyOffice']);
  });
});
