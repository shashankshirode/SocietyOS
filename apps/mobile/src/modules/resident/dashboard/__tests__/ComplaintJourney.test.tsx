import React from 'react';
import { screen } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { ComplaintJourney } from '../components/ComplaintJourney';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 320, height: 568, scale: 1, fontScale: 1 })),
}));

describe('ComplaintJourney', () => {
  it('condenses progress to three contextual steps on compact phones', async () => {
    (useWindowDimensions as jest.Mock).mockReturnValue({ width: 320, height: 568, scale: 1, fontScale: 1 });
    const complaint = getDashboardFixture().complaintProgress!;
    await renderWithProviders(
      <ComplaintJourney
        {...complaint}
        onComplaintPress={dashboardNoop}
        sectionTitle={enMessages.resident.dashboard.sections.complaints}
        priorityLabels={enMessages.resident.dashboard.complaint.priority}
      />,
    );
    const renderedSteps = complaint.steps.filter((step) => screen.queryByText(step.label));
    expect(renderedSteps).toHaveLength(3);
    expect(screen.getByText(complaint.latestUpdate!)).toBeTruthy();
  });
});
