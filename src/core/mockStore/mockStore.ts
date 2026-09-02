import type { MockStoreState, GateLog, LedgerEntry } from './mockStore.types';
import type { Visitor } from '../../shared/types/visitor.types';
import type { Complaint } from '../../shared/types/complaint.types';
import type { Notice } from '../../shared/types/notice.types';
import { mockVisitors } from '../../shared/mock/visitors.mock';
import { mockComplaints } from '../../shared/mock/complaints.mock';
import { mockNotices } from '../../shared/mock/notices.mock';
import { mockResidentDocuments } from '../../shared/mock/documents.mock';
import { mockNocRequests } from '../../shared/mock/nocRequests.mock';
import { mockStaffMembers } from '../../shared/mock/staff.mock';
import { mockAdminResidents } from '../../shared/mock/adminResidents.mock';
import { mockChatThreads } from '../../shared/mock/chat.mock';
import { mockInterFlatIssues } from '../../shared/mock/interFlatIssues.mock';
import { mockFacilityBookings } from '../../shared/mock/facilityBookings.mock';
import { mockVehicles } from '../../shared/mock/vehicles.mock';
import { mockResidentsList } from '../../modules/resident/profile/data/residents.mockSource';
import { mockSocietyHierarchy, mockUnitsDetailList } from '../../modules/societySetup/data/societySetup.mockSource';
import {
  residentScopedBills,
  residentScopedChatThreads,
  residentScopedComplaints,
  residentScopedDocuments,
  residentScopedNocRequests,
  residentScopedNotices,
  residentScopedVisitors,
  residentScopedVehicles,
} from '../../modules/resident/mock/residentMockDomainBuilders';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MOCK_DATA_VERSION = 4;
export const MOCK_STORE_STORAGE_KEY = 'society-os.mock.resident-state.v4';
const obsoleteMockStoreKeys = [
  'society-os.mock.resident-state.v1',
  'society-os.mock.sos-events.v1',
  'societyos.resident.facilityBooking.v2',
  'societyos.resident.facilityBooking.v2.meta',
];

type PersistedMockStore = {
  version: number;
  state: MockStoreState;
};

const initialStoreState: MockStoreState = {
  visitors: [...residentScopedVisitors, ...mockVisitors],
  complaints: [
    ...residentScopedComplaints,
    ...mockComplaints,
    {
      id: 'comp-nashik-1',
      title: 'Plumbing leakage in kitchen sink',
      description: 'Continuous leakage under the kitchen counter has started damaging the woodwork.',
      category: 'PLUMBING',
      status: 'OPEN',
      priority: 'HIGH',
      location: 'C-503, Kitchen',
      flatNumber: 'C-503',
      residentName: 'Amit',
      createdAt: '2026-07-09T09:00:00Z',
      updatedAt: '2026-07-09T09:00:00Z',
      slaText: 'Resolution expected within 24 hours',
    },
    {
      id: 'comp-ra-1',
      title: 'Clubhouse AC remote missing',
      description: 'AC remote in the indoor game room is missing since yesterday.',
      category: 'OTHER',
      status: 'OPEN',
      priority: 'LOW',
      location: 'Clubhouse, 1st Floor',
      flatNumber: 'B-2101',
      residentName: 'Shashank',
      createdAt: '2026-07-09T10:00:00Z',
      updatedAt: '2026-07-09T10:00:00Z',
      slaText: 'Expected resolution in 48 hours',
    }
  ],
  notices: [
    ...residentScopedNotices,
    ...mockNotices,
    {
      id: 'notice-ra-1',
      title: 'Clubhouse renovations starting',
      body: 'Gym and swimming pool will remain closed for maintenance from July 12th to July 15th.',
      category: 'MAINTENANCE',
      date: '2026-07-08',
      postedBy: 'Committee Rohan Ananta',
      isImportant: true,
      priority: 'IMPORTANT',
      status: 'UNREAD',
      societyName: 'Rohan Ananta Tathawade',
      targetAudience: 'All Residents',
      acknowledgementRequired: false,
    },
    {
      id: 'notice-nashik-1',
      title: 'AGM rescheduled to next Sunday',
      body: 'Due to municipal elections, the Annual General Meeting is rescheduled to next Sunday, July 19th.',
      category: 'AGM_MEETING',
      date: '2026-07-09',
      postedBy: 'Gokhale Park Committee',
      isImportant: true,
      priority: 'URGENT',
      status: 'UNREAD',
      societyName: 'Gokhale Park Nashik',
      targetAudience: 'All Owners/Tenants',
      acknowledgementRequired: true,
      acknowledged: false,
    }
  ],
  bills: [...residentScopedBills],
  documents: [
    ...residentScopedDocuments,
    ...mockResidentDocuments,
    {
      id: 'doc-nashik-1',
      title: 'Registered Lease Agreement',
      category: 'RENT_AGREEMENT',
      flatNumber: 'C-503',
      status: 'VERIFIED',
      uploadedDate: '2026-06-25',
      uploadedBy: 'Amit',
      verifiedDate: '2026-06-26',
      verifiedBy: 'Gokhale Park Sec',
      fileType: 'pdf',
      fileSize: '2.1 MB',
      sensitivity: 'TENANT_ONLY',
      description: 'Active rent agreement for unit C-503.',
    },
    {
      id: 'doc-nashik-2',
      title: 'Police Verification Form',
      category: 'POLICE_VERIFICATION',
      flatNumber: 'C-503',
      status: 'PENDING_VERIFICATION',
      uploadedDate: '2026-07-09',
      uploadedBy: 'Amit',
      fileType: 'pdf',
      fileSize: '1.1 MB',
      sensitivity: 'TENANT_ONLY',
      description: 'Awaiting local police desk verification stamp.',
    }
  ],
  nocs: [...residentScopedNocRequests, ...mockNocRequests],
  staff: [...mockStaffMembers],
  residents: [...mockAdminResidents],
  residentsNew: [...mockResidentsList],
  societyHierarchy: mockSocietyHierarchy,
  societyUnits: [...mockUnitsDetailList],
  chatThreads: [...residentScopedChatThreads, ...mockChatThreads],
  interFlatIssues: [...mockInterFlatIssues],
  facilityBookings: [...mockFacilityBookings],
  vehicles: [...residentScopedVehicles, ...mockVehicles],
  gateLogs: [],
  ledgerEntries: [],
  advanceBalances: {},
};

function cloneInitialStoreState(): MockStoreState {
  return {
    ...initialStoreState,
    visitors: [...initialStoreState.visitors],
    complaints: [...initialStoreState.complaints],
    notices: [...initialStoreState.notices],
    bills: [...initialStoreState.bills],
    documents: [...initialStoreState.documents],
    nocs: [...initialStoreState.nocs],
    staff: [...initialStoreState.staff],
    residents: [...initialStoreState.residents],
    residentsNew: [...initialStoreState.residentsNew],
    societyUnits: [...initialStoreState.societyUnits],
    chatThreads: [...initialStoreState.chatThreads],
    interFlatIssues: [...initialStoreState.interFlatIssues],
    facilityBookings: [...initialStoreState.facilityBookings],
    vehicles: [...initialStoreState.vehicles],
    gateLogs: [...initialStoreState.gateLogs],
    ledgerEntries: [...initialStoreState.ledgerEntries],
    advanceBalances: { ...initialStoreState.advanceBalances },
  };
}

type VisitorStoreInput =
  | Visitor
  | (Pick<Visitor, 'id' | 'name' | 'type' | 'status' | 'phone' | 'expectedDate' | 'expectedTime'> &
      Partial<Omit<Visitor, 'id' | 'name' | 'type' | 'status' | 'phone' | 'expectedDate' | 'expectedTime'>>);

type ComplaintStoreInput = Pick<
  Complaint,
  'id' | 'title' | 'description' | 'priority' | 'status' | 'createdAt' | 'updatedAt'
> &
  Partial<Omit<Complaint, 'id' | 'title' | 'description' | 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'category'>> & {
    category: Complaint['category'] | 'Plumbing';
  };

type NoticeStoreInput = Pick<
  Notice,
  'id' | 'title' | 'body' | 'category' | 'priority' | 'date' | 'postedBy'
> & Partial<Omit<Notice, 'id' | 'title' | 'body' | 'category' | 'priority' | 'date' | 'postedBy'>>;

function normalizeVisitorInput(visitor: VisitorStoreInput): Visitor {
  return {
    flatNumber: '',
    societyName: '',
    purpose: '',
    otp: '',
    createdAt: new Date().toISOString(),
    ...visitor,
  };
}

function normalizeComplaintInput(complaint: ComplaintStoreInput): Complaint {
  return {
    ...complaint,
    category: complaint.category === 'Plumbing' ? 'PLUMBING' : complaint.category,
    location: complaint.location ?? '',
    flatNumber: complaint.flatNumber ?? complaint.raisedBy ?? '',
    residentName: complaint.residentName ?? '',
    slaText: complaint.slaText ?? '',
  };
}

function normalizeNoticeInput(notice: NoticeStoreInput): Notice {
  return {
    ...notice,
    isImportant: notice.isImportant ?? false,
    status: notice.status ?? 'UNREAD',
    societyName: notice.societyName ?? '',
  };
}

class MockStore {
  private state: MockStoreState;
  private listeners: Set<() => void> = new Set();
  private hydration: Promise<void> | null = null;

  constructor() {
    this.state = cloneInitialStoreState();
  }

  getState(): MockStoreState {
    return this.state;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  hydrate(): Promise<void> {
    if (!this.hydration) {
      this.hydration = AsyncStorage.getItem(MOCK_STORE_STORAGE_KEY).then(async (raw) => {
        if (!raw) {
          const storedKeys = await AsyncStorage.getAllKeys();
          const legacyKeys = storedKeys.filter((key) => obsoleteMockStoreKeys.includes(key) || key.startsWith('societyos.resident.facilityBooking.v2.chunk'));
          if (legacyKeys.length) await AsyncStorage.multiRemove(legacyKeys);
          this.persist();
          return;
        }
        const saved = JSON.parse(raw) as PersistedMockStore;
        if (saved.version !== MOCK_DATA_VERSION) {
          await AsyncStorage.removeItem(MOCK_STORE_STORAGE_KEY);
          this.state = cloneInitialStoreState();
          this.persist();
          this.listeners.forEach((listener) => listener());
          return;
        }
        this.state = { ...cloneInitialStoreState(), ...saved.state };
        this.listeners.forEach((listener) => listener());
      }).catch(() => undefined);
    }
    return this.hydration;
  }

  private persist() {
    const persisted: PersistedMockStore = { version: MOCK_DATA_VERSION, state: this.state };
    void AsyncStorage.setItem(MOCK_STORE_STORAGE_KEY, JSON.stringify(persisted));
  }

  private notify() {
    this.persist();
    this.listeners.forEach((listener) => listener());
  }

  reset() {
    this.state = cloneInitialStoreState();
    this.hydration = Promise.resolve();
    this.notify();
  }

  async resetPersistedDemoData(): Promise<void> {
    await AsyncStorage.multiRemove([...obsoleteMockStoreKeys, MOCK_STORE_STORAGE_KEY, 'society-os.mock.sos-events.v4']);
    this.state = cloneInitialStoreState();
    this.hydration = Promise.resolve();
    this.notify();
  }

  
  addVisitor(visitor: VisitorStoreInput) {
    this.state.visitors = [normalizeVisitorInput(visitor), ...this.state.visitors];
    this.notify();
  }

  updateVisitor(id: string, updates: Partial<Visitor>) {
    this.state.visitors = this.state.visitors.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    this.notify();
  }

  
  addComplaint(complaint: ComplaintStoreInput) {
    this.state.complaints = [normalizeComplaintInput(complaint), ...this.state.complaints];
    this.notify();
  }

  updateComplaint(id: string, updates: Partial<MockStoreState['complaints'][number]>) {
    this.state.complaints = this.state.complaints.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.notify();
  }

  
  addNotice(notice: NoticeStoreInput) {
    this.state.notices = [normalizeNoticeInput(notice), ...this.state.notices];
    this.notify();
  }

  updateNotice(id: string, updates: Partial<MockStoreState['notices'][number]>) {
    this.state.notices = this.state.notices.map((n) =>
      n.id === id ? { ...n, ...updates } : n
    );
    this.notify();
  }

  
  addBill(bill: MockStoreState['bills'][number]) {
    this.state.bills = [bill, ...this.state.bills];
    this.notify();
  }

  updateBill(id: string, updates: Partial<MockStoreState['bills'][number]>) {
    this.state.bills = this.state.bills.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    this.notify();
  }

  
  addDocument(doc: MockStoreState['documents'][number]) {
    this.state.documents = [doc, ...this.state.documents];
    this.notify();
  }

  
  addNoc(noc: MockStoreState['nocs'][number]) {
    this.state.nocs = [noc, ...this.state.nocs];
    this.notify();
  }

  updateNoc(id: string, updates: Partial<MockStoreState['nocs'][number]>) {
    this.state.nocs = this.state.nocs.map((n) =>
      n.id === id ? { ...n, ...updates } : n
    );
    this.notify();
  }

  
  addStaff(staff: MockStoreState['staff'][number]) {
    this.state.staff = [staff, ...this.state.staff];
    this.notify();
  }

  updateStaff(id: string, updates: Partial<MockStoreState['staff'][number]>) {
    this.state.staff = this.state.staff.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.notify();
  }

  
  updateResident(id: string, updates: Partial<MockStoreState['residents'][number]>) {
    this.state.residents = this.state.residents.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    this.notify();
  }

  
  addChatThread(thread: MockStoreState['chatThreads'][number]) {
    this.state.chatThreads = [thread, ...this.state.chatThreads];
    this.notify();
  }

  updateChatThread(id: string, updates: Partial<MockStoreState['chatThreads'][number]>) {
    this.state.chatThreads = this.state.chatThreads.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.notify();
  }

  
  addInterFlatIssue(issue: MockStoreState['interFlatIssues'][number]) {
    this.state.interFlatIssues = [issue, ...this.state.interFlatIssues];
    this.notify();
  }

  updateInterFlatIssue(id: string, updates: Partial<MockStoreState['interFlatIssues'][number]>) {
    this.state.interFlatIssues = this.state.interFlatIssues.map((i) =>
      i.id === id ? { ...i, ...updates } : i
    );
    this.notify();
  }

  
  addFacilityBooking(booking: MockStoreState['facilityBookings'][number]) {
    this.state.facilityBookings = [booking, ...this.state.facilityBookings];
    this.notify();
  }

  updateFacilityBooking(id: string, updates: Partial<MockStoreState['facilityBookings'][number]>) {
    this.state.facilityBookings = this.state.facilityBookings.map((fb) =>
      fb.id === id ? { ...fb, ...updates } : fb
    );
    this.notify();
  }

  
  addVehicle(vehicle: MockStoreState['vehicles'][number]) {
    this.state.vehicles = [vehicle, ...this.state.vehicles];
    this.notify();
  }

  updateVehicle(id: string, updates: Partial<MockStoreState['vehicles'][number]>) {
    this.state.vehicles = this.state.vehicles.map((v) =>
      v.id === id ? { ...v, ...updates } : v
    );
    this.notify();
  }

  
  addGateLog(log: GateLog) {
    this.state.gateLogs = [log, ...this.state.gateLogs];
    this.notify();
  }

  
  addLedgerEntry(entry: LedgerEntry) {
    this.state.ledgerEntries = [entry, ...this.state.ledgerEntries];
    this.notify();
  }

  
  updateResidentNew(id: string, updates: Partial<MockStoreState['residentsNew'][number]>) {
    this.state.residentsNew = this.state.residentsNew.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    this.notify();
  }

  
  updateSocietyHierarchy(hierarchy: MockStoreState['societyHierarchy']) {
    this.state.societyHierarchy = hierarchy;
    this.notify();
  }

  updateSocietyUnit(id: string, updates: Partial<MockStoreState['societyUnits'][number]>) {
    this.state.societyUnits = this.state.societyUnits.map((u) =>
      u.id === id ? { ...u, ...updates } : u
    );
    this.notify();
  }

  addSocietyUnitsBulk(units: MockStoreState['societyUnits']) {
    this.state.societyUnits = [...units, ...this.state.societyUnits];
    this.notify();
  }

  updateAdvanceBalance(residenceId: string, amount: number) {
    this.state.advanceBalances = {
      ...this.state.advanceBalances,
      [residenceId]: amount,
    };
    this.notify();
  }
}

export const mockStore = new MockStore();
