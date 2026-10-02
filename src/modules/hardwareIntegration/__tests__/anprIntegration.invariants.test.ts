import { AnprIntegrationService } from '../services/anprIntegrationService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('ANPR Integration Invariants', () => {
  let service: AnprIntegrationService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Security Supervisor',
    userRole: 'SECURITY_GUARD',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new AnprIntegrationService();
    service.registerVehicleEntitlement({
      vehicleId: 'veh-01',
      vehicleNumber: 'MH12AB1234',
      unitNumber: 'A-101',
      status: 'ACTIVE',
    });
    service.registerVehicleEntitlement({
      vehicleId: 'veh-02',
      vehicleNumber: 'MH12BAD9999',
      unitNumber: 'B-202',
      status: 'BLOCKED',
    });
  });

  test('high confidence active vehicle grants access', () => {
    const res = service.processCaptureEvent(adminActor, {
      deviceId: 'cam-01',
      deviceName: 'Main ANPR Camera',
      detectedPlateText: 'MH12AB1234',
      confidence: 0.95,
      gateLocation: 'Main Gate Entry',
      timestamp: '2026-07-01T09:00:00Z',
    });

    expect(res.accessGranted).toBe(true);
    expect(res.requiresReview).toBe(false);
    expect(res.event.status).toBe('MATCHED');
    expect(res.event.matchedVehicleNumber).toBe('MH12AB1234');
  });

  test('low confidence OCR forces review and never auto-opens barrier', () => {
    const res = service.processCaptureEvent(adminActor, {
      deviceId: 'cam-01',
      deviceName: 'Main ANPR Camera',
      detectedPlateText: 'MH12AB1234',
      confidence: 0.72,
      gateLocation: 'Main Gate Entry',
      timestamp: '2026-07-01T09:05:00Z',
    });

    expect(res.accessGranted).toBe(false);
    expect(res.requiresReview).toBe(true);
    expect(res.event.status).toBe('LOW_CONFIDENCE');
    expect(res.event.reviewStatus).toBe('PENDING_REVIEW');
  });

  test('unrecognized vehicle triggers human review path', () => {
    const res = service.processCaptureEvent(adminActor, {
      deviceId: 'cam-01',
      deviceName: 'Main ANPR Camera',
      detectedPlateText: 'DL01XY9999',
      confidence: 0.96,
      gateLocation: 'Main Gate Entry',
      timestamp: '2026-07-01T09:10:00Z',
    });

    expect(res.accessGranted).toBe(false);
    expect(res.requiresReview).toBe(true);
    expect(res.event.status).toBe('UNMATCHED');
  });

  test('blocked vehicle is denied without review', () => {
    const res = service.processCaptureEvent(adminActor, {
      deviceId: 'cam-01',
      deviceName: 'Main ANPR Camera',
      detectedPlateText: 'MH12BAD9999',
      confidence: 0.99,
      gateLocation: 'Main Gate Entry',
      timestamp: '2026-07-01T09:15:00Z',
    });

    expect(res.accessGranted).toBe(false);
    expect(res.requiresReview).toBe(false);
    expect(res.event.status).toBe('DENIED');
  });

  test('guard can review unmatched plate and record decision with audit', () => {
    const res = service.processCaptureEvent(adminActor, {
      deviceId: 'cam-01',
      deviceName: 'Main ANPR Camera',
      detectedPlateText: 'MH12A81234',
      confidence: 0.70,
      gateLocation: 'Main Gate Entry',
      timestamp: '2026-07-01T09:20:00Z',
    });

    const review = service.reviewMatch(adminActor, {
      eventId: res.event.id,
      reviewerDecision: 'MATCH_TO_VEHICLE',
      notes: 'Character 8 was read as B due to dirt on plate.',
      matchedVehicleId: 'veh-01',
      suggestedVehicleNumber: 'MH12AB1234',
    });

    expect(review.reviewerDecision).toBe('MATCH_TO_VEHICLE');
    expect(res.event.reviewStatus).toBe('REVIEWED');
    expect(res.event.reviewedBy).toBe('Security Supervisor');
    expect(res.event.status).toBe('MATCHED');
  });
});
