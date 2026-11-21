export interface Parcel {
  id: string;
  courierCompany: string;
  recipientFlat: string;
  recipientName: string;
  receivedTime: string;
  status: 'PENDING_PICKUP' | 'COLLECTED';
  pickupOtp: string;
}
