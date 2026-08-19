export type SosCommandDockLayoutMode =
  | 'anchoredDock'
  | 'compactTray'
  | 'tabletDock';

export type SosCommandActionId =
  | 'MEDICAL'
  | 'FIRE_ALERT'
  | 'LIFT_STUCK'
  | 'CALL_SECURITY'
  | 'SENIOR_HELP'
  | 'TRIGGER_SOS';

export interface SosCommandActionConfig {
  id: SosCommandActionId;
  labelKey: string;
  accessibilityKey: string;
  icon: string;
  color: string;
  tone: 'danger' | 'warning' | 'info';
  requiresConfirm: boolean;
  confirmationMessageKey: string;
}
