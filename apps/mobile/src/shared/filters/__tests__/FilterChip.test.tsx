import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { FilterChip } from '../FilterChip';

describe('FilterChip Component', () => {
  it('renders filter label and handles presses', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(
      <FilterChip label="Open Tickets" selected={false} onPress={onPress} />
    );
    expect(screen.getByText('Open Tickets')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Open Tickets'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders selected indicators states correctly', async () => {
    const screen = await renderWithProviders(
      <FilterChip label="Resolved" selected={true} />
    );
    expect(screen.getByText('Resolved')).toBeOnTheScreen();
  });
});
