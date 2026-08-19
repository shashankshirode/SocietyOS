import { useMemo } from 'react';
import type { EnglishMessagesType } from '../../../../messages/en';
import { t } from '../../household/components/householdComponentUtils';
import type { ResidentRoleVariant } from '../../profile/data/residentRoleCapabilities.types';
import type { ResidentCommandAction, ResidencePulseData, ResidencePulseItem, ResidentDashboardData, ResidentModuleShelfItem, ResidentPriorityItem, ResidentPrioritySummaryData, } from '../data/dashboard.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export const RESIDENT_DASHBOARD_LIMITS = {
    priorities: 3,
    visitors: 4,
    notices: 3,
    documents: 3,
    communityServices: 6,
    activities: 5,
    amenities: 3
} as const;
export interface ResidentDashboardPersonalizationInput {
    dashboard: ResidentDashboardData;
    messages: EnglishMessagesType;
    role: ResidentRoleVariant;
}
export interface ResidentDashboardPersonalization {
    priorities: ResidentPriorityItem[];
    prioritySummary: ResidentPrioritySummaryData;
    pulse: ResidencePulseData;
    commandActions: ResidentCommandAction[];
    moduleShelfItems: ResidentModuleShelfItem[];
}
function countByStatus<TItem extends {
    status: string;
}>(items: TItem[], statuses: readonly string[]): number {
    return items.filter((item) => statuses.includes(item.status)).length;
}
function createPriorityItems({ dashboard, messages, role, }: ResidentDashboardPersonalizationInput): ResidentPriorityItem[] {
    if (dashboard.reminders.some((reminder) => Boolean(reminder.actionId))) {
        const metaBySeverity = {
            danger: messages.resident.dashboard.status.critical,
            warning: messages.resident.dashboard.status.dueSoon,
            info: messages.resident.dashboard.status.recommended,
            success: messages.resident.dashboard.status.informational
        } as const;
        const iconBySeverity = {
            danger: 'alert-circle-outline',
            warning: 'time-outline',
            info: 'sparkles-outline',
            success: 'checkmark-circle-outline'
        } as const;
        return dashboard.reminders.map((reminder) => ({
            id: reminder.id,
            ...includeWhenPresent("actionId", reminder.actionId),
            title: reminder.title,
            description: reminder.description,
            metaLabel: metaBySeverity[reminder.severity],
            actionLabel: reminder.actionLabel,
            iconName: iconBySeverity[reminder.severity],
            tone: reminder.severity
        }));
    }
    const pendingDocuments = countByStatus(dashboard.documents, ['pending', 'missing', 'expired']);
    const upcomingVisitors = countByStatus(dashboard.visitorTimeline, ['upcoming', 'inside']);
    const overdueVisitor = dashboard.visitorTimeline.find((visitor) => visitor.exitAlert);
    const base: ResidentPriorityItem[] = [
        {
            id: 'act-visitor',
            actionId: 'act-visitor',
            title: t(messages, 'resident.priority.visitorTitle'),
            description: t(messages, 'resident.priority.visitorDescription'),
            metaLabel: `${upcomingVisitors} ${t(messages, 'resident.pulse.todaySuffix')}`,
            actionLabel: t(messages, 'resident.experience.createVisitor'),
            iconName: 'people-outline',
            tone: 'info'
        },
        {
            id: 'act-pay',
            actionId: 'act-pay',
            title: t(messages, 'resident.priority.billTitle'),
            description: t(messages, 'resident.priority.billDescription'),
            metaLabel: t(messages, 'resident.priority.metaDueSoon'),
            actionLabel: t(messages, 'resident.experience.payBill'),
            iconName: 'wallet-outline',
            tone: dashboard.maintenancePayment.status === 'overdue' ? 'danger' : 'warning'
        },
        {
            id: 'act-documents',
            actionId: 'act-documents',
            title: t(messages, 'resident.priority.documentTitle'),
            description: t(messages, 'resident.priority.documentDescription'),
            metaLabel: `${pendingDocuments} ${t(messages, 'resident.pulse.pending')}`,
            actionLabel: t(messages, 'resident.experience.uploadDocument'),
            iconName: 'folder-open-outline',
            tone: pendingDocuments > 0 ? 'warning' : 'success'
        },
    ];
    if (overdueVisitor?.exitAlert) {
        const assurancePriority: ResidentPriorityItem = {
            id: `visitor-exit-${overdueVisitor.id}`,
            actionId: 'act-visitor',
            title: t(messages, 'visitor.exitAssurance.exitNotConfirmed'),
            description: t(messages, 'visitor.exitAssurance.dashboardAlertDescription', overdueVisitor.visitorName, overdueVisitor.exitAlert.elapsedMinutes),
            metaLabel: t(messages, 'visitor.exitAssurance.highPriority'),
            actionLabel: t(messages, 'visitor.exitAssurance.confirmLeft'),
            iconName: 'shield-half-outline',
            tone: overdueVisitor.exitAlert.priority === 'critical' ? 'danger' : 'warning'
        };
        if (role === 'RESIDENT_OWNER' || role === 'RESIDENT_TENANT') {
            return [assurancePriority, ...base];
        }
    }
    if (role === 'RESIDENT_OWNER') {
        return [
            {
                id: 'act-family',
                actionId: 'act-family',
                title: t(messages, 'resident.priority.familyEmergencyTitle'),
                description: t(messages, 'resident.priority.familyEmergencyDescription'),
                metaLabel: t(messages, 'resident.priority.metaToday'),
                actionLabel: t(messages, 'resident.household.profile.actions.addFamilyMember'),
                iconName: 'people-circle-outline',
                tone: 'warning'
            },
            {
                id: 'act-tenant',
                actionId: 'act-tenant',
                title: t(messages, 'resident.priority.tenantVerificationTitle'),
                description: t(messages, 'resident.priority.tenantVerificationDescription'),
                metaLabel: t(messages, 'resident.priority.metaBlocked'),
                actionLabel: t(messages, 'resident.household.profile.actions.viewTenantRequestStatus'),
                iconName: 'shield-checkmark-outline',
                tone: 'danger'
            },
            getRequiredItem(base, 1, "useResidentDashboardPersonalization.ts"),
        ];
    }
    if (role === 'RESIDENT_TENANT') {
        return [
            {
                id: 'act-tenant',
                actionId: 'act-tenant',
                title: t(messages, 'resident.priority.tenantVerificationTitle'),
                description: t(messages, 'resident.priority.tenantVerificationDescription'),
                metaLabel: t(messages, 'resident.priority.metaBlocked'),
                actionLabel: t(messages, 'resident.experience.uploadDocument'),
                iconName: 'shield-checkmark-outline',
                tone: 'warning'
            },
            getRequiredItem(base, 0, "useResidentDashboardPersonalization.ts"),
            getRequiredItem(base, 2, "useResidentDashboardPersonalization.ts"),
        ];
    }
    return [
        {
            id: 'act-sos',
            actionId: 'act-sos',
            title: t(messages, 'resident.emergency.homeTitle'),
            description: t(messages, 'resident.priority.familyEmergencyDescription'),
            metaLabel: t(messages, 'resident.pulse.ready'),
            actionLabel: t(messages, 'resident.experience.sos'),
            iconName: 'alert-circle-outline',
            tone: 'danger'
        },
        getRequiredItem(base, 0, "useResidentDashboardPersonalization.ts"),
        {
            id: 'act-connect',
            actionId: 'act-connect',
            title: t(messages, 'resident.experience.connectModule'),
            description: t(messages, 'resident.experience.connectModuleDescription'),
            metaLabel: t(messages, 'resident.priority.metaToday'),
            actionLabel: t(messages, 'resident.dashboard.openLabel'),
            iconName: 'chatbubbles-outline',
            tone: 'info'
        },
    ];
}
function createPulse({ dashboard, messages, }: ResidentDashboardPersonalizationInput): ResidencePulseData {
    const activeVisitors = countByStatus(dashboard.visitorTimeline, ['upcoming', 'inside']);
    const pendingDocuments = countByStatus(dashboard.documents, ['pending', 'missing', 'expired']);
    const activeComplaints = dashboard.complaintProgress ? 1 : 0;
    const billDue = dashboard.maintenancePayment.status === 'paid' ? 0 : 1;
    const items: ResidencePulseItem[] = [
        {
            id: 'gate',
            label: t(messages, 'resident.pulse.gateAccess'),
            value: t(messages, 'resident.pulse.normal'),
            tone: 'success'
        },
        {
            id: 'visitors',
            label: t(messages, 'resident.pulse.visitors'),
            value: `${activeVisitors} ${t(messages, 'resident.pulse.todaySuffix')}`,
            tone: activeVisitors > 0 ? 'info' : 'normal'
        },
        {
            id: 'bills',
            label: t(messages, 'resident.pulse.bills'),
            value: billDue > 0 ? `${billDue} ${t(messages, 'resident.pulse.due')}` : t(messages, 'resident.pulse.ready'),
            tone: billDue > 0 ? 'warning' : 'success'
        },
        {
            id: 'documents',
            label: t(messages, 'resident.pulse.documents'),
            value: pendingDocuments > 0 ? `${pendingDocuments} ${t(messages, 'resident.pulse.pending')}` : t(messages, 'resident.pulse.ready'),
            tone: pendingDocuments > 0 ? 'warning' : 'success'
        },
        {
            id: 'complaints',
            label: t(messages, 'resident.pulse.complaints'),
            value: activeComplaints > 0 ? `${activeComplaints} ${t(messages, 'resident.pulse.active')}` : t(messages, 'resident.pulse.ready'),
            tone: activeComplaints > 0 ? 'info' : 'success'
        },
        {
            id: 'emergency',
            label: t(messages, 'resident.pulse.emergency'),
            value: t(messages, 'resident.pulse.ready'),
            tone: 'success'
        },
    ];
    return {
        title: t(messages, 'resident.pulse.title'),
        subtitle: t(messages, 'resident.pulse.subtitle'),
        centerLabel: t(messages, 'resident.pulse.homeStatus'),
        centerValue: pendingDocuments > 1 || dashboard.maintenancePayment.status === 'overdue'
            ? t(messages, 'resident.pulse.actionRequired')
            : pendingDocuments > 0 || billDue > 0 || activeComplaints > 0
                ? t(messages, 'resident.pulse.needsAttention')
                : t(messages, 'resident.pulse.ready'),
        items,
        recommendedAction: t(messages, 'resident.pulse.recommendedAction'),
        lastUpdatedLabel: dashboard.lastUpdatedLabel ?? t(messages, 'resident.pulse.lastUpdated')
    };
}
function createCommandActions(dashboard: ResidentDashboardData, messages: EnglishMessagesType, role: ResidentRoleVariant): ResidentCommandAction[] {
    const common: ResidentCommandAction[] = [
        {
            id: 'act-visitor',
            label: t(messages, 'resident.experience.createVisitor'),
            accessibilityLabel: t(messages, 'resident.experience.createVisitor'),
            iconName: 'person-add-outline',
            tone: 'primary',
            ...includeWhenPresent("badgeLabel", dashboard.visitorTimeline.some((visitor) => visitor.status === 'inside')
                ? t(messages, 'resident.pulse.active')
                : undefined)
        },
        {
            id: 'act-complaint',
            label: t(messages, 'resident.experience.raiseComplaint'),
            accessibilityLabel: t(messages, 'resident.experience.raiseComplaint'),
            iconName: 'chatbox-ellipses-outline',
            tone: 'neutral',
            ...includeWhenPresent("badgeLabel", dashboard.complaintProgress
                ? t(messages, 'resident.pulse.active')
                : undefined)
        },
        {
            id: 'act-sos',
            label: t(messages, 'resident.experience.sos'),
            accessibilityLabel: t(messages, 'resident.actions.confirmSos'),
            iconName: 'alert-circle-outline',
            tone: 'danger'
        },
    ];
    if (role === 'RESIDENT_FAMILY') {
        return common;
    }
    const documentAction: ResidentCommandAction = {
        id: 'act-documents',
        label: t(messages, 'resident.experience.uploadDocument'),
        accessibilityLabel: t(messages, 'resident.experience.uploadDocument'),
        iconName: 'cloud-upload-outline',
        tone: 'neutral',
        ...includeWhenPresent("badgeLabel", dashboard.documents.some((document) => document.status !== 'verified')
            ? t(messages, 'resident.pulse.pending')
            : undefined)
    };
    const domesticHelpAction: ResidentCommandAction = {
        id: 'act-domestic-help',
        label: t(messages, 'resident.domesticHelp.dashboardAction'),
        accessibilityLabel: t(messages, 'resident.domesticHelp.dashboardActionAccessibility'),
        iconName: 'person-circle-outline',
        tone: 'neutral'
    };
    if (role === 'RESIDENT_TENANT') {
        return [getRequiredItem(common, 0, "useResidentDashboardPersonalization.ts"), getRequiredItem(common, 1, "useResidentDashboardPersonalization.ts"), domesticHelpAction, documentAction, getRequiredItem(common, 2, "useResidentDashboardPersonalization.ts")];
    }
    return [
        getRequiredItem(common, 0, "useResidentDashboardPersonalization.ts"),
        {
            id: 'act-pay',
            label: t(messages, 'resident.experience.payBill'),
            accessibilityLabel: t(messages, 'resident.experience.payBill'),
            iconName: 'card-outline',
            tone: 'warning',
            ...includeWhenPresent("badgeLabel", dashboard.maintenancePayment.status === 'paid'
                ? undefined
                : t(messages, 'resident.pulse.due'))
        },
        getRequiredItem(common, 1, "useResidentDashboardPersonalization.ts"),
        domesticHelpAction,
        documentAction,
        {
            id: 'act-noc',
            label: t(messages, 'resident.experience.requestNoc'),
            accessibilityLabel: t(messages, 'resident.experience.requestNoc'),
            iconName: 'ribbon-outline',
            tone: 'success'
        },
        getRequiredItem(common, 2, "useResidentDashboardPersonalization.ts"),
    ];
}
function createModuleShelfItems(dashboard: ResidentDashboardData, messages: EnglishMessagesType, role: ResidentRoleVariant): ResidentModuleShelfItem[] {
    const common: ResidentModuleShelfItem[] = [
        {
            id: 'visitors',
            label: t(messages, 'resident.experience.visitorModule'),
            description: t(messages, 'resident.experience.visitorModuleDescription'),
            countLabel: `${Math.min(dashboard.visitorTimeline.length, RESIDENT_DASHBOARD_LIMITS.visitors)} ${t(messages, 'resident.experience.itemLimitLabel')}`,
            iconName: 'people-outline',
            tone: 'primary'
        },
        {
            id: 'documents',
            label: t(messages, 'resident.experience.documentsModule'),
            description: t(messages, 'resident.experience.documentsModuleDescription'),
            countLabel: `${Math.min(dashboard.documents.length, RESIDENT_DASHBOARD_LIMITS.documents)} ${t(messages, 'resident.experience.itemLimitLabel')}`,
            iconName: 'lock-closed-outline',
            tone: 'neutral'
        },
        {
            id: 'connect',
            label: t(messages, 'resident.experience.connectModule'),
            description: t(messages, 'resident.experience.connectModuleDescription'),
            iconName: 'chatbubbles-outline',
            tone: 'neutral'
        },
    ];
    if (role === 'RESIDENT_FAMILY') {
        return common;
    }
    return [
        getRequiredItem(common, 0, "useResidentDashboardPersonalization.ts"),
        {
            id: 'billing',
            label: t(messages, 'resident.experience.billingModule'),
            description: t(messages, 'resident.experience.billingModuleDescription'),
            iconName: 'wallet-outline',
            tone: 'warning'
        },
        getRequiredItem(common, 1, "useResidentDashboardPersonalization.ts"),
        getRequiredItem(common, 2, "useResidentDashboardPersonalization.ts"),
        ...(dashboard.amenities.length > 0
            ? [
                {
                    id: 'amenities',
                    label: t(messages, 'resident.experience.amenitiesModule'),
                    description: t(messages, 'resident.experience.amenitiesModuleDescription'),
                    countLabel: `${Math.min(dashboard.amenities.length, RESIDENT_DASHBOARD_LIMITS.amenities)} ${t(messages, 'resident.experience.itemLimitLabel')}`,
                    iconName: 'calendar-outline' as const,
                    tone: 'success' as const
                },
            ]
            : []),
        {
            id: 'marketplace',
            label: t(messages, 'resident.experience.marketplaceModule'),
            description: t(messages, 'resident.experience.marketplaceModuleDescription'),
            countLabel: `${Math.min(dashboard.communityServices.length, RESIDENT_DASHBOARD_LIMITS.communityServices)} ${t(messages, 'resident.experience.itemLimitLabel')}`,
            iconName: 'storefront-outline',
            tone: 'primary'
        },
    ];
}
export function createResidentDashboardPersonalization(input: ResidentDashboardPersonalizationInput): ResidentDashboardPersonalization {
    const priorities = createPriorityItems(input);
    return {
        priorities,
        prioritySummary: {
            label: priorities.length > 0
                ? t(input.messages, 'resident.priority.summaryAttention')
                : t(input.messages, 'resident.priority.summaryCalm'),
            value: String(priorities.length)
        },
        pulse: createPulse(input),
        commandActions: createCommandActions(input.dashboard, input.messages, input.role),
        moduleShelfItems: createModuleShelfItems(input.dashboard, input.messages, input.role)
    };
}
export function useResidentDashboardPersonalization(input: ResidentDashboardPersonalizationInput): ResidentDashboardPersonalization {
    return useMemo(() => createResidentDashboardPersonalization(input), [input]);
}

