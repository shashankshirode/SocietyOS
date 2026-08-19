import type { EmergencyActionId } from './emergencyAction.types';

export type MessageKey = string;

export type SosCommandDockState =
  | { status: 'idle' }
  | { status: 'open' }
  | { status: 'confirming'; actionId: EmergencyActionId }
  | { status: 'triggering'; actionId: EmergencyActionId }
  | { status: 'success'; actionId: EmergencyActionId; eventId: string }
  | { status: 'failed'; actionId: EmergencyActionId; errorMessageKey: MessageKey };
