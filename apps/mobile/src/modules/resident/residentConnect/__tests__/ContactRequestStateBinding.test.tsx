import { fireEvent, screen } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request state binding', () => {
  it('keeps subject and message values independent', async () => {
    await renderContactRequestScreen();
    const subjectInput = screen.getByTestId('contact-request-subject-input');
    const messageInput = screen.getByTestId('contact-request-message-input');

    await fireEvent.changeText(subjectInput, 'Parking coordination');
    expect(screen.getByTestId('contact-request-subject-input').props.value).toBe('Parking coordination');
    expect(screen.getByTestId('contact-request-message-input').props.value).toBe('');

    await fireEvent.changeText(messageInput, 'Could we coordinate visitor parking?');
    expect(screen.getByTestId('contact-request-subject-input').props.value).toBe('Parking coordination');
    expect(screen.getByTestId('contact-request-message-input').props.value).toBe('Could we coordinate visitor parking?');
  });
});
