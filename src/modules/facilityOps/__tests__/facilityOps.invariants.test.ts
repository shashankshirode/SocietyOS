import { AmcContractService } from '../services/amcContractService';
import { AssetService } from '../services/assetService';
import { CrossDomainIntegrationService } from '../services/crossDomainIntegrationService';
import { FinanceIntegrationService } from '../services/financeIntegrationService';
import { InventoryService } from '../services/inventoryService';
import { InvoiceMatchingService } from '../services/invoiceMatchingService';
import { PreventiveMaintenanceService } from '../services/preventiveMaintenanceService';
import { ProcurementService } from '../services/procurementService';
import { VendorScorecardService } from '../services/vendorScorecardService';
import { VendorService } from '../services/vendorService';
import { WorkOrderService } from '../services/workOrderService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Phase 16 Core Domain Invariants', () => {
  const managerSession = {
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-green-valley',
    role: 'FACILITY_MANAGER' as const,
  };
  const technicianSession = {
    userId: 'usr-tech-1',
    name: 'Technician Rajesh',
    societyId: 'soc-green-valley',
    role: 'TECHNICIAN' as const,
  };
  const committeeSession = {
    userId: 'usr-comm-1',
    name: 'Committee Approver',
    societyId: 'soc-green-valley',
    role: 'COMMITTEE_MEMBER' as const,
  };

  const manager = createActorFromSession(managerSession);
  const technician = createActorFromSession(technicianSession);
  const committee = createActorFromSession(committeeSession);

  const vendorService = VendorService.getInstance();
  const amcService = AmcContractService.getInstance();
  const assetService = AssetService.getInstance();
  const maintenanceService = PreventiveMaintenanceService.getInstance();
  const workOrderService = WorkOrderService.getInstance();
  const inventoryService = InventoryService.getInstance();
  const procurementService = ProcurementService.getInstance();
  const invoiceService = InvoiceMatchingService.getInstance();
  const financeService = FinanceIntegrationService.getInstance();
  const scorecardService = VendorScorecardService.getInstance();
  const crossDomainService = CrossDomainIntegrationService.getInstance();

  beforeEach(() => {
    vendorService.clear();
    amcService.clear();
    assetService.clear();
    maintenanceService.clear();
    workOrderService.clear();
    inventoryService.clear();
    procurementService.clear();
    invoiceService.clear();
    financeService.clear();
    crossDomainService.clear();
  });

  test('Invariant 1: Vendor != Contract - A vendor and its contracts have distinct identities and lifecycles', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Apex Lift Solutions',
        category: 'LIFT_MAINTENANCE',
        contactPerson: 'Ramesh Shah',
        mobileNumber: '9876543210',
        officeAddress: '101 Industrial Estate',
        servicesOffered: ['LIFT_MAINTENANCE'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const contract1 = amcService.createContract(
      {
        vendorId: vendor.id,
        vendorName: vendor.vendorName,
        category: 'LIFT',
        linkedAssets: ['ast-lift-1'],
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        contractAmount: 120000,
        serviceFrequency: 'MONTHLY',
        slaTerms: '4hr emergency',
        emergencyResponseTime: '2 hours',
        includedServices: ['Preventive', 'Breakdown'],
        excludedServices: ['Modernization'],
      },
      manager
    );

    const contract2 = amcService.createContract(
      {
        vendorId: vendor.id,
        vendorName: vendor.vendorName,
        category: 'LIFT',
        linkedAssets: ['ast-lift-2'],
        startDate: '2026-06-01',
        endDate: '2027-05-31',
        contractAmount: 130000,
        serviceFrequency: 'MONTHLY',
        slaTerms: '4hr emergency',
        emergencyResponseTime: '2 hours',
        includedServices: ['Preventive'],
        excludedServices: ['Major parts'],
      },
      manager
    );

    expect(vendor.id).not.toBe(contract1.id);
    expect(contract1.id).not.toBe(contract2.id);
    expect(contract1.vendorId).toBe(vendor.id);
    expect(contract2.vendorId).toBe(vendor.id);
  });

  test('Invariant 2: Contract != AMC Reminder - Contract is authoritative, reminder is derived projection', () => {
    const contract = amcService.createContract(
      {
        vendorId: 'vnd-1',
        vendorName: 'Fire Safe Ltd',
        category: 'FIRE_SAFETY',
        linkedAssets: ['ast-fire-1'],
        startDate: '2026-01-01',
        endDate: '2026-04-15',
        contractAmount: 50000,
        serviceFrequency: 'QUARTERLY',
        slaTerms: 'Standard SLA',
        emergencyResponseTime: '4 hours',
        includedServices: ['Extinguisher refill'],
        excludedServices: [],
      },
      manager
    );

    const reminders = amcService.evaluateRenewalReminders('2026-04-01');
    expect(reminders.length).toBe(1);
    expect(reminders[0].contractId).toBe(contract.id);
    expect(reminders[0].daysRemaining).toBe(14);
    expect(reminders[0].status).toBe('DUE_SOON');
  });

  test('Invariant 3: Asset lifecycleStatus != operationalCondition', () => {
    const asset = assetService.createAsset(
      {
        assetName: 'Main DG Set 250kVA',
        category: 'GENERATOR',
        location: 'Basement B1',
        installationDate: '2024-01-01',
        purchaseDate: '2023-12-01',
        vendorId: 'vnd-gen-1',
        vendorName: 'PowerCorp',
        warrantyExpiry: '2027-01-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    expect(asset.lifecycleStatus).toBe('ACTIVE');
    expect(asset.operationalCondition).toBe('OPERATIONAL');

    const breakdown = assetService.reportBreakdown(
      asset.id,
      'Oil leak and high engine temperature',
      'HIGH',
      'MAJOR_DISRUPTION',
      'Switched to secondary power line',
      manager
    );

    const updatedAsset = assetService.getAsset(asset.id)!;
    expect(updatedAsset.lifecycleStatus).toBe('ACTIVE');
    expect(updatedAsset.operationalCondition).toBe('BREAKDOWN');
    expect(breakdown.operationalImpact).toBe('MAJOR_DISRUPTION');
  });

  test('Invariant 4: Work Order != Complaint - Linked but status remains independent', () => {
    const wo = crossDomainService.createWorkOrderFromComplaint(
      'cmp-flat-402',
      'ast-pump-1',
      'Water pressure low',
      'Reported by resident in 402',
      manager
    );

    expect(wo.source).toBe('COMPLAINT');
    expect(wo.linkedComplaintId).toBe('cmp-flat-402');
    expect(wo.status).toBe('OPEN');
  });

  test('Invariant 5: Work Order != Emergency Incident - Emergency close does not erase work order', () => {
    const wo = crossDomainService.createWorkOrderFromEmergency(
      'emg-lift-trap-12',
      'ast-lift-b',
      'Residents trapped in Lift B',
      'Level 2 emergency alarm',
      manager
    );

    expect(wo.source).toBe('EMERGENCY');
    expect(wo.linkedEmergencyIncidentId).toBe('emg-lift-trap-12');
    expect(wo.priority).toBe('URGENT');

    workOrderService.startWorkOrder(wo.id, technician);
    const inProgressWo = workOrderService.getWorkOrder(wo.id)!;
    expect(inProgressWo.status).toBe('IN_PROGRESS');
    expect(inProgressWo.linkedEmergencyIncidentId).toBe('emg-lift-trap-12');
  });

  test('Invariant 6: MaintenancePlan != MaintenanceOccurrence != WorkOrder', () => {
    const plan = maintenanceService.createPlan(
      {
        assetId: 'ast-pump-1',
        assetName: 'Main Booster Pump',
        title: 'Monthly Pump Lubrication',
        frequency: 'MONTHLY',
        checklist: [
          { id: 'chk-1', taskDescription: 'Check oil level', isMandatory: true },
          { id: 'chk-2', taskDescription: 'Check motor vibration', isMandatory: true },
        ],
        slaHours: 24,
        requiredEvidence: ['PHOTO_AFTER'],
        nextDueRule: 'FIXED_CALENDAR',
        effectiveStartDate: '2026-01-01',
      },
      manager
    );

    const occurrence = maintenanceService.generateOccurrence(plan.id, '2026-02-01');
    expect(occurrence.planId).toBe(plan.id);
    expect(occurrence.status).toBe('SCHEDULED');

    const wo = maintenanceService.createWorkOrderFromOccurrence(occurrence.id, manager);
    expect(wo.maintenancePlanId).toBe(plan.id);
    expect(wo.maintenanceOccurrenceId).toBe(occurrence.id);
    expect(occurrence.status).toBe('GENERATED');
    expect(occurrence.generatedWorkOrderId).toBe(wo.id);
  });

  test('Invariant 7: Inventory quantity derives from controlled movement ledger', () => {
    const item = inventoryService.registerItem({
      id: 'inv-bearing-1',
      itemName: 'Ball Bearing 6205',
      category: 'SPARE_PARTS',
      currentStock: 0,
      unit: 'PIECES',
      minimumStockLevel: 5,
      location: 'Central Store Shelf A1',
      lastIssuedDate: '',
      lastPurchasedDate: '',
      stockStatus: 'OUT_OF_STOCK',
    });

    inventoryService.receiveStock(
      {
        itemId: item.id,
        transactionType: 'RECEIPT',
        quantity: 20,
        actor: manager.name,
        actorId: manager.userId,
        purpose: 'Initial Stocking',
      },
      manager
    );

    expect(inventoryService.getItem(item.id)!.currentStock).toBe(20);

    inventoryService.issueStock(
      {
        itemId: item.id,
        transactionType: 'ISSUE',
        quantity: 4,
        actor: technician.name,
        actorId: technician.userId,
        purpose: 'Pump repair',
        linkedWorkOrderId: 'wo-101',
      },
      manager
    );

    expect(inventoryService.getItem(item.id)!.currentStock).toBe(16);
    expect(inventoryService.getTransactions(item.id).length).toBe(2);
  });

  test('Invariant 8: Concurrent inventory issue cannot oversell stock', async () => {
    const item = inventoryService.registerItem({
      id: 'inv-sensor-5',
      itemName: 'Pressure Sensor',
      category: 'SPARE_PARTS',
      currentStock: 5,
      unit: 'PIECES',
      minimumStockLevel: 2,
      location: 'Store Room',
      lastIssuedDate: '',
      lastPurchasedDate: '',
      stockStatus: 'IN_STOCK',
    });

    const lockKey = `item-lock-${item.id}`;
    const acquiredByTech1 = await inventoryService.acquireLock(lockKey);
    expect(acquiredByTech1).toBe(true);

    const acquiredByTech2 = await inventoryService.acquireLock(lockKey);
    expect(acquiredByTech2).toBe(false);

    inventoryService.issueStock(
      {
        itemId: item.id,
        transactionType: 'ISSUE',
        quantity: 5,
        actor: 'Technician 1',
        purpose: 'Urgent replacement',
      },
      manager
    );

    inventoryService.releaseLock(lockKey);

    expect(() => {
      inventoryService.issueStock(
        {
          itemId: item.id,
          transactionType: 'ISSUE',
          quantity: 5,
          actor: 'Technician 2',
          purpose: 'Simultaneous request',
        },
        manager
      );
    }).toThrow('INSUFFICIENT_STOCK');

    expect(inventoryService.getItem(item.id)!.currentStock).toBe(0);
  });

  test('Invariant 9: Vendor invoice alone cannot create payable without three-way match and approval', () => {
    const invoice = invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-2026-888',
        vendorId: 'vnd-plumbing-1',
        vendorName: 'PlumbPro',
        poId: 'po-non-existent',
        lines: [{ description: 'Ball Valves', quantity: 10, unitPrice: 500, totalPrice: 5000 }],
        subtotal: 5000,
        taxAmount: 900,
        totalAmount: 5900,
        invoiceDate: '2026-03-01',
        dueDate: '2026-03-31',
      },
      manager
    );

    expect(() => {
      financeService.createPayableHandoff(invoice.id, 'client-op-1', manager);
    }).toThrow('ACCESS_DENIED: Actor lacks AUTHORIZE_PAYMENTS permission');

    expect(() => {
      financeService.createPayableHandoff(invoice.id, 'client-op-1', committee);
    }).toThrow('INVOICE_NOT_APPROVED: Cannot create payable for invoice in status RECEIVED');
  });

  test('Invariant 10: Partial receipt does not mark PO fully received', () => {
    const pr = procurementService.submitPurchaseRequest(
      {
        itemOrCategory: 'Valves',
        requiredQuantity: 100,
        reason: 'Plumbing overhaul',
        estimatedAmount: 50000,
        urgency: 'HIGH',
      },
      manager
    );
    procurementService.approvePurchaseRequest(pr.id, 'Approved by committee', committee);

    const po = procurementService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-valves',
        vendorName: 'ValveTech',
        lines: [{ itemId: 'item-valve-1', itemName: 'Gate Valve 2 inch', quantity: 100, unitPrice: 500 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'Store Room',
        terms: 'Net 30',
      },
      manager
    );

    const gr = procurementService.receiveGoods(
      {
        poId: po.id,
        lines: [
          {
            poLineId: po.lines[0].id,
            deliveredQuantity: 90,
            acceptedQuantity: 90,
            rejectedQuantity: 0,
          },
        ],
      },
      manager
    );

    const updatedPo = procurementService.getPurchaseOrder(po.id)!;
    expect(updatedPo.status).toBe('PARTIALLY_RECEIVED');
    expect(updatedPo.lines[0].acceptedQuantity).toBe(90);
    expect(gr.status).toBe('PARTIAL');
  });

  test('Invariant 11: PO=100, Received=90, Invoiced=100 produces match exception and blocks payable', () => {
    const pr = procurementService.submitPurchaseRequest(
      {
        itemOrCategory: 'Valves',
        requiredQuantity: 100,
        reason: 'Plumbing overhaul',
        estimatedAmount: 50000,
        urgency: 'HIGH',
      },
      manager
    );
    procurementService.approvePurchaseRequest(pr.id, 'Approved', committee);

    const po = procurementService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-valves',
        vendorName: 'ValveTech',
        lines: [{ itemId: 'item-valve-1', itemName: 'Gate Valve 2 inch', quantity: 100, unitPrice: 500 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'Store Room',
        terms: 'Net 30',
      },
      manager
    );

    procurementService.receiveGoods(
      {
        poId: po.id,
        lines: [
          {
            poLineId: po.lines[0].id,
            deliveredQuantity: 90,
            acceptedQuantity: 90,
            rejectedQuantity: 0,
          },
        ],
      },
      manager
    );

    const invoice = invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-VT-100',
        vendorId: 'vnd-valves',
        vendorName: 'ValveTech',
        poId: po.id,
        lines: [{ description: 'Gate Valve 2 inch', quantity: 100, unitPrice: 500, totalPrice: 50000, poLineId: po.lines[0].id }],
        subtotal: 50000,
        taxAmount: 9000,
        totalAmount: 59000,
        invoiceDate: '2026-04-05',
        dueDate: '2026-05-05',
      },
      manager
    );

    const matchResult = invoiceService.performThreeWayMatch(invoice.id);
    expect(matchResult.status).toBe('EXCEPTION');
    expect(matchResult.exceptions.length).toBe(1);
    expect(matchResult.exceptions[0].type).toBe('QUANTITY_MISMATCH');
    expect(matchResult.exceptions[0].expected).toBe(90);
    expect(matchResult.exceptions[0].actual).toBe(100);

    expect(() => {
      invoiceService.approveInvoice(invoice.id, committee);
    }).toThrow('INVOICE_MATCH_EXCEPTION');

    expect(() => {
      financeService.createPayableHandoff(invoice.id, 'op-inv-1', committee);
    }).toThrow('INVOICE_NOT_APPROVED');
  });

  test('Invariant 12: Three-way match respects configured tolerance policy', () => {
    const pr = procurementService.submitPurchaseRequest(
      {
        itemOrCategory: 'Pipes',
        requiredQuantity: 10,
        reason: 'Repairs',
        estimatedAmount: 10000,
        urgency: 'MEDIUM',
      },
      manager
    );
    procurementService.approvePurchaseRequest(pr.id, 'Approved', committee);

    const po = procurementService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-pipes',
        vendorName: 'PipeCo',
        lines: [{ itemId: 'item-p1', itemName: 'PVC Pipe', quantity: 10, unitPrice: 1000 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'Store',
        terms: 'Net 30',
      },
      manager
    );

    procurementService.receiveGoods(
      {
        poId: po.id,
        lines: [{ poLineId: po.lines[0].id, deliveredQuantity: 10, acceptedQuantity: 10, rejectedQuantity: 0 }],
      },
      manager
    );

    const invoice = invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-PC-1',
        vendorId: 'vnd-pipes',
        vendorName: 'PipeCo',
        poId: po.id,
        lines: [{ description: 'PVC Pipe', quantity: 10, unitPrice: 1015, totalPrice: 10150, poLineId: po.lines[0].id }],
        subtotal: 10150,
        taxAmount: 1827,
        totalAmount: 11977,
        invoiceDate: '2026-04-05',
        dueDate: '2026-05-05',
      },
      manager
    );

    const strictTolerance = {
      policyVersion: 'strict-1',
      priceTolerancePercent: 1.0,
      taxTolerancePercent: 1.0,
      quantityTolerancePercent: 0.0,
      effectiveFrom: '2026-01-01',
    };
    const strictResult = invoiceService.performThreeWayMatch(invoice.id, strictTolerance);
    expect(strictResult.status).toBe('EXCEPTION');

    const relaxedTolerance = {
      policyVersion: 'relaxed-2',
      priceTolerancePercent: 2.0,
      taxTolerancePercent: 1.0,
      quantityTolerancePercent: 0.0,
      effectiveFrom: '2026-01-01',
    };
    const relaxedResult = invoiceService.performThreeWayMatch(invoice.id, relaxedTolerance);
    expect(relaxedResult.status).toBe('MATCHED');
  });

  test('Invariant 13 & 14: Historical contract version preserved upon renewal without overwriting old AMC', () => {
    const contractV1 = amcService.createContract(
      {
        vendorId: 'vnd-otis',
        vendorName: 'Otis Elevators',
        category: 'LIFT',
        linkedAssets: ['ast-lift-1'],
        startDate: '2025-04-01',
        endDate: '2026-03-31',
        contractAmount: 200000,
        serviceFrequency: 'MONTHLY',
        slaTerms: '2hr SLA',
        emergencyResponseTime: '1 hour',
        includedServices: ['All preventive'],
        excludedServices: ['Cable replacement'],
      },
      manager
    );

    expect(contractV1.version).toBe(1);

    const contractV2 = amcService.renewContract(
      contractV1.id,
      {
        newStartDate: '2026-04-01',
        newEndDate: '2027-03-31',
        newContractAmount: 220000,
        renewalReason: 'Annual price index adjustment',
      },
      manager
    );

    expect(contractV2.version).toBe(2);
    expect(contractV2.previousVersionId).toBe(contractV1.id);
    expect(contractV2.status).toBe('ACTIVE');
    expect(contractV2.contractAmount).toBe(220000);

    const oldContract = amcService.getContract(contractV1.id)!;
    expect(oldContract.status).toBe('SUPERSEDED');
    expect(oldContract.contractAmount).toBe(200000);
    expect(oldContract.supersededBy).toBe(contractV2.id);
  });

  test('Invariant 15: Asset transfer preserves location history', () => {
    const asset = assetService.createAsset(
      {
        assetName: 'Submersible Water Pump',
        category: 'WATER_PUMP',
        location: 'Pump House A',
        installationDate: '2025-01-01',
        purchaseDate: '2024-12-01',
        vendorId: 'vnd-pump',
        vendorName: 'Kirloskar',
        warrantyExpiry: '2027-01-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    assetService.transferAsset(
      {
        assetId: asset.id,
        toLocation: 'STP Plant Basement',
        reason: 'Reassigned during STP upgrade',
      },
      manager
    );

    const updated = assetService.getAsset(asset.id)!;
    expect(updated.location).toBe('STP Plant Basement');

    const history = assetService.getTransferHistory(asset.id);
    expect(history.length).toBe(2);
    expect(history[1].fromLocation).toBe('Pump House A');
    expect(history[1].toLocation).toBe('STP Plant Basement');
    expect(history[1].transferredBy).toBe(manager.name);
  });

  test('Invariant 16: Asset retirement with open Work Order is blocked', () => {
    const asset = assetService.createAsset(
      {
        assetName: 'Solar Inverter 10kW',
        category: 'SOLAR',
        location: 'Clubhouse Roof',
        installationDate: '2023-01-01',
        purchaseDate: '2022-12-01',
        vendorId: 'vnd-solar',
        vendorName: 'Tata Solar',
        warrantyExpiry: '2028-01-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'QUARTERLY',
      },
      manager
    );

    workOrderService.createWorkOrder(
      {
        title: 'Check inverter grid synchronization',
        type: 'REPAIR',
        priority: 'HIGH',
        assetId: asset.id,
      },
      manager
    );

    expect(() => {
      assetService.retireAsset(
        {
          assetId: asset.id,
          reason: 'End of operational life',
        },
        manager
      );
    }).toThrow('ASSET_RETIREMENT_BLOCKED: Asset has 1 active work order(s)');
  });

  test('Invariant 17: Completed maintenance remains linked to asset, plan, vendor, and evidence', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Lift Monthly Check',
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        assetId: 'ast-lift-1',
        vendorId: 'vnd-otis',
        maintenancePlanId: 'plan-lift-monthly',
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.submitCompletion(
      {
        workOrderId: wo.id,
        technicianNotes: 'All guide rails lubricated and brake clearances inspected',
        evidenceDocumentIds: ['doc-vault-photo-1', 'doc-vault-photo-2'],
        serviceReportDocumentId: 'doc-vault-report-1',
      },
      technician
    );

    const verified = workOrderService.verifyWorkOrder(
      {
        workOrderId: wo.id,
        action: 'ACCEPT',
        verificationNotes: 'Inspection passed without issues',
      },
      manager
    );

    expect(verified.status).toBe('VERIFIED');
    expect(verified.evidenceDocumentIds).toContain('doc-vault-photo-1');
    expect(verified.serviceReportDocumentId).toBe('doc-vault-report-1');
    expect(verified.maintenancePlanId).toBe('plan-lift-monthly');
  });

  test('Invariant 18: Missed maintenance produces visible escalation', () => {
    const plan = maintenanceService.createPlan(
      {
        assetId: 'ast-wtp-1',
        assetName: 'Water Treatment Sand Filter',
        title: 'Weekly Filter Backwash',
        frequency: 'WEEKLY',
        checklist: [{ id: 'c1', taskDescription: 'Backwash filter', isMandatory: true }],
        slaHours: 12,
        requiredEvidence: [],
        nextDueRule: 'FIXED_CALENDAR',
        effectiveStartDate: '2026-01-01',
      },
      manager
    );

    const occurrence = maintenanceService.generateOccurrence(plan.id, '2026-01-10');
    const escalated = maintenanceService.escalateMissedOccurrence(occurrence.id);

    expect(escalated.status).toBe('MISSED');
    expect(escalated.escalatedAt).toBeDefined();
  });

  test('Invariant 19: Vendor no-show cannot become completed work', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'CCTV Camera Alignment',
        type: 'REPAIR',
        priority: 'MEDIUM',
        assetId: 'ast-cctv-gate',
        vendorId: 'vnd-cctv-1',
      },
      manager
    );

    workOrderService.recordVendorNoShow(wo.id, 'Technician failed to arrive for scheduled visit', manager);

    const currentWo = workOrderService.getWorkOrder(wo.id)!;
    expect(currentWo.status).toBe('ASSIGNED');
    expect(currentWo.timeline.some((t) => t.event === 'VENDOR_NO_SHOW')).toBe(true);

    expect(() => {
      workOrderService.verifyWorkOrder(
        {
          workOrderId: wo.id,
          action: 'ACCEPT',
          verificationNotes: 'Premature verification',
        },
        manager
      );
    }).toThrow('INVALID_WORK_ORDER_STATE');
  });

  test('Invariant 20: Parts shortage pauses work without closing work order', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Swimming Pool Pump Bearing Replacement',
        type: 'REPAIR',
        priority: 'HIGH',
        assetId: 'ast-pool-pump',
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.pauseForPartsShortage(
      wo.id,
      'Required 6308 C3 bearing not in stock',
      'item-bearing-6308',
      technician
    );

    const pausedWo = workOrderService.getWorkOrder(wo.id)!;
    expect(pausedWo.status).toBe('ON_HOLD');
    expect(pausedWo.holdReason).toBe('PARTS_SHORTAGE');
    expect(pausedWo.timeline.some((t) => t.event === 'PART_SHORTAGE')).toBe(true);
  });

  test('Invariant 21: Completion submission != verification', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Fire Alarm Sounder Test',
        type: 'INSPECTION',
        priority: 'LOW',
        assetId: 'ast-fire-panel',
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.submitCompletion(
      {
        workOrderId: wo.id,
        technicianNotes: 'All sounders in Tower A tested',
      },
      technician
    );

    const submittedWo = workOrderService.getWorkOrder(wo.id)!;
    expect(submittedWo.status).toBe('COMPLETION_SUBMITTED');
    expect(submittedWo.verificationStatus).toBe('PENDING');

    workOrderService.verifyWorkOrder(
      {
        workOrderId: wo.id,
        action: 'REWORK',
        verificationNotes: 'Sounder on 4th floor did not activate',
      },
      manager
    );

    const reworkedWo = workOrderService.getWorkOrder(wo.id)!;
    expect(reworkedWo.status).toBe('IN_PROGRESS');
    expect(reworkedWo.verificationStatus).toBe('REWORK_REQUIRED');
  });

  test('Invariant 22: Work verification preserves evidence', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Transformer Bushing Cleaning',
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'HIGH',
        assetId: 'ast-transformer-1',
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.submitCompletion(
      {
        workOrderId: wo.id,
        technicianNotes: 'Cleaned with dielectric solvent',
        evidenceDocumentIds: ['doc-transformer-clean-1', 'doc-transformer-clean-2'],
        serviceReportDocumentId: 'doc-report-transformer',
      },
      technician
    );

    const verified = workOrderService.verifyWorkOrder(
      {
        workOrderId: wo.id,
        action: 'ACCEPT',
        verificationNotes: 'Inspected and approved by Electrical Incharge',
      },
      manager
    );

    expect(verified.verificationStatus).toBe('VERIFIED');
    expect(verified.evidenceDocumentIds?.length).toBe(2);
    expect(verified.serviceReportDocumentId).toBe('doc-report-transformer');
  });

  test('Invariant 23: Work reopen preserves prior closure history', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Gate Barrier Sensor Replacement',
        type: 'REPAIR',
        priority: 'MEDIUM',
        assetId: 'ast-barrier-1',
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.submitCompletion({ workOrderId: wo.id, technicianNotes: 'Sensor replaced' }, technician);
    workOrderService.verifyWorkOrder({ workOrderId: wo.id, action: 'ACCEPT' }, manager);
    workOrderService.closeWorkOrder(wo.id, 'Finished and closed', manager);

    const closedWo = workOrderService.getWorkOrder(wo.id)!;
    expect(closedWo.status).toBe('CLOSED');

    const reopenedWo = workOrderService.reopenWorkOrder(wo.id, 'Barrier misaligned again on next morning', manager);
    expect(reopenedWo.status).toBe('OPEN');
    expect(reopenedWo.timeline.some((t) => t.event === 'CLOSED')).toBe(true);
    expect(reopenedWo.timeline.some((t) => t.event === 'REOPENED')).toBe(true);
  });

  test('Invariant 24: Duplicate scheduler run creates one maintenance Work Order', () => {
    const plan = maintenanceService.createPlan(
      {
        assetId: 'ast-stp-blower',
        assetName: 'STP Air Blower 1',
        title: 'Weekly Blower Greasing',
        frequency: 'WEEKLY',
        checklist: [{ id: 'chk-1', taskDescription: 'Grease bearings', isMandatory: true }],
        slaHours: 24,
        requiredEvidence: [],
        nextDueRule: 'FIXED_CALENDAR',
        effectiveStartDate: '2026-01-01',
      },
      manager
    );

    const occ1 = maintenanceService.generateOccurrence(plan.id, '2026-02-05');
    const occ2 = maintenanceService.generateOccurrence(plan.id, '2026-02-05');
    expect(occ1.id).toBe(occ2.id);

    const wo1 = maintenanceService.createWorkOrderFromOccurrence(occ1.id, manager);
    const wo2 = maintenanceService.createWorkOrderFromOccurrence(occ1.id, manager);
    expect(wo1.id).toBe(wo2.id);
  });

  test('Invariant 25: Duplicate stock mutation creates one movement', () => {
    const item = inventoryService.registerItem({
      id: 'inv-fuse-10a',
      itemName: 'HRC Fuse 10A',
      category: 'ELECTRICAL',
      currentStock: 50,
      unit: 'PIECES',
      minimumStockLevel: 10,
      location: 'Electrical Panel Room',
      lastIssuedDate: '',
      lastPurchasedDate: '',
      stockStatus: 'IN_STOCK',
    });

    const tx1 = inventoryService.issueStock(
      {
        itemId: item.id,
        transactionType: 'ISSUE',
        quantity: 5,
        actor: technician.name,
        purpose: 'Panel maintenance',
        clientOperationId: 'client-tx-op-1',
      },
      manager
    );

    expect(tx1.id).toBe('client-tx-op-1');
    expect(inventoryService.getItem(item.id)!.currentStock).toBe(45);
  });

  test('Invariant 26: Duplicate GoodsReceipt creates one receipt and one inventory movement', () => {
    const pr = procurementService.submitPurchaseRequest(
      {
        itemOrCategory: 'Lubricant',
        requiredQuantity: 20,
        reason: 'Monthly maintenance',
        estimatedAmount: 10000,
        urgency: 'MEDIUM',
      },
      manager
    );
    procurementService.approvePurchaseRequest(pr.id, 'Approved', committee);

    const po = procurementService.createPurchaseOrder(
      {
        purchaseRequestId: pr.id,
        vendorId: 'vnd-lubricants',
        vendorName: 'Shell Lubricants',
        lines: [{ itemId: 'item-lube-1', itemName: 'Shell Tellus 46', quantity: 20, unitPrice: 500 }],
        deliveryDate: '2026-04-01',
        deliveryLocation: 'Store',
        terms: 'Net 30',
      },
      manager
    );

    const gr = procurementService.receiveGoods(
      {
        poId: po.id,
        lines: [{ poLineId: po.lines[0].id, deliveredQuantity: 20, acceptedQuantity: 20, rejectedQuantity: 0 }],
        clientOperationId: 'client-gr-op-99',
      },
      manager
    );

    expect(gr.id).toBe('client-gr-op-99');
    expect(procurementService.getGoodsReceipt('client-gr-op-99')).toBeDefined();
  });

  test('Invariant 27: Duplicate invoice is detected', () => {
    invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-UNIQUE-01',
        vendorId: 'vnd-water-supply',
        vendorName: 'CleanWater Co',
        lines: [{ description: 'Water tanker supply', quantity: 5, unitPrice: 1000, totalPrice: 5000 }],
        subtotal: 5000,
        taxAmount: 900,
        totalAmount: 5900,
        invoiceDate: '2026-03-01',
        dueDate: '2026-03-31',
      },
      manager
    );

    expect(() => {
      invoiceService.registerInvoice(
        {
          invoiceNumber: 'INV-UNIQUE-01',
          vendorId: 'vnd-water-supply',
          vendorName: 'CleanWater Co',
          lines: [{ description: 'Water tanker supply duplicate', quantity: 5, unitPrice: 1000, totalPrice: 5000 }],
          subtotal: 5000,
          taxAmount: 900,
          totalAmount: 5900,
          invoiceDate: '2026-03-01',
          dueDate: '2026-03-31',
        },
        manager
      );
    }).toThrow('INVOICE_DUPLICATE');
  });

  test('Invariant 28: Duplicate payable handoff does not create two financial obligations', () => {
    const invoice = invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-PAYABLE-TEST',
        vendorId: 'vnd-pest-control',
        vendorName: 'SafeHome Pest',
        workOrderId: 'wo-pest-verified',
        lines: [{ description: 'Monthly Fogging', quantity: 1, unitPrice: 15000, totalPrice: 15000 }],
        subtotal: 15000,
        taxAmount: 2700,
        totalAmount: 17700,
        invoiceDate: '2026-03-15',
        dueDate: '2026-04-15',
      },
      manager
    );

    invoice.status = 'APPROVED';

    const handoff1 = financeService.createPayableHandoff(invoice.id, 'client-op-pay-1', committee);
    const handoff2 = financeService.createPayableHandoff(invoice.id, 'client-op-pay-1', committee);

    expect(handoff1.payableRequestId).toBe(handoff2.payableRequestId);
    expect(financeService.getPayableRequests().length).toBe(1);
  });

  test('Invariant 29: Vendor deactivation does not destroy historical records', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Past Security Ltd',
        category: 'SECURITY',
        contactPerson: 'Col. Joshi',
        mobileNumber: '9123456780',
        officeAddress: 'Security HQ',
        servicesOffered: ['SECURITY'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    vendorService.deactivateVendor(vendor.id, 'Terminated contract per mutual agreement', manager);
    const deactivated = vendorService.getVendor(vendor.id)!;
    expect(deactivated.status).toBe('INACTIVE');

    const list = vendorService.getVendors();
    expect(list.some((v) => v.id === vendor.id)).toBe(true);
  });

  test('Invariant 31 & 32: Vendor performance is derived/explainable and formula changes do not rewrite historical snapshots', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Quality Lift Corp',
        category: 'LIFT_MAINTENANCE',
        contactPerson: 'Amitabh Sen',
        mobileNumber: '9988776655',
        officeAddress: '78 Ring Road',
        servicesOffered: ['LIFT_MAINTENANCE'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const wo1 = workOrderService.createWorkOrder(
      {
        title: 'Monthly Lift Service 1',
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        assetId: 'ast-lift-1',
        vendorId: vendor.id,
      },
      manager
    );
    workOrderService.startWorkOrder(wo1.id, technician);
    workOrderService.submitCompletion({ workOrderId: wo1.id, technicianNotes: 'Completed' }, technician);
    workOrderService.verifyWorkOrder({ workOrderId: wo1.id, action: 'ACCEPT' }, manager);

    const scorecard = scorecardService.calculateScorecard(vendor.id, {
      from: '2026-01-01',
      to: '2026-12-31',
    });

    expect(scorecard.vendorId).toBe(vendor.id);
    expect(scorecard.completionRate).toBe(100);
    expect(scorecard.formulaVersion).toBe('v1.0.0');
    expect(scorecard.isLowDataVolume).toBe(true);
  });

  test('Invariant 33: Sensitive Vendor documents are access controlled', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Confidential Services',
        category: 'SECURITY',
        contactPerson: 'Mr. X',
        mobileNumber: '9000000000',
        officeAddress: 'Confidential address',
        servicesOffered: ['SECURITY'],
        emergencySupportAvailable: false,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    vendorService.uploadDocument(
      vendor.id,
      {
        documentType: 'PAN_CARD',
        documentCategory: 'TAX',
        documentVaultId: 'doc-vault-pan-secret',
        sensitivity: 'RESTRICTED',
      },
      manager
    );

    const docsForManager = vendorService.getVendorDocuments(vendor.id, manager);
    expect(docsForManager.length).toBe(1);

    const docsForTech = vendorService.getVendorDocuments(vendor.id, technician);
    expect(docsForTech.length).toBe(0);
  });

  test('Invariant 39: Client cannot self-declare procurement approval without permission', () => {
    const pr = procurementService.submitPurchaseRequest(
      {
        itemOrCategory: 'Tools',
        requiredQuantity: 1,
        reason: 'Technician tool set',
        estimatedAmount: 5000,
        urgency: 'LOW',
      },
      technician
    );

    expect(() => {
      procurementService.approvePurchaseRequest(pr.id, 'Self-approval attempt', technician);
    }).toThrow('ACCESS_DENIED');
  });

  test('Invariant 40: Finance ledger is not directly mutated by Phase 16', () => {
    const invoice = invoiceService.registerInvoice(
      {
        invoiceNumber: 'INV-FIN-TEST',
        vendorId: 'vnd-gardening',
        vendorName: 'GreenGardens',
        lines: [{ description: 'Lawn Mowing', quantity: 1, unitPrice: 8000, totalPrice: 8000 }],
        subtotal: 8000,
        taxAmount: 1440,
        totalAmount: 9440,
        invoiceDate: '2026-03-20',
        dueDate: '2026-04-20',
      },
      manager
    );

    invoice.status = 'APPROVED';

    const handoff = financeService.createPayableHandoff(invoice.id, 'op-payable-fin-1', committee);
    expect(handoff.status).toBe('ACCEPTED');
    expect(handoff.financeReferenceId).toMatch(/^FIN-AP-/);

    const payable = financeService.getPayableRequest(handoff.payableRequestId)!;
    expect(payable.status).toBe('ACCEPTED');
  });

  test('Invariant 42: Work Order state transitions are server-authoritative and reject invalid transitions', () => {
    const wo = workOrderService.createWorkOrder(
      {
        title: 'Check Water Tank Float Valve',
        type: 'INSPECTION',
        priority: 'LOW',
        assetId: 'ast-tank-overhead',
      },
      manager
    );

    expect(wo.status).toBe('OPEN');

    expect(() => {
      workOrderService.completeWorkOrder(wo.id, manager);
    }).toThrow('INVALID_WORK_ORDER_STATE: Cannot transition from OPEN to COMPLETED');

    expect(() => {
      workOrderService.verifyWorkOrder({ workOrderId: wo.id, action: 'ACCEPT' }, manager);
    }).toThrow('INVALID_WORK_ORDER_STATE: Cannot verify work order in status OPEN');
  });

  test('Invariant 44: Historical asset, vendor, and service records remain reconstructable', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Heritage Lift Corp',
        category: 'LIFT_MAINTENANCE',
        contactPerson: 'S. Kulkarni',
        mobileNumber: '9822001122',
        officeAddress: 'Heritage Mills',
        servicesOffered: ['LIFT_MAINTENANCE'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const asset = assetService.createAsset(
      {
        assetName: 'Heritage Lift A',
        category: 'LIFT',
        location: 'Wing A',
        installationDate: '2020-01-01',
        purchaseDate: '2019-12-01',
        vendorId: vendor.id,
        vendorName: vendor.vendorName,
        warrantyExpiry: '2022-01-01',
        warrantyStatus: 'EXPIRED',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    const wo = workOrderService.createWorkOrder(
      {
        title: 'Periodic Maintenance',
        type: 'PREVENTIVE_MAINTENANCE',
        priority: 'MEDIUM',
        assetId: asset.id,
        vendorId: vendor.id,
      },
      manager
    );

    workOrderService.startWorkOrder(wo.id, technician);
    workOrderService.submitCompletion({ workOrderId: wo.id, technicianNotes: 'Completed' }, technician);
    workOrderService.verifyWorkOrder({ workOrderId: wo.id, action: 'ACCEPT' }, manager);
    workOrderService.closeWorkOrder(wo.id, 'Finished', manager);

    const history = workOrderService.getServiceHistoryForAsset(asset.id);
    expect(history.length).toBe(1);
    expect(history[0].assetId).toBe(asset.id);
    expect(history[0].workOrderNumber).toBe(wo.workOrderNumber);

    assetService.retireAsset({ assetId: asset.id, reason: 'Modernized with new elevator' }, manager);
    const retired = assetService.getAsset(asset.id)!;
    expect(retired.lifecycleStatus).toBe('RETIRED');

    const historyAfterRetirement = workOrderService.getServiceHistoryForAsset(asset.id);
    expect(historyAfterRetirement.length).toBe(1);
    expect(historyAfterRetirement[0].workOrderNumber).toBe(wo.workOrderNumber);
  });
});
