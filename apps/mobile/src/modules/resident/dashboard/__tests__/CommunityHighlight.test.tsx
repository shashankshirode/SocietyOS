import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { CommunityHighlight } from '../components/CommunityHighlight';
import type { NoticeHighlight } from '../data/dashboard.types';

jest.mock('../../../../core/theme/useThemePreference', () => ({
  useThemePreference: () => ({
    preference: 'light',
    setPreference: jest.fn(),
    isLoading: false,
  }),
}));

describe('CommunityHighlight', () => {
  it('renders fallback content gracefully when notice is not provided', async () => {
    const onPress = jest.fn();

    const { getByText, getByLabelText } = await renderWithProviders(
      <CommunityHighlight onPress={onPress} />,
    );

    expect(getByText('In your community')).toBeTruthy();
    expect(getByText('Connect with your community')).toBeTruthy();
    expect(getByText('Events, society notices, facilities and neighbour groups')).toBeTruthy();

    const card = getByLabelText(/Community highlight: Connect with your community/);
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders section header, event notice content, and dispatches onPress', async () => {
    const onPress = jest.fn();
    const notice: NoticeHighlight = {
      id: 'notif-1',
      title: 'Independence Day celebration registrations',
      summary: 'Register participants before 10 August',
      category: 'event',
      publishedAtLabel: '10 Aug',
      acknowledgementStatus: 'pending',
    };

    const { getByText, getByLabelText } = await renderWithProviders(
      <CommunityHighlight notice={notice} onPress={onPress} />,
    );

    expect(getByText('In your community')).toBeTruthy();
    expect(getByText('Explore ›')).toBeTruthy();
    expect(getByText('Independence Day celebration registrations')).toBeTruthy();
    expect(getByText('Register participants before 10 August')).toBeTruthy();

    const card = getByLabelText(/Community highlight: Independence Day celebration registrations/);
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);

    const exploreBtn = getByLabelText('Explore community tab');
    fireEvent.press(exploreBtn);
    expect(onPress).toHaveBeenCalledTimes(2);
  });
});


