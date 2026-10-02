import type {
  AmcContract,
  AmcRenewalReminder,
  CreateAmcContractInput,
  RenewAmcContractInput,
  AmcStatus,
  AmcReminderStatus,
} from '../../../shared/types/amc.types';
import type { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { generateOperationId } from '../../../core/api/idempotency';

export interface AmcRenewalResult {
  newContract: AmcContract;
  supersededContract: AmcContract;
  renewalReminder: AmcRenewalReminder;
}

export class AmcContractService {
  private static instance: AmcContractService;
  private contracts: Map<string, AmcContract> = new Map();

  private constructor() {}

  static getInstance(): AmcContractService {
    if (!AmcContractService.instance) {
      AmcContractService.instance = new AmcContractService();
    }
    return AmcContractService.instance;
  }

  validateNoOverlap(
    existingContracts: AmcContract[],
    newLinkedAssets: string[],
    newStartDate: string,
    newEndDate: string,
    excludeContractId?: string
  ): void {
    const newStart = new Date(newStartDate).getTime();
    const newEnd = new Date(newEndDate).getTime();

    if (newEnd <= newStart) {
      throw new Error('VALIDATION_ERROR: Contract end date must be after start date');
    }

    for (const contract of existingContracts) {
      if (contract.id === excludeContractId) continue;
      if (contract.status !== 'ACTIVE' && contract.status !== 'EXPIRING_SOON') continue;

      const existingStart = new Date(contract.startDate).getTime();
      const existingEnd = new Date(contract.endDate).getTime();

      const datesOverlap = newStart < existingEnd && newEnd > existingStart;
      if (!datesOverlap) continue;

      const sharedAssets = contract.linkedAssets.filter((a) => newLinkedAssets.includes(a));
      if (sharedAssets.length > 0) {
        throw new Error(
          `CONTRACT_OVERLAP: Active contract ${contract.contractNumber} already covers asset(s) [${sharedAssets.join(', ')}] in this period`
        );
      }
    }
  }

  deriveReminder(contract: AmcContract, now = new Date()): AmcRenewalReminder {
    const endDate = new Date(contract.endDate);
    const diffMs = endDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'LOW';
    let status: AmcReminderStatus = 'UPCOMING';

    if (daysRemaining < 0) {
      priority = 'URGENT';
      status = 'OVERDUE';
    } else if (daysRemaining <= 15) {
      priority = 'URGENT';
      status = 'DUE_SOON';
    } else if (daysRemaining <= 45) {
      priority = 'HIGH';
      status = 'DUE_SOON';
    } else if (daysRemaining <= 90) {
      priority = 'MEDIUM';
      status = 'UPCOMING';
    }

    return {
      id: `reminder-${contract.id}`,
      contractId: contract.id,
      contractNumber: contract.contractNumber,
      vendorName: contract.vendorName,
      expiryDate: contract.endDate,
      daysRemaining,
      priority,
      status,
      responsiblePerson: 'Facility Manager',
      lastReminderDate: now.toISOString().split('T')[0] ?? '',
    };
  }

  createContract(
    input: CreateAmcContractInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): AmcContract {
    if (!actor.hasPermission('CREATE_CONTRACT') && !actor.hasPermission('MANAGE_CONTRACTS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to create contract');
    }

    if (!input.linkedAssets || input.linkedAssets.length === 0) {
      throw new Error('VALIDATION_ERROR: At least one asset must be linked to the AMC');
    }

    this.validateNoOverlap(Array.from(this.contracts.values()), input.linkedAssets, input.startDate, input.endDate);

    const contractId = input.clientOperationId ?? generateOperationId('amc');
    const contractNumber = `AMC-${actor.societyId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);
    const renewalNotice = new Date(endDate);
    renewalNotice.setMonth(renewalNotice.getMonth() - 3);

    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const contract: AmcContract = {
      id: contractId,
      contractNumber,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      category: input.category,
      linkedAssets: [...input.linkedAssets],
      startDate: input.startDate,
      endDate: input.endDate,
      renewalNoticeDate: renewalNotice.toISOString().split('T')[0] ?? input.startDate,
      renewalDueInDays: diffDays,
      contractAmount: input.contractAmount,
      status: 'ACTIVE' as AmcStatus,
      serviceFrequency: input.serviceFrequency,
      lastServiceDate: '',
      nextServiceDate: '',
      slaTerms: input.slaTerms,
      emergencyResponseTime: input.emergencyResponseTime,
      includedServices: [...input.includedServices],
      excludedServices: [...input.excludedServices],
      documents: [],
      documentVaultIds: input.documentVaultIds ? [...input.documentVaultIds] : [],
      renewalStatus: 'UPCOMING' as AmcReminderStatus,
      notes: input.notes ?? '',
      version: 1,
      createdAt: now.toISOString(),
      createdBy: actor.userId,
    };

    this.contracts.set(contract.id, contract);
    return contract;
  }

  renewContract(
    existingContractId: string,
    input: RenewAmcContractInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): AmcContract {
    if (!actor.hasPermission('RENEW_CONTRACT') && !actor.hasPermission('MANAGE_CONTRACTS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to renew contract');
    }

    const existingContract = this.contracts.get(existingContractId);
    if (!existingContract) {
      throw new Error('CONTRACT_NOT_FOUND: Contract to renew does not exist');
    }

    if (existingContract.status === 'TERMINATED' || existingContract.status === 'SUPERSEDED') {
      throw new Error(`RENEWAL_BLOCKED: Cannot renew contract in ${existingContract.status} status`);
    }

    const newStartDate = input.newStartDate ?? existingContract.endDate;
    this.validateNoOverlap(
      Array.from(this.contracts.values()),
      existingContract.linkedAssets,
      newStartDate,
      input.newEndDate,
      existingContractId
    );

    const newContractId = input.clientOperationId ?? generateOperationId('amc-ren');
    const newContractNumber = `${existingContract.contractNumber}-R${existingContract.version + 1}`;

    const newContract: AmcContract = {
      id: newContractId,
      contractNumber: newContractNumber,
      vendorId: existingContract.vendorId,
      vendorName: existingContract.vendorName,
      category: existingContract.category,
      linkedAssets: [...existingContract.linkedAssets],
      startDate: newStartDate,
      endDate: input.newEndDate,
      renewalNoticeDate: newStartDate,
      renewalDueInDays: 365,
      contractAmount: input.newContractAmount,
      serviceFrequency: input.newServiceFrequency ?? existingContract.serviceFrequency,
      lastServiceDate: existingContract.lastServiceDate,
      nextServiceDate: existingContract.nextServiceDate,
      slaTerms: input.newSlaTerms ?? existingContract.slaTerms,
      emergencyResponseTime: input.newEmergencyResponseTime ?? existingContract.emergencyResponseTime,
      includedServices: input.newIncludedServices ? [...input.newIncludedServices] : [...existingContract.includedServices],
      excludedServices: input.newExcludedServices ? [...input.newExcludedServices] : [...existingContract.excludedServices],
      documents: [],
      status: 'ACTIVE' as AmcStatus,
      renewalStatus: 'UPCOMING' as AmcReminderStatus,
      notes: input.notes ?? `Renewed from ${existingContract.contractNumber}`,
      version: existingContract.version + 1,
      previousVersionId: existingContract.id,
      createdAt: now.toISOString(),
      ...(actor.userId ? { createdBy: actor.userId } : {}),
      ...(input.newDocumentVaultIds ? { documentVaultIds: [...input.newDocumentVaultIds] } : (existingContract.documentVaultIds ? { documentVaultIds: [...existingContract.documentVaultIds] } : {})),
    };

    const supersededContract: AmcContract = {
      ...existingContract,
      status: 'SUPERSEDED' as AmcStatus,
      supersededAt: now.toISOString(),
      supersededBy: newContract.id,
    };

    this.contracts.set(existingContract.id, supersededContract);
    this.contracts.set(newContract.id, newContract);

    return newContract;
  }

  evaluateRenewalReminders(currentDate?: string): AmcRenewalReminder[] {
    const now = currentDate ? new Date(currentDate) : new Date();
    const reminders: AmcRenewalReminder[] = [];
    for (const contract of this.contracts.values()) {
      if (contract.status === 'ACTIVE' || contract.status === 'EXPIRING_SOON') {
        reminders.push(this.deriveReminder(contract, now));
      }
    }
    return reminders;
  }

  getContract(id: string): AmcContract | null {
    return this.contracts.get(id) ?? null;
  }

  getContracts(): AmcContract[] {
    return Array.from(this.contracts.values());
  }

  terminateContract(contractId: string, reason: string, actor: FacilityOperationsActor): AmcContract {
    if (!actor.hasPermission('TERMINATE_CONTRACT') && !actor.hasPermission('MANAGE_CONTRACTS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to terminate contract');
    }

    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new Error('CONTRACT_NOT_FOUND');
    }

    const terminated: AmcContract = {
      ...contract,
      status: 'TERMINATED',
      notes: `${contract.notes} | Terminated: ${reason}`,
    };
    this.contracts.set(contract.id, terminated);
    return terminated;
  }

  clear(): void {
    this.contracts.clear();
  }
}

export const amcContractService = AmcContractService.getInstance();
