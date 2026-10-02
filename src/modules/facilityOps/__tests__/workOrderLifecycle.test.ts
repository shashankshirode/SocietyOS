import { WorkOrderService } from '../services/workOrderService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Work Order Lifecycle', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });
  const technician = createActorFromSession({
    userId: 'usr-tech-1',
    name: 'Technician',
    societyId: 'soc-1',
    role: 'TECHNICIAN',
  });

  const woService = WorkOrderService.getInstance();

  beforeEach(() => {
    woService.clear();
  });

  test('executes complete happy path from creation to close', () => {
    const wo = woService.createWorkOrder(
      {
        title: 'Overhead Tank Level Controller Servicing',
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        assetId: 'ast-water-tank',
        vendorId: 'vnd-automation',
      },
      manager
    );

    expect(wo.status).toBe('ASSIGNED');
    expect(wo.timeline.length).toBe(1);

    woService.startWorkOrder(wo.id, technician);
    expect(woService.getWorkOrder(wo.id)!.status).toBe('IN_PROGRESS');

    woService.submitCompletion(
      {
        workOrderId: wo.id,
        technicianNotes: 'Float sensors cleaned and calibrated',
        evidenceDocumentIds: ['doc-vault-tank-clean'],
      },
      technician
    );
    expect(woService.getWorkOrder(wo.id)!.status).toBe('COMPLETION_SUBMITTED');

    woService.verifyWorkOrder(
      {
        workOrderId: wo.id,
        action: 'ACCEPT',
        verificationNotes: 'Water levels responding accurately',
      },
      manager
    );
    expect(woService.getWorkOrder(wo.id)!.status).toBe('VERIFIED');

    woService.closeWorkOrder(wo.id, 'Routine check completed', manager);
    expect(woService.getWorkOrder(wo.id)!.status).toBe('CLOSED');
  });

  test('handles rework cycle on failed verification', () => {
    const wo = woService.createWorkOrder(
      {
        title: 'Clubhouse Lighting Fixture Repair',
        type: 'REPAIR',
        priority: 'LOW',
        assetId: 'ast-light-clubhouse',
      },
      manager
    );

    woService.startWorkOrder(wo.id, technician);
    woService.submitCompletion({ workOrderId: wo.id, technicianNotes: 'Replaced bulb' }, technician);

    woService.verifyWorkOrder(
      {
        workOrderId: wo.id,
        action: 'REWORK',
        verificationNotes: 'Chandelier dimmer switch still flickering',
      },
      manager
    );

    const reworked = woService.getWorkOrder(wo.id)!;
    expect(reworked.status).toBe('IN_PROGRESS');
    expect(reworked.verificationStatus).toBe('REWORK_REQUIRED');
    expect(reworked.reworkReason).toContain('dimmer switch');

    woService.submitCompletion({ workOrderId: wo.id, technicianNotes: 'Replaced dimmer capacitor' }, technician);
    woService.verifyWorkOrder({ workOrderId: wo.id, action: 'ACCEPT' }, manager);

    expect(woService.getWorkOrder(wo.id)!.status).toBe('VERIFIED');
  });
});
