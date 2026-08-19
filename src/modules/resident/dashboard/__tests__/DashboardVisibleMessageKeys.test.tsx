import React from 'react';
import { View } from 'react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { AmenityDiscoveryRail, CommunityServiceMatrix, ComplaintJourney, DocumentReadinessPanel, FinancialSnapshot, HomePulsePanel, ResidentActivityStream, ResidentCommandDock, ResidentConnectPreview, SocietyNoticeRail, TodayCommandCenter, VisitorJourneyTimeline, } from '../components';
import { residentAmenityImageByName } from '../../media/residentImageUsageMap';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardExperience, getDashboardFixture } from './dashboardTestFixtures';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
describe('Dashboard visible message-key safety', () => {
    it('renders integrated dashboard sections without exposing localization keys', async () => {
        const dashboard = getDashboardFixture();
        const experience = getDashboardExperience();
        const copy = enMessages.resident.dashboard;
        const rendered = await renderWithProviders(<View>
        <TodayCommandCenter title={copy.sections.commandCenter} subtitle={copy.sections.commandCenterSubtitle} viewAllLabel={copy.actions.viewAllPriorities} emptyTitle={enMessages.resident.priority.emptyTitle} emptyDescription={enMessages.resident.priority.emptyDescription} items={experience.priorities} summary={experience.prioritySummary} onActionPress={dashboardNoop} onViewAllPress={dashboardNoop}/>
        <HomePulsePanel pulse={experience.pulse}/>
        <ResidentCommandDock title={copy.sections.commandDock} subtitle={copy.sections.commandDockSubtitle} actions={experience.commandActions} onActionPress={dashboardNoop}/>
        <VisitorJourneyTimeline items={dashboard.visitorTimeline.slice(0, RESIDENT_DASHBOARD_LIMITS.visitors)} onCreateVisitorPress={dashboardNoop} onVisitorPress={dashboardNoop} title={copy.sections.visitors} subtitle={copy.sections.visitorsSubtitle} createPassLabel={copy.actions.createVisitor} noVisitorsLabel={copy.empty.visitorsTitle} noVisitorsCtaLabel={copy.actions.createVisitor} otpLabel={copy.status.otp} statusLabels={{ ...copy.status, inside: copy.status.insideSociety }}/>
        <FinancialSnapshot {...dashboard.maintenancePayment} onPayNowPress={dashboardNoop} onBillPress={dashboardNoop} onLedgerPress={dashboardNoop} sectionTitle={copy.sections.finance} sectionSubtitle={copy.sections.financeSubtitle}/>
        {dashboard.complaintProgress ? <ComplaintJourney {...dashboard.complaintProgress} onComplaintPress={dashboardNoop} sectionTitle={copy.sections.complaints} sectionSubtitle={copy.sections.complaintsSubtitle} priorityLabels={copy.complaint.priority}/> : null}
        <ResidentConnectPreview {...includeWhenPresent("contactRequest", dashboard.contactRequest)} departmentChats={dashboard.departmentChats} onAcceptRequest={dashboardNoop} onRejectRequest={dashboardNoop} onOpenDepartmentChat={dashboardNoop} onOpenResidentConnect={dashboardNoop} sectionTitle={copy.sections.connect} sectionSubtitle={copy.sections.connectSubtitle} openLabel={copy.actions.openConnect} privacyNote={copy.status.privacyFirst} acceptLabel={copy.connect.accept} declineLabel={copy.connect.decline}/>
        <SocietyNoticeRail notices={dashboard.notices.slice(0, RESIDENT_DASHBOARD_LIMITS.notices)} onNoticePress={dashboardNoop} onViewAllPress={dashboardNoop} sectionTitle={copy.sections.notices} sectionSubtitle={copy.sections.noticesSubtitle} viewAllLabel={copy.actions.viewAllNotices} ackLabels={{ pending: copy.noticeCard.acknowledgementPending, acknowledged: copy.noticeCard.acknowledged, notRequired: copy.noticeCard.acknowledgementNotRequired }}/>
        <DocumentReadinessPanel documents={dashboard.documents.slice(0, RESIDENT_DASHBOARD_LIMITS.documents)} onDocumentPress={dashboardNoop} onAddDocumentPress={dashboardNoop} sectionTitle={copy.sections.documents} sectionSubtitle={copy.sections.documentsSubtitle} securityNote={copy.status.secureAccess} addDocumentLabel={copy.actions.uploadDocument} summaryLabels={copy.documents} statusLabels={{ verified: copy.documents.verified, pending: copy.documents.pending, expiring: copy.documents.expiring, expired: copy.documents.expired, missing: copy.documents.missing }}/>
        <AmenityDiscoveryRail amenities={dashboard.amenities.slice(0, RESIDENT_DASHBOARD_LIMITS.amenities)} onAmenityPress={dashboardNoop} onBookPress={dashboardNoop} imageAssetsByAmenityName={residentAmenityImageByName} sectionTitle={copy.sections.amenities} sectionSubtitle={copy.sections.amenitiesSubtitle} bookLabel={copy.actions.bookAmenity} availabilityLabels={{ available: copy.status.available, limited: copy.status.limitedSlots, closed: copy.status.closed }}/>
        <CommunityServiceMatrix services={dashboard.communityServices.slice(0, RESIDENT_DASHBOARD_LIMITS.communityServices)} onServicePress={dashboardNoop} sectionTitle={copy.sections.services} sectionSubtitle={copy.sections.servicesSubtitle} verifiedLabel={copy.status.societyVerified} independentLabel={copy.status.independentProvider}/>
        <ResidentActivityStream title={copy.sections.activity} subtitle={copy.sections.activitySubtitle} activities={dashboard.activities.slice(0, RESIDENT_DASHBOARD_LIMITS.activities)} onActivityPress={dashboardNoop} viewAllLabel={copy.actions.viewAllActivity} onViewAllPress={dashboardNoop}/>
      </View>);
        const renderedTree = JSON.stringify(rendered.toJSON());
        expect(renderedTree).not.toMatch(/(?:resident|common|buttons|accessibility)\.[a-zA-Z]/);
        expect(renderedTree).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:/);
    });
});

