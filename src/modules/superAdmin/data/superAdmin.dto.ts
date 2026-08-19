


import type { PlatformDashboardMetrics, SuperAdminHomeData, PlatformAuditLogEntry, PlatformOperationalAlert, DataExportRequest, PlatformSettingsGroup, PlatformReleaseRecord } from '../../../shared/types/platform.types';
import type { PlatformSociety, SocietyOnboardingDraft, HierarchyTemplate, SocietyModuleConfig, PlatformFeatureFlag, SocietyAdminUser, PlatformUserRecord } from '../../../shared/types/platformSociety.types';
import type { HiddenCommercialControl, FreeLaunchPlanMapping } from '../../../shared/types/platformCommercial.types';
import type { SupportTicket, SupportTicketEscalation, IntegrationRecord, NotificationChannelRecord } from '../../../shared/types/platformSupport.types';
import type { UsageAnalyticsMetrics, ModuleAdoptionRow, SocietyHealthRow } from '../../../shared/types/platformAnalytics.types';


export type PlatformDashboardDto = PlatformDashboardMetrics;
export type SuperAdminHomeDto = SuperAdminHomeData;
export type PlatformSocietyDto = PlatformSociety;
export type SocietyOnboardingDraftDto = SocietyOnboardingDraft;
export type HierarchyTemplateDto = HierarchyTemplate;
export type SocietyModuleConfigDto = SocietyModuleConfig;
export type PlatformFeatureFlagDto = PlatformFeatureFlag;
export type HiddenCommercialControlDto = HiddenCommercialControl;
export type SupportTicketDto = SupportTicket;
export type SocietyAdminUserDto = SocietyAdminUser;
export type PlatformUserRecordDto = PlatformUserRecord;
export type PlatformAuditLogEntryDto = PlatformAuditLogEntry;
export type PlatformOperationalAlertDto = PlatformOperationalAlert;
export type UsageAnalyticsDto = UsageAnalyticsMetrics;
export type ModuleAdoptionRowDto = ModuleAdoptionRow;
export type SocietyHealthRowDto = SocietyHealthRow;
export type IntegrationRecordDto = IntegrationRecord;
export type NotificationChannelRecordDto = NotificationChannelRecord;
export type DataExportRequestDto = DataExportRequest;
export type PlatformSettingsGroupDto = PlatformSettingsGroup;
export type PlatformReleaseRecordDto = PlatformReleaseRecord;
export type FreeLaunchPlanMappingDto = FreeLaunchPlanMapping;


export interface CreateOnboardingDraftRequest {
  societyName: string;
  societyType: string;
  city: string;
  state: string;
  address?: string;
  numberOfTowersWings: number;
  approximateUnitCount: number;
  primaryContactName: string;
  primaryContactMobile: string;
  primaryContactEmail: string;
  initialAdminEmail: string;
  launchMode: string;
  defaultLanguage: string;
  enabledModuleTemplate: string;
  notes?: string;
}

export interface FeatureFlagChangeRequestDto {
  flagKey: string;
  newValue: boolean;
  reason: string;
}

export interface SocietyFeatureFlagUpdateDto {
  flagKey: string;
  enabled: boolean;
  auditNote: string;
}

export type SupportTicketEscalationDto = SupportTicketEscalation;

export interface DataExportRequestCreateDto {
  type: string;
  societyId?: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  reason: string;
}
