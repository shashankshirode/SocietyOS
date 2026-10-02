import type {
  CctvCamera,
  CctvAccessRequest,
} from '../../../shared/types/cctv.types';
import type { RequestCctvAccessCommand } from '../../../shared/types/hardware.types';
import {
  assertSocietyAccess,
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';

export class CctvIntegrationService {
  private readonly cameras = new Map<string, CctvCamera>();
  private readonly requests = new Map<string, CctvAccessRequest>();

  registerCamera(camera: CctvCamera): void {
    this.cameras.set(camera.id, camera);
  }

  requestAccess(actor: HardwareActorContext, command: RequestCctvAccessCommand): CctvAccessRequest {
    assertHumanPrivilege(actor);
    const camera = this.cameras.get(command.cameraId);
    if (!camera) {
      throw new Error(`CCTV_CAMERA_NOT_FOUND: Camera ${command.cameraId} does not exist.`);
    }
    assertSocietyAccess(actor, camera.societyId);

    if (camera.accessLevel === 'DISABLED') {
      throw new Error('CCTV_ACCESS_DISABLED: Access to this camera is currently disabled by society policy.');
    }

    if (actor.userRole === 'RESIDENT' && camera.accessLevel !== 'FACILITY_AND_SECURITY') {
      throw new Error('CCTV_ACCESS_DENIED: Residents cannot access restricted security cameras.');
    }

    const id = `car-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const duration = command.durationMinutes > 0 ? command.durationMinutes : 30;
    const expiresAt = new Date(now.getTime() + duration * 60000).toISOString();

    const request: CctvAccessRequest = {
      id,
      cameraId: command.cameraId,
      cameraName: camera.name,
      requesterName: actor.userName,
      requesterRole: actor.userRole,
      requesterId: actor.userId,
      reason: command.reason,
      purpose: command.purpose,
      durationMinutes: duration,
      status: 'PENDING',
      requestedAt: now.toISOString(),
      expiresAt,
      incidentReferenceId: command.incidentReferenceId,
    };

    if (camera.accessLevel === 'EMERGENCY_ONLY' && command.purpose === 'SECURITY_INCIDENT') {
      request.status = 'APPROVED';
      request.approvedAt = now.toISOString();
      request.approvedBy = 'EMERGENCY_SYSTEM_AUTO_APPROVE';
      request.accessToken = `cctv-token-${Date.now()}`;
      request.evidenceReference = `cctv://vault/evidence/${command.cameraId}/${Date.now()}`;
      request.evidenceChecksum = 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }

    this.requests.set(id, request);
    return request;
  }

  approveAccess(actor: HardwareActorContext, requestId: string): CctvAccessRequest {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR']);
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error(`CCTV_REQUEST_NOT_FOUND: Access request ${requestId} does not exist.`);
    }

    request.status = 'APPROVED';
    request.approvedAt = new Date().toISOString();
    request.approvedBy = actor.userName;
    request.accessToken = `cctv-token-${Date.now()}`;
    request.evidenceReference = `cctv://vault/evidence/${request.cameraId}/${Date.now()}`;
    request.evidenceChecksum = 'sha256-a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0';

    return request;
  }

  rejectAccess(actor: HardwareActorContext, requestId: string, _reason: string): CctvAccessRequest {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER', 'SECURITY_SUPERVISOR']);
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error(`CCTV_REQUEST_NOT_FOUND: Access request ${requestId} does not exist.`);
    }

    request.status = 'REJECTED';
    return request;
  }

  verifyAccessToken(actor: HardwareActorContext, requestId: string, token: string): { valid: boolean; evidenceReference?: string } {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'APPROVED') {
      return { valid: false };
    }
    if (request.accessToken !== token) {
      return { valid: false };
    }
    if (request.expiresAt && new Date().toISOString() > request.expiresAt) {
      request.status = 'EXPIRED';
      return { valid: false };
    }
    if (request.requesterId && actor.userId !== request.requesterId && actor.userRole !== 'SUPER_ADMIN') {
      return { valid: false };
    }

    return {
      valid: true,
      evidenceReference: request.evidenceReference,
    };
  }

  listCameras(): CctvCamera[] {
    return Array.from(this.cameras.values());
  }

  listRequests(): CctvAccessRequest[] {
    return Array.from(this.requests.values());
  }

  seedInitialCameras(cameras: CctvCamera[]): void {
    for (const c of cameras) {
      this.cameras.set(c.id, c);
    }
  }
}

export const cctvIntegrationService = new CctvIntegrationService();
