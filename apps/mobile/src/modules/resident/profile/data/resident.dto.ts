import type { Bill } from '../../../../shared/types/bill.types';
import type { Complaint } from '../../../../shared/types/complaint.types';
import type { Notice } from '../../../../shared/types/notice.types';
import type { ResidentProfile } from '../../../../shared/types/resident.types';
import type { Visitor } from '../../../../shared/types/visitor.types';

export type ResidentDto = Partial<ResidentProfile> & Pick<ResidentProfile, 'id'>;

export type ResidentDashboardDto = {
  resident: ResidentDto;
  visitors: Visitor[];
  complaints: Complaint[];
  bills: Bill[];
  notices: Notice[];
};

export type ResidentDashboard = {
  resident: ResidentProfile;
  todayVisitors: Visitor[];
  activeComplaints: Complaint[];
  pendingBill?: Bill;
  latestNotice?: Notice;
};

