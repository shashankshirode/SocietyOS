import { InventoryService } from '../services/inventoryService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Inventory Movement Ledger', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });
  const technician = createActorFromSession({
    userId: 'usr-tech-1',
    name: 'Technician',
    societyId: 'soc-1',
    role: 'TECHNICIAN',
  });

  const invService = InventoryService.getInstance();

  beforeEach(() => {
    invService.clear();
  });

  test('prevents returning more items than were originally issued for a work order', () => {
    const item = invService.registerItem({
      id: 'inv-valve-quarter',
      itemName: 'Quarter Turn Valve',
      category: 'PLUMBING',
      currentStock: 10,
      unit: 'PIECES',
      minimumStockLevel: 2,
      location: 'Plumbing Store',
      lastIssuedDate: '',
      lastPurchasedDate: '',
      stockStatus: 'IN_STOCK',
    });

    invService.issueStock(
      {
        itemId: item.id,
        transactionType: 'ISSUE',
        quantity: 3,
        actor: technician.name,
        purpose: 'Plumbing repair in Tower A',
        linkedWorkOrderId: 'wo-plumb-101',
      },
      manager
    );

    invService.returnStock(
      {
        itemId: item.id,
        transactionType: 'RETURN',
        quantity: 2,
        actor: technician.name,
        purpose: 'Unused spares returned',
        linkedWorkOrderId: 'wo-plumb-101',
      },
      manager
    );

    expect(() => {
      invService.returnStock(
        {
          itemId: item.id,
          transactionType: 'RETURN',
          quantity: 2,
          actor: technician.name,
          purpose: 'Excess return attempt',
          linkedWorkOrderId: 'wo-plumb-101',
        },
        manager
      );
    }).toThrow('RETURN_EXCEEDS_ISSUED_QUANTITY: Issued 3, already returned 2, cannot return 2');
  });

  test('evaluates reorder recommendations without automatically initiating financial spend', () => {
    invService.registerItem({
      id: 'inv-chlorine-tab',
      itemName: 'Chlorine Tablets 200g',
      category: 'CLEANING',
      currentStock: 1,
      unit: 'KG',
      minimumStockLevel: 5,
      reorderThreshold: 5,
      location: 'Chemical Shed',
      lastIssuedDate: '',
      lastPurchasedDate: '',
      stockStatus: 'LOW_STOCK',
    });

    const recommendations = invService.evaluateReorderRecommendations();
    expect(recommendations.length).toBe(1);
    expect(recommendations[0].item.id).toBe('inv-chlorine-tab');
    expect(recommendations[0].recommendedQuantity).toBe(9);
  });
});
