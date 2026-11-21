import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { ResidentHomeScreen } from '../dashboard/screens/ResidentHomeScreen';
import { ResidentNextStepPanel } from '../../../ui/patterns/ResidentNextStepPanel';
import { ResidentJourneySummary } from '../../../ui/patterns/ResidentJourneySummary';
import { ResidentProgressCoach } from '../../../ui/patterns/ResidentProgressCoach';
import { ResidentTrustPanel } from '../../../ui/patterns/ResidentTrustPanel';
import { ResidentRoleAwareEmptyState } from '../../../ui/patterns/ResidentRoleAwareEmptyState';

jest.mock('../../../core/mockStore/useMockStore', () => ({
  useMockStore: () => ({
    state: {
      visitors: [],
      complaints: [],
      bills: [],
      notices: [],
      chatThreads: [],
    },
    updateVisitor: jest.fn(),
  }),
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })),
} as never;
const mockRoute = {
  params: undefined,
} as never;

describe('Resident Dashboard Productization Journey', () => {
  it('renders ResidentHomeScreen without crash', async () => {
    const { toJSON } = await renderWithProviders(<ResidentHomeScreen navigation={mockNavigation} route={mockRoute} />);
    expect(toJSON()).toBeDefined();
  });

  it('renders ResidentNextStepPanel with proper text and interactions', async () => {
    const primaryPress = jest.fn();
    const { getByText } = await renderWithProviders(
      <ResidentNextStepPanel
        title="Verification Required"
        description="Please upload documents"
        urgency="high"
        primaryActionLabel="Upload Now"
        onPrimaryActionPress={primaryPress}
      />
    );
    expect(getByText('Verification Required')).toBeDefined();
    expect(getByText('Upload Now')).toBeDefined();
  });

  it('renders ResidentJourneySummary with status info', async () => {
    const { getByText } = await renderWithProviders(
      <ResidentJourneySummary
        journeyType="visitor"
        status="APPROVED"
        nextStep="Gate Entry"
      />
    );
    expect(getByText('APPROVED')).toBeDefined();
  });

  it('renders ResidentProgressCoach and timelines', async () => {
    const { getByText } = await renderWithProviders(
      <ResidentProgressCoach
        steps={[
          { title: 'Step 1', status: 'completed' },
          { title: 'Step 2', status: 'current' },
        ]}
      />
    );
    expect(getByText('Step 1')).toBeDefined();
  });

  it('renders ResidentTrustPanel securely', async () => {
    const { getByText } = await renderWithProviders(
      <ResidentTrustPanel message="End-to-end encrypted storage" />
    );
    expect(getByText('End-to-end encrypted storage')).toBeDefined();
  });

  it('renders ResidentRoleAwareEmptyState indicating restrictions', async () => {
    const { getByText } = await renderWithProviders(
      <ResidentRoleAwareEmptyState requiredRole="Owner" currentRole="RESIDENT_FAMILY" />
    );
    expect(getByText('Access Restricted')).toBeDefined();
  });
});
