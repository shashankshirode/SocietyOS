import type Ionicons from '@expo/vector-icons/Ionicons';

export type EmergencyActionId =
  | 'MEDICAL'
  | 'FIRE_ALERT'
  | 'LIFT_STUCK'
  | 'CALL_SECURITY'
  | 'SENIOR_HELP'
  | 'MAIN_SOS';

export type EmergencyOrbitLayoutMode =
  | 'orbit'
  | 'compactArc'
  | 'bottomTray';

export type EmergencyOrbitActionPosition = {
  actionId: EmergencyActionId;
  translateX: number;
  translateY: number;
};

export type EmergencyOrbitLayout = {
  mode: EmergencyOrbitLayoutMode;
  positions: EmergencyOrbitActionPosition[];
};

export type EmergencyActionConfig = {
  id: EmergencyActionId;
  labelKey: string;
  accessibilityKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tone: 'danger' | 'warning' | 'info';
  requiresConfirm: boolean;
  confirmationMessageKey: string;
};
