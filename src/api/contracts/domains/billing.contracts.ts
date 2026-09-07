import type { EndpointDefinition } from '../api.types';
import type { PaginatedResponse, JsonObject } from '../api.types';
import type { Absent } from "../../../shared/types/absence.types";
export interface Bill {
    id: string;
    societyId: string;
    billingCycleId: string;
    unitId: string;
    unitNumber: string;
    tower: string;
    residentId: string;
    residentName: string;
    billNumber: string;
    status: 'DRAFT' | 'PUBLISHED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'DISPUTED';
    dueDate: string;
    issuedDate: string;
    paidDate?: string;
    lineItems: BillLineItem[];
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    lateFee: number;
    payments: Payment[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
export interface BillLineItem {
    id: string;
    billId: string;
    chargeHeadId: string;
    chargeHeadName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    periodStart?: string;
    periodEnd?: string;
}
export interface BillingCycle {
    id: string;
    societyId: string;
    name: string;
    periodStart: string;
    periodEnd: string;
    dueDate: string;
    status: 'DRAFT' | 'GENERATING' | 'PUBLISHED' | 'CLOSED';
    totalBills: number;
    totalAmount: number;
    collectedAmount: number;
    generatedAt?: string;
    publishedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}
export interface ChargeHead {
    id: string;
    societyId: string;
    name: string;
    code: string;
    description: string;
    type: 'RECURRING' | 'ONE_TIME' | 'USAGE_BASED' | 'PENALTY' | 'REFUND';
    category: 'MAINTENANCE' | 'PARKING' | 'AMENITY' | 'UTILITY' | 'SECURITY' | 'ADMIN' | 'OTHER';
    defaultAmount: number;
    taxRate: number;
    isActive: boolean;
    applicableTo: ('OWNER' | 'TENANT' | 'COMMERCIAL')[];
    frequency?: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'ON_DEMAND';
    createdAt: string;
    updatedAt: string;
}
export interface Payment {
    id: string;
    billId: string;
    paymentOrderId: string;
    amount: number;
    method: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
    transactionId?: string | Absent;
    gatewayResponse?: JsonObject | Absent;
    paidAt?: string | Absent;
    refundedAt?: string | Absent;
    refundReason?: string | Absent;
    collectedBy?: string | Absent;
    receiptNumber?: string | Absent;
    receiptUrl?: string | Absent;
    createdAt: string;
    updatedAt: string;
}
export interface PaymentOrder {
    id: string;
    billId: string;
    residentId: string;
    amount: number;
    method: Payment['method'];
    status: 'CREATED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
    gatewayOrderId?: string | Absent;
    gatewayResponse?: JsonObject | Absent;
    expiresAt: string;
    completedAt?: string | Absent;
    createdAt: string;
}
export interface LedgerEntry {
    id: string;
    unitId: string;
    residentId: string;
    type: 'DEBIT' | 'CREDIT';
    amount: number;
    balance: number;
    description: string;
    referenceType: 'BILL' | 'PAYMENT' | 'ADJUSTMENT' | 'REFUND' | 'OPENING_BALANCE';
    referenceId: string;
    date: string;
    createdBy: string;
    createdAt: string;
}
export interface BillingSummary {
    totalOutstanding: number;
    totalPaid: number;
    totalOverdue: number;
    upcomingBills: number;
    nextDueDate?: string;
    nextDueAmount?: number;
}
export interface CreateBillRequest {
    unitId: string;
    billingCycleId: string;
    lineItems: Omit<BillLineItem, 'id' | 'billId' | 'taxAmount' | 'totalAmount'>[];
    dueDate: string;
    notes?: string;
}
export interface CreatePaymentOrderRequest {
    billId: string;
    method: Payment['method'];
    amount?: number;
}
export interface PaymentCallbackRequest {
    orderId: string;
    paymentId: string;
    status: Payment['status'];
    transactionId: string;
    gatewayResponse: JsonObject;
}
export const billingEndpoints = {
    getBills: {
        method: 'GET' as const,
        path: '/bills',
        queryParams: ['page', 'pageSize', 'status', 'unitId', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
        responseBody: {} as PaginatedResponse<Bill>,
        authRequired: true,
    },
    getBill: {
        method: 'GET' as const,
        path: '/bills/{billId}',
        pathParams: ['billId'],
        responseBody: {} as Bill,
        authRequired: true,
    },
    getBillReceipt: {
        method: 'GET' as const,
        path: '/bills/{billId}/receipt',
        pathParams: ['billId'],
        responseBody: {} as {
            receiptUrl: string;
            receiptNumber: string;
        },
        authRequired: true,
    },
    getLineItems: {
        method: 'GET' as const,
        path: '/bills/{billId}/line-items',
        pathParams: ['billId'],
        responseBody: {} as BillLineItem[],
        authRequired: true,
    },
    getBillingCycles: {
        method: 'GET' as const,
        path: '/billing-cycles',
        queryParams: ['page', 'pageSize', 'status'],
        responseBody: {} as PaginatedResponse<BillingCycle>,
        authRequired: true,
    },
    getBillingCycle: {
        method: 'GET' as const,
        path: '/billing-cycles/{cycleId}',
        pathParams: ['cycleId'],
        responseBody: {} as BillingCycle,
        authRequired: true,
    },
    getChargeHeads: {
        method: 'GET' as const,
        path: '/charge-heads',
        queryParams: ['page', 'pageSize', 'type', 'category', 'isActive'],
        responseBody: {} as PaginatedResponse<ChargeHead>,
        authRequired: true,
    },
    createChargeHead: {
        method: 'POST' as const,
        path: '/charge-heads',
        requestBody: {} as Omit<ChargeHead, 'id' | 'societyId' | 'createdAt' | 'updatedAt'>,
        responseBody: {} as ChargeHead,
        authRequired: true,
    },
    getPayments: {
        method: 'GET' as const,
        path: '/payments',
        queryParams: ['page', 'pageSize', 'status', 'method', 'dateFrom', 'dateTo', 'billId'],
        responseBody: {} as PaginatedResponse<Payment>,
        authRequired: true,
    },
    getPayment: {
        method: 'GET' as const,
        path: '/payments/{paymentId}',
        pathParams: ['paymentId'],
        responseBody: {} as Payment,
        authRequired: true,
    },
    createPaymentOrder: {
        method: 'POST' as const,
        path: '/payments/orders',
        requestBody: {} as CreatePaymentOrderRequest,
        responseBody: {} as PaymentOrder,
        authRequired: true,
    },
    paymentCallback: {
        method: 'POST' as const,
        path: '/payments/callback',
        requestBody: {} as PaymentCallbackRequest,
        responseBody: {} as Payment,
        authRequired: false,
    },
    getLedger: {
        method: 'GET' as const,
        path: '/ledger',
        queryParams: ['page', 'pageSize', 'unitId', 'type', 'dateFrom', 'dateTo'],
        responseBody: {} as PaginatedResponse<LedgerEntry>,
        authRequired: true,
    },
    getSummary: {
        method: 'GET' as const,
        path: '/billing/summary',
        responseBody: {} as BillingSummary,
        authRequired: true,
    },
    mockPayment: {
        method: 'POST' as const,
        path: '/payments/mock-confirm',
        requestBody: {} as {
            orderId: string;
            status: 'SUCCESS' | 'FAILED';
        },
        responseBody: {} as Payment,
        authRequired: true,
    },
} as const satisfies Record<string, EndpointDefinition>;

