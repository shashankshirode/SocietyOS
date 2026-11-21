import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentDisplayName } from '../../../../ui/typography/ResidentDisplayName';

describe('Resident dashboard long-name handling', () => {
  it('keeps a long resident name on one line with tail truncation', async () => {
    await renderWithProviders(
      <ResidentDisplayName
        testID="long-resident-name"
        displayName="Shashank Dattatraya Deshmukh Patwardhan"
      />,
    );

    const name = screen.getByTestId('long-resident-name');
    expect(name.props.numberOfLines).toBe(1);
    expect(name.props.ellipsizeMode).toBe('tail');
  });
});
