import type { HardwareCapability } from '../../../shared/types/hardware.types';

export interface HardwareActorContext {
  userId: string;
  userName: string;
  userRole: string;
  societyId: string;
  isDeviceCredential?: boolean;
  capabilities?: HardwareCapability[];
}

export class HardwareSecurityError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'HardwareSecurityError';
    this.code = code;
  }
}

export function assertSocietyAccess(actor: HardwareActorContext, targetSocietyId?: string): void {
  if (!targetSocietyId || !actor.societyId) {
    return;
  }
  if (actor.societyId !== targetSocietyId) {
    throw new HardwareSecurityError('CROSS_SOCIETY_ACCESS_DENIED: Actor society does not match target device society.', 'CROSS_SOCIETY_ACCESS_DENIED');
  }
}


export function assertHumanPrivilege(actor: HardwareActorContext, requiredRole?: string[]): void {
  if (actor.isDeviceCredential) {
    throw new HardwareSecurityError('DEVICE_NOT_AUTHORIZED_FOR_ADMIN: Hardware device credentials cannot execute administrative management operations.', 'ACCESS_DENIED');
  }
  if (requiredRole && requiredRole.length > 0 && !requiredRole.includes(actor.userRole)) {
    throw new HardwareSecurityError(`ACCESS_DENIED: Role ${actor.userRole} is not authorized for this operation.`, 'ACCESS_DENIED');
  }
}

export function assertDeviceIngestionPrivilege(actor: HardwareActorContext): void {
  if (!actor.isDeviceCredential && actor.userRole !== 'SUPER_ADMIN' && actor.userRole !== 'HARDWARE_CONNECTOR') {
    throw new HardwareSecurityError('HUMAN_TOKEN_CANNOT_INJECT_DEVICE_EVENTS: Device events must be submitted by authenticated hardware connectors or agents.', 'ACCESS_DENIED');
  }
}

export function assertCapability(actor: HardwareActorContext, capability: HardwareCapability): void {
  if (actor.capabilities && !actor.capabilities.includes(capability)) {
    throw new HardwareSecurityError(`DEVICE_CAPABILITY_NOT_SUPPORTED: Required capability ${capability} is not supported.`, 'DEVICE_CAPABILITY_NOT_SUPPORTED');
  }
}
