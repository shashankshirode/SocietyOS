import { fireEvent, screen } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request validation layout', () => {
  it('places field errors below controls while preserving the character counter', async () => {
    await renderContactRequestScreen();
    const subjectInput = screen.getByTestId('contact-request-subject-input');
    const messageInput = screen.getByTestId('contact-request-message-input');

    await fireEvent.changeText(subjectInput, 'Help');
    await fireEvent(subjectInput, 'blur');
    await fireEvent.changeText(messageInput, 'Too short');
    await fireEvent(messageInput, 'blur');

    expect(screen.getByTestId('contact-request-subject-error')).toHaveTextContent(
      'Subject must be at least 5 characters.',
    );
    expect(screen.getByTestId('contact-request-message-error')).toHaveTextContent(
      'Message must be at least 10 characters.',
    );
    expect(screen.queryByTestId('contact-request-message-helper')).toBeNull();
    expect(screen.getByTestId('contact-request-message-character-count')).toBeTruthy();
  });
});
