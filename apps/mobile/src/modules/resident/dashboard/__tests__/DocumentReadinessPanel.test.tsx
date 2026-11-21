import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { DocumentReadinessPanel } from '../components/DocumentReadinessPanel';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('DocumentReadinessPanel', () => {
    it('summarizes readiness while limiting sensitive document rows', async () => {
        const dashboard = getDashboardFixture();
        await renderWithProviders(<DocumentReadinessPanel documents={dashboard.documents.slice(0, RESIDENT_DASHBOARD_LIMITS.documents)} onDocumentPress={dashboardNoop} onAddDocumentPress={dashboardNoop} summaryLabels={enMessages.resident.dashboard.documents} statusLabels={{ missing: enMessages.resident.dashboard.documents.missing }}/>);
        expect(screen.getByText(enMessages.resident.dashboard.documents.missing)).toBeTruthy();
        expect(screen.queryByText(getRequiredItem(dashboard.documents, 3, "DocumentReadinessPanel.test.tsx").title)).toBeNull();
    });
});

