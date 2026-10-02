export interface Society {
  id: string;
  name: string;
  city: string;
  state: string;
  planCode: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'EXPIRED';
  totalUnits: number;
  activeUsers: number;
}