import { visitorLifecycleStore } from '../../resident/visitors/data/visitorLifecycle.store';
import { walkInApprovalService } from '../services/walkInApprovalService';
import { mockStore } from '../../../core/mockStore/mockStore';

describe('Phase 5 Complete Security & Visitor Operations Integration', () => {
  beforeEach(() => {
    visitorLifecycleStore.reset();
    mockStore.reset();
  });

  describe('Walk-In Registration, Resident Approval & Gate Admission', () => {
    it('creates walk-in request, delivers to resident, approves, and admits visitor', async () => {
      const requestResult = await walkInApprovalService.createWalkInApprovalRequest({
        visitorName: 'Aditya Birla',
        visitorPhone: '9876543210',
        visitorCategory: 'GUEST',
        flatNumber: 'A-1204',
        unitId: 'unit-active',
        gateId: 'gate-01',
        gateName: 'Gate 01',
        guardId: 'guard-001',
        guardName: 'Ramesh Guard',
        societyId: 'soc-001',
        purpose: 'Guest visit',
      });

      expect(requestResult.success).toBe(true);
      expect(requestResult.request).toBeDefined();

      const requestId = requestResult.request!.requestId;
      const pendingForUnit = await walkInApprovalService.getPendingApprovalsForUnit('A-1204');
      expect(pendingForUnit.length).toBeGreaterThan(0);
      expect(pendingForUnit.some((r) => r.requestId === requestId)).toBe(true);

      const approvalResult = await walkInApprovalService.respondToApproval({
        requestId,
        action: 'APPROVE',
        residentId: 'res-001',
        residentRole: 'OWNER',
      });

      expect(approvalResult.success).toBe(true);

      const storedRequest = (mockStore.getState().visitorApprovalRequests || []).find(
        (r: any) => r.requestId === requestId || r.id === requestId,
      );
      expect(storedRequest?.status).toBe('APPROVED');

      const pass = visitorLifecycleStore.createPass({
        name: 'Aditya Birla',
        type: 'GUEST',
        flatNumber: 'A-1204',
        purpose: 'Guest visit',
        vehicleNumber: 'MH 12 AB 1234',
      });

      expect(pass).toBeDefined();
      const entryResult = visitorLifecycleStore.allowEntry(pass.id, {
        gateName: 'Gate 01',
        vehicleNumber: 'MH 12 AB 1234',
      });

      expect(entryResult.success).toBe(true);
      const updatedPass = visitorLifecycleStore.findPass(pass.id);
      expect(updatedPass?.status).toBe('CHECKED_IN');
      expect(updatedPass?.entryTime).toBeDefined();

      const exitResult = visitorLifecycleStore.recordExit(pass.id, {
        gateId: 'Gate 01',
      });
      expect(exitResult.success).toBe(true);
      expect(visitorLifecycleStore.findPass(pass.id)?.status).toBe('CHECKED_OUT');
    });

    it('rejects walk-in visitor when resident denies approval request', async () => {
      const requestResult = await walkInApprovalService.createWalkInApprovalRequest({
        visitorName: 'Unknown Salesperson',
        visitorPhone: '9123456789',
        visitorCategory: 'GUEST',
        flatNumber: 'A-1204',
        unitId: 'unit-active',
        gateId: 'gate-01',
        gateName: 'Gate 01',
        guardId: 'guard-001',
        guardName: 'Ramesh Guard',
        societyId: 'soc-001',
        purpose: 'Sales pitch',
      });

      expect(requestResult.success).toBe(true);
      const requestId = requestResult.request!.requestId;

      const denyResult = await walkInApprovalService.respondToApproval({
        requestId,
        action: 'DENY',
        residentId: 'res-001',
        residentRole: 'OWNER',
        denialReason: 'Not interested, deny entry',
      });

      expect(denyResult.success).toBe(true);

      const storedRequest = (mockStore.getState().visitorApprovalRequests || []).find(
        (r: any) => r.requestId === requestId || r.id === requestId,
      );
      expect(storedRequest?.status).toBe('DENIED');
      expect(storedRequest?.denialReason).toBe('Not interested, deny entry');
    });

    it('escalates approval request when primary resident does not respond', async () => {
      const requestResult = await walkInApprovalService.createWalkInApprovalRequest({
        visitorName: 'Service Technician',
        visitorPhone: '9988776655',
        visitorCategory: 'SERVICE',
        flatNumber: 'A-1204',
        unitId: 'unit-active',
        gateId: 'gate-01',
        gateName: 'Gate 01',
        guardId: 'guard-001',
        guardName: 'Ramesh Guard',
        societyId: 'soc-001',
        purpose: 'AC Repair',
      });

      const requestId = requestResult.request!.requestId;

      const escalation = await walkInApprovalService.escalateRequest({
        requestId,
        escalatedBy: 'guard-001',
        escalationReason: 'Resident did not respond within timeout',
        escalationStatus: 'ESCALATED_TO_SECURITY',
      });
      expect(escalation.success).toBe(true);

      const updated = (mockStore.getState().visitorApprovalRequests || []).find(
        (r: any) => r.requestId === requestId || r.id === requestId,
      );
      expect(updated?.status).toBe('ESCALATED');
    });
  });

  describe('Delivery Operations & Parcel Custody Desk', () => {
    it('handles parcel custody reception at gate and resident pickup confirmation', () => {
      const initialParcels = visitorLifecycleStore.getParcels('A-1204');
      const initialCount = initialParcels.length;

      const newParcel = visitorLifecycleStore.receiveParcel({
        flatNumber: 'A-1204',
        partner: 'Amazon',
        trackingNumber: 'AZ-998822',
        gateName: 'Gate 01',
      });

      expect(newParcel.id).toBeDefined();
      expect(newParcel.status).toBe('WAITING_COLLECTION');
      expect(newParcel.collectedAt).toBeUndefined();

      const unitParcels = visitorLifecycleStore.getParcels('A-1204');
      expect(unitParcels.length).toBe(initialCount + 1);

      const confirmed = visitorLifecycleStore.confirmParcelPickup(newParcel.id, 'Rohan Sharma');
      expect(confirmed).toBe(true);

      const updatedParcel = visitorLifecycleStore
        .getParcels('A-1204')
        .find((p) => p.id === newParcel.id);
      expect(updatedParcel?.status).toBe('COLLECTED');
      expect(updatedParcel?.collectedBy).toBe('Rohan Sharma');
      expect(updatedParcel?.collectedAt).toBeDefined();
    });

    it('records doorstep delivery entry through gate with valid pass', () => {
      const deliveryPass = visitorLifecycleStore.createPass({
        name: 'Swiggy Delivery',
        type: 'DELIVERY',
        flatNumber: 'A-1204',
        purpose: 'Food delivery',
        vehicleNumber: 'MH 12 FD 3322',
      });

      expect(deliveryPass).toBeDefined();

      const entry = visitorLifecycleStore.allowEntry(deliveryPass.id, {
        gateName: 'Main Gate',
        vehicleNumber: 'MH 12 FD 3322',
      });

      expect(entry.success).toBe(true);
      expect(visitorLifecycleStore.findPass(deliveryPass.id)?.status).toBe('CHECKED_IN');
    });
  });

  describe('Domestic Staff Validation & Blocking', () => {
    it('records valid staff check-in when staff is active', () => {
      const entryResult = visitorLifecycleStore.checkInStaff({
        staffId: 'stf-001',
        staffName: 'Sunita Devi',
        role: 'Housekeeping',
        gateName: 'Gate 01',
      });

      expect(entryResult.success).toBe(true);
      expect(entryResult.event?.eventType).toBe('ENTRY');
      expect((entryResult.event as any)?.staffName).toBe('Sunita Devi');
    });

    it('blocks suspended or blocked staff from entering campus', () => {
      const suspendedEntry = visitorLifecycleStore.checkInStaff({
        staffId: 'stf-suspended-001',
        staffName: 'Ramesh Mali',
        role: 'Gardener',
        gateName: 'Gate 01',
        isSuspended: true,
      });

      expect(suspendedEntry.success).toBe(false);
      expect(suspendedEntry.error).toMatch(/suspended|blocked/i);
    });
  });

  describe('Vehicle & Cab Operations', () => {
    it('records rapid cab drop-off entry with vehicle plate and creates drop-off pass', () => {
      const cabEntry = visitorLifecycleStore.recordCabEntry({
        flatNumber: 'A-1204',
        provider: 'Uber',
        cabRegistration: 'MH 12 UB 9988',
        driverName: 'Santosh Jadhav',
        gateName: 'Gate 01',
      });

      expect(cabEntry.success).toBe(true);
      expect(cabEntry.pass).toBeDefined();
      expect(cabEntry.pass?.type).toBe('CAB');
      expect(cabEntry.pass?.status).toBe('CHECKED_IN');
      expect(cabEntry.event?.vehicleNumber).toBe('MH 12 UB 9988');
    });
  });

  describe('Offline Queueing & Deterministic Sync Reconciliation', () => {
    it('queues gate events while offline and synchronizes upon reconnection without conflicts', () => {
      visitorLifecycleStore.setOfflineMode(true);
      expect(visitorLifecycleStore.offlineMode).toBe(true);

      const pass = visitorLifecycleStore.findPass('GH-902');
      expect(pass).toBeDefined();

      const offlineEntry = visitorLifecycleStore.allowEntry('pass-001', {
        gateName: 'Gate 02',
        vehicleNumber: 'MH 12 QX 4048',
      });

      expect(offlineEntry.success).toBe(true);
      expect(visitorLifecycleStore.offlineQueue.length).toBe(1);

      const syncCount = visitorLifecycleStore.syncOfflineQueue();
      expect(syncCount).toBe(1);
      expect(visitorLifecycleStore.offlineQueue.length).toBe(0);
      expect(visitorLifecycleStore.offlineMode).toBe(false);

      const synchronizedPass = visitorLifecycleStore.findPass('GH-902');
      expect(synchronizedPass?.status).toBe('CHECKED_IN');
      expect(synchronizedPass?.entryTime).toBeDefined();
    });
  });
});
