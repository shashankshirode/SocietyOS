export type ResidentFacilityAmenity = {
  id: string;
  name: string;
  category: 'CLUBHOUSE' | 'FITNESS' | 'SPORTS' | 'EVENT_SPACE' | 'GUEST_ROOM' | 'KIDS' | 'COMMUNITY';
  description: string;
  capacity: number;
  chargeAmount: number;
  depositAmount: number;
  bookingType: 'HOURLY' | 'OVERNIGHT';
  approvalRequired: boolean;
};
