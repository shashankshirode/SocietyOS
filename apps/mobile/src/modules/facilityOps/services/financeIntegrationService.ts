import {
  FinancePayableHandoffResult,
  FinancePayableRequest,
} from '../../../shared/types/financePayable.types';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { InvoiceMatchingService } from './invoiceMatchingService';

export class FinanceIntegrationService {
  private static instance: FinanceIntegrationService;
  private payableRequests: Map<string, FinancePayableRequest> = new Map();
  private idempotencyRegistry: Map<string, string> = new Map();

  private constructor() {}

  public static getInstance(): FinanceIntegrationService {
    if (!FinanceIntegrationService.instance) {
      FinanceIntegrationService.instance = new FinanceIntegrationService();
    }
    return FinanceIntegrationService.instance;
  }

  public createPayableHandoff(
    invoiceId: string,
    clientOperationId: string,
    actor: FacilityOperationsActor
  ): FinancePayableHandoffResult {
    if (!actor.hasPermission('AUTHORIZE_PAYMENTS')) {
      throw new Error('ACCESS_DENIED: Actor lacks AUTHORIZE_PAYMENTS permission');
    }

    if (this.idempotencyRegistry.has(clientOperationId)) {
      const existingPayableId = this.idempotencyRegistry.get(clientOperationId);
      if (existingPayableId && this.payableRequests.has(existingPayableId)) {
        const existing = this.payableRequests.get(existingPayableId)!;
        return {
          success: true,
          payableRequestId: existing.id,
          status: existing.status,
          ...(existing.financeReferenceId ? { financeReferenceId: existing.financeReferenceId } : {}),
        };
      }
    }

    const invoiceService = InvoiceMatchingService.getInstance();
    const invoice = invoiceService.getInvoice(invoiceId);
    if (!invoice) {
      throw new Error('INVOICE_NOT_FOUND');
    }

    if (invoice.status !== 'APPROVED') {
      throw new Error(
        `INVOICE_NOT_APPROVED: Cannot create payable for invoice in status ${invoice.status}`
      );
    }

    const payableId = `pay-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const financeReferenceId = `FIN-AP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const payableRequest: FinancePayableRequest = {
      id: payableId,
      invoiceId: invoice.id,
      vendorId: invoice.vendorId,
      vendorName: invoice.vendorName,
      amount: invoice.totalAmount,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      sourceOperationId: clientOperationId,
      status: 'ACCEPTED',
      financeReferenceId,
      createdAt: new Date().toISOString(),
    };

    this.payableRequests.set(payableId, payableRequest);
    this.idempotencyRegistry.set(clientOperationId, payableId);

    invoice.status = 'PAYABLE_CREATED';
    invoice.financePayableReferenceId = financeReferenceId;

    return {
      success: true,
      payableRequestId: payableId,
      financeReferenceId,
      status: 'ACCEPTED',
    };
  }

  public getPayableRequest(id: string): FinancePayableRequest | null {
    return this.payableRequests.get(id) ?? null;
  }

  public getPayableRequests(): FinancePayableRequest[] {
    return Array.from(this.payableRequests.values());
  }

  public recordPaymentSettlement(
    payableRequestId: string,
    settledAt: string
  ): FinancePayableRequest {
    const payable = this.payableRequests.get(payableRequestId);
    if (!payable) {
      throw new Error('PAYABLE_REQUEST_NOT_FOUND');
    }

    const updated: FinancePayableRequest = {
      ...payable,
      status: 'PAID',
      settledAt,
    };
    this.payableRequests.set(payable.id, updated);

    const invoiceService = InvoiceMatchingService.getInstance();
    const invoice = invoiceService.getInvoice(payable.invoiceId);
    if (invoice) {
      invoice.status = 'PAID';
    }

    return updated;
  }

  public clear(): void {
    this.payableRequests.clear();
    this.idempotencyRegistry.clear();
  }
}
