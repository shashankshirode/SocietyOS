export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  providerCount: number;
};

export type ServiceProvider = {
  id: string;
  categoryId: string;
  name: string;
  rating: number;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  serviceArea: string;
};

export type ServiceRequestRecord = {
  id: string;
  providerId: string;
  residentName: string;
  categoryName: string;
  requestedSlot: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ASSIGNED';
};

export type VendorRatingRecord = {
  id: string;
  providerId: string;
  rating: number;
  review: string;
  createdAt: string;
};
