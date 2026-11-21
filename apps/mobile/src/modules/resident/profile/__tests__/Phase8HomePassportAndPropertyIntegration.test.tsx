import React from 'react';
import { screen, cleanup, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { DigitalHomePassportScreen } from '../screens/DigitalHomePassportScreen';
import { activeHomeStore } from '../../homeContext/data/activeHomeStore';
import { ownerTenantMockSource } from '../data/ownerTenant.mockSource';
import { parkingMockSource } from '../../parking/data/parking.mockSource';
import { documentMockSource } from '../../documents/data/document.mockSource';
import { nocMockSource } from '../../noc/data/noc.mockSource';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../../app/navigation/navigation.types';

type HomePassportProps = NativeStackScreenProps<HomeStackParamList, 'DigitalHomePassport'>;

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native');
  return {
    ...original,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useNavigationState: () => 'DigitalHomePassport',
  };
});

const mockNavigation: HomePassportProps['navigation'] = {
  navigate: jest.fn(),
  navigateDeprecated: jest.fn(),
  preload: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(),
  getState: jest.fn(),
  setParams: jest.fn(),
  replaceParams: jest.fn(),
  setOptions: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  popTo: jest.fn(),
  popToTop: jest.fn(),
  addListener: jest.fn(() => () => {}),
  isFocused: () => true,
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })) as HomePassportProps['navigation']['getParent'],
};

const mockRoute: HomePassportProps['route'] = {
  key: 'DigitalHomePassport-test',
  name: 'DigitalHomePassport',
  params: { unitId: 'unit-gv-a-1204' },
};

describe('Phase 8 Digital Home Passport and Property Integration', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Digital Home Passport with active unit details and authoritative records', async () => {
    await renderWithProviders(
      <DigitalHomePassportScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Digital Home Passport')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Verified Unit')).toBeTruthy();
      expect(screen.getByText('Authoritative Records')).toBeTruthy();
      expect(screen.getByText('SH-2024-0012')).toBeTruthy();
      expect(screen.getByText('NMC-PT-2024-9912')).toBeTruthy();
      expect(screen.getByText('Request Property Data Correction')).toBeTruthy();
    });
  });

  it('multi-property residence switching cleanly re-scopes data without bleeding', async () => {
    const defaultOverview = await ownerTenantMockSource.getUnitOccupancyOverview('unit-gv-a-1204');
    expect(defaultOverview.ok).toBe(true);
    if (defaultOverview.ok) {
      expect(defaultOverview.data.unitDetails.flatNumber).toBe('A-1204');
      expect(defaultOverview.data.unitDetails.carpetAreaSqFt).toBe(1450);
      expect(defaultOverview.data.societyName).toBe('Green Valley Heights');
    }

    activeHomeStore.setActiveContextId('context-003');
    const tenantOverview = await ownerTenantMockSource.getUnitOccupancyOverview('unit-gp-c-503');
    expect(tenantOverview.ok).toBe(true);
    if (tenantOverview.ok) {
      expect(tenantOverview.data.unitDetails.flatNumber).toBe('C-503');
      expect(tenantOverview.data.unitDetails.carpetAreaSqFt).toBe(850);
      expect(tenantOverview.data.societyName).toBe('Gokhale Park Residency');
      expect(tenantOverview.data.unitDetails.occupancyStatus).toBe('TENANT_OCCUPIED');
    }

    activeHomeStore.setActiveContextId('context-004');
    const puneOverview = await ownerTenantMockSource.getUnitOccupancyOverview('unit-ra-b-2101');
    expect(puneOverview.ok).toBe(true);
    if (puneOverview.ok) {
      expect(puneOverview.data.unitDetails.flatNumber).toBe('B-2101');
      expect(puneOverview.data.unitDetails.carpetAreaSqFt).toBe(1200);
      expect(puneOverview.data.societyName).toBe('Rohan Ananta');
    }

    activeHomeStore.setActiveContextId('context-001');
    const restoredOverview = await ownerTenantMockSource.getUnitOccupancyOverview('unit-gv-a-1204');
    expect(restoredOverview.ok).toBe(true);
    if (restoredOverview.ok) {
      expect(restoredOverview.data.unitDetails.flatNumber).toBe('A-1204');
      expect(restoredOverview.data.societyName).toBe('Green Valley Heights');
    }
  });

  it('records property correction request and updates status to PENDING_REVIEW', async () => {
    const correctionResult = await ownerTenantMockSource.createCorrectionRequest({
      unitId: 'unit-gv-a-1204',
      field: 'Carpet Area',
      currentValue: '1,450 sq ft',
      proposedValue: '1,480 sq ft',
      reason: 'Architectural balcony measurement enclosed per society resolution',
    });

    expect(correctionResult.ok).toBe(true);
    if (correctionResult.ok) {
      expect(correctionResult.data.id).toMatch(/^cor-/);
      expect(correctionResult.data.status).toBe('PENDING_REVIEW');
      expect(correctionResult.data.proposedValue).toBe('1,480 sq ft');
      expect(correctionResult.data.field).toBe('Carpet Area');
    }

    const requestsResult = await ownerTenantMockSource.getCorrectionRequests('unit-gv-a-1204');
    expect(requestsResult.ok).toBe(true);
    if (requestsResult.ok) {
      expect(requestsResult.data.length).toBeGreaterThan(0);
      expect(requestsResult.data[0]?.proposedValue).toBe('1,480 sq ft');
    }
  });

  it('vehicle registration normalizes plate and rejects duplicate registrations in the society', async () => {
    const duplicateAttempt = await parkingMockSource.addVehicle({
      societyId: 'society-001',
      unitId: 'unit-a-1204',
      vehicleNumber: 'MH 15 AB 1234',
      vehicleType: 'CAR',
      makeModel: 'Hyundai Creta',
      color: 'White',
      fuelType: 'PETROL',
      ownerName: 'Shashank',
      linkedResidentName: 'Shashank',
    });

    expect(duplicateAttempt.ok).toBe(false);
    if (!duplicateAttempt.ok) {
      expect(duplicateAttempt.error.code).toBe('VEHICLE_ALREADY_REGISTERED');
    }

    const uniquePlate = `MH15TEST${Math.floor(1000 + Math.random() * 9000)}`;
    const successResult = await parkingMockSource.addVehicle({
      societyId: 'society-001',
      unitId: 'unit-a-1204',
      vehicleNumber: uniquePlate,
      vehicleType: 'EV',
      makeModel: 'MG ZS EV',
      color: 'Silver',
      fuelType: 'ELECTRIC',
      ownerName: 'Shashank Shirode',
      linkedResidentName: 'Shashank Shirode',
    });

    expect(successResult.ok).toBe(true);
    if (successResult.ok) {
      expect(successResult.data.vehicleNumber).toBe(uniquePlate);
      expect(successResult.data.isEv).toBe(true);
      expect(successResult.data.verificationStatus).toBe('PENDING');

      const foundInStore = mockStore.getState().vehicles.find((v) => v.vehicleNumber === uniquePlate);
      expect(foundInStore).toBeDefined();
      expect(foundInStore?.makeModel).toBe('MG ZS EV');
    }
  });

  it('parking allocation prevents double-allocation when slot is already allocated to another unit', async () => {
    const doubleAllocationAttempt = await parkingMockSource.allocateParkingSlot({
      slotId: 'slot-b2-p114',
      unitId: 'unit-b-804',
      flatNumber: 'B-804',
    });

    expect(doubleAllocationAttempt.ok).toBe(false);
    if (!doubleAllocationAttempt.ok) {
      expect(doubleAllocationAttempt.error.code).toBe('SLOT_ALREADY_ALLOCATED');
    }

    const validSlotAllocation = await parkingMockSource.allocateParkingSlot({
      slotId: 'slot-b2-p114',
      unitId: 'unit-a-1204',
      flatNumber: 'A-1204',
      vehicleId: 'vehicle-a1204-car-1',
    });

    expect(validSlotAllocation.ok).toBe(true);
    if (validSlotAllocation.ok) {
      expect(validSlotAllocation.data.slotNumber).toBe('B2-P114');
      expect(validSlotAllocation.data.allocationStatus).toBe('ALLOCATED');
    }
  });

  it('guard vehicle lookup searches across registered vehicles dynamically', async () => {
    const lookupResult = await parkingMockSource.lookupVehicleForGuard('MH15AB1234');
    expect(lookupResult.ok).toBe(true);
    if (lookupResult.ok) {
      expect(lookupResult.data.length).toBeGreaterThan(0);
      const vehicle = lookupResult.data[0];
      if (vehicle) {
        expect(vehicle.vehicleNumber).toBe('MH15AB1234');
        expect(vehicle.linkedFlat).toBe('A-1204');
        expect(vehicle.parkingSlotNumber).toBe('B2-P114');
      }
    }

    const flatLookup = await parkingMockSource.lookupVehicleForGuard('A-1204');
    expect(flatLookup.ok).toBe(true);
    if (flatLookup.ok) {
      expect(flatLookup.data.length).toBeGreaterThan(0);
    }
  });

  it('document upload persists in mockStore and reflects in residence vault', async () => {
    const initialDocsCount = mockStore.getState().documents.length;

    const uploadResult = await documentMockSource.uploadPlaceholder({
      title: 'Property Tax Paid Receipt 2026',
      category: 'PROPERTY_TAX',
    });

    expect(uploadResult.ok).toBe(true);
    if (uploadResult.ok) {
      expect(uploadResult.data.title).toBe('Property Tax Paid Receipt 2026');
      expect(uploadResult.data.status).toBe('PENDING_VERIFICATION');

      const updatedDocs = mockStore.getState().documents;
      expect(updatedDocs.length).toBe(initialDocsCount + 1);
      const newlyAdded = updatedDocs.find((d) => d.id === uploadResult.data.id);
      expect(newlyAdded).toBeDefined();
      expect(newlyAdded?.title).toBe('Property Tax Paid Receipt 2026');
    }
  });

  it('NOC request creation, approval, and automated demo certificate generation', async () => {
    const createNocResult = await nocMockSource.createRequest({
      nocType: 'RENOVATION',
      requiredByDate: '2026-08-01',
      reason: 'Interior woodwork and kitchen cabinet installation',
    });

    expect(createNocResult.ok).toBe(true);
    if (createNocResult.ok) {
      const createdNoc = createNocResult.data;
      expect(createdNoc.status).toBe('DRAFT');
      expect(createdNoc.nocType).toBe('RENOVATION');

      const approvalResult = await nocMockSource.approveNocRequest(createdNoc.id);
      expect(approvalResult.ok).toBe(true);
      if (approvalResult.ok) {
        expect(approvalResult.data.noc.status).toBe('APPROVED');
        expect(approvalResult.data.certificate).toBeDefined();
        expect(approvalResult.data.certificate.certificateNumber).toMatch(/^NOC-CERT-/);
        expect(approvalResult.data.certificate.digitalSignature).toMatch(/^SIG-SOC-/);

        const vaultDocs = mockStore.getState().documents;
        const generatedCertDoc = vaultDocs.find(
          (d) => d.category === 'SOCIETY_NOC' && d.title.includes('RENOVATION')
        );
        expect(generatedCertDoc).toBeDefined();
        expect(generatedCertDoc?.status).toBe('VERIFIED');
        expect(generatedCertDoc?.isSocietyDoc).toBe(true);
      }
    }
  });

  it('evaluates move-out clearance checklist items', async () => {
    const moveOutResult = await nocMockSource.createMoveOut({
      personType: 'TENANT',
      proposedMoveOutDate: '2026-08-31',
      reason: 'Lease term completion and relocation',
      contactNumber: '9820011223',
    });

    expect(moveOutResult.ok).toBe(true);
    if (moveOutResult.ok) {
      expect(moveOutResult.data.status).toBe('PENDING_CLEARANCE');
      expect(moveOutResult.data.checklist.length).toBeGreaterThan(0);

      const clearanceResult = await nocMockSource.moveOutClearance(moveOutResult.data.id);
      expect(clearanceResult.ok).toBe(true);
      if (clearanceResult.ok) {
        const duesItem = clearanceResult.data.find((c) => c.title.includes('Maintenance'));
        expect(duesItem).toBeDefined();
        expect(duesItem?.status).toBe('PENDING');
      }
    }
  });
});
