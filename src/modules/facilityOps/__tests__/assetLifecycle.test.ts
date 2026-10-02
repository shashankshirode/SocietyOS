import { AssetService } from '../services/assetService';
import { WorkOrderService } from '../services/workOrderService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Asset Lifecycle', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });

  const assetService = AssetService.getInstance();
  const workOrderService = WorkOrderService.getInstance();

  beforeEach(() => {
    assetService.clear();
    workOrderService.clear();
  });

  test('validates duplicate asset code and duplicate serial number', () => {
    assetService.createAsset(
      {
        assetName: 'Main Substation Transformer 1',
        assetCode: 'AST-TX-01',
        serialNumber: 'SN-TX-9988',
        category: 'ELECTRICAL',
        location: 'Substation Yard',
        installationDate: '2023-01-01',
        purchaseDate: '2022-12-01',
        vendorId: 'vnd-abb',
        vendorName: 'ABB India',
        warrantyExpiry: '2028-01-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'HALF_YEARLY',
      },
      manager
    );

    expect(() => {
      assetService.createAsset(
        {
          assetName: 'Transformer 2',
          assetCode: 'AST-TX-01',
          category: 'ELECTRICAL',
          location: 'Substation Yard',
          installationDate: '2023-01-01',
          purchaseDate: '2022-12-01',
          vendorId: 'vnd-abb',
          vendorName: 'ABB India',
          warrantyExpiry: '2028-01-01',
          warrantyStatus: 'ACTIVE',
          serviceFrequency: 'HALF_YEARLY',
        },
        manager
      );
    }).toThrow('DUPLICATE_ASSET_CODE');

    expect(() => {
      assetService.createAsset(
        {
          assetName: 'Transformer 3',
          assetCode: 'AST-TX-03',
          serialNumber: 'SN-TX-9988',
          category: 'ELECTRICAL',
          location: 'Substation Yard',
          installationDate: '2023-01-01',
          purchaseDate: '2022-12-01',
          vendorId: 'vnd-abb',
          vendorName: 'ABB India',
          warrantyExpiry: '2028-01-01',
          warrantyStatus: 'ACTIVE',
          serviceFrequency: 'HALF_YEARLY',
        },
        manager
      );
    }).toThrow('DUPLICATE_SERIAL');
  });

  test('prevents asset transfer to invalid or same destination location', () => {
    const asset = assetService.createAsset(
      {
        assetName: 'Hydro-Pneumatic Pump 1',
        category: 'WATER_PUMP',
        location: 'Basement B2 Pump Room',
        installationDate: '2024-06-01',
        purchaseDate: '2024-05-01',
        vendorId: 'vnd-grundfos',
        vendorName: 'Grundfos',
        warrantyExpiry: '2026-06-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    expect(() => {
      assetService.transferAsset(
        {
          assetId: asset.id,
          toLocation: '',
          reason: 'Relocating',
        },
        manager
      );
    }).toThrow('INVALID_LOCATION: Destination location must be non-empty');

    expect(() => {
      assetService.transferAsset(
        {
          assetId: asset.id,
          toLocation: 'Basement B2 Pump Room',
          reason: 'Same location test',
        },
        manager
      );
    }).toThrow('INVALID_LOCATION: Destination location must differ from current location');
  });

  test('retires asset cleanly and links replacement asset', () => {
    const oldAsset = assetService.createAsset(
      {
        assetName: 'Old Swimming Pool Chlorinator',
        category: 'SWIMMING_POOL',
        location: 'Clubhouse Pool Deck',
        installationDate: '2018-01-01',
        purchaseDate: '2017-12-01',
        vendorId: 'vnd-pool',
        vendorName: 'PoolCare',
        warrantyExpiry: '2020-01-01',
        warrantyStatus: 'EXPIRED',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    const newAsset = assetService.createAsset(
      {
        assetName: 'Automated Salt Chlorinator Pro',
        category: 'SWIMMING_POOL',
        location: 'Clubhouse Pool Deck',
        installationDate: '2026-03-01',
        purchaseDate: '2026-02-15',
        vendorId: 'vnd-pool',
        vendorName: 'PoolCare',
        warrantyExpiry: '2029-03-01',
        warrantyStatus: 'ACTIVE',
        serviceFrequency: 'MONTHLY',
      },
      manager
    );

    const retired = assetService.retireAsset(
      {
        assetId: oldAsset.id,
        reason: 'Replaced by Automated Salt Chlorinator Pro',
        replacementAssetId: newAsset.id,
      },
      manager
    );

    expect(retired.lifecycleStatus).toBe('RETIRED');
    expect(retired.operationalCondition).toBe('DECOMMISSIONED');
    expect(retired.replacementAssetId).toBe(newAsset.id);
  });
});
