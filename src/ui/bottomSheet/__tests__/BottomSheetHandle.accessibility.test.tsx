import React from 'react';
import { screen } from '@testing-library/react-native';
import { BottomSheetHandle } from '../BottomSheetHandle';
import { enMessages } from '../../../messages/en';
import { renderWithProviders } from '../../../test/testUtils';

describe('BottomSheetHandle Accessibility', () => {
  it('should render the drag handle with correct accessibility label and role', async () => {
    await renderWithProviders(<BottomSheetHandle />);

    const handle = screen.getByRole('button', {
      name: enMessages.resident.accessibility.dailyInsights.dragHandle,
    });
    expect(handle).toBeTruthy();
  });
});
