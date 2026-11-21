export enum VisitorStatus {
  EXPECTED = 'EXPECTED',
  WAITING_APPROVAL = 'WAITING_APPROVAL',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum VisitorType {
  GUEST = 'GUEST',
  DELIVERY = 'DELIVERY',
  CAB = 'CAB',
  VENDOR = 'VENDOR',
}

export enum VisitorTabFilter {
  ALL = 'ALL',
  UPCOMING = 'UPCOMING',
  INSIDE = 'INSIDE',
  COMPLETED = 'COMPLETED',
  PAST = 'PAST',
}

export enum DeliveryBrandId {
  SWIGGY = 'SWIGGY',
  ZOMATO = 'ZOMATO',
  AMAZON = 'AMAZON',
  BLINKIT = 'BLINKIT',
  COURIER = 'COURIER',
}

export enum LeaveAtGateState {
  ACTIVE = 'ACTIVE',
  OFF = 'OFF',
}

export enum VisitorPassDurationType {
  ONE_DAY = 'oneDay',
  FREQUENT = 'frequent',
  PARTY = 'party',
}
