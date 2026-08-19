import { fireEvent, screen } from '@testing-library/react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';

describe('contact request helper and counter', () => {
  it('renders helper once and updates a separate character counter', async () => {
    await renderContactRequestScreen();
    const helper = 'Briefly explain why you would like to contact this resident.';

    expect(screen.getAllByText(helper)).toHaveLength(1);
    await fireEvent.changeText(screen.getByTestId('contact-request-message-input'), 'Hello resident');
    expect(screen.getByTestId('contact-request-message-character-count')).toHaveTextContent(
      '486 characters remaining',
    );
  });
});
