import { fireEvent, screen } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request filled state', () => {
  it('keeps both controlled values visible and enables submit', async () => {
    await renderContactRequestScreen();
    await fireEvent.changeText(screen.getByTestId('contact-request-subject-input'), 'Neighbour coordination');
    await fireEvent.changeText(
      screen.getByTestId('contact-request-message-input'),
      'Could we coordinate the shared floor notice tomorrow?',
    );

    expect(screen.getByTestId('contact-request-subject-input').props.value).toBe('Neighbour coordination');
    expect(screen.getByTestId('contact-request-message-input').props.value).toBe(
      'Could we coordinate the shared floor notice tomorrow?',
    );
    expect(screen.getByTestId('contact-request-submit-button')).not.toBeDisabled();
    expect(screen.queryByText(/^contactRequest\.|^buttons\./)).toBeNull();
  });

  it('keeps maximum-length controlled values inside their inputs', async () => {
    await renderContactRequestScreen();
    const subject = 'S'.repeat(80);
    const message = 'M'.repeat(500);

    await fireEvent.changeText(screen.getByTestId('contact-request-subject-input'), subject);
    await fireEvent.changeText(screen.getByTestId('contact-request-message-input'), message);

    expect(screen.getByDisplayValue(subject)).toBeTruthy();
    expect(screen.getByDisplayValue(message)).toBeTruthy();
    expect(screen.getByTestId('contact-request-message-character-count')).toHaveTextContent(
      '0 characters remaining',
    );
  });
});
