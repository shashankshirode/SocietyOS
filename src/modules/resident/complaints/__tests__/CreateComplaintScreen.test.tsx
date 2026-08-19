import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { CreateComplaintScreen } from '../screens/CreateComplaintScreen';
import { enMessages } from '../../../../messages/en';

describe('CreateComplaintScreen Component', () => {
  it('renders complaint creation form successfully', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    const screen = await renderWithProviders(
      <CreateComplaintScreen
        navigation={navigationMock}
      />
    );
    expect(screen.getByText(enMessages.complaints.createTitle)).toBeOnTheScreen();
  });
});
