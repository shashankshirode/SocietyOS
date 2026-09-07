import type { JsonObject } from '../../core/api/api.types';

export type ImportEntityType =
  | 'RESIDENT'
  | 'VEHICLE'
  | 'PARKING_SLOT'
  | 'INVENTORY_ITEM'
  | 'VENDOR'
  | 'ASSET'
  | 'STAFF'
  | 'CHARGE_HEAD'
  | 'UNIT'
  | 'FINANCIAL_OPENING_BALANCE'
  | 'COMPLAINT_CATEGORY'
  | 'FACILITY'
  | 'DOCUMENT_CATEGORY';

export type ImportStatus =
  | 'UPLOADED'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'PREVIEWED'
  | 'COMMITTING'
  | 'COMMITTED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'ROLLED_BACK';

export type ValidationSeverity = 'ERROR' | 'WARNING' | 'INFO';

export type ValidationRule = {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone' | 'enum';
  enumValues?: string[];
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: (value: JsonObject[string], row: JsonObject) => boolean | string;
};

export type ColumnMapping = {
  sourceColumn: string;
  targetField: string;
  transformation?: (value: string) => JsonObject[string];
  defaultValue?: JsonObject[string];
};

export type ImportTemplate = {
  id: string;
  name: string;
  entityType: ImportEntityType;
  version: number;
  columns: ColumnMapping[];
  validationRules: ValidationRule[];
  uniqueKeys: string[];
  foreignKeyRefs: Array<{
    field: string;
    referenceEntity: ImportEntityType;
    referenceField: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ImportBatch = {
  id: string;
  templateId: string;
  entityType: ImportEntityType;
  fileName: string;
  fileSize: number;
  fileHash: string;
  totalRows: number;
  status: ImportStatus;
  uploadedAt: string;
  uploadedBy: string;
  societyId: string;
  validatedAt?: string;
  previewedAt?: string;
  committedAt?: string;
  completedAt?: string;
  errorCount: number;
  warningCount: number;
  successCount: number;
  rollbackBatchId?: string;
  metadata?: JsonObject;
};

export type ImportRowResult = {
  rowIndex: number;
  status: 'VALID' | 'INVALID' | 'DUPLICATE' | 'FOREIGN_KEY_ERROR';
  data: JsonObject;
  errors: Array<{
    field: string;
    code: string;
    message: string;
    severity: ValidationSeverity;
  }>;
  warnings: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  duplicateOf?: string;
  foreignKeyErrors?: Array<{
    field: string;
    referenceEntity: ImportEntityType;
    value: JsonObject[string];
  }>;
};

export type ImportPreview = {
  batchId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  foreignKeyErrorRows: number;
  sampleValidRows: ImportRowResult[];
  sampleInvalidRows: ImportRowResult[];
  columnStats: Record<string, {
    total: number;
    filled: number;
    empty: number;
    uniqueValues: number;
  }>;
};

export type ExportConfig = {
  entityType: ImportEntityType;
  format: 'CSV' | 'XLSX' | 'JSON';
  filters?: JsonObject;
  columns?: string[];
  includeHeaders: boolean;
  dateFormat?: string;
  encoding?: string;
};

export type ExportJob = {
  id: string;
  config: ExportConfig;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  fileUrl?: string;
  fileSize?: number;
  rowCount?: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
  requestedBy: string;
  societyId: string;
};

export type MigrationPlan = {
  id: string;
  name: string;
  sourceSystem: string;
  targetSystem: string;
  entities: Array<{
    entityType: ImportEntityType;
    sourceQuery: string;
    targetTemplateId: string;
    transformScript?: string;
  }>;
  status: 'DRAFT' | 'VALIDATING' | 'READY' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
};

export const ENTITY_TYPE_LABELS: Record<ImportEntityType, string> = {
  RESIDENT: 'Residents',
  VEHICLE: 'Vehicles',
  PARKING_SLOT: 'Parking Slots',
  INVENTORY_ITEM: 'Inventory Items',
  VENDOR: 'Vendors',
  ASSET: 'Assets',
  STAFF: 'Staff Members',
  CHARGE_HEAD: 'Charge Heads',
  UNIT: 'Units',
  FINANCIAL_OPENING_BALANCE: 'Financial Opening Balances',
  COMPLAINT_CATEGORY: 'Complaint Categories',
  FACILITY: 'Facilities',
  DOCUMENT_CATEGORY: 'Document Categories',
};

export const IMPORT_STATUS_LABELS: Record<ImportStatus, string> = {
  UPLOADED: 'Uploaded',
  VALIDATING: 'Validating',
  VALIDATED: 'Validated',
  PREVIEWED: 'Previewed',
  COMMITTING: 'Committing',
  COMMITTED: 'Committed',
  COMPLETED_WITH_ERRORS: 'Completed with Errors',
  FAILED: 'Failed',
  ROLLED_BACK: 'Rolled Back',
};