import { ProcurementService } from '../services/procurementService';
import { InvoiceMatchingService } from '../services/invoiceMatchingService';
import { FinanceIntegrationService } from '../services/financeIntegrationService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Procurement, PO Revisions and Three-Way Match', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });
  const committee = createActorFromSession({
    userId: 'usr-comm-1',
    name: 'Treasurer',
    societyId: 'soc-1',
    role: 'TREASURER',
  });

  const procService = ProcurementService.getInstance();
  const invService = InvoiceMatchingService.getInstance();
  const finService = FinanceIntegrationService.getInstance();

  beforeEach(() => {
    procService.clear();
    invService.clear();
    finService.clear();
  });

  test('creates PO, revises it with version increment, and handles damaged delivery', () => {
    const pr = procService.submitPurchaseRequest(
      {
        itemOrCategory: 'Lighting',
        requiredQuantity: 100,
        reason: 'LED conversion',
        estimatedAmount: 20000,
        urgency: 'MEDIUM',
      },
      manager
    );
    procService.approvePurchaseRequest(pr.id, 'Approved by committee', committee);

    const po1 = procService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-led',
        vendorName: 'Philips Lighting',
        lines: [{ itemId: 'item-led-9w', itemName: '9W LED Bulb', quantity: 100, unitPrice: 200 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'Store',
        terms: 'Net 30',
      },
      manager
    );
    expect(po1.version).toBe(1);

    const po2 = procService.revisePurchaseOrder(
      po1.id,
      [{ itemId: 'item-led-9w', itemName: '9W LED Bulb', quantity: 120, unitPrice: 190 }],
      manager
    );
    expect(po2.version).toBe(2);
    expect(po2.previousVersionId).toBe(po1.id);
    expect(po2.totalAmount).toBe(120 * 190);

    const gr = procService.receiveGoods(
      {
        poId: po2.id,
        lines: [
          {
            poLineId: po2.lines[0].id,
            deliveredQuantity: 90,
            acceptedQuantity: 85,
            rejectedQuantity: 5,
            rejectionReason: 'Broken glass on 5 units during transit',
          },
        ],
      },
      manager
    );

    expect(gr.lines[0].deliveredQuantity).toBe(90);
    expect(gr.lines[0].acceptedQuantity).toBe(85);
    expect(gr.lines[0].rejectedQuantity).toBe(5);

    const poAfterReceipt = procService.getPurchaseOrder(po2.id)!;
    expect(poAfterReceipt.status).toBe('PARTIALLY_RECEIVED');
    expect(poAfterReceipt.lines[0].acceptedQuantity).toBe(85);
  });

  test('resolves match exception and completes finance handoff', () => {
    const pr = procService.submitPurchaseRequest(
      {
        itemOrCategory: 'Filter Media',
        requiredQuantity: 50,
        reason: 'Water treatment',
        estimatedAmount: 25000,
        urgency: 'HIGH',
      },
      manager
    );
    procService.approvePurchaseRequest(pr.id, 'Approved', committee);

    const po = procService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-filters',
        vendorName: 'FilterCorp',
        lines: [{ itemId: 'item-carbon', itemName: 'Activated Carbon 25kg', quantity: 50, unitPrice: 500 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'WTP Shed',
        terms: 'Net 30',
      },
      manager
    );

    procService.receiveGoods(
      {
        poId: po.id,
        lines: [{ poLineId: po.lines[0].id, deliveredQuantity: 50, acceptedQuantity: 50, rejectedQuantity: 0 }],
      },
      manager
    );

    const invoice = invService.registerInvoice(
      {
        invoiceNumber: 'INV-FC-999',
        vendorId: 'vnd-filters',
        vendorName: 'FilterCorp',
        poId: po.id,
        lines: [{ description: 'Activated Carbon 25kg', quantity: 50, unitPrice: 520, totalPrice: 26000, poLineId: po.lines[0].id }],
        subtotal: 26000,
        taxAmount: 4680,
        totalAmount: 30680,
        invoiceDate: '2026-04-02',
        dueDate: '2026-05-02',
      },
      manager
    );

    const matchResult = invService.performThreeWayMatch(invoice.id);
    expect(matchResult.status).toBe('EXCEPTION');
    expect(matchResult.exceptions[0].type).toBe('PRICE_MISMATCH');

    invService.resolveMatchException(
      invoice.id,
      'PRICE_MISMATCH',
      'Vendor freight rate increase approved per amendment letter',
      committee
    );

    const approved = invService.approveInvoice(invoice.id, committee);
    expect(approved.status).toBe('APPROVED');

    const handoff = finService.createPayableHandoff(invoice.id, 'client-op-payable-100', committee);
    expect(handoff.success).toBe(true);
    expect(handoff.status).toBe('ACCEPTED');
  });
});
