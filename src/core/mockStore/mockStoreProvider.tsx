import React, { createContext, useEffect, useState } from 'react';
import { mockStore } from './mockStore';
import type { MockStoreState } from './mockStore.types';

type MockStoreContextValue = {
  state: MockStoreState;
  reset: () => void;
  addVisitor: typeof mockStore.addVisitor;
  updateVisitor: typeof mockStore.updateVisitor;
  addComplaint: typeof mockStore.addComplaint;
  updateComplaint: typeof mockStore.updateComplaint;
  addNotice: typeof mockStore.addNotice;
  updateNotice: typeof mockStore.updateNotice;
  addBill: typeof mockStore.addBill;
  updateBill: typeof mockStore.updateBill;
  addDocument: typeof mockStore.addDocument;
  addNoc: typeof mockStore.addNoc;
  updateNoc: typeof mockStore.updateNoc;
  addStaff: typeof mockStore.addStaff;
  updateStaff: typeof mockStore.updateStaff;
  updateResident: typeof mockStore.updateResident;
  updateResidentNew: typeof mockStore.updateResidentNew;
  updateSocietyHierarchy: typeof mockStore.updateSocietyHierarchy;
  updateSocietyUnit: typeof mockStore.updateSocietyUnit;
  addSocietyUnitsBulk: typeof mockStore.addSocietyUnitsBulk;
  addChatThread: typeof mockStore.addChatThread;
  updateChatThread: typeof mockStore.updateChatThread;
  addInterFlatIssue: typeof mockStore.addInterFlatIssue;
  updateInterFlatIssue: typeof mockStore.updateInterFlatIssue;
  addFacilityBooking: typeof mockStore.addFacilityBooking;
  updateFacilityBooking: typeof mockStore.updateFacilityBooking;
  addVehicle: typeof mockStore.addVehicle;
  updateVehicle: typeof mockStore.updateVehicle;
  addGateLog: typeof mockStore.addGateLog;
  addLedgerEntry: typeof mockStore.addLedgerEntry;
};

export const MockStoreContext = createContext<MockStoreContextValue | null>(null);

export function MockStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MockStoreState>(mockStore.getState());

  useEffect(() => {
    void mockStore.hydrate();
    const unsubscribe = mockStore.subscribe(() => {
      setState({ ...mockStore.getState() });
    });
    return unsubscribe;
  }, []);

  const value = {
    state,
    reset: () => mockStore.reset(),
    addVisitor: (visitor: Parameters<typeof mockStore.addVisitor>[0]) => mockStore.addVisitor(visitor),
    updateVisitor: (id: string, updates: Parameters<typeof mockStore.updateVisitor>[1]) => mockStore.updateVisitor(id, updates),
    addComplaint: (complaint: Parameters<typeof mockStore.addComplaint>[0]) => mockStore.addComplaint(complaint),
    updateComplaint: (id: string, updates: Parameters<typeof mockStore.updateComplaint>[1]) => mockStore.updateComplaint(id, updates),
    addNotice: (notice: Parameters<typeof mockStore.addNotice>[0]) => mockStore.addNotice(notice),
    updateNotice: (id: string, updates: Parameters<typeof mockStore.updateNotice>[1]) => mockStore.updateNotice(id, updates),
    addBill: (bill: Parameters<typeof mockStore.addBill>[0]) => mockStore.addBill(bill),
    updateBill: (id: string, updates: Parameters<typeof mockStore.updateBill>[1]) => mockStore.updateBill(id, updates),
    addDocument: (document: Parameters<typeof mockStore.addDocument>[0]) => mockStore.addDocument(document),
    addNoc: (noc: Parameters<typeof mockStore.addNoc>[0]) => mockStore.addNoc(noc),
    updateNoc: (id: string, updates: Parameters<typeof mockStore.updateNoc>[1]) => mockStore.updateNoc(id, updates),
    addStaff: (staff: Parameters<typeof mockStore.addStaff>[0]) => mockStore.addStaff(staff),
    updateStaff: (id: string, updates: Parameters<typeof mockStore.updateStaff>[1]) => mockStore.updateStaff(id, updates),
    updateResident: (id: string, updates: Parameters<typeof mockStore.updateResident>[1]) => mockStore.updateResident(id, updates),
    updateResidentNew: (id: string, updates: Parameters<typeof mockStore.updateResidentNew>[1]) => mockStore.updateResidentNew(id, updates),
    updateSocietyHierarchy: (hierarchy: Parameters<typeof mockStore.updateSocietyHierarchy>[0]) => mockStore.updateSocietyHierarchy(hierarchy),
    updateSocietyUnit: (id: string, updates: Parameters<typeof mockStore.updateSocietyUnit>[1]) => mockStore.updateSocietyUnit(id, updates),
    addSocietyUnitsBulk: (units: Parameters<typeof mockStore.addSocietyUnitsBulk>[0]) => mockStore.addSocietyUnitsBulk(units),
    addChatThread: (thread: Parameters<typeof mockStore.addChatThread>[0]) => mockStore.addChatThread(thread),
    updateChatThread: (id: string, updates: Parameters<typeof mockStore.updateChatThread>[1]) => mockStore.updateChatThread(id, updates),
    addInterFlatIssue: (issue: Parameters<typeof mockStore.addInterFlatIssue>[0]) => mockStore.addInterFlatIssue(issue),
    updateInterFlatIssue: (id: string, updates: Parameters<typeof mockStore.updateInterFlatIssue>[1]) => mockStore.updateInterFlatIssue(id, updates),
    addFacilityBooking: (booking: Parameters<typeof mockStore.addFacilityBooking>[0]) => mockStore.addFacilityBooking(booking),
    updateFacilityBooking: (id: string, updates: Parameters<typeof mockStore.updateFacilityBooking>[1]) => mockStore.updateFacilityBooking(id, updates),
    addVehicle: (vehicle: Parameters<typeof mockStore.addVehicle>[0]) => mockStore.addVehicle(vehicle),
    updateVehicle: (id: string, updates: Parameters<typeof mockStore.updateVehicle>[1]) => mockStore.updateVehicle(id, updates),
    addGateLog: (log: Parameters<typeof mockStore.addGateLog>[0]) => mockStore.addGateLog(log),
    addLedgerEntry: (entry: Parameters<typeof mockStore.addLedgerEntry>[0]) => mockStore.addLedgerEntry(entry),
  };

  return (
    <MockStoreContext.Provider value={value}>
      {children}
    </MockStoreContext.Provider>
  );
}
