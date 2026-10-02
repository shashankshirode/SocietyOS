import type {
  Asset,
  CreateAssetInput,
  TransferAssetInput,
  RetireAssetInput,
  AssetTransfer,
  AssetLifecycleStatus,
  AssetOperationalCondition,
} from '../../../shared/types/asset.types';
import type { FacilityIncident, OperationalImpact } from '../../../shared/types/workOrder.types';
import type { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { generateOperationId } from '../../../core/api/idempotency';
import { WorkOrderService } from './workOrderService';

export interface AssetCreationResult {
  asset: Asset;
  initialTransfer: AssetTransfer;
}

export interface AssetTransferResult {
  updatedAsset: Asset;
  transferRecord: AssetTransfer;
}

export interface AssetBreakdownResult {
  updatedAsset: Asset;
  incident: FacilityIncident;
  requiresEmergencyIncident: boolean;
}

export class AssetService {
  private static instance: AssetService;
  private assets: Map<string, Asset> = new Map();
  private transferHistory: Map<string, AssetTransfer[]> = new Map();
  private incidents: FacilityIncident[] = [];

  private constructor() {}

  static getInstance(): AssetService {
    if (!AssetService.instance) {
      AssetService.instance = new AssetService();
    }
    return AssetService.instance;
  }

  validateAssetCodeAndSerial(
    existingAssets: Asset[],
    newAssetCode: string,
    newSerialNumber?: string,
    excludeAssetId?: string
  ): void {
    const codeMatch = existingAssets.find(
      (a) => a.id !== excludeAssetId && a.assetCode.toLowerCase() === newAssetCode.toLowerCase()
    );
    if (codeMatch) {
      throw new Error(`DUPLICATE_ASSET_CODE: Asset with code "${newAssetCode}" already exists`);
    }

    if (newSerialNumber && newSerialNumber.trim().length > 0) {
      const serialMatch = existingAssets.find(
        (a) => a.id !== excludeAssetId && a.serialNumber && a.serialNumber.toLowerCase() === newSerialNumber.toLowerCase()
      );
      if (serialMatch) {
        throw new Error(`DUPLICATE_SERIAL: Asset with serial number "${newSerialNumber}" already exists`);
      }
    }
  }

  createAsset(
    input: CreateAssetInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): Asset {
    if (!actor.hasPermission('CREATE_ASSET') && !actor.hasPermission('MANAGE_ASSETS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to create asset');
    }

    const code = input.assetCode && input.assetCode.trim().length > 0
      ? input.assetCode
      : `AST-${actor.societyId.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    this.validateAssetCodeAndSerial(Array.from(this.assets.values()), code, input.serialNumber);

    const assetId = input.clientOperationId ?? generateOperationId('ast');

    const asset: Asset = {
      id: assetId,
      assetName: input.assetName,
      assetCode: code,
      category: input.category,
      location: input.location,
      status: 'ACTIVE',
      lifecycleStatus: 'ACTIVE',
      operationalCondition: 'OPERATIONAL',
      installationDate: input.installationDate,
      purchaseDate: input.purchaseDate,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      amcStatus: input.amcStatus ?? 'NOT_COVERED',
      warrantyExpiry: input.warrantyExpiry,
      warrantyStatus: input.warrantyStatus,
      lastServiceDate: '',
      ...(input.serialNumber ? { serialNumber: input.serialNumber } : {}),
      ...(input.model ? { model: input.model } : {}),
      nextServiceDate: '',
      serviceFrequency: input.serviceFrequency,
      healthScore: 100,
      openWorkOrders: 0,
      documents: [],
      documentVaultIds: input.documentVaultIds ? [...input.documentVaultIds] : [],
      serviceHistorySummary: 'Newly commissioned asset',
      breakdownCount: 0,
      notes: input.notes ?? '',
      ...(input.serialNumber ? { serialNumber: input.serialNumber } : {}),
      ...(input.model ? { model: input.model } : {}),
      ...(input.amcContractId ? { amcContractId: input.amcContractId } : {}),
      ...(input.amcContractNumber ? { amcContractNumber: input.amcContractNumber } : {}),
    };

    const initialTransfer: AssetTransfer = {
      id: generateOperationId('txfr'),
      assetId,
      fromLocation: 'PROCUREMENT / VENDOR',
      toLocation: input.location,
      transferredAt: now.toISOString(),
      transferredBy: actor.name,
      reason: 'Initial commissioning and placement',
    };

    this.assets.set(asset.id, asset);
    this.transferHistory.set(asset.id, [initialTransfer]);

    return asset;
  }

  transferAsset(
    input: TransferAssetInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): Asset {
    if (!actor.hasPermission('TRANSFER_ASSET') && !actor.hasPermission('MANAGE_ASSETS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to transfer asset');
    }

    const asset = this.assets.get(input.assetId);
    if (!asset) {
      throw new Error('ASSET_NOT_FOUND: Cannot transfer non-existent asset');
    }

    if (asset.lifecycleStatus === 'RETIRED' || asset.lifecycleStatus === 'DISPOSED') {
      throw new Error(`TRANSFER_BLOCKED: Cannot transfer asset in ${asset.lifecycleStatus} status`);
    }

    if (!input.toLocation || input.toLocation.trim().length === 0) {
      throw new Error('INVALID_LOCATION: Destination location must be non-empty');
    }

    if (asset.location.toLowerCase() === input.toLocation.trim().toLowerCase()) {
      throw new Error('INVALID_LOCATION: Destination location must differ from current location');
    }

    const transferRecord: AssetTransfer = {
      id: input.clientOperationId ?? generateOperationId('txfr'),
      assetId: asset.id,
      fromLocation: asset.location,
      toLocation: input.toLocation.trim(),
      transferredAt: now.toISOString(),
      transferredBy: actor.name,
      reason: input.reason,
    };

    const updatedAsset: Asset = {
      ...asset,
      location: input.toLocation.trim(),
    };

    this.assets.set(asset.id, updatedAsset);
    const history = this.transferHistory.get(asset.id) ?? [];
    history.push(transferRecord);
    this.transferHistory.set(asset.id, history);

    return updatedAsset;
  }

  retireAsset(
    input: RetireAssetInput,
    actor: FacilityOperationsActor,
    now = new Date()
  ): Asset {
    if (!actor.hasPermission('RETIRE_ASSET') && !actor.hasPermission('MANAGE_ASSETS')) {
      throw new Error('ACCESS_DENIED: Insufficient permissions to retire asset');
    }

    const asset = this.assets.get(input.assetId);
    if (!asset) {
      throw new Error('ASSET_NOT_FOUND: Cannot retire non-existent asset');
    }

    const workOrderService = WorkOrderService.getInstance();
    const openWorkOrders = workOrderService
      .getWorkOrders()
      .filter(
        (wo) =>
          wo.linkedAssetId === asset.id &&
          wo.status !== 'COMPLETED' &&
          wo.status !== 'VERIFIED' &&
          wo.status !== 'CLOSED' &&
          wo.status !== 'CANCELLED'
      );

    if (openWorkOrders.length > 0) {
      throw new Error(
        `ASSET_RETIREMENT_BLOCKED: Asset has ${openWorkOrders.length} active work order(s). Resolve or cancel them first.`
      );
    }

    const retiredAsset: Asset = {
      ...asset,
      status: 'RETIRED',
      lifecycleStatus: 'RETIRED' as AssetLifecycleStatus,
      operationalCondition: 'DECOMMISSIONED' as AssetOperationalCondition,
      retirementReason: input.reason,
      retiredAt: now.toISOString(),
      retiredBy: actor.name,
      ...(input.replacementAssetId ? { replacementAssetId: input.replacementAssetId } : {}),
    };

    this.assets.set(asset.id, retiredAsset);
    return retiredAsset;
  }

  reportBreakdown(
    assetId: string,
    description: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    operationalImpact: OperationalImpact,
    immediateActionTaken: string,
    actor: FacilityOperationsActor,
    now = new Date()
  ): FacilityIncident {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error('ASSET_NOT_FOUND');
    }

    const incident: FacilityIncident = {
      id: generateOperationId('inc'),
      assetId: asset.id,
      assetName: asset.assetName,
      reportedDate: now.toISOString().split('T')[0] ?? '',
      severity,
      operationalImpact,
      immediateActionTaken,
      vendorNotificationRequired: true,
    };

    const updatedAsset: Asset = {
      ...asset,
      operationalCondition: 'BREAKDOWN' as AssetOperationalCondition,
      breakdownCount: asset.breakdownCount + 1,
    };

    this.assets.set(asset.id, updatedAsset);
    this.incidents.push(incident);

    return incident;
  }

  getAsset(id: string): Asset | null {
    return this.assets.get(id) ?? null;
  }

  getAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  getTransferHistory(assetId: string): AssetTransfer[] {
    return this.transferHistory.get(assetId) ?? [];
  }

  clear(): void {
    this.assets.clear();
    this.transferHistory.clear();
    this.incidents = [];
  }
}

export const assetService = AssetService.getInstance();
