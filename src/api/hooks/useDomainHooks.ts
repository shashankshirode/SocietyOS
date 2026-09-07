import { useQuery, useMutation, useInfiniteQuery } from './useApi';
import { apiService } from '../services/ApiService';
import type { 
  SendOtpRequest, VerifyOtpRequest, UserProfile, UserPreferences 
} from '../contracts/domains/auth.contracts';
import type { Resident, Vehicle, FamilyMember, KycDocument, Unit } from '../contracts/domains/resident.contracts';
import type { VisitorPass, VisitorPassListParams, CreateVisitorPassRequest, VisitorExitAlert } from '../contracts/domains/visitor.contracts';
import type { Complaint, CreateComplaintRequest, UpdateComplaintRequest, AssignComplaintRequest, ReopenComplaintRequest, ComplaintFeedback, ComplaintComment, ComplaintSlaSummary } from '../contracts/domains/complaint.contracts';
import type { Bill, BillingCycle, ChargeHead, Payment, PaymentOrder, BillingSummary, CreateBillRequest, CreatePaymentOrderRequest } from '../contracts/domains/billing.contracts';
import type { Facility, FacilityBooking, CreateBookingRequest, UpdateBookingRequest, AvailabilitySlot, AvailabilityRequest } from '../contracts/domains/facility.contracts';
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeListParams, Acknowledgement } from '../contracts/domains/notice.contracts';

export function useAuth() {
  const { data: profile } = useQuery(['auth', 'profile'], () => apiService.getProfile(), {
    enabled: apiService.isAuthenticated(),
  });

  const sendOtp = useMutation(
    (request: SendOtpRequest) => apiService.sendOtp(request),
    { onSuccess: () => {} }
  );

  const verifyOtp = useMutation(
    (request: VerifyOtpRequest) => apiService.verifyOtp(request),
    { onSuccess: () => {} }
  );

  const logout = useMutation(
    () => apiService.logout(),
    { onSuccess: () => {} }
  );

  const logoutAll = useMutation(
    () => apiService.logoutAll(),
    { onSuccess: () => {} }
  );

  const updateProfile = useMutation(
    (data: Partial<UserProfile>) => apiService.updateProfile(data),
    { onSuccess: () => {} }
  );

  const updatePreferences = useMutation(
    (data: Partial<UserPreferences>) => apiService.updatePreferences(data),
    { onSuccess: () => {} }
  );

  return {
    profile,
    isAuthenticated: apiService.isAuthenticated(),
    sendOtp: sendOtp.mutateAsync,
    verifyOtp: verifyOtp.mutateAsync,
    logout: logout.mutateAsync,
    logoutAll: logoutAll.mutateAsync,
    updateProfile: updateProfile.mutateAsync,
    updatePreferences: updatePreferences.mutateAsync,
    isLoading: sendOtp.isLoading || verifyOtp.isLoading,
  };
}

export function useResident() {
  const { data: profile } = useQuery(['resident', 'profile'], () => apiService.getResidentProfile(), {
    enabled: apiService.isAuthenticated(),
  });

  const { data: units } = useQuery(['resident', 'units'], () => apiService.getUnits(), {
    enabled: apiService.isAuthenticated(),
  });

  const { data: familyMembers } = useQuery(['resident', 'family'], () => apiService.getFamilyMembers(), {
    enabled: apiService.isAuthenticated(),
  });

  const { data: vehicles } = useQuery(['resident', 'vehicles'], () => apiService.getVehicles(), {
    enabled: apiService.isAuthenticated(),
  });

  const addVehicle = useMutation(
    (data: Omit<Vehicle, 'id' | 'status'>) => apiService.addVehicle(data),
    { onSuccess: () => {} }
  );

  const updateVehicle = useMutation(
    ({ vehicleId, data }: { vehicleId: string; data: Partial<Vehicle> }) => apiService.updateVehicle(vehicleId, data),
    { onSuccess: () => {} }
  );

  const removeVehicle = useMutation(
    (vehicleId: string) => apiService.removeVehicle(vehicleId),
    { onSuccess: () => {} }
  );

  const uploadKyc = useMutation(
    (data: { type: KycDocument['type']; documentUrl: string }) => apiService.uploadKyc(data),
    { onSuccess: () => {} }
  );

  const { data: kycStatus } = useQuery(['resident', 'kyc'], () => apiService.getKycStatus(), {
    enabled: apiService.isAuthenticated(),
  });

  return {
    profile,
    units,
    familyMembers,
    vehicles,
    kycStatus,
    addVehicle: addVehicle.mutateAsync,
    updateVehicle: updateVehicle.mutateAsync,
    removeVehicle: removeVehicle.mutateAsync,
    uploadKyc: uploadKyc.mutateAsync,
  };
}

export function useVisitors() {
  const listVisitorPasses = (params: VisitorPassListParams = {}) => 
    useQuery(['visitors', 'list', params], () => apiService.listVisitorPasses(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getVisitorPass = (passId: string) =>
    useQuery(['visitors', 'detail', passId], () => apiService.getVisitorPass(passId), {
      enabled: apiService.isAuthenticated() && !!passId,
    });

  const createVisitorPass = useMutation(
    (request: CreateVisitorPassRequest) => apiService.createVisitorPass(request),
    { onSuccess: () => {} }
  );

  const cancelVisitorPass = useMutation(
    ({ passId, reason }: { passId: string; reason: string }) => apiService.cancelVisitorPass(passId, reason),
    { onSuccess: () => {} }
  );

  const listExitAlerts = (params: { page?: number; pageSize?: number; status?: string[] } = {}) =>
    useQuery(['visitors', 'exitAlerts', params], () => apiService.getExitAlerts(params), {
      enabled: apiService.isAuthenticated(),
    });

  const confirmExit = useMutation(
    (alertId: string) => apiService.confirmExit(alertId),
    { onSuccess: () => {} }
  );

  return {
    listVisitorPasses,
    getVisitorPass,
    createVisitorPass: createVisitorPass.mutateAsync,
    cancelVisitorPass: cancelVisitorPass.mutateAsync,
    listExitAlerts,
    confirmExit: confirmExit.mutateAsync,
  };
}

export function useComplaints() {
  const listComplaints = (params: {
    page?: number;
    pageSize?: number;
    status?: string[];
    category?: string[];
    priority?: string[];
    assignedTo?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  } = {}) =>
    useQuery(['complaints', 'list', params], () => apiService.listComplaints(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getComplaint = (complaintId: string) =>
    useQuery(['complaints', 'detail', complaintId], () => apiService.getComplaint(complaintId), {
      enabled: apiService.isAuthenticated() && !!complaintId,
    });

  const createComplaint = useMutation(
    (request: CreateComplaintRequest) => apiService.createComplaint(request),
    { onSuccess: () => {} }
  );

  const updateComplaint = useMutation(
    ({ complaintId, data }: { complaintId: string; data: UpdateComplaintRequest }) => apiService.updateComplaint(complaintId, data),
    { onSuccess: () => {} }
  );

  const assignComplaint = useMutation(
    ({ complaintId, data }: { complaintId: string; data: AssignComplaintRequest }) => apiService.assignComplaint(complaintId, data),
    { onSuccess: () => {} }
  );

  const reopenComplaint = useMutation(
    ({ complaintId, data }: { complaintId: string; data: ReopenComplaintRequest }) => apiService.reopenComplaint(complaintId, data),
    { onSuccess: () => {} }
  );

  const addComment = useMutation(
    ({ complaintId, content, isInternal }: { complaintId: string; content: string; isInternal: boolean }) => apiService.addComplaintComment(complaintId, content, isInternal),
    { onSuccess: () => {} }
  );

  const getComments = (complaintId: string, page = 1, pageSize = 20) =>
    useQuery(['complaints', 'comments', complaintId, page], () => apiService.getComplaintComments(complaintId, page, pageSize), {
      enabled: apiService.isAuthenticated() && !!complaintId,
    });

  const submitFeedback = useMutation(
    ({ complaintId, feedback }: { complaintId: string; feedback: ComplaintFeedback }) => apiService.submitComplaintFeedback(complaintId, feedback),
    { onSuccess: () => {} }
  );

  const getSlaSummary = (params: { dateFrom?: string; dateTo?: string; category?: string } = {}) =>
    useQuery(['complaints', 'sla', params], () => apiService.getComplaintSlaSummary(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getCategories = () =>
    useQuery(['complaints', 'categories'], () => apiService.getComplaintCategories(), {
      enabled: apiService.isAuthenticated(),
    });

  return {
    listComplaints,
    getComplaint,
    createComplaint: createComplaint.mutateAsync,
    updateComplaint: updateComplaint.mutateAsync,
    assignComplaint: assignComplaint.mutateAsync,
    reopenComplaint: reopenComplaint.mutateAsync,
    addComment: addComment.mutateAsync,
    getComments,
    submitFeedback: submitFeedback.mutateAsync,
    getSlaSummary,
    getCategories,
  };
}

export function useBilling() {
  const listBills = (params: { page?: number; pageSize?: number; status?: string[]; unitId?: string; dateFrom?: string; dateTo?: string } = {}) =>
    useQuery(['bills', 'list', params], () => apiService.listBills(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getBill = (billId: string) =>
    useQuery(['bills', 'detail', billId], () => apiService.getBill(billId), {
      enabled: apiService.isAuthenticated() && !!billId,
    });

  const getBillReceipt = (billId: string) =>
    useQuery(['bills', 'receipt', billId], () => apiService.getBillReceipt(billId), {
      enabled: apiService.isAuthenticated() && !!billId,
    });

  const getBillingSummary = () =>
    useQuery(['billing', 'summary'], () => apiService.getBillingSummary(), {
      enabled: apiService.isAuthenticated(),
    });

  const createPaymentOrder = useMutation(
    (request: CreatePaymentOrderRequest) => apiService.createPaymentOrder(request),
    { onSuccess: () => {} }
  );

  const mockPaymentConfirm = useMutation(
    ({ orderId, status }: { orderId: string; status: 'SUCCESS' | 'FAILED' }) => apiService.mockPaymentConfirm(orderId, status),
    { onSuccess: () => {} }
  );

  return {
    listBills,
    getBill,
    getBillReceipt,
    getBillingSummary,
    createPaymentOrder: createPaymentOrder.mutateAsync,
    mockPaymentConfirm: mockPaymentConfirm.mutateAsync,
  };
}

export function useFacilities() {
  const listFacilities = (params: { page?: number; pageSize?: number; category?: string; status?: string } = {}) =>
    useQuery(['facilities', 'list', params], () => apiService.listFacilities(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getFacility = (facilityId: string) =>
    useQuery(['facilities', 'detail', facilityId], () => apiService.getFacility(facilityId), {
      enabled: apiService.isAuthenticated() && !!facilityId,
    });

  const getAvailability = (request: AvailabilityRequest) =>
    useQuery(['facilities', 'availability', request], () => apiService.getFacilityAvailability(request), {
      enabled: apiService.isAuthenticated() && !!request.facilityId,
    });

  const listBookings = (params: { page?: number; pageSize?: number; facilityId?: string; status?: string; dateFrom?: string; dateTo?: string; unitId?: string } = {}) =>
    useQuery(['facilities', 'bookings', params], () => apiService.listFacilityBookings(params), {
      enabled: apiService.isAuthenticated(),
    });

  const createBooking = useMutation(
    (request: CreateBookingRequest) => apiService.createFacilityBooking(request),
    { onSuccess: () => {} }
  );

  const cancelBooking = useMutation(
    ({ bookingId, reason }: { bookingId: string; reason: string }) => apiService.cancelFacilityBooking(bookingId, reason),
    { onSuccess: () => {} }
  );

  return {
    listFacilities,
    getFacility,
    getAvailability,
    listBookings,
    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutateAsync,
  };
}

export function useNotices() {
  const listNotices = (params: NoticeListParams = {}) =>
    useQuery(['notices', 'list', params], () => apiService.listNotices(params), {
      enabled: apiService.isAuthenticated(),
    });

  const getNotice = (noticeId: string) =>
    useQuery(['notices', 'detail', noticeId], () => apiService.getNotice(noticeId), {
      enabled: apiService.isAuthenticated() && !!noticeId,
    });

  const acknowledgeNotice = useMutation(
    (noticeId: string) => apiService.acknowledgeNotice(noticeId),
    { onSuccess: () => {} }
  );

  const getUnreadCount = () =>
    useQuery(['notices', 'unreadCount'], () => apiService.getUnreadNoticeCount(), {
      enabled: apiService.isAuthenticated(),
      refetchInterval: 60000,
    });

  return {
    listNotices,
    getNotice,
    acknowledgeNotice: acknowledgeNotice.mutateAsync,
    getUnreadCount,
  };
}