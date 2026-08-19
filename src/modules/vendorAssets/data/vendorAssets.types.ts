export interface Vendor {
  id: string;
  name: string;
  serviceType: string;
  contactPerson: string;
  phone: string;
  rating: number;
}

export interface Asset {
  id: string;
  name: string;
  location: string;
  lastMaintenance: string;
  nextAmcDate: string;
}
