import type { JsonObject } from '../../core/api/api.types';

export type SearchEntityType =
  | 'UNIT'
  | 'RESIDENT'
  | 'VEHICLE'
  | 'COMPLAINT'
  | 'NOTICE'
  | 'DOCUMENT'
  | 'FACILITY_BOOKING'
  | 'PARKING_ALLOCATION'
  | 'VENDOR'
  | 'STAFF'
  | 'ASSET'
  | 'INVENTORY_ITEM'
  | 'BILL'
  | 'PAYMENT'
  | 'NOC'
  | 'VISITOR_PASS'
  | 'MOVE_IN_REQUEST'
  | 'MOVE_OUT_REQUEST';

export type SearchResultType = SearchEntityType | 'ALL';

export type SearchPermission = 'READ' | 'WRITE' | 'ADMIN';

export type SearchIndexConfig = {
  entityType: SearchEntityType;
  searchableFields: string[];
  filterableFields: string[];
  sortableFields: string[];
  privacyFields: string[];
  requiredPermissions: SearchPermission[];
};

export type SearchQuery = {
  query: string;
  entityTypes?: SearchEntityType[];
  filters?: Record<string, string | number | boolean | Array<string | number>>;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  societyId: string;
  unitId?: string;
  userId: string;
  userRole: string;
  userPermissions: SearchPermission[];
};

export type SearchResult<T = JsonObject> = {
  id: string;
  entityType: SearchEntityType;
  title: string;
  snippet: string;
  score: number;
  data: T;
  permissions: SearchPermission[];
  matchedFields: string[];
  highlightedFields: Record<string, string>;
};

export type SearchResponse<T = JsonObject> = {
  results: SearchResult<T>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  tookMs: number;
  query: string;
  filters: SearchQuery['filters'];
  suggestions: string[];
};

export type SearchFacet = {
  field: string;
  values: Array<{
    value: string | number;
    count: number;
  }>;
};

export type SearchSuggestion = {
  text: string;
  type: 'QUERY' | 'ENTITY' | 'FIELD';
  entityType?: SearchEntityType;
  entityId?: string;
};

export type PrivacyFilter = {
  entityType: SearchEntityType;
  field: string;
  action: 'MASK' | 'REMOVE' | 'REDACT';
  condition?: (data: JsonObject, user: { role: string; permissions: SearchPermission[]; unitId?: string }) => boolean;
};

export const DEFAULT_SEARCH_INDEX_CONFIGS: Record<SearchEntityType, SearchIndexConfig> = {
  UNIT: {
    entityType: 'UNIT',
    searchableFields: ['unitNumber', 'tower', 'floor', 'type', 'status'],
    filterableFields: ['tower', 'floor', 'type', 'status', 'ownerId', 'tenantId'],
    sortableFields: ['unitNumber', 'tower', 'floor', 'createdAt'],
    privacyFields: ['ownerId', 'tenantId', 'ownerContact', 'tenantContact'],
    requiredPermissions: ['READ'],
  },
  RESIDENT: {
    entityType: 'RESIDENT',
    searchableFields: ['fullName', 'phone', 'email', 'unitNumber', 'tower'],
    filterableFields: ['unitNumber', 'tower', 'ownerType', 'status'],
    sortableFields: ['fullName', 'unitNumber', 'createdAt'],
    privacyFields: ['phone', 'email', 'idProof', 'address', 'emergencyContact'],
    requiredPermissions: ['READ'],
  },
  VEHICLE: {
    entityType: 'VEHICLE',
    searchableFields: ['vehicleNumber', 'vehicleType', 'ownerName', 'unitNumber'],
    filterableFields: ['vehicleType', 'unitNumber', 'status'],
    sortableFields: ['vehicleNumber', 'createdAt'],
    privacyFields: ['ownerPhone', 'rfidTag'],
    requiredPermissions: ['READ'],
  },
  COMPLAINT: {
    entityType: 'COMPLAINT',
    searchableFields: ['title', 'description', 'category', 'status', 'reporterName'],
    filterableFields: ['category', 'status', 'priority', 'assignedTo', 'tower', 'unitId'],
    sortableFields: ['createdAt', 'priority', 'status'],
    privacyFields: ['reporterPhone', 'reporterEmail', 'internalNotes'],
    requiredPermissions: ['READ'],
  },
  NOTICE: {
    entityType: 'NOTICE',
    searchableFields: ['title', 'content', 'category', 'priority'],
    filterableFields: ['category', 'priority', 'status', 'targetAudience'],
    sortableFields: ['publishedAt', 'expiresAt', 'priority'],
    privacyFields: [],
    requiredPermissions: ['READ'],
  },
  DOCUMENT: {
    entityType: 'DOCUMENT',
    searchableFields: ['name', 'category', 'tags', 'description'],
    filterableFields: ['category', 'status', 'owningEntityType', 'owningEntityId'],
    sortableFields: ['createdAt', 'version', 'category'],
    privacyFields: ['fileContent', 'metadata'],
    requiredPermissions: ['READ'],
  },
  FACILITY_BOOKING: {
    entityType: 'FACILITY_BOOKING',
    searchableFields: ['facilityName', 'bookedByName', 'purpose'],
    filterableFields: ['facilityId', 'status', 'date', 'timeSlot'],
    sortableFields: ['bookingDate', 'createdAt', 'status'],
    privacyFields: ['bookedByPhone', 'bookedByEmail'],
    requiredPermissions: ['READ'],
  },
  PARKING_ALLOCATION: {
    entityType: 'PARKING_ALLOCATION',
    searchableFields: ['slotNumber', 'vehicleNumber', 'ownerName', 'unitNumber'],
    filterableFields: ['slotType', 'status', 'unitNumber', 'vehicleType'],
    sortableFields: ['slotNumber', 'allocatedAt', 'status'],
    privacyFields: ['ownerPhone', 'rfidTag'],
    requiredPermissions: ['READ'],
  },
  VENDOR: {
    entityType: 'VENDOR',
    searchableFields: ['name', 'category', 'contactPerson', 'email', 'phone'],
    filterableFields: ['category', 'status', 'rating'],
    sortableFields: ['name', 'createdAt', 'rating'],
    privacyFields: ['gstNumber', 'panNumber', 'bankDetails', 'contactPersonPhone'],
    requiredPermissions: ['READ'],
  },
  STAFF: {
    entityType: 'STAFF',
    searchableFields: ['name', 'employeeId', 'role', 'department', 'phone'],
    filterableFields: ['role', 'department', 'status', 'shift'],
    sortableFields: ['name', 'employeeId', 'joinedAt'],
    privacyFields: ['phone', 'email', 'address', 'emergencyContact', 'salary'],
    requiredPermissions: ['READ'],
  },
  ASSET: {
    entityType: 'ASSET',
    searchableFields: ['name', 'serialNumber', 'category', 'location', 'manufacturer'],
    filterableFields: ['category', 'status', 'location', 'assignedTo'],
    sortableFields: ['name', 'serialNumber', 'purchaseDate', 'status'],
    privacyFields: ['purchasePrice', 'warrantyDetails'],
    requiredPermissions: ['READ'],
  },
  INVENTORY_ITEM: {
    entityType: 'INVENTORY_ITEM',
    searchableFields: ['name', 'sku', 'category', 'description'],
    filterableFields: ['category', 'status', 'location', 'vendorId'],
    sortableFields: ['name', 'sku', 'quantity', 'reorderLevel'],
    privacyFields: ['unitCost', 'vendorDetails'],
    requiredPermissions: ['READ'],
  },
  BILL: {
    entityType: 'BILL',
    searchableFields: ['billNumber', 'unitNumber', 'residentName', 'status'],
    filterableFields: ['status', 'billingCycle', 'unitId', 'amount'],
    sortableFields: ['billDate', 'dueDate', 'amount', 'status'],
    privacyFields: ['amount', 'lineItems', 'paymentHistory'],
    requiredPermissions: ['READ'],
  },
  PAYMENT: {
    entityType: 'PAYMENT',
    searchableFields: ['paymentId', 'billNumber', 'residentName', 'method'],
    filterableFields: ['method', 'status', 'date', 'amount'],
    sortableFields: ['paymentDate', 'amount', 'status'],
    privacyFields: ['transactionId', 'gatewayResponse', 'cardLast4'],
    requiredPermissions: ['READ'],
  },
  NOC: {
    entityType: 'NOC',
    searchableFields: ['nocNumber', 'unitNumber', 'residentName', 'status'],
    filterableFields: ['status', 'unitId', 'type'],
    sortableFields: ['createdAt', 'status', 'issuedAt'],
    privacyFields: ['clearedDues', 'documents'],
    requiredPermissions: ['READ'],
  },
  VISITOR_PASS: {
    entityType: 'VISITOR_PASS',
    searchableFields: ['visitorName', 'visitorPhone', 'hostUnit', 'hostName', 'purpose'],
    filterableFields: ['status', 'hostUnitId', 'visitorType', 'date'],
    sortableFields: ['createdAt', 'expectedAt', 'status'],
    privacyFields: ['visitorPhone', 'visitorIdProof', 'otp'],
    requiredPermissions: ['READ'],
  },
  MOVE_IN_REQUEST: {
    entityType: 'MOVE_IN_REQUEST',
    searchableFields: ['requestId', 'unitNumber', 'residentName', 'status'],
    filterableFields: ['status', 'unitId', 'moveInDate'],
    sortableFields: ['createdAt', 'moveInDate', 'status'],
    privacyFields: ['documents', 'emergencyContact'],
    requiredPermissions: ['READ'],
  },
  MOVE_OUT_REQUEST: {
    entityType: 'MOVE_OUT_REQUEST',
    searchableFields: ['requestId', 'unitNumber', 'residentName', 'status'],
    filterableFields: ['status', 'unitId', 'moveOutDate'],
    sortableFields: ['createdAt', 'moveOutDate', 'status'],
    privacyFields: ['clearedDues', 'documents', 'handoverNotes'],
    requiredPermissions: ['READ'],
  },
};

export const PRIVACY_FILTERS: PrivacyFilter[] = [
  { entityType: 'RESIDENT', field: 'phone', action: 'MASK', condition: (_, u) => Boolean(!u.permissions.includes('ADMIN') && u.unitId) },
  { entityType: 'RESIDENT', field: 'email', action: 'MASK', condition: (_, u) => Boolean(!u.permissions.includes('ADMIN') && u.unitId) },
  { entityType: 'RESIDENT', field: 'idProof', action: 'REMOVE', condition: (_, u) => !u.permissions.includes('ADMIN') },
  { entityType: 'VEHICLE', field: 'ownerPhone', action: 'MASK', condition: (_, u) => !u.permissions.includes('ADMIN') },
  { entityType: 'DOCUMENT', field: 'fileContent', action: 'REMOVE', condition: (_, u) => !u.permissions.includes('ADMIN') },
  { entityType: 'BILL', field: 'amount', action: 'MASK', condition: (data, u) => data.unitId !== u.unitId && !u.permissions.includes('ADMIN') },
  { entityType: 'PAYMENT', field: 'cardLast4', action: 'REMOVE', condition: (_, u) => !u.permissions.includes('ADMIN') },
  { entityType: 'VISITOR_PASS', field: 'visitorPhone', action: 'MASK', condition: (data, u) => data.hostUnitId !== u.unitId && !u.permissions.includes('ADMIN') },
];