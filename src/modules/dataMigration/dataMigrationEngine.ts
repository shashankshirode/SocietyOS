import {
  ImportEntityType,
  ImportStatus,
  ValidationSeverity,
  ImportTemplate,
  ImportBatch,
  ImportRowResult,
  ImportPreview,
  ColumnMapping,
  ValidationRule,
  ExportConfig,
  ExportJob,
} from './dataMigration.types';

export type {
  ImportTemplate,
  ImportBatch,
  ImportRowResult,
  ImportPreview,
  ExportConfig,
  ExportJob,
} from './dataMigration.types';
import { createIdempotencyKey } from '../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../core/audit';
import { apiClient } from '../../core/api/apiClient';
import { apiEndpoints } from '../../core/api/apiEndpoints';

const DEFAULT_TEMPLATES: ImportTemplate[] = [
  {
    id: 'template-resident',
    name: 'Resident Import Template',
    entityType: 'RESIDENT',
    version: 1,
    columns: [
      { sourceColumn: 'full_name', targetField: 'fullName' },
      { sourceColumn: 'phone', targetField: 'phone' },
      { sourceColumn: 'email', targetField: 'email' },
      { sourceColumn: 'unit_number', targetField: 'unitNumber' },
      { sourceColumn: 'tower', targetField: 'tower' },
      { sourceColumn: 'floor', targetField: 'floor' },
      { sourceColumn: 'owner_type', targetField: 'ownerType' },
      { sourceColumn: 'id_proof_type', targetField: 'idProofType' },
      { sourceColumn: 'id_proof_number', targetField: 'idProofNumber' },
    ],
    validationRules: [
      { field: 'fullName', required: true, type: 'string', minLength: 2, maxLength: 100 },
      { field: 'phone', required: true, type: 'phone' },
      { field: 'email', required: false, type: 'email' },
      { field: 'unitNumber', required: true, type: 'string', minLength: 1 },
      { field: 'tower', required: true, type: 'string' },
      { field: 'floor', required: true, type: 'number', min: 0, max: 100 },
      { field: 'ownerType', required: true, type: 'enum', enumValues: ['OWNER', 'TENANT', 'CO_OWNER', 'FAMILY'] },
      { field: 'idProofType', required: true, type: 'enum', enumValues: ['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE'] },
      { field: 'idProofNumber', required: true, type: 'string', minLength: 10 },
    ],
    uniqueKeys: ['phone', 'idProofNumber'],
    foreignKeyRefs: [
      { field: 'unitNumber', referenceEntity: 'UNIT', referenceField: 'unitNumber' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-vehicle',
    name: 'Vehicle Import Template',
    entityType: 'VEHICLE',
    version: 1,
    columns: [
      { sourceColumn: 'vehicle_number', targetField: 'vehicleNumber' },
      { sourceColumn: 'vehicle_type', targetField: 'vehicleType' },
      { sourceColumn: 'owner_phone', targetField: 'ownerPhone' },
      { sourceColumn: 'unit_number', targetField: 'unitNumber' },
      { sourceColumn: 'rfid_tag', targetField: 'rfidTag' },
      { sourceColumn: 'color', targetField: 'color' },
      { sourceColumn: 'make', targetField: 'make' },
      { sourceColumn: 'model', targetField: 'model' },
    ],
    validationRules: [
      { field: 'vehicleNumber', required: true, type: 'string', minLength: 5, maxLength: 15 },
      { field: 'vehicleType', required: true, type: 'enum', enumValues: ['CAR', 'BIKE', 'CYCLE', 'EV', 'OTHER'] },
      { field: 'ownerPhone', required: true, type: 'phone' },
      { field: 'unitNumber', required: true, type: 'string' },
      { field: 'rfidTag', required: false, type: 'string' },
    ],
    uniqueKeys: ['vehicleNumber', 'rfidTag'],
    foreignKeyRefs: [
      { field: 'ownerPhone', referenceEntity: 'RESIDENT', referenceField: 'phone' },
      { field: 'unitNumber', referenceEntity: 'UNIT', referenceField: 'unitNumber' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class DataMigrationEngine {
  private templates: Map<string, ImportTemplate> = new Map();
  private batches: Map<string, ImportBatch> = new Map();
  private rowResults: Map<string, ImportRowResult[]> = new Map();
  private exportJobs: Map<string, ExportJob> = new Map();
  private listeners: Array<(batch: ImportBatch) => void> = [];

  constructor() {
    DEFAULT_TEMPLATES.forEach(t => this.templates.set(t.id, t));
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('data_migration_batches');
      if (stored) {
        const batches = JSON.parse(stored);
        batches.forEach((b: ImportBatch) => this.batches.set(b.id, b));
      }
      const results = localStorage.getItem('data_migration_results');
      if (results) {
        const parsed = JSON.parse(results);
        Object.entries(parsed).forEach(([batchId, rows]) => {
          this.rowResults.set(batchId, rows as ImportRowResult[]);
        });
      }
    } catch (error) {
      console.error('[DataMigrationEngine] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('data_migration_batches', JSON.stringify(Array.from(this.batches.values())));
      const resultsObj: Record<string, ImportRowResult[]> = {};
      this.rowResults.forEach((rows, batchId) => {
        resultsObj[batchId] = rows;
      });
      localStorage.setItem('data_migration_results', JSON.stringify(resultsObj));
    } catch (error) {
      console.error('[DataMigrationEngine] Failed to save to storage:', error);
    }
  }

  getTemplates(entityType?: ImportEntityType): ImportTemplate[] {
    const all = Array.from(this.templates.values());
    return entityType ? all.filter(t => t.entityType === entityType) : all;
  }

  getTemplate(id: string): ImportTemplate | null {
    return this.templates.get(id) ?? null;
  }

  async uploadFile(
    file: File,
    templateId: string,
    societyId: string,
    uploadedBy: string
  ): Promise<{ batchId: string; totalRows: number }> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    const content = await this.readFileAsText(file);
    const rows = this.parseCSV(content);

    const batchId = `import_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const fileHash = await this.computeHash(content);

    const batch: ImportBatch = {
      id: batchId,
      templateId,
      entityType: template.entityType,
      fileName: file.name,
      fileSize: file.size,
      fileHash,
      totalRows: rows.length,
      status: 'UPLOADED',
      uploadedAt: new Date().toISOString(),
      uploadedBy,
      societyId,
      errorCount: 0,
      warningCount: 0,
      successCount: 0,
    };

    this.batches.set(batchId, batch);
    this.saveToStorage();

    createAuditEntry({
      actorUserId: uploadedBy,
      actorType: 'ADMIN',
      societyId,
      action: 'IMPORT_UPLOAD',
      entityType: 'IMPORT_BATCH',
      entityId: batchId,
      newState: { status: 'UPLOADED', totalRows: rows.length, entityType: template.entityType },
      idempotencyKey: createIdempotencyKey('import'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { batchId, totalRows: rows.length };
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private parseCSV(content: string): JsonObject[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const firstLine = lines[0];
    if (!firstLine) return [];
    const headers = this.parseCSVLine(firstLine);
    const rows: JsonObject[] = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine) continue;
      const values = this.parseCSVLine(currentLine);
      if (values.length !== headers.length) continue;

      const row: JsonObject = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() ?? '';
      });
      rows.push(row);
    }

    return rows;
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  private async computeHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async validateBatch(batchId: string): Promise<ImportRowResult[]> {
    const batch = this.batches.get(batchId);
    if (!batch) throw new Error('Batch not found');

    batch.status = 'VALIDATING';
    this.saveToStorage();

    const template = this.templates.get(batch.templateId)!;
    const content = localStorage.getItem(`import_file_${batchId}`);
    if (!content) throw new Error('File content not found');

    const rows = this.parseCSV(content);
    const results: ImportRowResult[] = [];
    const seenValues: Record<string, Set<string>> = {};

    template.uniqueKeys.forEach(key => seenValues[key] = new Set());

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const mappedRow = this.mapRow(row, template.columns);
      const errors: ImportRowResult['errors'] = [];
      const warnings: ImportRowResult['warnings'] = [];

      for (const rule of template.validationRules) {
        const value = mappedRow[rule.field];
        const validation = this.validateField(value, rule, mappedRow, i);
        if (validation) {
          if (validation.severity === 'ERROR') {
            errors.push(validation);
          } else {
            warnings.push({ field: validation.field, code: validation.code, message: validation.message });
          }
        }
      }

      for (const key of template.uniqueKeys ?? []) {
        const value = String(mappedRow[key] ?? '');
        const seenSet = seenValues[key];
        if (value && seenSet && seenSet.has(value)) {
          errors.push({
            field: key,
            code: 'DUPLICATE_VALUE',
            message: `Duplicate value for ${key}: ${value}`,
            severity: 'ERROR',
          });
        } else if (value && seenSet) {
          seenSet.add(value);
        }
      }

      const foreignKeyErrors: ImportRowResult['foreignKeyErrors'] = [];
      for (const fk of template.foreignKeyRefs) {
        const value = mappedRow[fk.field];
        if (value && !await this.checkForeignKey(fk.referenceEntity, fk.referenceField, value)) {
          foreignKeyErrors.push({
            field: fk.field,
            referenceEntity: fk.referenceEntity,
            value,
          });
        }
      }

      let status: ImportRowResult['status'] = 'VALID';
      if (errors.length > 0) {
        status = foreignKeyErrors.length > 0 ? 'FOREIGN_KEY_ERROR' : 'INVALID';
      } else if (foreignKeyErrors.length > 0) {
        status = 'FOREIGN_KEY_ERROR';
      }

      results.push({
        rowIndex: i,
        status,
        data: mappedRow,
        errors,
        warnings,
        foreignKeyErrors,
      });
    }

    this.rowResults.set(batchId, results);

    batch.status = 'VALIDATED';
    batch.validatedAt = new Date().toISOString();
    batch.errorCount = results.filter(r => r.status !== 'VALID').length;
    batch.warningCount = results.reduce((sum, r) => sum + r.warnings.length, 0);
    batch.successCount = results.filter(r => r.status === 'VALID').length;
    this.saveToStorage();

    return results;
  }

  private mapRow(row: JsonObject, columns: ColumnMapping[]): JsonObject {
    const mapped: JsonObject = {};
    for (const col of columns) {
      const value = row[col.sourceColumn];
      if (value !== undefined && value !== '') {
        mapped[col.targetField] = col.transformation ? col.transformation(String(value)) : value;
      } else if (col.defaultValue !== undefined) {
        mapped[col.targetField] = col.defaultValue;
      }
    }
    return mapped;
  }

  private validateField(
    value: JsonObject[string],
    rule: ValidationRule,
    row: JsonObject,
    rowIndex: number
  ): { field: string; code: string; message: string; severity: ValidationSeverity } | null {
    if (rule.required && (value === undefined || value === null || value === '')) {
      return { field: rule.field, code: 'REQUIRED', message: `${rule.field} is required`, severity: 'ERROR' };
    }
    if (value === undefined || value === null || value === '') return null;

    const strValue = String(value);

    switch (rule.type) {
      case 'string':
        if (rule.minLength && strValue.length < rule.minLength) {
          return { field: rule.field, code: 'MIN_LENGTH', message: `${rule.field} must be at least ${rule.minLength} characters`, severity: 'ERROR' };
        }
        if (rule.maxLength && strValue.length > rule.maxLength) {
          return { field: rule.field, code: 'MAX_LENGTH', message: `${rule.field} must be at most ${rule.maxLength} characters`, severity: 'ERROR' };
        }
        if (rule.pattern && !new RegExp(rule.pattern).test(strValue)) {
          return { field: rule.field, code: 'PATTERN_MISMATCH', message: `${rule.field} format is invalid`, severity: 'ERROR' };
        }
        break;
      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          return { field: rule.field, code: 'INVALID_NUMBER', message: `${rule.field} must be a number`, severity: 'ERROR' };
        }
        if (rule.min !== undefined && num < rule.min) {
          return { field: rule.field, code: 'MIN_VALUE', message: `${rule.field} must be at least ${rule.min}`, severity: 'ERROR' };
        }
        if (rule.max !== undefined && num > rule.max) {
          return { field: rule.field, code: 'MAX_VALUE', message: `${rule.field} must be at most ${rule.max}`, severity: 'ERROR' };
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strValue)) {
          return { field: rule.field, code: 'INVALID_EMAIL', message: `${rule.field} must be a valid email`, severity: 'ERROR' };
        }
        break;
      case 'phone':
        if (!/^[\d\s\-\+\(\)]{10,}$/.test(strValue.replace(/\s/g, ''))) {
          return { field: rule.field, code: 'INVALID_PHONE', message: `${rule.field} must be a valid phone number`, severity: 'ERROR' };
        }
        break;
      case 'date':
        if (isNaN(Date.parse(strValue))) {
          return { field: rule.field, code: 'INVALID_DATE', message: `${rule.field} must be a valid date`, severity: 'ERROR' };
        }
        break;
      case 'enum':
        if (rule.enumValues && !rule.enumValues.includes(strValue)) {
          return { field: rule.field, code: 'INVALID_ENUM', message: `${rule.field} must be one of: ${rule.enumValues.join(', ')}`, severity: 'ERROR' };
        }
        break;
    }

    if (rule.customValidator) {
      const customResult = rule.customValidator(value, row);
      if (customResult !== true) {
        return {
          field: rule.field,
          code: 'CUSTOM_VALIDATION',
          message: typeof customResult === 'string' ? customResult : `${rule.field} failed custom validation`,
          severity: 'ERROR',
        };
      }
    }

    return null;
  }

  private async checkForeignKey(entityType: ImportEntityType, field: string, value: JsonObject[string]): Promise<boolean> {
    try {
      const response = await apiClient.get<{ exists: boolean }>(`/api/migration/check/${entityType}/${field}`, {
        query: { value: String(value) },
      });
      return response.exists;
    } catch {
      return false;
    }
  }

  generatePreview(batchId: string): ImportPreview {
    const results = this.rowResults.get(batchId) ?? [];
    const validRows = results.filter(r => r.status === 'VALID');
    const invalidRows = results.filter(r => r.status !== 'VALID');
    const duplicateRows = results.filter(r => r.status === 'DUPLICATE');
    const fkErrorRows = results.filter(r => r.status === 'FOREIGN_KEY_ERROR');

    const allRows = [...validRows, ...invalidRows];
    const columns = new Set<string>();
    allRows.forEach(r => Object.keys(r.data).forEach(c => columns.add(c)));

    const columnStats: ImportPreview['columnStats'] = {};
    for (const col of columns) {
      const values = allRows.map(r => r.data[col]).filter(v => v !== undefined && v !== '');
      columnStats[col] = {
        total: allRows.length,
        filled: values.length,
        empty: allRows.length - values.length,
        uniqueValues: new Set(values).size,
      };
    }

    return {
      batchId,
      totalRows: results.length,
      validRows: validRows.length,
      invalidRows: invalidRows.length,
      duplicateRows: duplicateRows.length,
      foreignKeyErrorRows: fkErrorRows.length,
      sampleValidRows: validRows.slice(0, 10),
      sampleInvalidRows: invalidRows.slice(0, 10),
      columnStats,
    };
  }

  async commitBatch(batchId: string, options?: { force?: boolean }): Promise<{ committed: number; errors: number }> {
    const batch = this.batches.get(batchId);
    if (!batch) throw new Error('Batch not found');

    const results = this.rowResults.get(batchId) ?? [];
    const validRows = results.filter(r => r.status === 'VALID');

    if (validRows.length === 0 && !options?.force) {
      throw new Error('No valid rows to commit');
    }

    batch.status = 'COMMITTING';
    this.saveToStorage();

    try {
      const response = await apiClient.post<{
        committed: number;
        errors: Array<{ rowIndex: number; error: string }>;
      }>(apiEndpoints.accounting.importData, {
        batchId,
        entityType: batch.entityType,
        rows: validRows.map(r => r.data),
      });

      batch.status = response.errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMMITTED';
      batch.committedAt = new Date().toISOString();
      batch.completedAt = new Date().toISOString();
      this.saveToStorage();

      createAuditEntry({
        actorUserId: batch.uploadedBy,
        actorType: 'ADMIN',
        societyId: batch.societyId,
        action: 'IMPORT_COMMIT',
        entityType: 'IMPORT_BATCH',
        entityId: batchId,
        previousState: { status: 'COMMITTING' },
        newState: { status: batch.status, committed: response.committed, errors: response.errors.length },
        idempotencyKey: createIdempotencyKey('import_commit'),
        source: 'MOBILE',
        outcome: response.errors.length > 0 ? 'PARTIAL' : 'SUCCESS',
      });

      return { committed: response.committed, errors: response.errors.length };
    } catch (error) {
      batch.status = 'FAILED';
      this.saveToStorage();
      throw error;
    }
  }

  async rollbackBatch(batchId: string): Promise<void> {
    const batch = this.batches.get(batchId);
    if (!batch) throw new Error('Batch not found');

    if (batch.status !== 'COMMITTED' && batch.status !== 'COMPLETED_WITH_ERRORS') {
      throw new Error('Batch cannot be rolled back');
    }

    try {
      await apiClient.post(apiEndpoints.accounting.rollbackImport, { batchId });

      const rollbackBatchId = `rollback_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      batch.status = 'ROLLED_BACK';
      batch.rollbackBatchId = rollbackBatchId;
      this.saveToStorage();

      createAuditEntry({
        actorUserId: batch.uploadedBy,
        actorType: 'ADMIN',
        societyId: batch.societyId,
        action: 'IMPORT_ROLLBACK',
        entityType: 'IMPORT_BATCH',
        entityId: batchId,
        previousState: { status: batch.status },
        newState: { status: 'ROLLED_BACK', rollbackBatchId },
        idempotencyKey: createIdempotencyKey('import_rollback'),
        source: 'MOBILE',
        outcome: 'SUCCESS',
      });
    } catch (error) {
      throw error;
    }
  }

  getBatch(batchId: string): ImportBatch | null {
    return this.batches.get(batchId) ?? null;
  }

  getAllBatches(): ImportBatch[] {
    return Array.from(this.batches.values()).sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  getRowResults(batchId: string): ImportRowResult[] {
    return this.rowResults.get(batchId) ?? [];
  }

  async exportData(config: ExportConfig, societyId: string, requestedBy: string): Promise<string> {
    const jobId = `export_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

    const job: ExportJob = {
      id: jobId,
      config,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      requestedBy,
      societyId,
    };

    this.exportJobs.set(jobId, job);

    createAuditEntry({
      actorUserId: requestedBy,
      actorType: 'ADMIN',
      societyId,
      action: 'EXPORT_START',
      entityType: 'EXPORT_JOB',
      entityId: jobId,
      newState: { status: 'QUEUED', entityType: config.entityType, format: config.format },
      idempotencyKey: createIdempotencyKey('export'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return jobId;
  }

  getExportJob(jobId: string): ExportJob | null {
    return this.exportJobs.get(jobId) ?? null;
  }

  onBatchUpdate(listener: (batch: ImportBatch) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }
}

export const dataMigrationEngine = new DataMigrationEngine();