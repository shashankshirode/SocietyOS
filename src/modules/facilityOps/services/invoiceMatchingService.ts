import {
  GoodsReceipt,
  InvoiceMatchResult,
  MatchException,
  MatchTolerancePolicy,
  PurchaseOrder,
  VendorInvoice,
} from '../../../shared/types/inventory.types';
import { WorkOrder } from '../../../shared/types/workOrder.types';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { ProcurementService } from './procurementService';
import { WorkOrderService } from './workOrderService';

export class InvoiceMatchingService {
  private static instance: InvoiceMatchingService;
  private invoices: Map<string, VendorInvoice> = new Map();
  private defaultTolerance: MatchTolerancePolicy = {
    policyVersion: '1.0.0',
    priceTolerancePercent: 2.0,
    taxTolerancePercent: 1.0,
    quantityTolerancePercent: 0.0,
    effectiveFrom: '2026-01-01',
  };

  private constructor() {}

  public static getInstance(): InvoiceMatchingService {
    if (!InvoiceMatchingService.instance) {
      InvoiceMatchingService.instance = new InvoiceMatchingService();
    }
    return InvoiceMatchingService.instance;
  }

  public registerInvoice(
    input: {
      invoiceNumber: string;
      vendorId: string;
      vendorName: string;
      poId?: string;
      workOrderId?: string;
      lines: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        poLineId?: string;
      }>;
      subtotal: number;
      taxAmount: number;
      totalAmount: number;
      currency?: string;
      invoiceDate: string;
      dueDate: string;
      documentVaultId?: string;
      clientOperationId?: string;
    },
    actor: FacilityOperationsActor
  ): VendorInvoice {
    if (!actor.hasPermission('APPROVE_INVOICE') && !actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to register vendor invoices');
    }

    const isDuplicate = Array.from(this.invoices.values()).some(
      (inv) => inv.vendorId === input.vendorId && inv.invoiceNumber.toLowerCase() === input.invoiceNumber.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error(`INVOICE_DUPLICATE: Invoice ${input.invoiceNumber} already exists for vendor ${input.vendorId}`);
    }

    const invoiceId = input.clientOperationId ?? `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const invoice: VendorInvoice = {
      ...input,
      id: invoiceId,
      currency: input.currency ?? 'INR',
      status: 'RECEIVED',
    };

    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  public performThreeWayMatch(
    invoiceId: string,
    tolerancePolicy?: MatchTolerancePolicy
  ): InvoiceMatchResult {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error('INVOICE_NOT_FOUND');
    }

    if (!invoice.poId) {
      throw new Error('PO_ID_REQUIRED_FOR_THREE_WAY_MATCH');
    }

    const procurementService = ProcurementService.getInstance();
    const po = procurementService.getPurchaseOrder(invoice.poId);
    if (!po) {
      const exception: MatchException = {
        type: 'PO_NOT_FOUND',
        expected: invoice.poId,
        actual: 'NOT_FOUND',
        variance: 0,
        tolerance: 0,
        reason: `Referenced PO ${invoice.poId} does not exist`,
        resolved: false,
      };
      return this.recordMatchResult(invoice, [exception], 'THREE_WAY_GOODS', tolerancePolicy);
    }

    if (po.vendorId !== invoice.vendorId) {
      const exception: MatchException = {
        type: 'VENDOR_MISMATCH',
        expected: po.vendorId,
        actual: invoice.vendorId,
        variance: 0,
        tolerance: 0,
        reason: `PO vendor ${po.vendorId} does not match invoice vendor ${invoice.vendorId}`,
        resolved: false,
      };
      return this.recordMatchResult(invoice, [exception], 'THREE_WAY_GOODS', tolerancePolicy, po.id);
    }

    const goodsReceipts = procurementService
      .getGoodsReceipts()
      .filter((gr) => gr.poId === po.id);

    const exceptions: MatchException[] = [];
    const policy = tolerancePolicy ?? this.defaultTolerance;

    let totalAcceptedQuantity = 0;
    for (const gr of goodsReceipts) {
      for (const line of gr.lines) {
        totalAcceptedQuantity += line.acceptedQuantity;
      }
    }

    const totalInvoicedQuantity = invoice.lines.reduce((sum, l) => sum + l.quantity, 0);

    if (totalInvoicedQuantity > totalAcceptedQuantity) {
      const variance = totalInvoicedQuantity - totalAcceptedQuantity;
      exceptions.push({
        type: 'QUANTITY_MISMATCH',
        expected: totalAcceptedQuantity,
        actual: totalInvoicedQuantity,
        variance,
        tolerance: policy.quantityTolerancePercent,
        reason: `Invoiced quantity (${totalInvoicedQuantity}) exceeds goods receipt accepted quantity (${totalAcceptedQuantity})`,
        resolved: false,
      });
    }

    for (const invLine of invoice.lines) {
      const matchingPoLine = po.lines.find(
        (pol) => pol.id === invLine.poLineId || pol.itemName.toLowerCase() === invLine.description.toLowerCase()
      );
      if (matchingPoLine) {
        const priceVariancePercent =
          Math.abs((invLine.unitPrice - matchingPoLine.unitPrice) / matchingPoLine.unitPrice) * 100;
        if (priceVariancePercent > policy.priceTolerancePercent) {
          exceptions.push({
            type: 'PRICE_MISMATCH',
            expected: matchingPoLine.unitPrice,
            actual: invLine.unitPrice,
            variance: invLine.unitPrice - matchingPoLine.unitPrice,
            tolerance: policy.priceTolerancePercent,
            reason: `Line "${invLine.description}" price variance ${priceVariancePercent.toFixed(1)}% exceeds tolerance ${policy.priceTolerancePercent}%`,
            resolved: false,
          });
        }
      }
    }

    const latestGr = goodsReceipts[goodsReceipts.length - 1];
    return this.recordMatchResult(
      invoice,
      exceptions,
      'THREE_WAY_GOODS',
      policy,
      po.id,
      latestGr?.id
    );
  }

  public performTwoWayServiceMatch(
    invoiceId: string,
    tolerancePolicy?: MatchTolerancePolicy
  ): InvoiceMatchResult {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error('INVOICE_NOT_FOUND');
    }

    if (!invoice.workOrderId) {
      throw new Error('WORK_ORDER_ID_REQUIRED_FOR_SERVICE_MATCH');
    }

    const workOrderService = WorkOrderService.getInstance();
    const workOrder = workOrderService.getWorkOrder(invoice.workOrderId);
    if (!workOrder) {
      throw new Error('WORK_ORDER_NOT_FOUND');
    }

    const exceptions: MatchException[] = [];
    const policy = tolerancePolicy ?? this.defaultTolerance;

    if (workOrder.status !== 'VERIFIED' && workOrder.status !== 'CLOSED') {
      exceptions.push({
        type: 'UNVERIFIED_SERVICE',
        expected: 'VERIFIED',
        actual: workOrder.status,
        variance: 0,
        tolerance: 0,
        reason: `Service work order ${workOrder.id} is in status ${workOrder.status}, not yet verified by Society`,
        resolved: false,
      });
    }

    if (workOrder.assignedVendorId && workOrder.assignedVendorId !== invoice.vendorId) {
      exceptions.push({
        type: 'VENDOR_MISMATCH',
        expected: workOrder.assignedVendorId,
        actual: invoice.vendorId,
        variance: 0,
        tolerance: 0,
        reason: `Work order vendor ${workOrder.assignedVendorId} does not match invoice vendor ${invoice.vendorId}`,
        resolved: false,
      });
    }

    return this.recordMatchResult(
      invoice,
      exceptions,
      'TWO_WAY_SERVICE',
      policy,
      undefined,
      undefined,
      workOrder.id
    );
  }

  public resolveMatchException(
    invoiceId: string,
    exceptionType: string,
    resolutionReason: string,
    actor: FacilityOperationsActor
  ): VendorInvoice {
    if (!actor.hasPermission('APPROVE_INVOICE')) {
      throw new Error('ACCESS_DENIED: Actor lacks APPROVE_INVOICE permission');
    }

    const invoice = this.invoices.get(invoiceId);
    if (!invoice || !invoice.matchResult) {
      throw new Error('INVOICE_OR_MATCH_RESULT_NOT_FOUND');
    }

    const targetEx = invoice.matchResult.exceptions.find(
      (e) => e.type === exceptionType && !e.resolved
    );
    if (!targetEx) {
      throw new Error(`EXCEPTION_NOT_FOUND_OR_ALREADY_RESOLVED: ${exceptionType}`);
    }

    targetEx.resolved = true;
    targetEx.resolutionReason = resolutionReason;
    targetEx.resolvedBy = actor.name;
    targetEx.resolvedAt = new Date().toISOString();

    const allResolved = invoice.matchResult.exceptions.every((e) => e.resolved);
    const newStatus = allResolved ? 'MATCHED' : 'EXCEPTION';

    const updatedInvoice: VendorInvoice = {
      ...invoice,
      status: newStatus,
      matchResult: {
        ...invoice.matchResult,
        status: allResolved ? 'MATCHED' : 'EXCEPTION',
      },
    };

    this.invoices.set(invoice.id, updatedInvoice);
    return updatedInvoice;
  }

  public approveInvoice(
    invoiceId: string,
    actor: FacilityOperationsActor
  ): VendorInvoice {
    if (!actor.hasPermission('APPROVE_INVOICE')) {
      throw new Error('ACCESS_DENIED: Actor lacks APPROVE_INVOICE permission');
    }

    const invoice = this.invoices.get(invoiceId);
    if (!invoice) {
      throw new Error('INVOICE_NOT_FOUND');
    }

    if (invoice.status === 'EXCEPTION') {
      throw new Error(
        'INVOICE_MATCH_EXCEPTION: Cannot approve invoice with unresolved match exceptions'
      );
    }

    if (invoice.status !== 'MATCHED') {
      throw new Error(
        `INVOICE_NOT_READY_FOR_APPROVAL: Invoice status is ${invoice.status}, must be MATCHED`
      );
    }

    const approvedInvoice: VendorInvoice = {
      ...invoice,
      status: 'APPROVED',
      approvedBy: actor.name,
      approvedAt: new Date().toISOString(),
    };

    this.invoices.set(invoice.id, approvedInvoice);
    return approvedInvoice;
  }

  public getInvoice(id: string): VendorInvoice | null {
    return this.invoices.get(id) ?? null;
  }

  public getInvoices(): VendorInvoice[] {
    return Array.from(this.invoices.values());
  }

  public clear(): void {
    this.invoices.clear();
  }

  private recordMatchResult(
    invoice: VendorInvoice,
    exceptions: MatchException[],
    matchType: 'THREE_WAY_GOODS' | 'TWO_WAY_SERVICE',
    tolerancePolicy?: MatchTolerancePolicy,
    poId?: string,
    goodsReceiptId?: string,
    workOrderId?: string
  ): InvoiceMatchResult {
    const hasUnresolved = exceptions.some((e) => !e.resolved);
    const status = hasUnresolved ? 'EXCEPTION' : 'MATCHED';

    const matchResult: InvoiceMatchResult = {
      status,
      matchType,
      exceptions,
      toleranceApplied: tolerancePolicy ?? this.defaultTolerance,
      evaluatedAt: new Date().toISOString(),
      ...(poId ? { poId } : {}),
      ...(goodsReceiptId ? { goodsReceiptId } : {}),
      ...(workOrderId ? { workOrderId } : {}),
    };

    const updatedInvoice: VendorInvoice = {
      ...invoice,
      status,
      matchResult,
    };

    this.invoices.set(invoice.id, updatedInvoice);
    return matchResult;
  }
}
