import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentTodayPriorityPanel } from '../../../../ui/patterns/ResidentTodayPriorityPanel';
import { getDashboardExperience } from './dashboardTestFixtures';

describe('TodayCommandCentreHeader', () => {
  it('renders section title and subtitle correctly without truncation properties on title', async () => {
    const experience = getDashboardExperience();
    const copy = enMessages.resident.dashboard;

    await renderWithProviders(
      <ResidentTodayPriorityPanel
        title={copy.todayCommandCentre.title}
        subtitle={copy.todayCommandCentre.subtitle}
        viewAllLabel={copy.todayCommandCentre.viewAll}
        emptyTitle={copy.todayCommandCentre.noPrioritiesTitle}
        emptyDescription={copy.todayCommandCentre.noPrioritiesMessage}
        items={experience.priorities}
        summary={experience.prioritySummary}
        onActionPress={jest.fn()}
        onViewAllPress={jest.fn()}
      />
    );

    const titleElement = screen.getByText(copy.todayCommandCentre.title);
    expect(titleElement).toBeTruthy();
    
    expect(titleElement.props.numberOfLines).toBeUndefined();

    const subtitleElement = screen.getByText(copy.todayCommandCentre.subtitle);
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.props.numberOfLines).toBe(2);
  });
});
