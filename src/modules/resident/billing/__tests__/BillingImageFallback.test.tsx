import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ImageWithFallback } from '../../../../ui/media/ImageWithFallback';

describe('billing image fallback', () => {
  it('renders an accessible icon fallback when no image source is available', async () => {
    await renderWithProviders(
      <ImageWithFallback
        accessibilityLabel="Billing category visual"
        height={44}
        fallbackIconName="receipt-outline"
      />,
    );
    expect(screen.getByLabelText('Billing category visual')).toBeOnTheScreen();
    expect(screen.getByText('Billing category visual')).toBeOnTheScreen();
  });
});
