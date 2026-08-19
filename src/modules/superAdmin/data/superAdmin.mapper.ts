



import type { PlatformDashboardMetrics, SuperAdminHomeData, PlatformAuditLogEntry, PlatformOperationalAlert, DataExportRequest, PlatformSettingsGroup, PlatformReleaseRecord } from '../../../shared/types/platform.types';
import type { PlatformSociety, SocietyOnboardingDraft, HierarchyTemplate, SocietyModuleConfig, PlatformFeatureFlag, SocietyAdminUser, PlatformUserRecord } from '../../../shared/types/platformSociety.types';
import type { HiddenCommercialControl } from '../../../shared/types/platformCommercial.types';
import type { SupportTicket, IntegrationRecord, NotificationChannelRecord } from '../../../shared/types/platformSupport.types';
import type { UsageAnalyticsMetrics, ModuleAdoptionRow, SocietyHealthRow } from '../../../shared/types/platformAnalytics.types';


export const mapDashboard = (dto: PlatformDashboardMetrics): PlatformDashboardMetrics => dto;
export const mapHome = (dto: SuperAdminHomeData): SuperAdminHomeData => dto;
export const mapSociety = (dto: PlatformSociety): PlatformSociety => dto;
export const mapSocieties = (dtos: PlatformSociety[]): PlatformSociety[] => dtos.map(mapSociety);
export const mapOnboardingDraft = (dto: SocietyOnboardingDraft): SocietyOnboardingDraft => dto;
export const mapOnboardingDrafts = (dtos: SocietyOnboardingDraft[]): SocietyOnboardingDraft[] => dtos.map(mapOnboardingDraft);
export const mapTemplate = (dto: HierarchyTemplate): HierarchyTemplate => dto;
export const mapTemplates = (dtos: HierarchyTemplate[]): HierarchyTemplate[] => dtos.map(mapTemplate);
export const mapModuleConfig = (dto: SocietyModuleConfig): SocietyModuleConfig => dto;
export const mapModuleConfigs = (dtos: SocietyModuleConfig[]): SocietyModuleConfig[] => dtos.map(mapModuleConfig);
export const mapFeatureFlag = (dto: PlatformFeatureFlag): PlatformFeatureFlag => dto;
export const mapFeatureFlags = (dtos: PlatformFeatureFlag[]): PlatformFeatureFlag[] => dtos.map(mapFeatureFlag);
export const mapCommercial = (dto: HiddenCommercialControl): HiddenCommercialControl => dto;
export const mapCommercials = (dtos: HiddenCommercialControl[]): HiddenCommercialControl[] => dtos.map(mapCommercial);
export const mapTicket = (dto: SupportTicket): SupportTicket => dto;
export const mapTickets = (dtos: SupportTicket[]): SupportTicket[] => dtos.map(mapTicket);
export const mapAdminUser = (dto: SocietyAdminUser): SocietyAdminUser => dto;
export const mapAdminUsers = (dtos: SocietyAdminUser[]): SocietyAdminUser[] => dtos.map(mapAdminUser);
export const mapPlatformUser = (dto: PlatformUserRecord): PlatformUserRecord => dto;
export const mapPlatformUsers = (dtos: PlatformUserRecord[]): PlatformUserRecord[] => dtos.map(mapPlatformUser);
export const mapAuditLog = (dto: PlatformAuditLogEntry): PlatformAuditLogEntry => dto;
export const mapAuditLogs = (dtos: PlatformAuditLogEntry[]): PlatformAuditLogEntry[] => dtos.map(mapAuditLog);
export const mapAlert = (dto: PlatformOperationalAlert): PlatformOperationalAlert => dto;
export const mapAlerts = (dtos: PlatformOperationalAlert[]): PlatformOperationalAlert[] => dtos.map(mapAlert);
export const mapUsageAnalytics = (dto: UsageAnalyticsMetrics): UsageAnalyticsMetrics => dto;
export const mapModuleAdoption = (dto: ModuleAdoptionRow): ModuleAdoptionRow => dto;
export const mapModuleAdoptions = (dtos: ModuleAdoptionRow[]): ModuleAdoptionRow[] => dtos.map(mapModuleAdoption);
export const mapHealthRow = (dto: SocietyHealthRow): SocietyHealthRow => dto;
export const mapHealthRows = (dtos: SocietyHealthRow[]): SocietyHealthRow[] => dtos.map(mapHealthRow);
export const mapIntegration = (dto: IntegrationRecord): IntegrationRecord => dto;
export const mapIntegrations = (dtos: IntegrationRecord[]): IntegrationRecord[] => dtos.map(mapIntegration);
export const mapNotificationChannel = (dto: NotificationChannelRecord): NotificationChannelRecord => dto;
export const mapNotificationChannels = (dtos: NotificationChannelRecord[]): NotificationChannelRecord[] => dtos.map(mapNotificationChannel);
export const mapExportRequest = (dto: DataExportRequest): DataExportRequest => dto;
export const mapSettings = (dto: PlatformSettingsGroup): PlatformSettingsGroup => dto;
export const mapSettingsList = (dtos: PlatformSettingsGroup[]): PlatformSettingsGroup[] => dtos.map(mapSettings);
export const mapRelease = (dto: PlatformReleaseRecord): PlatformReleaseRecord => dto;
export const mapReleases = (dtos: PlatformReleaseRecord[]): PlatformReleaseRecord[] => dtos.map(mapRelease);
