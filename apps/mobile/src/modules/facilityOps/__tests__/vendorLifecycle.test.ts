import { VendorService } from '../services/vendorService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Vendor Lifecycle', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });
  const technician = createActorFromSession({
    userId: 'usr-tech-1',
    name: 'Technician',
    societyId: 'soc-1',
    role: 'TECHNICIAN',
  });

  const vendorService = VendorService.getInstance();

  beforeEach(() => {
    vendorService.clear();
  });

  test('registers vendor in VERIFICATION_PENDING state', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'ElectroCare Services',
        legalName: 'ElectroCare Pvt Ltd',
        category: 'ELECTRICAL',
        contactPerson: 'Kishore Kumar',
        mobileNumber: '9820123456',
        email: 'kishore@electrocare.com',
        officeAddress: 'Shop 4, Market Complex',
        gstNumber: '27AAAAA0000A1Z5',
        panNumber: 'ABCDE1234F',
        servicesOffered: ['ELECTRICAL'],
        emergencySupportAvailable: true,
        contacts: [
          { name: 'Kishore Kumar', role: 'PRIMARY', phone: '9820123456', email: 'kishore@electrocare.com' },
        ],
        bankAccounts: [
          {
            bankName: 'HDFC Bank',
            accountNumber: '5010022334455',
            accountNumberMasked: '****4455',
            ifscCode: 'HDFC0000123',
            accountType: 'CURRENT',
          },
        ],
        requiredDocuments: [],
      },
      manager
    );

    expect(vendor.id).toBeDefined();
    expect(vendor.status).toBe('VERIFICATION_PENDING');
    expect(vendor.verificationStatus).toBe('PENDING');
    expect(vendor.maskedPhone).toBe('******3456');
    expect(vendor.gstMasked).toBe('27AA****1Z5');
    expect(vendor.panMasked).toBe('ABC****F');
  });

  test('requires mandatory fields on registration', () => {
    expect(() => {
      vendorService.registerVendor(
        {
          vendorName: '',
          category: 'PLUMBING',
          contactPerson: 'Person',
          mobileNumber: '9999999999',
          officeAddress: 'Address',
          servicesOffered: ['PLUMBING'],
          emergencySupportAvailable: false,
          contacts: [],
          bankAccounts: [],
          requiredDocuments: [],
        },
        manager
      );
    }).toThrow('VALIDATION_ERROR: Vendor name is mandatory');

    expect(() => {
      vendorService.registerVendor(
        {
          vendorName: 'Valid Name',
          category: 'PLUMBING',
          contactPerson: 'Person',
          mobileNumber: '123',
          officeAddress: 'Address',
          servicesOffered: ['PLUMBING'],
          emergencySupportAvailable: false,
          contacts: [],
          bankAccounts: [],
          requiredDocuments: [],
        },
        manager
      );
    }).toThrow('VALIDATION_ERROR: Valid mobile number is mandatory');
  });

  test('verifies vendor documents and activates vendor once all verified', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'PlumbFast Solutions',
        category: 'PLUMBING',
        contactPerson: 'Santosh Rao',
        mobileNumber: '9876543210',
        officeAddress: 'Unit 12 Trade Center',
        servicesOffered: ['PLUMBING'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const doc1 = vendorService.uploadDocument(
      vendor.id,
      {
        documentType: 'GST_CERTIFICATE',
        documentCategory: 'GST',
        documentVaultId: 'vault-doc-gst-1',
      },
      manager
    );

    const doc2 = vendorService.uploadDocument(
      vendor.id,
      {
        documentType: 'INSURANCE_POLICY',
        documentCategory: 'INSURANCE',
        documentVaultId: 'vault-doc-ins-1',
      },
      manager
    );

    vendorService.verifyDocument(vendor.id, doc1.id, manager);
    const verif1 = vendorService.verifyVendor(vendor.id, manager);
    expect(verif1.status).toBe('IN_PROGRESS');
    expect(vendorService.getVendor(vendor.id)!.status).toBe('VERIFICATION_PENDING');

    vendorService.verifyDocument(vendor.id, doc2.id, manager);
    const verif2 = vendorService.verifyVendor(vendor.id, manager);
    expect(verif2.status).toBe('VERIFIED');
    expect(vendorService.getVendor(vendor.id)!.status).toBe('ACTIVE');
  });

  test('suspends and deactivates vendor with open work order guard', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Rapid Elevator Co',
        category: 'LIFT_MAINTENANCE',
        contactPerson: 'Vikas Patil',
        mobileNumber: '9819819819',
        officeAddress: '15 High Street',
        servicesOffered: ['LIFT_MAINTENANCE'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const suspended = vendorService.suspendVendor(vendor.id, 'Investigation into safety compliance', manager);
    expect(suspended.status).toBe('SUSPENDED');

    vendor.openWorkOrders = 2;
    expect(() => {
      vendorService.deactivateVendor(vendor.id, 'Discontinued services', manager);
    }).toThrow('DEACTIVATION_BLOCKED: Vendor has 2 open work orders');

    vendor.openWorkOrders = 0;
    const deactivated = vendorService.deactivateVendor(vendor.id, 'Mutual termination', manager);
    expect(deactivated.status).toBe('INACTIVE');
  });

  test('records reason-coded emergency override for expired compliance', () => {
    const vendor = vendorService.registerVendor(
      {
        vendorName: 'Emergency Lifts Inc',
        category: 'LIFT_MAINTENANCE',
        contactPerson: 'Anil Deshmukh',
        mobileNumber: '9820098200',
        officeAddress: 'Tower B Ground',
        servicesOffered: ['LIFT_MAINTENANCE'],
        emergencySupportAvailable: true,
        contacts: [],
        bankAccounts: [],
        requiredDocuments: [],
      },
      manager
    );

    const override = vendorService.recordEmergencyOverride(
      vendor.id,
      'wo-urgent-lift-1',
      ['INSURANCE_EXPIRED_YESTERDAY'],
      'Resident trapped in lift car on 8th floor requires immediate technician response',
      manager
    );

    expect(override.vendorId).toBe(vendor.id);
    expect(override.workOrderId).toBe('wo-urgent-lift-1');
    expect(override.expiredRequirements).toContain('INSURANCE_EXPIRED_YESTERDAY');
    expect(override.authorizedByActorId).toBe(manager.userId);
  });
});
