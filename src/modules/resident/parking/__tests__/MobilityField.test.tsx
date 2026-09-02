import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { MobilityField } from '../components/MobilityField';
import { MobilityTrace } from '../components/MobilityTrace';
import type { Vehicle } from '../../../../shared/types/vehicle.types';
import type { ParkingSlot } from '../../../../shared/types/parking.types';

const mockVehicle: Vehicle = {
  id: 'v-1',
  societyId: 'soc-001',
  unitId: 'unit-001',
  vehicleNumber: 'MH15 AB 1234',
  vehicleType: 'CAR',
  makeModel: 'Honda City',
  color: 'White',
  fuelType: 'PETROL',
  isEv: false,
  ownerName: 'Shashank',
  linkedResidentName: 'Shashank',
  linkedFlat: '1204',
  parkingSlotNumber: 'B2-P118',
  stickerStatus: 'ISSUED',
  rfidStatus: 'ACTIVE',
  verificationStatus: 'VERIFIED',
  registrationDocumentStatus: 'VERIFIED',
  lastGateEntry: 'Entered through Gate 2 today at 09:18 AM',
  lastUpdatedAt: new Date().toISOString(),
};

const mockSlot: ParkingSlot = {
  id: 'slot-1',
  societyId: 'soc-001',
  slotNumber: 'B2 · P118',
  level: 'B2',
  zone: 'Zone A',
  slotType: 'CAR',
  linkedUnitId: 'unit-001',
  linkedFlat: '1204',
  allocationStatus: 'ALLOCATED',
  stickerRfidLinkage: 'ACTIVE',
  visitorParkingAllowedNearby: true,
};

describe('MobilityField Component', () => {
  it('renders parked vehicle with spatial bay assignment in fixed allotment policy', async () => {
    await renderWithProviders(
      <MobilityField
        policy="FIXED_ALLOTMENT"
        primaryVehicle={mockVehicle}
        assignedSlot={mockSlot}
      />
    );

    expect(screen.getByText('GATE 2 · RFID ACCESS')).toBeTruthy();
    expect(screen.getByText('HOME BAY')).toBeTruthy();
    expect(screen.getByText('B2 · P118')).toBeTruthy();
    expect(screen.getByText('MH15 AB 1234')).toBeTruthy();
    expect(screen.getByText('Honda City')).toBeTruthy();
    expect(screen.getByText('● Inside')).toBeTruthy();
  });

  it('renders open pool configuration without claiming private bay assignment', async () => {
    await renderWithProviders(
      <MobilityField
        policy="OPEN_COMMON_POOL"
        primaryVehicle={mockVehicle}
      />
    );

    expect(screen.getByText('SOCIETY GATE · OPEN PARKING')).toBeTruthy();
    expect(screen.getByText('COMMON BAY')).toBeTruthy();
    expect(screen.getByText('Common Resident Pool')).toBeTruthy();
  });

  it('renders unallotted unit state with direct request action', async () => {
    const onRequestAllotment = jest.fn();
    await renderWithProviders(
      <MobilityField
        policy="NO_PARKING_SOCIETY"
        onRequestAllotmentPress={onRequestAllotment}
      />
    );

    expect(screen.getByText('UNALLOTTED UNIT')).toBeTruthy();
    expect(screen.getByText('Request Allotment →')).toBeTruthy();
    fireEvent.press(screen.getByText('Request Allotment →'));
    expect(onRequestAllotment).toHaveBeenCalledTimes(1);
  });

  it('triggers vehicle focus handler when bay is pressed', async () => {
    const onVehiclePress = jest.fn();
    await renderWithProviders(
      <MobilityField
        primaryVehicle={mockVehicle}
        assignedSlot={mockSlot}
        onVehiclePress={onVehiclePress}
      />
    );

    fireEvent.press(screen.getByLabelText('Parking space B2 · P118. Honda City parked.'));
    expect(onVehiclePress).toHaveBeenCalledWith(mockVehicle);
  });

  it('renders Mobility Trace movement events', async () => {
    await renderWithProviders(
      <MobilityTrace
        events={[
          {
            id: 't-1',
            type: 'ENTRY',
            time: '18 min ago',
            title: 'Honda City entered',
            subtitle: 'Gate 2 · RFID Access · Confirmed',
          },
        ]}
      />
    );

    expect(screen.getByText('Mobility Trace')).toBeTruthy();
    expect(screen.getByText('Honda City entered')).toBeTruthy();
    expect(screen.getByText('18 min ago')).toBeTruthy();
  });
});
