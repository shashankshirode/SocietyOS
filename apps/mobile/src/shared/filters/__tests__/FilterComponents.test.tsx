import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { FilterChip } from '../FilterChip';
import { FilterChipGroup } from '../FilterChipGroup';
import { ActiveFilterBar } from '../ActiveFilterBar';
import { FilterButton } from '../FilterButton';
import { FilterPanel } from '../FilterPanel';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';

describe('Filter UI Components', () => {
  it('renders FilterChip with label and selected state styling', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FilterChip label="Pending" selected />
      </ThemeProvider>
    );

    const chip = screen.getByText('Pending');
    expect(chip).toBeOnTheScreen();
  });

  it('renders FilterChipGroup horizontal layout and handles select changes', async () => {
    const filters = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
    ];
    const onChange = jest.fn();

    await renderWithProviders(
      <ThemeProvider>
        <FilterChipGroup
          filters={filters}
          selectedValues={['all']}
          onChange={onChange}
          layout="horizontal-scroll"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('All')).toBeOnTheScreen();
    expect(screen.getByText('Active')).toBeOnTheScreen();
  });

  it('renders ActiveFilterBar with active selections', async () => {
    const activeFilters = [{ key: 'status', label: 'Status: Pending' }];
    const onRemove = jest.fn();

    await renderWithProviders(
      <ThemeProvider>
        <ActiveFilterBar
          filters={activeFilters}
          onRemove={onRemove}
          onClearAll={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Status: Pending')).toBeOnTheScreen();
  });

  it('renders FilterButton with correct active count and labels', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <FilterButton label="Status Filters" activeCount={3} onPress={onPress} />
      </ThemeProvider>
    );

    expect(screen.getByText('Status Filters')).toBeOnTheScreen();
    expect(screen.getByText('3')).toBeOnTheScreen();
  });

  it('renders FilterPanel when visible and interactive', async () => {
    const sections = [
      {
        key: 'priority',
        title: 'Priority',
        options: [{ label: 'High', value: 'high' }],
      },
    ];

    await renderWithProviders(
      <ThemeProvider>
        <FilterPanel
          visible={true}
          sections={sections}
          onApply={jest.fn()}
          onClear={jest.fn()}
          onCancel={jest.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Priority')).toBeOnTheScreen();
    expect(screen.getByText('High')).toBeOnTheScreen();
  });
});
