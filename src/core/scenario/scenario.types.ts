import type { ResidentHomeRole } from '../../modules/resident/homeContext/data/residentHomeContext.types';
export type ScenarioMembershipStatus = 'INVITED' | 'PENDING_APPROVAL' | 'ACTIVE' | 'LIMITED' | 'RESTRICTED' | 'SUSPENDED' | 'EXPIRING' | 'ENDED' | 'REJECTED' | 'TRANSFER_PENDING';
export type ScenarioNetworkState = 'online' | 'slow' | 'offline' | 'error_inject';
export type ScenarioTheme = 'light' | 'dark' | 'system';
export type ScenarioTextScale = 1.0 | 1.25 | 1.5 | 2.0;
export interface ScenarioDomainState {
    hasVisitorApproaching?: boolean;
    hasWaitingAtGate?: boolean;
    hasOverdueVisitor?: boolean;
    hasWaitingParcel?: boolean;
    hasDueBill?: boolean;
    hasOverdueBill?: boolean;
    hasUrgentComplaint?: boolean;
    hasUrgentNotice?: boolean;
    hasUpcomingFacilityBooking?: boolean;
    hasExpiringDocument?: boolean;
    hasStaffInside?: boolean;
    hasActiveSosEmergency?: boolean;
    isZeroDataHome?: boolean;
    isDenseDataHome?: boolean;
}
export interface ScenarioDefinition {
    id: string;
    name: string;
    category: 'onboarding' | 'lifecycle' | 'daily_rhythm' | 'interruption' | 'stress_test';
    description: string;
    role: ResidentHomeRole;
    membershipStatus: ScenarioMembershipStatus;
    residenceCount: number;
    activeResidenceName: string;
    activeUnitNumber: string;
    networkState: ScenarioNetworkState;
    textScale?: ScenarioTextScale;
    theme?: ScenarioTheme;
    domain: ScenarioDomainState;
    expectedNarrative: string;
    expectedPrimaryAction: string;
}
export type ScenarioPresetId = 'FIRST_INSTALL' | 'NO_HOME' | 'PENDING_HOME' | 'CALM_HOME' | 'BUSY_EVENING' | 'ATTENTION_OVERLOAD' | 'PAYMENT_PROCESSING' | 'VISITOR_AT_GATE' | 'COMPLAINT_WAITING' | 'DOCUMENT_EXPIRING' | 'RESTRICTED_ROLE' | 'TENANCY_EXPIRING' | 'MOVE_OUT' | 'MULTI_HOME' | 'WRONG_HOME_NOTIF' | 'OFFLINE' | 'SLOW_NETWORK' | 'SESSION_EXPIRED' | 'EMERGENCY_ACTIVE' | 'ZERO_DATA' | 'HIGH_FONT_SCALE' | 'TABLET_MULTI_PANE';

