import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { PlatformDashboardMetrics, SuperAdminHomeData, PlatformAuditLogEntry, PlatformOperationalAlert, DataExportRequest, PlatformSettingsGroup, PlatformReleaseRecord, DataExportType } from '../../../shared/types/platform.types';
import type { PlatformSociety, SocietyOnboardingDraft, HierarchyTemplate, SocietyModuleConfig, PlatformFeatureFlag, SocietyAdminUser, PlatformUserRecord } from '../../../shared/types/platformSociety.types';
import type { HiddenCommercialControl } from '../../../shared/types/platformCommercial.types';
import type { SupportTicket, IntegrationRecord, NotificationChannelRecord } from '../../../shared/types/platformSupport.types';
import type { UsageAnalyticsMetrics, ModuleAdoptionRow, SocietyHealthRow } from '../../../shared/types/platformAnalytics.types';
import { mockPlatformDashboardMetrics, mockSuperAdminHome } from '../../../shared/mock/platformDashboard.mock';
import { mockPlatformSocieties } from '../../../shared/mock/platformSocieties.mock';
import { mockOnboardingDrafts } from '../../../shared/mock/platformOnboarding.mock';
import { mockHierarchyTemplates } from '../../../shared/mock/hierarchyTemplates.mock';
import { mockPlatformFeatureFlags } from '../../../shared/mock/platformFeatureFlags.mock';
import { mockHiddenCommercialControls } from '../../../shared/mock/hiddenCommercialControls.mock';
import { allMockSupportTickets } from '../../../shared/mock/platformSupportTickets.mock';
import { mockPlatformUsers } from '../../../shared/mock/platformUsers.mock';
import { mockOperationalAlerts } from '../../../shared/mock/platformOperationalAlerts.mock';
import { mockUsageAnalytics } from '../../../shared/mock/platformUsageAnalytics.mock';
import { mockModuleAdoption } from '../../../shared/mock/moduleAdoptionAnalytics.mock';
import { mockSocietyHealth } from '../../../shared/mock/societyHealthOverview.mock';
import { mockIntegrations, mockNotificationChannels } from '../../../shared/mock/platformIntegrations.mock';
import { mockPlatformAuditLogs } from '../../../shared/mock/platformAuditLogs.mock';
import { mockPlatformSettings } from '../../../shared/mock/platformSettings.mock';
import { mockPlatformReleases } from '../../../shared/mock/platformReleaseRollout.mock';
import type { CreateOnboardingDraftRequest, FeatureFlagChangeRequestDto, SupportTicketEscalationDto, DataExportRequestCreateDto, SocietyFeatureFlagUpdateDto } from './superAdmin.dto';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
const delay = (ms = 400) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const ok = <T>(data: T): RepositoryResult<T> => ({ ok: true, data });
export const superAdminMockSource = {
    getDashboard: async (): Promise<RepositoryResult<PlatformDashboardMetrics>> => {
        await delay();
        return ok(mockPlatformDashboardMetrics);
    },
    getHome: async (): Promise<RepositoryResult<SuperAdminHomeData>> => {
        await delay();
        return ok({ ...mockSuperAdminHome, recentAuditActions: mockPlatformAuditLogs.slice(0, 5) });
    },
    getSocieties: async (): Promise<RepositoryResult<PlatformSociety[]>> => {
        await delay();
        return ok([...mockPlatformSocieties]);
    },
    listSocieties: async (): Promise<RepositoryResult<PlatformSociety[]>> => {
        await delay();
        return ok([...mockPlatformSocieties]);
    },
    getSocietyDetail: async (societyId: string): Promise<RepositoryResult<PlatformSociety>> => {
        await delay();
        const s = mockPlatformSocieties.find((s) => s.id === societyId);
        if (!s)
            return { ok: false, error: { message: 'Society not found', code: 'NOT_FOUND' } };
        return ok(s);
    },
    getOnboardingDrafts: async (): Promise<RepositoryResult<SocietyOnboardingDraft[]>> => {
        await delay();
        return ok([...mockOnboardingDrafts]);
    },
    getOnboardingDraftDetail: async (draftId: string): Promise<RepositoryResult<SocietyOnboardingDraft>> => {
        await delay();
        const d = mockOnboardingDrafts.find((d) => d.id === draftId);
        if (!d)
            return { ok: false, error: { message: 'Draft not found', code: 'NOT_FOUND' } };
        return ok(d);
    },
    createOnboardingDraft: async (_request: CreateOnboardingDraftRequest): Promise<RepositoryResult<SocietyOnboardingDraft>> => {
        await delay();
        return ok({ ...getRequiredItem(mockOnboardingDrafts, 0, "superAdmin.mockSource.ts"), id: `onb-${Date.now()}`, status: 'DRAFT' });
    },
    getHierarchyTemplates: async (): Promise<RepositoryResult<HierarchyTemplate[]>> => {
        await delay();
        return ok([...mockHierarchyTemplates]);
    },
    getModuleConfiguration: async (_societyId: string): Promise<RepositoryResult<SocietyModuleConfig[]>> => {
        await delay();
        const modules: SocietyModuleConfig[] = [
            { moduleKey: 'visitorManagement', moduleName: 'Visitor Management', moduleGroup: 'Core', featureFlagKey: 'visitorManagement', enabled: true, recommendedPhase: 'Phase 1', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'billing', moduleName: 'Billing', moduleGroup: 'Core', featureFlagKey: 'maintenanceBilling', enabled: true, recommendedPhase: 'Phase 1', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'complaints', moduleName: 'Complaints', moduleGroup: 'Core', featureFlagKey: 'complaints', enabled: true, recommendedPhase: 'Phase 1', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'notices', moduleName: 'Notices', moduleGroup: 'Core', featureFlagKey: 'notices', enabled: true, recommendedPhase: 'Phase 1', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'guard', moduleName: 'Guard', moduleGroup: 'Security', featureFlagKey: 'guardApp', enabled: true, recommendedPhase: 'Phase 1', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'parking', moduleName: 'Parking', moduleGroup: 'Infrastructure', featureFlagKey: 'parking', enabled: true, recommendedPhase: 'Phase 2', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'governance', moduleName: 'Governance', moduleGroup: 'Governance', featureFlagKey: 'governance', enabled: true, recommendedPhase: 'Phase 2', visibleToSocietyUsers: true, backendEnforcementRequired: false },
            { moduleKey: 'community', moduleName: 'Community', moduleGroup: 'Community', featureFlagKey: 'communityMarketplace', enabled: true, recommendedPhase: 'Phase 3', visibleToSocietyUsers: true, backendEnforcementRequired: false },
        ];
        return ok(modules);
    },
    getFeatureFlags: async (): Promise<RepositoryResult<PlatformFeatureFlag[]>> => {
        await delay();
        return ok([...mockPlatformFeatureFlags]);
    },
    changeFeatureFlag: async (_request: FeatureFlagChangeRequestDto): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    updateSocietyFeatureFlag: async (_request: SocietyFeatureFlagUpdateDto): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    getCommercialControls: async (): Promise<RepositoryResult<HiddenCommercialControl[]>> => {
        await delay();
        return ok([...mockHiddenCommercialControls]);
    },
    getCommercialControlDetail: async (societyId: string): Promise<RepositoryResult<HiddenCommercialControl>> => {
        await delay();
        const c = mockHiddenCommercialControls.find((c) => c.societyId === societyId);
        if (!c)
            return { ok: false, error: { message: 'Not found', code: 'NOT_FOUND' } };
        return ok(c);
    },
    getSupportTickets: async (): Promise<RepositoryResult<SupportTicket[]>> => {
        await delay();
        return ok([...allMockSupportTickets]);
    },
    getSupportTicketDetail: async (ticketId: string): Promise<RepositoryResult<SupportTicket>> => {
        await delay();
        const t = allMockSupportTickets.find((t) => t.id === ticketId);
        if (!t)
            return { ok: false, error: { message: 'Ticket not found', code: 'NOT_FOUND' } };
        return ok(t);
    },
    escalateSupportTicket: async (_request: SupportTicketEscalationDto): Promise<RepositoryResult<{
        success: boolean;
    }>> => {
        await delay();
        return ok({ success: true });
    },
    getSocietyAdmins: async (_societyId: string): Promise<RepositoryResult<SocietyAdminUser[]>> => {
        await delay();
        const admins: SocietyAdminUser[] = mockPlatformUsers.filter(u => u.role === 'SOCIETY_ADMIN').slice(0, 5).map(u => ({
            id: u.id, name: u.displayName, emailMasked: u.emailMasked, mobileMasked: u.mobileMasked,
            role: u.role, status: 'ACTIVE' as const, mfaStatusPlaceholder: 'NOT_SET' as const, societyId: u.societyId, societyName: u.society
        }));
        return ok(admins);
    },
    searchUsers: async (_query: string): Promise<RepositoryResult<PlatformUserRecord[]>> => {
        await delay();
        return ok([...mockPlatformUsers]);
    },
    getOperationalAlerts: async (): Promise<RepositoryResult<PlatformOperationalAlert[]>> => {
        await delay();
        return ok([...mockOperationalAlerts]);
    },
    getUsageAnalytics: async (): Promise<RepositoryResult<UsageAnalyticsMetrics>> => {
        await delay();
        return ok(mockUsageAnalytics);
    },
    getModuleAdoption: async (): Promise<RepositoryResult<ModuleAdoptionRow[]>> => {
        await delay();
        return ok([...mockModuleAdoption]);
    },
    getSocietyHealth: async (): Promise<RepositoryResult<SocietyHealthRow[]>> => {
        await delay();
        return ok([...mockSocietyHealth]);
    },
    getIntegrations: async (): Promise<RepositoryResult<IntegrationRecord[]>> => {
        await delay();
        return ok([...mockIntegrations]);
    },
    getNotificationChannels: async (): Promise<RepositoryResult<NotificationChannelRecord[]>> => {
        await delay();
        return ok([...mockNotificationChannels]);
    },
    createDataExportRequest: async (_request: DataExportRequestCreateDto): Promise<RepositoryResult<DataExportRequest>> => {
        await delay();
        const req: DataExportRequest = {
            id: `exp-${Date.now()}`, type: _request.type as DataExportType,
            ...includeWhenPresent("societyId", _request.societyId),
            dateRangeStart: _request.dateRangeStart, dateRangeEnd: _request.dateRangeEnd, reason: _request.reason,
            status: 'REQUESTED', requestedBy: 'Platform Owner', requestedAt: new Date().toISOString()
        };
        return ok(req);
    },
    getAuditLogs: async (): Promise<RepositoryResult<PlatformAuditLogEntry[]>> => {
        await delay();
        return ok([...mockPlatformAuditLogs]);
    },
    getSettings: async (): Promise<RepositoryResult<PlatformSettingsGroup[]>> => {
        await delay();
        return ok([...mockPlatformSettings]);
    },
    getReleases: async (): Promise<RepositoryResult<PlatformReleaseRecord[]>> => {
        await delay();
        return ok([...mockPlatformReleases]);
    }
};

