import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeHeader } from '../../../../ui/patterns/ResidentHomeHeader';
import { useResidentHomeContexts } from '../hooks/useResidentHomeContexts';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';

jest.mock('../hooks/useResidentHomeContexts');

describe('ResidentHomeHeader switcher integration', () => {
  const mockUseContexts = useResidentHomeContexts as jest.Mock;

  it('renders switcher trigger icon inside the header when multiple contexts exist', async () => {
    mockUseContexts.mockReturnValue({
      data: [
        { homeContextId: 'context-001', societyName: 'GV', flatNumber: 'A-1204', isCurrent: true, residentRole: 'owner', status: 'active' },
        { homeContextId: 'context-002', societyName: 'GV', flatNumber: 'B-804', isCurrent: false, residentRole: 'familyMember', status: 'active' },
      ],
      isLoading: false,
    });

    await renderWithProviders(
      <MockStoreProvider>
        <ResidentHomeHeader
          residentName="Shashank"
          unitLabel="A-1204"
          societyName="GV"
          roleLabel="Owner"
          unreadNoticeCount={0}
          pendingActionCount={0}
          onProfilePress={jest.fn()}
          onSwitchRolePress={jest.fn()}
        />
      </MockStoreProvider>
    );

    expect(screen.getByLabelText('Open home and society switcher bottom sheet')).toBeTruthy();
  });
});
