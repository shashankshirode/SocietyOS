import type { Visitor } from '../../shared/types/visitor.types';
import type { Complaint } from '../../shared/types/complaint.types';
import type { Notice } from '../../shared/types/notice.types';
import type { Bill } from '../../shared/types/bill.types';
import type { DocumentInfo } from '../../shared/types/document.types';
import type { NocRequest } from '../../shared/types/noc.types';
import type { StaffMember } from '../../shared/types/staff.types';
import type { AdminResident } from '../../shared/types/admin.types';
import type { ResidentProfileInfo } from '../../modules/resident/profile/data/residents.types';
import type { SocietyHierarchyNode, UnitDetailInfo } from '../../modules/societySetup/data/societySetup.types';
import type { ChatThread } from '../../shared/types/chat.types';
import type { InterFlatIssue } from '../../shared/types/interFlat.types';
import type { FacilityBooking } from '../../shared/types/facilityBooking.types';
import type { Vehicle } from '../../shared/types/vehicle.types';

export interface GateLog {
  id: string;
  visitorId: string;
  visitorName: string;
  entryTime: string;
  exitTime?: string;
  guardName: string;
  gateNumber: string;
  visitorType?: string;
  flatNumber?: string;
}

export interface LedgerEntry {
  id: string;
  unitId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  date: string;
}

export interface MockStoreState {
  visitors: Visitor[];
  complaints: Complaint[];
  notices: Notice[];
  bills: Bill[];
  documents: DocumentInfo[];
  nocs: NocRequest[];
  staff: StaffMember[];
  residents: AdminResident[];
  residentsNew: ResidentProfileInfo[];
  societyHierarchy: SocietyHierarchyNode;
  societyUnits: UnitDetailInfo[];
  chatThreads: ChatThread[];
  interFlatIssues: InterFlatIssue[];
  facilityBookings: FacilityBooking[];
  vehicles: Vehicle[];
  gateLogs: GateLog[];
  ledgerEntries: LedgerEntry[];
  advanceBalances: Record<string, number>;
}
