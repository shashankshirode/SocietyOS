import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentAppHeader } from '../ResidentAppHeader';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: React.PropsWithChildren) => children,
  SafeAreaView: ({ children }: React.PropsWithChildren) => children,
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

describe('ResidentAppHeader Safe Area', () => {
  it('includes safe-area top inset internally', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        includeSafeAreaTop={true}
        showBackButton={true}
      />
    );

    const container = screen.getByTestId('resident-header-container');
    expect(container.props.style).toContainEqual(expect.objectContaining({ paddingTop: 40 }));
  });

  it('excludes safe-area top inset when includeSafeAreaTop is false', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        includeSafeAreaTop={false}
        showBackButton={true}
      />
    );

    const container = screen.getByTestId('resident-header-container');
    expect(container.props.style).toContainEqual(expect.objectContaining({ paddingTop: 0 }));
  });
});
