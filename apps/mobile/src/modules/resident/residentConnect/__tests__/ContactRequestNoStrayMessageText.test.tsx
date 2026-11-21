import { fireEvent, screen } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request message rendering', () => {
  it('renders entered message content only in the multiline input', async () => {
    await renderContactRequestScreen();
    const message = 'A unique introductory message for state binding';
    const messageInput = screen.getByTestId('contact-request-message-input');

    await fireEvent.changeText(messageInput, message);

    expect(screen.getByDisplayValue(message)).toBe(messageInput);
    expect(screen.queryByText(message)).toBeNull();
  });
});
