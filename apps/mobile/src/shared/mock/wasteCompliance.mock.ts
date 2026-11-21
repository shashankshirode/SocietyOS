export const mockWasteCompliance = {
  pickupStatusToday: 'COMPLETED',
  wetWasteComplianceRate: 92, 
  dryWasteComplianceRate: 85, 
  missedPickupsCount: 2,
  repeatViolationsCount: 1,
  towerWiseStatus: [
    { tower: 'A Wing', status: 'COMPLIANT', segregationRate: 94 },
    { tower: 'B Wing', status: 'MINOR_ISSUE', segregationRate: 88 },
    { tower: 'C Wing', status: 'COMPLIANT', segregationRate: 91 },
  ],
  compostYieldKg: 120,
  compostStatus: 'IN_PROGRESS',
  recentComplaints: [
    { id: 'wc-1', flat: 'B-0802', type: 'MISSED_PICKUP', description: 'Garbage not picked up today.', status: 'PENDING' },
    { id: 'wc-2', flat: 'A-1204', type: 'SEGREGATION_ISSUE', description: 'Mixed waste observed in dry bin.', status: 'RESOLVED' },
  ],
  violations: [
    { id: 'viol-1', violationType: 'MIXED_WASTE', location: 'A-1304', status: 'PROPOSED', penaltyAmount: 500, date: '2026-06-28' },
    { id: 'viol-2', violationType: 'BULK_DUMPING', location: 'Basement B2', status: 'WARNING_ISSUED', penaltyAmount: 0, date: '2026-06-29' }
  ]
};
