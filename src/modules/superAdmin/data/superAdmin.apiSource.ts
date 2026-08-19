


import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { PlatformDashboardMetrics, SuperAdminHomeData, PlatformAuditLogEntry, PlatformOperationalAlert, DataExportRequest, PlatformSettingsGroup, PlatformReleaseRecord } from '../../../shared/types/platform.types';
import type { PlatformSociety, SocietyOnboardingDraft, HierarchyTemplate, SocietyModuleConfig, PlatformFeatureFlag, SocietyAdminUser, PlatformUserRecord } from '../../../shared/types/platformSociety.types';
import type { HiddenCommercialControl } from '../../../shared/types/platformCommercial.types';
import type { SupportTicket, IntegrationRecord, NotificationChannelRecord } from '../../../shared/types/platformSupport.types';
import type { UsageAnalyticsMetrics, ModuleAdoptionRow, SocietyHealthRow } from '../../../shared/types/platformAnalytics.types';
import type { CreateOnboardingDraftRequest, FeatureFlagChangeRequestDto, SupportTicketEscalationDto, DataExportRequestCreateDto, SocietyFeatureFlagUpdateDto } from './superAdmin.dto';

const notImplemented = (): Promise<RepositoryResult<never>> =>
  Promise.resolve({ ok: false, error: { message: 'API source not implemented', code: 'NOT_IMPLEMENTED' } });

export const superAdminApiSource = {
  getDashboard: () => notImplemented() as Promise<RepositoryResult<PlatformDashboardMetrics>>,
  getHome: () => notImplemented() as Promise<RepositoryResult<SuperAdminHomeData>>,
  getSocieties: () => notImplemented() as Promise<RepositoryResult<PlatformSociety[]>>,
  listSocieties: () => notImplemented() as Promise<RepositoryResult<PlatformSociety[]>>,
  getSocietyDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<PlatformSociety>>,
  getOnboardingDrafts: () => notImplemented() as Promise<RepositoryResult<SocietyOnboardingDraft[]>>,
  getOnboardingDraftDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<SocietyOnboardingDraft>>,
  createOnboardingDraft: (_req: CreateOnboardingDraftRequest) => notImplemented() as Promise<RepositoryResult<SocietyOnboardingDraft>>,
  getHierarchyTemplates: () => notImplemented() as Promise<RepositoryResult<HierarchyTemplate[]>>,
  getModuleConfiguration: (_id: string) => notImplemented() as Promise<RepositoryResult<SocietyModuleConfig[]>>,
  getFeatureFlags: () => notImplemented() as Promise<RepositoryResult<PlatformFeatureFlag[]>>,
  changeFeatureFlag: (_req: FeatureFlagChangeRequestDto) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  updateSocietyFeatureFlag: (_req: SocietyFeatureFlagUpdateDto) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getCommercialControls: () => notImplemented() as Promise<RepositoryResult<HiddenCommercialControl[]>>,
  getCommercialControlDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<HiddenCommercialControl>>,
  getSupportTickets: () => notImplemented() as Promise<RepositoryResult<SupportTicket[]>>,
  getSupportTicketDetail: (_id: string) => notImplemented() as Promise<RepositoryResult<SupportTicket>>,
  escalateSupportTicket: (_req: SupportTicketEscalationDto) => notImplemented() as Promise<RepositoryResult<{ success: boolean }>>,
  getSocietyAdmins: (_id: string) => notImplemented() as Promise<RepositoryResult<SocietyAdminUser[]>>,
  searchUsers: (_q: string) => notImplemented() as Promise<RepositoryResult<PlatformUserRecord[]>>,
  getOperationalAlerts: () => notImplemented() as Promise<RepositoryResult<PlatformOperationalAlert[]>>,
  getUsageAnalytics: () => notImplemented() as Promise<RepositoryResult<UsageAnalyticsMetrics>>,
  getModuleAdoption: () => notImplemented() as Promise<RepositoryResult<ModuleAdoptionRow[]>>,
  getSocietyHealth: () => notImplemented() as Promise<RepositoryResult<SocietyHealthRow[]>>,
  getIntegrations: () => notImplemented() as Promise<RepositoryResult<IntegrationRecord[]>>,
  getNotificationChannels: () => notImplemented() as Promise<RepositoryResult<NotificationChannelRecord[]>>,
  createDataExportRequest: (_req: DataExportRequestCreateDto) => notImplemented() as Promise<RepositoryResult<DataExportRequest>>,
  getAuditLogs: () => notImplemented() as Promise<RepositoryResult<PlatformAuditLogEntry[]>>,
  getSettings: () => notImplemented() as Promise<RepositoryResult<PlatformSettingsGroup[]>>,
  getReleases: () => notImplemented() as Promise<RepositoryResult<PlatformReleaseRecord[]>>,
};
