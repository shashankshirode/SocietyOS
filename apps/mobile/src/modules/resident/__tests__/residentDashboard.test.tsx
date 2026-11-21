import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ResidentHomeHeader } from '../../../ui/patterns/ResidentHomeHeader';
import { SmartReminderStrip } from '../../../ui/patterns/SmartReminderStrip';
import { PriorityActionRail } from '../../../ui/patterns/PriorityActionRail';
import { VisitorAccessTimeline } from '../../../ui/patterns/VisitorAccessTimeline';
import { MaintenancePaymentWallet } from '../../../ui/patterns/MaintenancePaymentWallet';
import { ComplaintProgressPanel } from '../../../ui/patterns/ComplaintProgressPanel';
import { ResidentConnectPanel } from '../../../ui/patterns/ResidentConnectPanel';
import { NoticeHighlightCarousel } from '../../../ui/patterns/NoticeHighlightCarousel';
import { DocumentVaultPanel } from '../../../ui/patterns/DocumentVaultPanel';
import { AmenityBookingCarousel } from '../../../ui/patterns/AmenityBookingCarousel';
import { EmergencyActionPanel } from '../../../ui/patterns/EmergencyActionPanel';
import { CommunityServicesGrid } from '../../../ui/patterns/CommunityServicesGrid';
import { HomeActivityTimeline } from '../../../ui/patterns/HomeActivityTimeline';
import { StatusPill } from '../../../ui/components/StatusPill';
import { IconBadge } from '../../../ui/components/IconBadge';
import { residentDashboardMockData } from '../dashboard/data/dashboard.mockData';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
const noop = () => { };
describe('ResidentHomeHeader', () => {
    it('renders greeting and resident info', async () => {
        await renderWithProviders(<ResidentHomeHeader residentName="Shashank" unitLabel="A-1204 · Tower A" societyName="Green Valley Heights" roleLabel="Resident Owner" unreadNoticeCount={3} pendingActionCount={5} onProfilePress={noop} onSwitchRolePress={noop}/>);
        expect(screen.getByText(/Shashank/)).toBeTruthy();
        expect(screen.getByText('A-1204 · Tower A')).toBeTruthy();
        expect(screen.getByText('Green Valley Heights')).toBeTruthy();
        expect(screen.getByText('Resident Owner')).toBeTruthy();
    });
    it('shows notification badge count', async () => {
        await renderWithProviders(<ResidentHomeHeader residentName="Test" unitLabel="B-102" societyName="Test Society" roleLabel="Tenant" unreadNoticeCount={7} pendingActionCount={0} onProfilePress={noop} onSwitchRolePress={noop}/>);
        expect(screen.getByText('7')).toBeTruthy();
    });
    it('renders long labels without crash', async () => {
        await renderWithProviders(<ResidentHomeHeader residentName="Very Long Name That Could Overflow" unitLabel="A-1204 / Tower B / East Wing / Basement Parking P2-184" societyName="Green Valley Heights Phase 2 Cooperative Housing Society" roleLabel="Resident Owner" unreadNoticeCount={99} pendingActionCount={25} onProfilePress={noop} onSwitchRolePress={noop}/>);
        expect(true).toBe(true);
    });
});
describe('SmartReminderStrip', () => {
    it('renders reminders', async () => {
        await renderWithProviders(<SmartReminderStrip reminders={residentDashboardMockData.reminders} onReminderPress={noop}/>);
        expect(screen.getByText('Visitor arriving in 20 min')).toBeTruthy();
        expect(screen.getByText('Maintenance bill due in 4 days')).toBeTruthy();
    });
    it('renders nothing when empty', async () => {
        const result = await renderWithProviders(<SmartReminderStrip reminders={[]} onReminderPress={noop}/>);
        expect(result.toJSON()).toBeNull();
    });
});
describe('PriorityActionRail', () => {
    it('renders primary and secondary actions', async () => {
        await renderWithProviders(<PriorityActionRail actions={residentDashboardMockData.priorityActions} onActionPress={noop}/>);
        expect(screen.getByText('Pay Maintenance')).toBeTruthy();
        expect(screen.getByText('Emergency SOS')).toBeTruthy();
    });
});
describe('VisitorAccessTimeline', () => {
    it('renders visitor timeline items', async () => {
        await renderWithProviders(<VisitorAccessTimeline items={residentDashboardMockData.visitorTimeline} onCreateVisitorPress={noop} onVisitorPress={noop}/>);
        expect(screen.getByText('Rajesh Kumar')).toBeTruthy();
        expect(screen.getByText('Amazon Delivery')).toBeTruthy();
        expect(screen.getByText('Sunita Bai')).toBeTruthy();
    });
    it('renders empty state when no visitors', async () => {
        await renderWithProviders(<VisitorAccessTimeline items={[]} onCreateVisitorPress={noop} onVisitorPress={noop}/>);
        expect(screen.getByText('No visitors today')).toBeTruthy();
        expect(screen.getByText('Create Visitor Pass')).toBeTruthy();
    });
});
describe('MaintenancePaymentWallet', () => {
    it('renders bill amount', async () => {
        await renderWithProviders(<MaintenancePaymentWallet {...residentDashboardMockData.maintenancePayment} onPayNowPress={noop} onBillPress={noop} onLedgerPress={noop}/>);
        expect(screen.getByText('4,850')).toBeTruthy();
        expect(screen.getByText('July 2026')).toBeTruthy();
        expect(screen.getByText('Pay Now')).toBeTruthy();
    });
    it('renders charge tags', async () => {
        await renderWithProviders(<MaintenancePaymentWallet {...residentDashboardMockData.maintenancePayment} onPayNowPress={noop} onBillPress={noop} onLedgerPress={noop}/>);
        expect(screen.getByText('Maintenance')).toBeTruthy();
        expect(screen.getByText('Sinking Fund')).toBeTruthy();
    });
});
describe('ComplaintProgressPanel', () => {
    it('renders complaint progress', async () => {
        const data = residentDashboardMockData.complaintProgress!;
        await renderWithProviders(<ComplaintProgressPanel {...data} onComplaintPress={noop}/>);
        expect(screen.getByText(data.title)).toBeTruthy();
        expect(screen.getByText('CMP-2026-0147')).toBeTruthy();
        expect(screen.getByText('Raised')).toBeTruthy();
        expect(screen.getByText('In Progress')).toBeTruthy();
    });
});
describe('ResidentConnectPanel', () => {
    it('renders contact request and department chats', async () => {
        await renderWithProviders(<ResidentConnectPanel {...includeWhenPresent("contactRequest", residentDashboardMockData.contactRequest)} departmentChats={residentDashboardMockData.departmentChats} onAcceptRequest={noop} onRejectRequest={noop} onOpenDepartmentChat={noop} onOpenResidentConnect={noop}/>);
        expect(screen.getByText('Contact Request')).toBeTruthy();
        expect(screen.getByText('Accept')).toBeTruthy();
        expect(screen.getByText('Decline')).toBeTruthy();
        expect(screen.getByText('Accounts Team')).toBeTruthy();
    });
    it('fires accept action', async () => {
        const onAccept = jest.fn();
        await renderWithProviders(<ResidentConnectPanel {...includeWhenPresent("contactRequest", residentDashboardMockData.contactRequest)} departmentChats={residentDashboardMockData.departmentChats} onAcceptRequest={onAccept} onRejectRequest={noop} onOpenDepartmentChat={noop} onOpenResidentConnect={noop}/>);
        fireEvent.press(screen.getByText('Accept'));
        expect(onAccept).toHaveBeenCalledWith('cr-1');
    });
});
describe('NoticeHighlightCarousel', () => {
    it('renders notice cards', async () => {
        await renderWithProviders(<NoticeHighlightCarousel notices={residentDashboardMockData.notices} onNoticePress={noop} onViewAllPress={noop}/>);
        expect(screen.getByText('Annual General Meeting — 15 July 2026')).toBeTruthy();
        expect(screen.getByText('View All')).toBeTruthy();
    });
});
describe('DocumentVaultPanel', () => {
    it('renders document rows', async () => {
        await renderWithProviders(<DocumentVaultPanel documents={residentDashboardMockData.documents} onDocumentPress={noop} onAddDocumentPress={noop}/>);
        expect(screen.getByText('Rent Agreement 2026-27')).toBeTruthy();
        expect(screen.getAllByText('Add Document').length).toBeGreaterThanOrEqual(1);
    });
});
describe('AmenityBookingCarousel', () => {
    it('renders amenity cards', async () => {
        await renderWithProviders(<AmenityBookingCarousel amenities={residentDashboardMockData.amenities} onAmenityPress={noop} onBookPress={noop}/>);
        expect(screen.getByText('Swimming Pool')).toBeTruthy();
        expect(screen.getByText('Clubhouse')).toBeTruthy();
        expect(screen.getByText('₹200/hr')).toBeTruthy();
    });
});
describe('EmergencyActionPanel', () => {
    it('renders SOS and emergency actions', async () => {
        await renderWithProviders(<EmergencyActionPanel actions={residentDashboardMockData.emergencyActions} onSosHoldComplete={noop} onEmergencyActionPress={noop}/>);
        expect(screen.getByText('SOS')).toBeTruthy();
        expect(screen.getByText('Emergency SOS')).toBeTruthy();
        expect(screen.getByText('Medical')).toBeTruthy();
        expect(screen.getByText('Fire Alert')).toBeTruthy();
    });
});
describe('CommunityServicesGrid', () => {
    it('renders service tiles', async () => {
        await renderWithProviders(<CommunityServicesGrid services={residentDashboardMockData.communityServices} onServicePress={noop}/>);
        expect(screen.getByText('Car Wash')).toBeTruthy();
        expect(screen.getByText('Pest Control')).toBeTruthy();
        expect(screen.getByText('Housekeeping')).toBeTruthy();
    });
});
describe('HomeActivityTimeline', () => {
    it('renders activity items', async () => {
        await renderWithProviders(<HomeActivityTimeline activities={residentDashboardMockData.activities} onActivityPress={noop}/>);
        expect(screen.getByText('Visitor pass created')).toBeTruthy();
        expect(screen.getByText('Complaint status updated')).toBeTruthy();
        expect(screen.getByText('15 min ago')).toBeTruthy();
    });
});
describe('StatusPill', () => {
    it('renders label text', async () => {
        await renderWithProviders(<StatusPill label="ACTIVE" tone="success"/>);
        expect(screen.getByText('ACTIVE')).toBeTruthy();
    });
});
describe('IconBadge', () => {
    it('renders without crash', async () => {
        await renderWithProviders(<IconBadge icon="home-outline"/>);
        expect(true).toBe(true);
    });
});

