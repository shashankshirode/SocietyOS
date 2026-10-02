import { CctvIntegrationService } from '../services/cctvIntegrationService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('CCTV Integration Invariants', () => {
  let service: CctvIntegrationService;
  const supervisorActor: HardwareActorContext = {
    userId: 'sec-super',
    userName: 'Security Supervisor',
    userRole: 'SECURITY_SUPERVISOR',
    societyId: 'soc-alpha',
  };
  const residentActor: HardwareActorContext = {
    userId: 'res-01',
    userName: 'Curious Resident',
    userRole: 'RESIDENT',
    societyId: 'soc-alpha',
  };
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Estate Manager',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new CctvIntegrationService();
    service.registerCamera({
      id: 'cam-gate',
      name: 'Main Gate PTZ Camera',
      deviceCode: 'CCTV-G1',
      location: 'Gate 1',
      coverageArea: 'Vehicle Lane',
      status: 'ONLINE',
      recordingEnabled: true,
      accessLevel: 'ADMIN_APPROVAL_REQUIRED',
      lastHealthCheck: '2026-07-01T12:00:00Z',
      societyId: 'soc-alpha',
    });
    service.registerCamera({
      id: 'cam-disabled',
      name: 'Maintenance Bay Camera',
      deviceCode: 'CCTV-MB',
      location: 'Service Area',
      coverageArea: 'Bay',
      status: 'OFFLINE',
      recordingEnabled: false,
      accessLevel: 'DISABLED',
      lastHealthCheck: '2026-07-01T12:00:00Z',
      societyId: 'soc-alpha',
    });
  });

  test('prevents ordinary resident from accessing restricted security cameras', () => {
    expect(() =>
      service.requestAccess(residentActor, {
        cameraId: 'cam-gate',
        reason: 'Checking parking lot',
        purpose: 'SECURITY_INCIDENT',
        durationMinutes: 15,
      })
    ).toThrow('CCTV_ACCESS_DENIED');
  });

  test('blocks requests for disabled cameras', () => {
    expect(() =>
      service.requestAccess(supervisorActor, {
        cameraId: 'cam-disabled',
        reason: 'Routine check',
        purpose: 'SAFETY_INVESTIGATION',
        durationMinutes: 15,
      })
    ).toThrow('CCTV_ACCESS_DISABLED');
  });

  test('derives requester identity from authenticated session, not client body', () => {
    const req = service.requestAccess(supervisorActor, {
      cameraId: 'cam-gate',
      reason: 'Gate barrier collision investigation',
      purpose: 'GATE_INCIDENT',
      durationMinutes: 30,
      incidentReferenceId: 'inc-gate-112',
    });

    expect(req.requesterName).toBe('Security Supervisor');
    expect(req.requesterRole).toBe('SECURITY_SUPERVISOR');
    expect(req.requesterId).toBe('sec-super');
    expect(req.status).toBe('PENDING');
  });

  test('time-bound access approval and token verification with evidence checksum', () => {
    const req = service.requestAccess(supervisorActor, {
      cameraId: 'cam-gate',
      reason: 'Investigate lost parcel handover',
      purpose: 'COMPLAINT_VERIFICATION',
      durationMinutes: 30,
    });

    const approved = service.approveAccess(adminActor, req.id);
    expect(approved.status).toBe('APPROVED');
    expect(approved.approvedBy).toBe('Estate Manager');
    expect(approved.accessToken).toBeDefined();
    expect(approved.evidenceChecksum).toBeDefined();

    const verifySuccess = service.verifyAccessToken(supervisorActor, req.id, approved.accessToken!);
    expect(verifySuccess.valid).toBe(true);
    expect(verifySuccess.evidenceReference).toBeDefined();

    const wrongActor: HardwareActorContext = {
      userId: 'stranger',
      userName: 'Unknown',
      userRole: 'RESIDENT',
      societyId: 'soc-alpha',
    };
    const verifyFail = service.verifyAccessToken(wrongActor, req.id, approved.accessToken!);
    expect(verifyFail.valid).toBe(false);
  });
});
