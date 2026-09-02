import type { SosCommandActionConfig } from './sosCommand.types';

export const SOS_COMMAND_ACTIONS: SosCommandActionConfig[] = [
  {
    id: 'MEDICAL',
    labelKey: 'resident.emergency.actions.medical',
    accessibilityKey: 'residentAccessibility.emergency.medical',
    icon: 'medical-outline',
    tone: 'danger',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmation.medical',
  },
  {
    id: 'FIRE_ALERT',
    labelKey: 'resident.emergency.actions.fireAlert',
    accessibilityKey: 'residentAccessibility.emergency.fireAlert',
    icon: 'flame-outline',
    tone: 'danger',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmation.fireAlert',
  },
  {
    id: 'LIFT_STUCK',
    labelKey: 'resident.emergency.actions.liftStuck',
    accessibilityKey: 'residentAccessibility.emergency.liftStuck',
    icon: 'help-buoy-outline',
    tone: 'info',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmation.liftStuck',
  },
  {
    id: 'CALL_SECURITY',
    labelKey: 'resident.emergency.actions.callSecurity',
    accessibilityKey: 'residentAccessibility.emergency.callSecurity',
    icon: 'call-outline',
    tone: 'info',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmation.security',
  },
  {
    id: 'SENIOR_HELP',
    labelKey: 'resident.emergency.actions.seniorHelp',
    accessibilityKey: 'residentAccessibility.emergency.seniorHelp',
    icon: 'heart-outline',
    tone: 'warning',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmation.seniorHelp',
  },
  {
    id: 'TRIGGER_SOS',
    labelKey: 'resident.emergency.actions.triggerSos',
    accessibilityKey: 'residentAccessibility.emergency.triggerSos',
    icon: 'alert-circle',
    tone: 'danger',
    requiresConfirm: true,
    confirmationMessageKey: 'resident.emergency.confirmTriggerDescription',
  },
];
export default SOS_COMMAND_ACTIONS;
