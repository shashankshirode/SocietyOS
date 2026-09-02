import { AppClock } from '../clock/AppClock';

export type PendingOperationType = 'payment' | 'visitor_pass' | 'complaint' | 'facility_hold' | 'document_upload' | 'noc_request';

export type PendingOperationStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'cancelled';

export interface PendingOperationRecord<TPayload = unknown> {
  operationId: string;
  correlationId: string;
  type: PendingOperationType;
  homeContextId: string;
  status: PendingOperationStatus;
  createdAt: number;
  updatedAt: number;
  payload: TPayload;
  errorMessage?: string | undefined;
}

export type OperationListener = (records: PendingOperationRecord[]) => void;

class PendingOperationStoreEngine {
  private records = new Map<string, PendingOperationRecord>();
  private listeners = new Set<OperationListener>();

  createOperation<T>(type: PendingOperationType, homeContextId: string, payload: T): PendingOperationRecord<T> {
    const timestamp = AppClock.now();
    const operationId = `OP-${type.toUpperCase()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const correlationId = `CORR-${timestamp}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: PendingOperationRecord<T> = {
      operationId,
      correlationId,
      type,
      homeContextId,
      status: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
      payload,
    };

    this.records.set(operationId, record as PendingOperationRecord);
    this.notify();
    return record;
  }

  getOperation(operationId: string): PendingOperationRecord | undefined {
    return this.records.get(operationId);
  }

  getOperationsForHome(homeContextId: string): PendingOperationRecord[] {
    return Array.from(this.records.values()).filter((r) => r.homeContextId === homeContextId);
  }

  getActiveOperations(): PendingOperationRecord[] {
    return Array.from(this.records.values()).filter((r) => r.status === 'pending' || r.status === 'processing');
  }

  updateStatus(operationId: string, status: PendingOperationStatus, errorMessage?: string | undefined): PendingOperationRecord | undefined {
    const record = this.records.get(operationId);
    if (!record) return undefined;

    const updated: PendingOperationRecord = {
      ...record,
      status,
      errorMessage,
      updatedAt: AppClock.now(),
    };

    this.records.set(operationId, updated);
    this.notify();
    return updated;
  }

  clearCompleted() {
    for (const [id, rec] of this.records.entries()) {
      if (rec.status === 'confirmed' || rec.status === 'cancelled') {
        this.records.delete(id);
      }
    }
    this.notify();
  }

  subscribe(listener: OperationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const list = Array.from(this.records.values());
    this.listeners.forEach((l) => l(list));
  }
}

export const PendingOperationStore = new PendingOperationStoreEngine();
export default PendingOperationStore;
