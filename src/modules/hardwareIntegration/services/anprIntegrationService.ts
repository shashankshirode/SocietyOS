import type {
  AnprEvent,
  AnprVehicleMatchReview,
} from '../../../shared/types/gateHardware.types';
import type { ReviewAnprMatchCommand } from '../../../shared/types/hardware.types';
import {
  assertSocietyAccess,
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';
import { connectorFrameworkService } from './connectorFrameworkService';

export class AnprIntegrationService {
  private readonly events: AnprEvent[] = [];
  private readonly reviews = new Map<string, AnprVehicleMatchReview>();
  private readonly registeredVehicles = new Map<string, { vehicleId: string; vehicleNumber: string; unitNumber: string; status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }>();

  registerVehicleEntitlement(vehicle: { vehicleId: string; vehicleNumber: string; unitNumber: string; status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' }): void {
    this.registeredVehicles.set(vehicle.vehicleNumber.toUpperCase().replace(/\s+/g, ''), vehicle);
  }

  processCaptureEvent(
    actor: HardwareActorContext,
    input: {
      deviceId: string;
      deviceName: string;
      detectedPlateText: string;
      confidence: number;
      gateLocation: string;
      timestamp: string;
      captureImageUrl?: string;
    }
  ): { event: AnprEvent; requiresReview: boolean; accessGranted: boolean } {
    assertSocietyAccess(actor);

    const normalizedPlate = input.detectedPlateText.toUpperCase().replace(/\s+/g, '');
    const dedupeKey = connectorFrameworkService.computeDeterministicDedupeKey(
      'ANPR',
      input.deviceId,
      normalizedPlate,
      input.timestamp
    );

    if (connectorFrameworkService.isDuplicateEvent(dedupeKey)) {
      const existing = this.events.find(e => e.deduplicationKey === dedupeKey);
      if (existing) {
        return {
          event: existing,
          requiresReview: existing.status === 'LOW_CONFIDENCE',
          accessGranted: existing.status === 'MATCHED',
        };
      }
    }

    const matchedVehicle = this.registeredVehicles.get(normalizedPlate);
    let status: AnprEvent['status'] = 'UNMATCHED';
    let reviewStatus: AnprEvent['reviewStatus'] = 'NOT_REQUIRED';
    let accessGranted = false;

    if (input.confidence < 0.85) {
      status = 'LOW_CONFIDENCE';
      reviewStatus = 'PENDING_REVIEW';
    } else if (!matchedVehicle) {
      status = 'UNMATCHED';
      reviewStatus = 'PENDING_REVIEW';
    } else if (matchedVehicle.status === 'BLOCKED') {
      status = 'DENIED';
      reviewStatus = 'NOT_REQUIRED';
    } else if (matchedVehicle.status === 'INACTIVE') {
      status = 'DENIED';
      reviewStatus = 'NOT_REQUIRED';
    } else {
      status = 'MATCHED';
      accessGranted = true;
    }

    const masked = normalizedPlate.length > 4
      ? `${normalizedPlate.slice(0, 4)}-**-${normalizedPlate.slice(-2)}`
      : '***-**-**';

    const event: AnprEvent = {
      id: `evt-anpr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      deviceId: input.deviceId,
      deviceName: input.deviceName,
      plateNumberMasked: masked,
      matchConfidence: input.confidence,
      matchedVehicleNumber: matchedVehicle?.vehicleNumber,
      unitNumber: matchedVehicle?.unitNumber,
      gateLocation: input.gateLocation,
      timestamp: input.timestamp,
      status,
      vehicleId: matchedVehicle?.vehicleId,
      captureImageUrl: input.captureImageUrl,
      reviewStatus,
      sourceTimestamp: input.timestamp,
      receivedAt: new Date().toISOString(),
      deduplicationKey: dedupeKey,
    };

    this.events.push(event);

    return {
      event,
      requiresReview: reviewStatus === 'PENDING_REVIEW',
      accessGranted,
    };
  }

  reviewMatch(actor: HardwareActorContext, command: ReviewAnprMatchCommand): AnprVehicleMatchReview {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'SECURITY_GUARD', 'FACILITY_MANAGER']);

    const event = this.events.find(e => e.id === command.eventId);
    if (!event) {
      throw new Error(`ANPR_EVENT_NOT_FOUND: Event ${command.eventId} does not exist.`);
    }

    const review: AnprVehicleMatchReview = {
      eventId: command.eventId,
      detectedPlateText: event.plateNumberMasked,
      suggestedVehicleNumber: command.suggestedVehicleNumber || event.matchedVehicleNumber,
      confidenceScore: event.matchConfidence,
      reviewerDecision: command.reviewerDecision,
      notes: command.notes,
      matchedVehicleId: command.matchedVehicleId,
    };

    event.reviewStatus = 'REVIEWED';
    event.reviewedBy = actor.userName;
    event.reviewDecision = command.reviewerDecision;

    if (command.reviewerDecision === 'MATCH_TO_VEHICLE') {
      event.status = 'MATCHED';
    } else if (command.reviewerDecision === 'MARK_FALSE_READ') {
      event.status = 'UNMATCHED';
    }

    this.reviews.set(command.eventId, review);
    return review;
  }

  listEvents(): AnprEvent[] {
    return [...this.events];
  }

  seedInitialEvents(events: AnprEvent[]): void {
    for (const e of events) {
      this.events.push(e);
    }
  }
}

export const anprIntegrationService = new AnprIntegrationService();
