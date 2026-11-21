import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeSwitcherSheet } from '../components/ResidentHomeSwitcherSheet';
import { useResidentHomeContexts } from '../hooks/useResidentHomeContexts';
import { useSwitchResidentHome } from '../hooks/useSwitchResidentHome';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';

jest.mock('../hooks/useResidentHomeContexts');
jest.mock('../hooks/useSwitchResidentHome');
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  function MockModal({ children, visible }: React.PropsWithChildren<{ visible?: boolean }>) {
    if (!visible) return null;
    return <rn.View>{children}</rn.View>;
  }
  MockModal.displayName = 'MockModal';
  rn.Modal = MockModal;
  return rn;
});

describe('ResidentHomeSwitcherSheet', () => {
  const mockUseContexts = useResidentHomeContexts as jest.Mock;
  const mockUseSwitch = useSwitchResidentHome as jest.Mock;

  beforeEach(() => {
    mockUseContexts.mockReturnValue({
      data: [
        { homeContextId: 'context-001', societyId: 'gv', societyName: 'GV', flatNumber: 'A-1204', displayUnitName: 'A-1204 · Tower A', isCurrent: true, residentRole: 'owner', status: 'active', pendingCount: 0, activeVisitorCount: 0 },
        { homeContextId: 'context-003', societyId: 'gp', societyName: 'GP', flatNumber: 'C-503', displayUnitName: 'C-503 · Wing C', isCurrent: false, residentRole: 'tenant', status: 'active', pendingCount: 0, activeVisitorCount: 0 },
      ],
      isLoading: false,
    });
    mockUseSwitch.mockReturnValue({
      switchHome: jest.fn().mockResolvedValue(true),
      isSubmitting: false,
      error: null,
    });
  });

  it('renders list of available contexts grouped by society', async () => {
    await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeSwitcherSheet visible={true} onClose={jest.fn()} />
      </MockStoreProvider>
    );

    expect(screen.getByText('GV')).toBeTruthy();
    expect(screen.getByText('A-1204')).toBeTruthy();
    expect(screen.getByText('GP')).toBeTruthy();
    expect(screen.getByText('C-503')).toBeTruthy();
  });

  it('triggers switchHome when flat context is tapped', async () => {
    const switchMock = jest.fn().mockResolvedValue(true);
    mockUseSwitch.mockReturnValue({
      switchHome: switchMock,
      isSubmitting: false,
      error: null,
    });

    await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeSwitcherSheet visible={true} onClose={jest.fn()} />
      </MockStoreProvider>
    );

    const flatNode = screen.getByLabelText('Select flat context C-503 · Wing C');
    fireEvent.press(flatNode);

    expect(switchMock).toHaveBeenCalledWith('context-003');
  });
});
