import { screen, within } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request field hierarchy', () => {
  it('renders the resident, subject, message, topic, privacy, and action structure', async () => {
    await renderContactRequestScreen();

    expect(screen.getByTestId('contact-request-selected-resident')).toBeTruthy();
    expect(within(screen.getByTestId('contact-request-subject')).getByText('Subject')).toBeTruthy();
    expect(within(screen.getByTestId('contact-request-message')).getByText('Message')).toBeTruthy();
    expect(screen.getByTestId('contact-request-topic-selector')).toBeTruthy();
    expect(screen.getByTestId('contact-request-privacy-panel')).toBeTruthy();
    expect(screen.getByTestId('contact-request-sticky-footer')).toBeTruthy();
    expect(screen.getByTestId('contact-request-submit-button')).toBeDisabled();
  });
});
