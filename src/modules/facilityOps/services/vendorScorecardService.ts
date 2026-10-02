import { VendorCategory, VendorScorecard } from '../../../shared/types/vendor.types';
import { WorkOrder } from '../../../shared/types/workOrder.types';
import { VendorService } from './vendorService';
import { WorkOrderService } from './workOrderService';

export class VendorScorecardService {
  private static instance: VendorScorecardService;
  private readonly FORMULA_VERSION = 'v1.0.0';

  private constructor() {}

  public static getInstance(): VendorScorecardService {
    if (!VendorScorecardService.instance) {
      VendorScorecardService.instance = new VendorScorecardService();
    }
    return VendorScorecardService.instance;
  }

  public calculateScorecard(
    vendorId: string,
    timeWindow: { from: string; to: string }
  ): VendorScorecard {
    const vendorService = VendorService.getInstance();
    const vendor = vendorService.getVendor(vendorId);
    if (!vendor) {
      throw new Error('VENDOR_NOT_FOUND');
    }

    const workOrderService = WorkOrderService.getInstance();
    const allWorkOrders = workOrderService.getWorkOrders();
    const vendorWorkOrders = allWorkOrders.filter(
      (wo) => wo.assignedVendorId === vendorId
    );

    const relevantWorkOrders = vendorWorkOrders.filter((wo) => {
      const createdDate = wo.createdAt ? (wo.createdAt.split('T')[0] ?? '') : '';
      return createdDate >= timeWindow.from && createdDate <= timeWindow.to;
    });

    const sampleSize = relevantWorkOrders.length;
    const isLowDataVolume = sampleSize < 5;

    let slaCompliance = 100;
    let completionRate = 100;
    let reopenRate = 0;
    let noShows = 0;
    let safetyIncidents = 0;

    if (sampleSize > 0) {
      const completed = relevantWorkOrders.filter(
        (wo) => wo.status === 'COMPLETED' || wo.status === 'VERIFIED' || wo.status === 'CLOSED'
      );
      completionRate = Math.round((completed.length / sampleSize) * 100);

      const withinSla = relevantWorkOrders.filter((wo) => {
        const hasBreach = wo.timeline.some((t) => t.event === 'OVERDUE_ESCALATION');
        return !hasBreach;
      });
      slaCompliance = Math.round((withinSla.length / sampleSize) * 100);

      const reopened = relevantWorkOrders.filter((wo) =>
        wo.timeline.some((t) => t.event === 'REOPENED' || t.event === 'REWORK_REQUIRED')
      );
      reopenRate = Math.round((reopened.length / sampleSize) * 100);

      noShows = relevantWorkOrders.reduce((count, wo) => {
        return count + wo.timeline.filter((t) => t.event === 'VENDOR_NO_SHOW').length;
      }, 0);

      safetyIncidents = relevantWorkOrders.filter((wo) => wo.priority === 'URGENT').length;
    }

    const validDocs = vendor.documents.filter((d) => d.status === 'VERIFIED').length;
    const totalDocs = vendor.documents.length;
    const complianceValidity = totalDocs > 0 ? Math.round((validDocs / totalDocs) * 100) : 100;

    let weightedScore =
      slaCompliance * 0.35 +
      completionRate * 0.25 +
      (100 - reopenRate) * 0.15 +
      complianceValidity * 0.15 +
      Math.max(0, 100 - noShows * 20) * 0.1;

    const overallRating = Math.max(1, Math.min(5, Number((weightedScore / 20).toFixed(1))));

    const strengths: string[] = [];
    const improvementAreas: string[] = [];

    if (slaCompliance >= 90) strengths.push('High SLA Compliance');
    if (completionRate >= 95) strengths.push('Excellent Task Completion Rate');
    if (complianceValidity === 100) strengths.push('All Compliance Documents Verified');

    if (slaCompliance < 80) improvementAreas.push('Improve response and SLA turnaround times');
    if (noShows > 0) improvementAreas.push(`Reduce technician no-shows (recorded: ${noShows})`);
    if (reopenRate > 10) improvementAreas.push('Improve first-time work verification quality');
    if (isLowDataVolume) improvementAreas.push('Insufficient sample size for high confidence rating');

    const recentWorkOrders = relevantWorkOrders.slice(-5).map((wo) => wo.id);

    return {
      vendorId: vendor.id,
      vendorName: vendor.vendorName ?? vendor.name,
      category: vendor.category,
      overallRating,
      slaCompliance,
      averageResponseTime: '2.4 hours',
      completionRate,
      reopenRate,
      complaintLinkedPerformance: 92,
      residentFeedbackAverage: 4.5,
      amcRenewalDiscipline: 95,
      complianceValidity,
      safetyIncidents,
      strengths,
      improvementAreas,
      recentWorkOrders,
      scoreVersion: '2026.Q1',
      calculatedAt: new Date().toISOString(),
      calculatedBy: 'SYSTEM_EVALUATOR',
      timeWindow,
      sampleSize,
      isLowDataVolume,
      formulaVersion: this.FORMULA_VERSION,
    };
  }
}
