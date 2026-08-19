import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentChatHomeScreen } from '../screens/ResidentChatHomeScreen';
import { useResidentChatConversations } from '../hooks/useResidentChatConversations';
import { useResidentDirectConversations } from '../../residentConnect/hooks/useResidentContactData';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useFocusEffect: (effect: () => void) => effect(),
  useNavigation: () => ({ canGoBack: () => false, goBack: jest.fn(), dispatch: jest.fn() }),
}));

jest.mock('../hooks/useResidentChatConversations', () => ({
  useResidentChatConversations: jest.fn(),
}));

jest.mock('../../residentConnect/hooks/useResidentContactData', () => ({
  useResidentDirectConversations: jest.fn(),
  useResidentContactRequests: jest.fn(() => ({
    scope: { residentProfileId: 'resident-001' },
    incoming: { data: [], isLoading: false, error: null, refetch: jest.fn() },
    outgoing: { data: [], isLoading: false, error: null, refetch: jest.fn() },
  })),
}));

jest.mock('../../../../core/featureFlags/useFeatureFlag', () => ({
  useFeatureFlags: jest.fn(() => ({ isEnabled: () => true })),
}));

describe('ResidentChatHomeScreen floating contact action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hides the floating action button (FAB) and shows the empty state button when chats are empty', async () => {
    (useResidentChatConversations as jest.Mock).mockReturnValue({
      conversations: [],
      isLoading: false,
      errorMessageKey: null,
      retry: jest.fn(),
    });

    (useResidentDirectConversations as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const navigation = { navigate: jest.fn() };
    await renderWithProviders(<ResidentChatHomeScreen navigation={navigation as never} route={{ params: {} } as never} />);

    expect(screen.queryByTestId('chat-new-contact-fab')).toBeNull();
    expect(screen.getByText('Start a new conversation')).toBeTruthy();
  });

  it('shows the floating action button (FAB) and hides the empty state button when chats exist', async () => {
    (useResidentChatConversations as jest.Mock).mockReturnValue({
      conversations: [
        {
          id: 'convo-1',
          homeContextId: 'home-1',
          channel: {
            code: 'general',
            displayNameMessageKey: 'chat.channel.securityGate.title',
            descriptionMessageKey: 'chat.channel.securityGate.description',
          },
          lastMessage: {
            messageText: 'Hello',
            senderSnapshot: { senderType: 'resident', displayNameAtSend: 'Amit' },
          },
          unreadCount: 0,
        },
      ],
      isLoading: false,
      errorMessageKey: null,
      retry: jest.fn(),
    });

    (useResidentDirectConversations as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });

    const navigation = { navigate: jest.fn() };
    await renderWithProviders(<ResidentChatHomeScreen navigation={navigation as never} route={{ params: {} } as never} />);

    const fab = screen.getByTestId('chat-new-contact-fab');
    expect(fab).toBeTruthy();
    expect(screen.queryByText('Start a new conversation')).toBeNull();

    fireEvent.press(fab);
    expect(navigation.navigate).toHaveBeenCalledWith('ResidentDirectorySelection');
  });
});
