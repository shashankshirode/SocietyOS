export interface OccupancyRecord {
  id: string;
  unitId: string;
  flatNumber: string;
  occupantName: string;
  occupantType: 'OWNER' | 'TENANT' | 'VACANT';
  leaseStartDate?: string;
  leaseEndDate?: string;
  documentStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}
