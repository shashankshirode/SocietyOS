import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeSwitcherSheet } from '../components/ResidentHomeSwitcherSheet';
import { activeHomeStore } from '../data/activeHomeStore';
import { mockResidentHomeContexts } from '../data/residentHomeContext.mockData';
import { useResidentHomeContexts } from '../hooks/useResidentHomeContexts';
import { useSwitchResidentHome } from '../hooks/useSwitchResidentHome';

jest.mock('../hooks/useResidentHomeContexts');
jest.mock('../hooks/useSwitchResidentHome');

const mockedUseResidentHomeContexts = jest.mocked(useResidentHomeContexts);
const mockedUseSwitchResidentHome = jest.mocked(useSwitchResidentHome);

describe('ResidentHomeSwitcherSheet stable selection', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-003');
    mockedUseResidentHomeContexts.mockReturnValue({
      data: mockResidentHomeContexts.map((context) => ({
        ...context,
        isCurrent: context.homeContextId === 'context-001',
      })),
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    mockedUseSwitchResidentHome.mockReturnValue({
      switchHome: jest.fn().mockResolvedValue(true),
      isSubmitting: false,
      switchingHomeContextId: null,
      error: null,
    });
  });

  it('selects the live active homeContextId even when fetched isCurrent flags are stale', async () => {
    await renderWithProviders(<ResidentHomeSwitcherSheet visible onClose={jest.fn()} />);

    const tenantHome = screen.getByLabelText(
      'Select flat context C-503 · Building C'
    );
    const staleOwnerHome = screen.getByLabelText(
      'Select flat context A-1204 · Tower A · East Wing'
    );

    expect(tenantHome.props.accessibilityState.selected).toBe(true);
    expect(staleOwnerHome.props.accessibilityState.selected).toBe(false);
  });

  it('does not issue a duplicate switch for the current home', async () => {
    const onClose = jest.fn();
    const switchHome = jest.fn().mockResolvedValue(true);
    mockedUseSwitchResidentHome.mockReturnValue({
      switchHome,
      isSubmitting: false,
      switchingHomeContextId: null,
      error: null,
    });
    await renderWithProviders(<ResidentHomeSwitcherSheet visible onClose={onClose} />);

    fireEvent.press(screen.getByLabelText('Select flat context C-503 · Building C'));

    expect(switchHome).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows progress only on the target card while a switch is in flight', async () => {
    mockedUseSwitchResidentHome.mockReturnValue({
      switchHome: jest.fn().mockResolvedValue(false),
      isSubmitting: true,
      switchingHomeContextId: 'context-004',
      error: null,
    });
    await renderWithProviders(<ResidentHomeSwitcherSheet visible onClose={jest.fn()} />);

    expect(screen.getByTestId('home-context-switching-context-004')).toBeTruthy();
    expect(screen.queryByTestId('home-context-switching-context-003')).toBeNull();
    expect(
      screen.getByLabelText('Select flat context P-702 · Palm Tower').props.accessibilityState.disabled
    ).toBe(true);
  });

  it('keeps a partially restricted home selectable when no switch is in flight', async () => {
    await renderWithProviders(<ResidentHomeSwitcherSheet visible onClose={jest.fn()} />);

    expect(
      screen.getByLabelText('Select flat context P-702 · Palm Tower').props.accessibilityState.disabled
    ).toBe(false);
  });
});
