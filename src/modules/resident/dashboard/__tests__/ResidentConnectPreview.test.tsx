import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentConnectPreview } from '../components/ResidentConnectPreview';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
describe('ResidentConnectPreview', () => {
    it('keeps contact consent actionable and caps large unread counts', async () => {
        const dashboard = getDashboardFixture('context-004');
        const accept = jest.fn<void, [
            string
        ]>();
        await renderWithProviders(<ResidentConnectPreview {...includeWhenPresent("contactRequest", dashboard.contactRequest)} departmentChats={dashboard.departmentChats} onAcceptRequest={accept} onRejectRequest={dashboardNoop} onOpenDepartmentChat={dashboardNoop} onOpenResidentConnect={dashboardNoop} acceptLabel={enMessages.resident.dashboard.connect.accept} declineLabel={enMessages.resident.dashboard.connect.decline}/>);
        expect(screen.getByText('99+')).toBeTruthy();
        fireEvent.press(screen.getByText(enMessages.resident.dashboard.connect.accept));
        expect(accept).toHaveBeenCalledWith(dashboard.contactRequest!.id);
    });
});

