import { UniversalApiClient, createApiClientFromEnv } from '../client/UniversalApiClient';
import type { ApiResponse, PaginatedResponse, JsonObject } from '../contracts/api.types';
import type { SendOtpRequest, VerifyOtpRequest, VerifyOtpResponse, UserProfile, UserPreferences } from '../contracts/domains/auth.contracts';
import type { Resident, Unit, Vehicle, FamilyMember, KycDocument } from '../contracts/domains/resident.contracts';
import type { VisitorPass, VisitorPassListParams, CreateVisitorPassRequest, VisitorExitAlert } from '../contracts/domains/visitor.contracts';
import type { Complaint, CreateComplaintRequest, UpdateComplaintRequest, AssignComplaintRequest, ReopenComplaintRequest, ComplaintFeedback, ComplaintComment, ComplaintSlaSummary, ComplaintCategory } from '../contracts/domains/complaint.contracts';
import type { Bill, BillingCycle, ChargeHead, Payment, PaymentOrder, LedgerEntry, BillingSummary, CreateBillRequest, CreatePaymentOrderRequest } from '../contracts/domains/billing.contracts';
import type { Facility, FacilityBooking, CreateBookingRequest, UpdateBookingRequest, AvailabilitySlot, AvailabilityRequest } from '../contracts/domains/facility.contracts';
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeListParams, Acknowledgement } from '../contracts/domains/notice.contracts';
import type { Absent } from "../../shared/types/absence.types";
class ApiService {
    private client: UniversalApiClient;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private userId: string | null = null;
    private authListeners: Array<(isAuthenticated: boolean) => void> = [];
    constructor(client?: UniversalApiClient) {
        this.client = client || createApiClientFromEnv();
        if (typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('access_token');
            this.refreshToken = localStorage.getItem('refresh_token');
            this.userId = localStorage.getItem('user_id');
        }
    }
    private getAuthHeaders(): Record<string, string> {
        return this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {};
    }
    private async handleResponse<T>(response: ApiResponse<T>): Promise<T> {
        if (!response.success) {
            const error = new Error(response.error?.message || 'Request failed') as Error & {
                code?: string | Absent;
                status?: number | Absent;
                fieldErrors?: Array<{
                    field: string;
                    message: string;
                }> | Absent;
            };
            if (response.error?.code !== undefined)
                error.code = response.error.code;
            if (response.error?.statusCode !== undefined)
                error.status = response.error.statusCode;
            if (response.error?.fieldErrors !== undefined)
                error.fieldErrors = response.error.fieldErrors;
            throw error;
        }
        return response.data;
    }
    setAuthTokens(accessToken: string, refreshToken: string, userId: string): void {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = userId;
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('user_id', userId);
        }
        this.notifyAuthChange(true);
    }
    clearAuth(): void {
        this.accessToken = null;
        this.refreshToken = null;
        this.userId = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
        }
        this.notifyAuthChange(false);
    }
    isAuthenticated(): boolean {
        return !!this.accessToken && !!this.userId;
    }
    getUserId(): string | null {
        return this.userId;
    }
    onAuthChange(listener: (isAuthenticated: boolean) => void): () => void {
        this.authListeners.push(listener);
        return () => {
            const index = this.authListeners.indexOf(listener);
            if (index > -1)
                this.authListeners.splice(index, 1);
        };
    }
    private notifyAuthChange(isAuthenticated: boolean): void {
        this.authListeners.forEach(listener => listener(isAuthenticated));
    }
    async refreshAccessToken(): Promise<boolean> {
        if (!this.refreshToken)
            return false;
        try {
            const response = await this.client.post<VerifyOtpResponse>('/auth/token/refresh', {
                refreshToken: this.refreshToken,
            });
            const data = await this.handleResponse(response);
            this.setAuthTokens(data.accessToken, data.refreshToken, this.userId!);
            return true;
        }
        catch {
            this.clearAuth();
            return false;
        }
    }
    async sendOtp(request: SendOtpRequest): Promise<{
        otpId: string;
        expiresIn: number;
        maskedPhone: string;
    }> {
        const response = await this.client.post('/auth/otp/send', request);
        return this.handleResponse(response);
    }
    async verifyOtp(request: VerifyOtpRequest): Promise<VerifyOtpResponse> {
        const response = await this.client.post('/auth/otp/verify', request);
        const data = await this.handleResponse(response);
        this.setAuthTokens(data.accessToken, data.refreshToken, data.user.id);
        return data;
    }
    async logout(): Promise<void> {
        if (this.accessToken) {
            try {
                await this.client.post('/auth/logout', {}, { headers: this.getAuthHeaders() });
            }
            catch {
            }
        }
        this.clearAuth();
    }
    async logoutAll(): Promise<void> {
        if (this.accessToken) {
            try {
                await this.client.post('/auth/logout-all', {}, { headers: this.getAuthHeaders() });
            }
            catch {
            }
        }
        this.clearAuth();
    }
    async getProfile(): Promise<UserProfile> {
        const response = await this.client.get('/auth/me', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        const response = await this.client.patch('/auth/me', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getPreferences(): Promise<UserPreferences> {
        const response = await this.client.get('/auth/me/preferences', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
        const response = await this.client.patch('/auth/me/preferences', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getResidentProfile(): Promise<Resident> {
        const response = await this.client.get('/residents/me', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updateResidentProfile(data: Partial<Resident>): Promise<Resident> {
        const response = await this.client.patch('/residents/me', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getUnits(): Promise<Unit[]> {
        const response = await this.client.get('/residents/me/units', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getUnit(unitId: string): Promise<Unit> {
        const response = await this.client.get(`/units/${unitId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getFamilyMembers(): Promise<FamilyMember[]> {
        const response = await this.client.get('/residents/me/family', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async addFamilyMember(data: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FamilyMember> {
        const response = await this.client.post('/residents/me/family', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updateFamilyMember(memberId: string, data: Partial<FamilyMember>): Promise<FamilyMember> {
        const response = await this.client.patch(`/residents/me/family/${memberId}`, data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async removeFamilyMember(memberId: string): Promise<void> {
        const response = await this.client.delete(`/residents/me/family/${memberId}`, { headers: this.getAuthHeaders() });
        await this.handleResponse(response);
    }
    async getVehicles(): Promise<Vehicle[]> {
        const response = await this.client.get('/residents/me/vehicles', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async addVehicle(data: Omit<Vehicle, 'id' | 'status'>): Promise<Vehicle> {
        const response = await this.client.post('/residents/me/vehicles', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updateVehicle(vehicleId: string, data: Partial<Vehicle>): Promise<Vehicle> {
        const response = await this.client.patch(`/residents/me/vehicles/${vehicleId}`, data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async removeVehicle(vehicleId: string): Promise<void> {
        const response = await this.client.delete(`/residents/me/vehicles/${vehicleId}`, { headers: this.getAuthHeaders() });
        await this.handleResponse(response);
    }
    async uploadKyc(data: {
        type: KycDocument['type'];
        documentUrl: string;
    }): Promise<KycDocument> {
        const response = await this.client.post('/residents/me/kyc', data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getKycStatus(): Promise<{
        status: Resident['kycStatus'];
        documents: KycDocument[];
    }> {
        const response = await this.client.get('/residents/me/kyc', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listVisitorPasses(params: VisitorPassListParams): Promise<PaginatedResponse<VisitorPass>> {
        const response = await this.client.get('/visitors', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getVisitorPass(passId: string): Promise<VisitorPass> {
        const response = await this.client.get(`/visitors/${passId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async createVisitorPass(request: CreateVisitorPassRequest): Promise<VisitorPass> {
        const response = await this.client.post('/visitors', request, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async cancelVisitorPass(passId: string, reason: string): Promise<VisitorPass> {
        const response = await this.client.post(`/visitors/${passId}/cancel`, { reason }, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getExitAlerts(params: {
        page?: number;
        pageSize?: number;
        status?: string[];
    }): Promise<PaginatedResponse<VisitorExitAlert>> {
        const response = await this.client.get('/visitors/exit-alerts', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async confirmExit(alertId: string): Promise<VisitorExitAlert> {
        const response = await this.client.post(`/visitors/exit-alerts/${alertId}/confirm-left`, {}, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listComplaints(params: {
        page?: number;
        pageSize?: number;
        status?: string[];
        category?: string[];
        priority?: string[];
        assignedTo?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    }): Promise<PaginatedResponse<Complaint>> {
        const response = await this.client.get('/complaints', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getComplaint(complaintId: string): Promise<Complaint> {
        const response = await this.client.get(`/complaints/${complaintId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async createComplaint(request: CreateComplaintRequest): Promise<Complaint> {
        const response = await this.client.post('/complaints', request, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async updateComplaint(complaintId: string, data: UpdateComplaintRequest): Promise<Complaint> {
        const response = await this.client.patch(`/complaints/${complaintId}`, data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async assignComplaint(complaintId: string, data: AssignComplaintRequest): Promise<Complaint> {
        const response = await this.client.post(`/complaints/${complaintId}/assign`, data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async reopenComplaint(complaintId: string, data: ReopenComplaintRequest): Promise<Complaint> {
        const response = await this.client.post(`/complaints/${complaintId}/reopen`, data, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async addComplaintComment(complaintId: string, content: string, isInternal: boolean): Promise<ComplaintComment> {
        const response = await this.client.post(`/complaints/${complaintId}/comments`, { content, isInternal }, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getComplaintComments(complaintId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<ComplaintComment>> {
        const response = await this.client.get(`/complaints/${complaintId}/comments`, {
            params: { page, pageSize },
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async submitComplaintFeedback(complaintId: string, feedback: ComplaintFeedback): Promise<Complaint> {
        const response = await this.client.post(`/complaints/${complaintId}/feedback`, feedback, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getComplaintSlaSummary(params: {
        dateFrom?: string;
        dateTo?: string;
        category?: string;
    }): Promise<ComplaintSlaSummary> {
        const response = await this.client.get('/complaints/sla/summary', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getComplaintCategories(): Promise<{
        category: ComplaintCategory;
        subCategories: string[];
    }[]> {
        const response = await this.client.get('/complaints/categories', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listBills(params: {
        page?: number;
        pageSize?: number;
        status?: string[];
        unitId?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<PaginatedResponse<Bill>> {
        const response = await this.client.get('/bills', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getBill(billId: string): Promise<Bill> {
        const response = await this.client.get(`/bills/${billId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getBillReceipt(billId: string): Promise<{
        receiptUrl: string;
        receiptNumber: string;
    }> {
        const response = await this.client.get(`/bills/${billId}/receipt`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getBillingSummary(): Promise<BillingSummary> {
        const response = await this.client.get('/billing/summary', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async createPaymentOrder(request: CreatePaymentOrderRequest): Promise<PaymentOrder> {
        const response = await this.client.post('/payments/orders', request, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async mockPaymentConfirm(orderId: string, status: 'SUCCESS' | 'FAILED'): Promise<Payment> {
        const response = await this.client.post('/payments/mock-confirm', { orderId, status }, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listFacilities(params: {
        page?: number;
        pageSize?: number;
        category?: string;
        status?: string;
    }): Promise<PaginatedResponse<Facility>> {
        const response = await this.client.get('/facilities', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getFacility(facilityId: string): Promise<Facility> {
        const response = await this.client.get(`/facilities/${facilityId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getFacilityAvailability(request: AvailabilityRequest): Promise<AvailabilitySlot[]> {
        const response = await this.client.post(`/facilities/${request.facilityId}/availability`, request, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listFacilityBookings(params: {
        page?: number;
        pageSize?: number;
        facilityId?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        unitId?: string;
    }): Promise<PaginatedResponse<FacilityBooking>> {
        const response = await this.client.get('/facility-bookings', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async createFacilityBooking(request: CreateBookingRequest): Promise<FacilityBooking> {
        const response = await this.client.post('/facility-bookings', request, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async cancelFacilityBooking(bookingId: string, reason: string): Promise<FacilityBooking> {
        const response = await this.client.post(`/facility-bookings/${bookingId}/cancel`, { reason }, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async listNotices(params: NoticeListParams): Promise<PaginatedResponse<Notice>> {
        const response = await this.client.get('/notices', {
            params: params as JsonObject,
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }
    async getNotice(noticeId: string): Promise<Notice> {
        const response = await this.client.get(`/notices/${noticeId}`, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async acknowledgeNotice(noticeId: string): Promise<Notice> {
        const response = await this.client.post(`/notices/${noticeId}/acknowledge`, {}, { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
    async getUnreadNoticeCount(): Promise<{
        count: number;
    }> {
        const response = await this.client.get('/notices/unread-count', { headers: this.getAuthHeaders() });
        return this.handleResponse(response);
    }
}
export const apiService = new ApiService();
export { ApiService };

