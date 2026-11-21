import { WorkOrder } from '../../../shared/types/workOrder.types';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { WorkOrderService } from './workOrderService';

export interface GatePassReference {
  passId: string;
  workOrderId: string;
  technicianName: string;
  validDate: string;
  status: 'ISSUED' | 'USED' | 'EXPIRED' | 'REVOKED';
  generatedAt: string;
}

export interface FacilityBlackoutNotification {
  facilityId: string;
  assetId: string;
  startTime: string;
  endTime: string;
  reason: string;
  blackoutId: string;
}

export interface ParkingOutageNotification {
  parkingZoneId: string;
  assetId: string;
  startTime: string;
  endTime: string;
  reason: string;
  outageId: string;
}

export class CrossDomainIntegrationService {
  private static instance: CrossDomainIntegrationService;
  private gatePasses: Map<string, GatePassReference> = new Map();
  private facilityBlackouts: FacilityBlackoutNotification[] = [];
  private parkingOutages: ParkingOutageNotification[] = [];

  private constructor() {}

  public static getInstance(): CrossDomainIntegrationService {
    if (!CrossDomainIntegrationService.instance) {
      CrossDomainIntegrationService.instance = new CrossDomainIntegrationService();
    }
    return CrossDomainIntegrationService.instance;
  }

  public createWorkOrderFromComplaint(
    complaintId: string,
    assetId: string,
    title: string,
    description: string,
    actor: FacilityOperationsActor
  ): WorkOrder {
    const workOrderService = WorkOrderService.getInstance();
    return workOrderService.createWorkOrder(
      {
        title,
        description,
        type: 'COMPLAINT_LINKED',
        priority: 'HIGH',
        assetId,
        source: 'COMPLAINT',
        sourceId: complaintId,
      },
      actor
    );
  }

  public createWorkOrderFromEmergency(
    incidentId: string,
    assetId: string,
    title: string,
    description: string,
    actor: FacilityOperationsActor
  ): WorkOrder {
    const workOrderService = WorkOrderService.getInstance();
    return workOrderService.createWorkOrder(
      {
        title,
        description,
        type: 'BREAKDOWN',
        priority: 'URGENT',
        assetId,
        source: 'EMERGENCY',
        sourceId: incidentId,
      },
      actor
    );
  }

  public generateTechnicianGatePass(
    workOrderId: string,
    technicianName: string,
    validDate: string,
    actor: FacilityOperationsActor
  ): GatePassReference {
    if (!actor.hasPermission('MANAGE_WORK_ORDERS')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_WORK_ORDERS permission');
    }

    const workOrderService = WorkOrderService.getInstance();
    const wo = workOrderService.getWorkOrder(workOrderId);
    if (!wo) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    const passId = `gate-pass-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const pass: GatePassReference = {
      passId,
      workOrderId: wo.id,
      technicianName,
      validDate,
      status: 'ISSUED',
      generatedAt: new Date().toISOString(),
    };

    this.gatePasses.set(passId, pass);
    return pass;
  }

  public registerFacilityMaintenanceBlackout(
    facilityId: string,
    assetId: string,
    startTime: string,
    endTime: string,
    reason: string
  ): FacilityBlackoutNotification {
    const blackout: FacilityBlackoutNotification = {
      facilityId,
      assetId,
      startTime,
      endTime,
      reason,
      blackoutId: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    this.facilityBlackouts.push(blackout);
    return blackout;
  }

  public registerParkingMaintenanceOutage(
    parkingZoneId: string,
    assetId: string,
    startTime: string,
    endTime: string,
    reason: string
  ): ParkingOutageNotification {
    const outage: ParkingOutageNotification = {
      parkingZoneId,
      assetId,
      startTime,
      endTime,
      reason,
      outageId: `prk-out-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    };
    this.parkingOutages.push(outage);
    return outage;
  }

  public getGatePass(passId: string): GatePassReference | null {
    return this.gatePasses.get(passId) ?? null;
  }

  public getFacilityBlackouts(): FacilityBlackoutNotification[] {
    return [...this.facilityBlackouts];
  }

  public getParkingOutages(): ParkingOutageNotification[] {
    return [...this.parkingOutages];
  }

  public clear(): void {
    this.gatePasses.clear();
    this.facilityBlackouts = [];
    this.parkingOutages = [];
  }
}
