import React from 'react';
import {  fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeSwitcherButton } from '../components/ResidentHomeSwitcherButton';
import { useResidentHomeContexts } from '../hooks/useResidentHomeContexts';
import { useActiveResidentHome } from '../hooks/useActiveResidentHome';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';

jest.mock('../hooks/useResidentHomeContexts');
jest.mock('../hooks/useActiveResidentHome');
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

describe('ResidentHomeSwitcherButton', () => {
  const mockUseContexts = useResidentHomeContexts as jest.Mock;
  const mockUseActive = useActiveResidentHome as jest.Mock;

  it('hides switch button when only one home context exists', async () => {
    mockUseContexts.mockReturnValue({
      data: [{ homeContextId: 'context-001', displayUnitName: 'A-1204 · Tower A' }],
      isLoading: false,
    });
    mockUseActive.mockReturnValue({
      activeId: 'context-001',
      activeContext: { homeContextId: 'context-001', displayUnitName: 'A-1204 · Tower A' },
    });

    const { toJSON } = await renderWithProviders(<ResidentHomeSwitcherButton />);
    expect(toJSON()).toBeNull();
  });

  it('shows switch button and triggers bottom sheet when contexts > 1', async () => {
    mockUseContexts.mockReturnValue({
      data: [
        { homeContextId: 'context-001', societyId: 'gv', societyName: 'GV', flatNumber: 'A-1204', displayUnitName: 'A-1204 · Tower A', isCurrent: true, residentRole: 'owner', status: 'active', pendingCount: 0, activeVisitorCount: 0 },
        { homeContextId: 'context-002', societyId: 'gv', societyName: 'GV', flatNumber: 'B-804', displayUnitName: 'B-804 · Tower B', isCurrent: false, residentRole: 'familyMember', status: 'active', pendingCount: 0, activeVisitorCount: 0 },
      ],
      isLoading: false,
    });
    mockUseActive.mockReturnValue({
      activeId: 'context-001',
      activeContext: { homeContextId: 'context-001', societyId: 'gv', societyName: 'GV', flatNumber: 'A-1204', displayUnitName: 'A-1204 · Tower A' },
    });

    const { getByLabelText, findByText } = await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeSwitcherButton />
      </MockStoreProvider>
    );

    const btn = getByLabelText('Open home and society switcher bottom sheet');
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
    expect(await findByText('Switch Home')).toBeTruthy();
  });
});
