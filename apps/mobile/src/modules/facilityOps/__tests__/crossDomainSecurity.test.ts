import { CrossDomainIntegrationService } from '../services/crossDomainIntegrationService';
import { WorkOrderService } from '../services/workOrderService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Cross Domain Integration and Security', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-a',
    role: 'FACILITY_MANAGER',
  });
  const technician = createActorFromSession({
    userId: 'usr-tech-1',
    name: 'Technician',
    societyId: 'soc-a',
    role: 'TECHNICIAN',
  });

  const crossDomainService = CrossDomainIntegrationService.getInstance();
  const workOrderService = WorkOrderService.getInstance();

  beforeEach(() => {
    crossDomainService.clear();
    workOrderService.clear();
  });

  test('generates technician gate pass linked to work order', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'STP Blower Bearing Inspection',
        type: 'INSPECTION',
        priority: 'MEDIUM',
        assetId: 'ast-stp-1',
      },
      manager
    );

    const pass = crossDomainService.generateTechnicianGatePass(
      wo.id,
      'Suresh Sharma (Vendor Tech)',
      '2026-04-10',
      manager
    );

    expect(pass.passId).toBeDefined();
    expect(pass.workOrderId).toBe(wo.id);
    expect(pass.technicianName).toBe('Suresh Sharma (Vendor Tech)');
    expect(pass.status).toBe('ISSUED');
  });

  test('registers facility maintenance blackout and parking outage', () => {
    const blackout = crossDomainService.registerFacilityMaintenanceBlackout(
      'fac-swimming-pool',
      'ast-pool-pump',
      '2026-04-15T08:00:00Z',
      '2026-04-15T18:00:00Z',
      'Annual deep cleaning and chlorination filter overhaul'
    );

    expect(blackout.blackoutId).toBeDefined();
    expect(blackout.facilityId).toBe('fac-swimming-pool');
    expect(crossDomainService.getFacilityBlackouts().length).toBe(1);

    const outage = crossDomainService.registerParkingMaintenanceOutage(
      'zone-basement-b2-paving',
      'ast-drainage-sump',
      '2026-04-20T09:00:00Z',
      '2026-04-20T17:00:00Z',
      'Sump pump pipe excavation across lanes 3-4'
    );

    expect(outage.outageId).toBeDefined();
    expect(outage.parkingZoneId).toBe('zone-basement-b2-paving');
    expect(crossDomainService.getParkingOutages().length).toBe(1);
  });
});
