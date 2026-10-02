import { useMemo } from 'react';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { useActiveResidentHome } from '../../resident/homeContext';
import type { FacilityOperationsActor, FacilityOperationsRole, FacilityOperationsPermission } from '../data/facilityOpsActor.types';
import { createFacilityOperationsActor } from '../data/facilityOpsActor';

export function useFacilityOpsActor(): FacilityOperationsActor | null {
  const { activeContext } = useActiveResidentHome();
  const { session } = useAuthSession();

  return useMemo(() => {
    if (!activeContext || !session) {
      return null;
    }

    const role = mapResidentRoleToFacilityRole(activeContext.residentRole);

    return createFacilityOperationsActor({
      actorId: session.userId,
      actorName: session.name ?? 'Unknown',
      actorRole: role,
      societyId: activeContext.societyId ?? '',
      societyName: activeContext.societyName ?? '',
      approvalLimit: getApprovalLimitForRole(role),
      sessionId: session.userId,
    });
  }, [activeContext, session]);
}

export function useFacilityOpsActorOrThrow(): FacilityOperationsActor {
  const context = useFacilityOpsActor();
  if (!context) {
    throw new Error('Facility operations actor context unavailable: no active session or residence');
  }
  return context;
}

export function useFacilityOpsPermissions(): FacilityOperationsPermission[] {
  const actor = useFacilityOpsActor();
  return actor?.permissions ?? [];
}

export function useCan(permission: FacilityOperationsPermission): boolean {
  const permissions = useFacilityOpsPermissions();
  return permissions.includes(permission);
}

export function useCanViewVendors(): boolean { return useCan('VIEW_VENDORS'); }
export function useCanCreateVendor(): boolean { return useCan('CREATE_VENDOR'); }
export function useCanApproveVendor(): boolean { return useCan('APPROVE_VENDOR'); }
export function useCanViewContracts(): boolean { return useCan('VIEW_CONTRACTS'); }
export function useCanCreateContract(): boolean { return useCan('CREATE_CONTRACT'); }
export function useCanApproveContract(): boolean { return useCan('APPROVE_CONTRACT'); }
export function useCanViewAssets(): boolean { return useCan('VIEW_ASSETS'); }
export function useCanCreateAsset(): boolean { return useCan('CREATE_ASSET'); }
export function useCanTransferAsset(): boolean { return useCan('TRANSFER_ASSET'); }
export function useCanRetireAsset(): boolean { return useCan('RETIRE_ASSET'); }
export function useCanViewWorkOrders(): boolean { return useCan('VIEW_WORK_ORDERS'); }
export function useCanCreateWorkOrder(): boolean { return useCan('CREATE_WORK_ORDER'); }
export function useCanAssignWorkOrder(): boolean { return useCan('ASSIGN_WORK_ORDER'); }
export function useCanCompleteWorkOrder(): boolean { return useCan('COMPLETE_WORK_ORDER'); }
export function useCanVerifyWorkOrder(): boolean { return useCan('VERIFY_WORK_ORDER'); }
export function useCanCloseWorkOrder(): boolean { return useCan('CLOSE_WORK_ORDER'); }
export function useCanViewInventory(): boolean { return useCan('VIEW_INVENTORY'); }
export function useCanReceiveInventory(): boolean { return useCan('RECEIVE_INVENTORY'); }
export function useCanIssueInventory(): boolean { return useCan('ISSUE_INVENTORY'); }
export function useCanCreatePurchaseRequest(): boolean { return useCan('CREATE_PURCHASE_REQUEST'); }
export function useCanApprovePurchaseRequest(): boolean { return useCan('APPROVE_PURCHASE_REQUEST'); }
export function useCanCreatePurchaseOrder(): boolean { return useCan('CREATE_PURCHASE_ORDER'); }
export function useCanReceiveGoods(): boolean { return useCan('RECEIVE_GOODS'); }
export function useCanViewInvoices(): boolean { return useCan('VIEW_INVOICES'); }
export function useCanMatchInvoice(): boolean { return useCan('MATCH_INVOICE'); }
export function useCanApproveInvoice(): boolean { return useCan('APPROVE_INVOICE'); }
export function useCanViewFinancials(): boolean { return useCan('VIEW_FINANCIALS'); }
export function useCanApprovePayment(): boolean { return useCan('APPROVE_PAYMENT'); }

function mapResidentRoleToFacilityRole(role: string): FacilityOperationsRole {
  switch (role) {
    case 'owner':
    case 'coOwner':
      return 'COMMITTEE_MEMBER';
    case 'tenant':
    case 'familyMember':
    case 'authorizedOccupant':
      return 'COMMITTEE_MEMBER';
    default:
      return 'COMMITTEE_MEMBER';
  }
}

function getApprovalLimitForRole(role: FacilityOperationsRole): number {
  switch (role) {
    case 'FACILITY_MANAGER': return 500000;
    case 'ASSISTANT_FACILITY_MANAGER': return 100000;
    case 'PROCUREMENT_OFFICER': return 200000;
    case 'TREASURER': return 1000000;
    case 'CHAIRMAN': return 5000000;
    default: return 0;
  }
}