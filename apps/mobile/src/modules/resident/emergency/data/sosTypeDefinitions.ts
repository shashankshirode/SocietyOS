import type { SosType, SosTypeDefinition } from './sosResponsePlan.types';
import type { EmergencyActionId } from './emergencyAction.types';
import type { SosCommandActionId } from './sosCommand.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const SOS_TYPE_DEFINITIONS: readonly SosTypeDefinition[] = [
    {
        sosType: 'medical',
        titleKey: 'resident.emergency.sosSettings.types.medical.title',
        descriptionKey: 'resident.emergency.sosSettings.types.medical.description',
        icon: 'medical-outline',
        color: '#EF4444',
        severity: 'critical',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 30,
    },
    {
        sosType: 'fire',
        titleKey: 'resident.emergency.sosSettings.types.fire.title',
        descriptionKey: 'resident.emergency.sosSettings.types.fire.description',
        icon: 'flame-outline',
        color: '#F97316',
        severity: 'critical',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 15,
    },
    {
        sosType: 'liftStuck',
        titleKey: 'resident.emergency.sosSettings.types.liftStuck.title',
        descriptionKey: 'resident.emergency.sosSettings.types.liftStuck.description',
        icon: 'help-buoy-outline',
        color: '#6366F1',
        severity: 'high',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 60,
    },
    {
        sosType: 'securityThreat',
        titleKey: 'resident.emergency.sosSettings.types.securityThreat.title',
        descriptionKey: 'resident.emergency.sosSettings.types.securityThreat.description',
        icon: 'shield-outline',
        color: '#DC2626',
        severity: 'critical',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 15,
    },
    {
        sosType: 'seniorHelp',
        titleKey: 'resident.emergency.sosSettings.types.seniorHelp.title',
        descriptionKey: 'resident.emergency.sosSettings.types.seniorHelp.description',
        icon: 'heart-outline',
        color: '#8B5CF6',
        severity: 'high',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 45,
    },
    {
        sosType: 'generalEmergency',
        titleKey: 'resident.emergency.sosSettings.types.generalEmergency.title',
        descriptionKey: 'resident.emergency.sosSettings.types.generalEmergency.description',
        icon: 'alert-circle',
        color: '#DC2626',
        severity: 'critical',
        requiresHoldConfirm: true,
        defaultEscalationDelaySec: 30,
    },
] as const;
export const SOS_TYPE_MAP: ReadonlyMap<SosType, SosTypeDefinition> = new Map(SOS_TYPE_DEFINITIONS.map((def) => [def.sosType, def]));
export function getSosTypeDefinition(sosType: SosType): SosTypeDefinition | Absent {
    return SOS_TYPE_MAP.get(sosType);
}
export const ALL_SOS_TYPES: readonly SosType[] = SOS_TYPE_DEFINITIONS.map((d) => d.sosType);
export function emergencyActionIdToSosType(actionId: EmergencyActionId): SosType | Absent {
    const mapping: Record<EmergencyActionId, SosType> = {
        MEDICAL: 'medical',
        FIRE_ALERT: 'fire',
        LIFT_STUCK: 'liftStuck',
        CALL_SECURITY: 'securityThreat',
        SENIOR_HELP: 'seniorHelp',
        MAIN_SOS: 'generalEmergency',
    };
    return mapping[actionId];
}
export function sosCommandActionIdToSosType(actionId: SosCommandActionId): SosType | Absent {
    const mapping: Record<SosCommandActionId, SosType> = {
        MEDICAL: 'medical',
        FIRE_ALERT: 'fire',
        LIFT_STUCK: 'liftStuck',
        CALL_SECURITY: 'securityThreat',
        SENIOR_HELP: 'seniorHelp',
        TRIGGER_SOS: 'generalEmergency',
    };
    return mapping[actionId];
}
export function sosTypeToEmergencyActionId(sosType: SosType): EmergencyActionId {
    const mapping: Record<SosType, EmergencyActionId> = {
        medical: 'MEDICAL',
        fire: 'FIRE_ALERT',
        liftStuck: 'LIFT_STUCK',
        securityThreat: 'CALL_SECURITY',
        seniorHelp: 'SENIOR_HELP',
        generalEmergency: 'MAIN_SOS',
    };
    return mapping[sosType];
}

