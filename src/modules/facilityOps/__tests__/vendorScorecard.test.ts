import { VendorScorecardService } from '../services/vendorScorecardService';
import { VendorService } from '../services/vendorService';
import { WorkOrderService } from '../services/workOrderService';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';

describe('VendorScorecardService', () => {
  const actor: FacilityOperationsActor = {
    actorId: 'user-ops-1',
    actorName: 'Ops Admin',
    actorRole: 'FACILITY_MANAGER',
    societyId: 'soc-123',
    permissions: ['VIEW_VENDORS', 'REGISTER_VENDOR', 'CREATE_VENDOR', 'MANAGE_VENDORS', 'CREATE_WORK_ORDER', 'ASSIGN_WORK_ORDER', 'COMPLETE_WORK_ORDER', 'VERIFY_WORK_ORDER'],
    hasPermission: () => true,
  };

  const timeWindow = {
    from: '2026-01-01',
    to: '2026-12-31',
  };

  it('throws VENDOR_NOT_FOUND when vendor does not exist', () => {
    const service = VendorScorecardService.getInstance();
    expect(() => service.calculateScorecard('non-existent-vendor', timeWindow)).toThrow('VENDOR_NOT_FOUND');
  });

  it('derives objective scorecard with low data volume flag for new vendor', () => {
    const vendorService = VendorService.getInstance();
    const vendor = vendorService.registerVendor({
      vendorName: 'Apex Lift Services',
      category: 'LIFT_MAINTENANCE',
      mobileNumber: '+919876543210',
      contactPerson: 'Suresh',
    }, actor);

    const scorecardService = VendorScorecardService.getInstance();
    const scorecard = scorecardService.calculateScorecard(vendor.id, timeWindow);

    expect(scorecard.vendorId).toBe(vendor.id);
    expect(scorecard.vendorName).toBe('Apex Lift Services');
    expect(scorecard.formulaVersion).toBe('v1.0.0');
    expect(scorecard.sampleSize).toBe(0);
    expect(scorecard.isLowDataVolume).toBe(true);
    expect(scorecard.improvementAreas).toContain('Insufficient sample size for high confidence rating');
    expect(scorecard.overallRating).toBeGreaterThanOrEqual(1);
    expect(scorecard.overallRating).toBeLessThanOrEqual(5);
  });

  it('derives metrics accurately with work orders, no-shows, and escalations', () => {
    const vendorService = VendorService.getInstance();
    const vendor = vendorService.registerVendor({
      vendorName: 'Reliable Fire Protection',
      category: 'FIRE_SAFETY',
      mobileNumber: '+919876543211',
      contactPerson: 'Karan',
    }, actor);

    const workOrderService = WorkOrderService.getInstance();

    for (let i = 0; i < 5; i++) {
      const wo = workOrderService.createWorkOrder({
        title: `Fire system inspection ${i}`,
        assetId: `asset-fire-${i}`,
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        dueDate: '2026-06-15',
        assignedTo: 'Technician',
        vendorId: vendor.id,
        description: `Fire system inspection ${i}`,
        clientOperationId: `client-wo-score-${i}-${Date.now()}`,
      }, actor);

      workOrderService.startWorkOrder(wo.id, actor);

      if (i === 0) {
        workOrderService.recordVendorNoShow(wo.id, 'Technician failed to arrive for scheduled visit', actor);
      }

      workOrderService.submitCompletion({
        workOrderId: wo.id,
        actualWorkPerformed: 'Completed valve inspection',
        evidenceDocumentIds: ['doc-fire-1'],
        serviceReportDocumentId: 'doc-report-1',
      }, actor);

      if (i === 1) {
        workOrderService.verifyWorkOrder({
          workOrderId: wo.id,
          action: 'REWORK',
          verificationNotes: 'Gauge seal not aligned',
        }, actor);
      } else {
        workOrderService.verifyWorkOrder({
          workOrderId: wo.id,
          action: 'ACCEPT',
          verificationNotes: 'Passed inspection',
        }, actor);
      }
    }

    const scorecardService = VendorScorecardService.getInstance();
    const scorecard = scorecardService.calculateScorecard(vendor.id, timeWindow);

    expect(scorecard.sampleSize).toBe(5);
    expect(scorecard.isLowDataVolume).toBe(false);
    expect(scorecard.completionRate).toBe(80);
    expect(scorecard.reopenRate).toBeGreaterThan(0);
    expect(scorecard.improvementAreas.some(area => area.includes('technician no-shows'))).toBe(true);
  });
});
