import React from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { useBlueprintFeatureCoverage } from '../useBlueprintFeatureCoverage';
import { BlueprintFeatureCoverageScreen } from '../../../modules/superAdmin/screens/BlueprintFeatureCoverageScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SuperAdminStackParamList } from '../../../app/navigation/navigation.types';

function TestHookComponent() {
  const {
    features,
    stats,
    searchQuery,
    setSearchQuery,
    setSelectedPhase,
  } = useBlueprintFeatureCoverage();

  return (
    <View>
      <Text testID="total-features">{stats.totalFeatures.toString()}</Text>
      <Text testID="implemented-features">{stats.implemented.toString()}</Text>
      <Text testID="filtered-count">{features.length.toString()}</Text>
      <TextInput
        testID="search-input"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button
        title="Select MVP"
        testID="select-mvp-btn"
        onPress={() => setSelectedPhase('MVP')}
      />
    </View>
  );
}

describe('Blueprint Feature Coverage', () => {
  it('computes coverage statistics correctly', async () => {
    await renderWithProviders(<TestHookComponent />);
    expect(screen.getByTestId('total-features')).toBeOnTheScreen();
    expect(screen.getByTestId('implemented-features')).toBeOnTheScreen();
  });

  it('filters features by search query', async () => {
    await renderWithProviders(<TestHookComponent />);
    
    const totalCount = parseInt(screen.getByTestId('total-features').props.children, 10);

    const input = screen.getByTestId('search-input');
    fireEvent.changeText(input, 'Setup');

    await waitFor(() => {
      const filteredCount = parseInt(screen.getByTestId('filtered-count').props.children, 10);
      expect(filteredCount).toBeLessThan(totalCount);
      expect(filteredCount).toBeGreaterThan(0);
    });
  });

  it('filters features by phase', async () => {
    await renderWithProviders(<TestHookComponent />);

    const totalCount = parseInt(screen.getByTestId('total-features').props.children, 10);

    const button = screen.getByTestId('select-mvp-btn');
    fireEvent.press(button);

    await waitFor(() => {
      const filteredCount = parseInt(screen.getByTestId('filtered-count').props.children, 10);
      expect(filteredCount).toBeLessThan(totalCount);
      expect(filteredCount).toBeGreaterThan(0);
    });
  });

  it('renders coverage dashboard screen correctly', async () => {
    type ScreenProps = NativeStackScreenProps<SuperAdminStackParamList, 'BlueprintFeatureCoverage'>;
    const navigation = { navigate: jest.fn() } as never;
    const route = { key: 'BlueprintFeatureCoverage-test', name: 'BlueprintFeatureCoverage' } as ScreenProps['route'];
    await renderWithProviders(<BlueprintFeatureCoverageScreen navigation={navigation} route={route} />);
    expect(screen.getByPlaceholderText('Search blueprint features...')).toBeOnTheScreen();
  });
});
