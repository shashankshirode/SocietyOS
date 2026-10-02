import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { visitorLifecycleStore, type VisitorPassRecord, } from '../../resident/visitors/data/visitorLifecycle.store';
import { GuardHomeScreen } from '../screens/GuardHomeScreen';
import { GuardCurrentVisitorsScreen } from '../screens/GuardCurrentVisitorsScreen';
import { GuardEmergencyBypassModal } from '../screens/GuardEmergencyBypassModal';
describe('Guard Gate Operations & Invariant Engine (Flow 02)', () => {
    beforeEach(() => {
        visitorLifecycleStore.reset();
    });
    describe('Authoritative Lifecycle & Exception Invariants', () => {
        it('creates pass and progresses from APPROVED to CHECKED_IN upon authoritative gate entry', () => {
            const pass = visitorLifecycleStore.findPass('GH-902');
            expect(pass).toBeDefined();
            expect(pass?.status).toBe('APPROVED');
            const entryResult = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
                vehicleNumber: 'MH 12 QX 4048',
            });
            expect(entryResult.success).toBe(true);
            expect(entryResult.event).toBeDefined();
            expect(entryResult.event?.eventType).toBe('ENTRY');
            expect(entryResult.event?.gateName).toBe('Gate 01');
            const updatedPass = visitorLifecycleStore.findPass('GH-902');
            expect(updatedPass?.status).toBe('CHECKED_IN');
            expect(updatedPass?.entryTime).toBeDefined();
        });
        it('EXCEPTION E03: enforces strict idempotency and blocks duplicate entry', () => {
            const firstEntry = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
            });
            expect(firstEntry.success).toBe(true);
            const duplicateEntry = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
            });
            expect(duplicateEntry.success).toBe(false);
            expect(duplicateEntry.error).toMatch(/already inside society/i);
        });
        it('EXCEPTION E01: denies entry on an expired pass', () => {
            const expiredResult = visitorLifecycleStore.allowEntry('pass-expired-001', {
                gateName: 'Gate 01',
            });
            expect(expiredResult.success).toBe(false);
            expect(expiredResult.error).toMatch(/expired/i);
        });
        it('EXCEPTION E02: denies entry on a revoked pass', () => {
            visitorLifecycleStore.revokePass('pass-001');
            const pass = visitorLifecycleStore.findPass('GH-902');
            expect(pass?.status === 'CANCELLED' || (pass?.status as string) === 'REVOKED').toBe(true);
            const entryResult = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
            });
            expect(entryResult.success).toBe(false);
            expect(entryResult.error).toMatch(/revoked/i);
        });
        it('EXCEPTION E10: flags vehicle mismatch in recorded gate event', () => {
            const entryResult = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
                vehicleNumber: 'MH 14 AB 2211',
            });
            expect(entryResult.success).toBe(true);
            expect(entryResult.event?.vehicleMismatch).toBe(true);
            expect(entryResult.event?.vehicleNumber).toBe('MH 14 AB 2211');
        });
        it('SCREENS G10 & G11: records exit, closes visit, and computes duration', () => {
            visitorLifecycleStore.allowEntry('pass-001', { gateName: 'Gate 01' });
            const exitResult = visitorLifecycleStore.recordExit('pass-001', {
                gateId: 'Gate 01',
            });
            expect(exitResult.success).toBe(true);
            expect(exitResult.event?.eventType).toBe('EXIT');
            const closedPass = visitorLifecycleStore.findPass('GH-902');
            expect(closedPass?.status).toBe('CHECKED_OUT');
            expect(closedPass?.exitTime).toBeDefined();
        });
        it('EXCEPTION E09: logs emergency access bypass with operator audit credentials', () => {
            const bypassEvent = visitorLifecycleStore.emergencyBypass({
                emergencyType: 'AMBULANCE',
                reason: 'Cardiac emergency Tower A',
                gateName: 'Gate 01',
                operatorName: 'Ramesh Shinde (GRD-102)',
                targetUnit: 'A-1204',
                vehicleNumber: 'MH 12 EM 108',
            });
            expect(bypassEvent.id).toMatch(/^EMG-/);
            expect(bypassEvent.emergencyType).toBe('AMBULANCE');
            expect(bypassEvent.operatorName).toBe('Ramesh Shinde (GRD-102)');
            expect(bypassEvent.reason).toBe('Cardiac emergency Tower A');
            const log = visitorLifecycleStore.gateEvents.find((e) => e.id === bypassEvent.id);
            expect(log).toBeDefined();
        });
        it('EXCEPTIONS E07 & E08: supports offline queuing and deterministic sync recovery', () => {
            visitorLifecycleStore.setOfflineMode(true);
            expect(visitorLifecycleStore.offlineMode).toBe(true);
            const offlineEntry = visitorLifecycleStore.allowEntry('pass-001', {
                gateName: 'Gate 01',
            });
            expect(offlineEntry.success).toBe(true);
            expect(visitorLifecycleStore.offlineQueue.length).toBe(1);
            const syncedCount = visitorLifecycleStore.syncOfflineQueue();
            expect(syncedCount).toBe(1);
            expect(visitorLifecycleStore.offlineQueue.length).toBe(0);
            expect(visitorLifecycleStore.offlineMode).toBe(false);
        });
    });
    describe('Guard UI Screens', () => {
        it('renders Screen G02 Gate Home with Gate 01 badge, dominant scan CTA, and operational tiles', async () => {
            const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
            await renderWithProviders(<GuardHomeScreen navigation={navigationMock as any}/>);
            expect(screen.getByText('GATE 01')).toBeTruthy();
            expect(screen.getByText('Green Valley Heights')).toBeTruthy();
            expect(screen.getByText('Scan Visitor Pass')).toBeTruthy();
            expect(screen.getByText('Currently Inside')).toBeTruthy();
            expect(screen.getByText('Expected Today')).toBeTruthy();
            expect(screen.getByText('Search Pass')).toBeTruthy();
            expect(screen.getByText('Walk-in Visitor')).toBeTruthy();
            expect(screen.getByText('Emergency')).toBeTruthy();
        });
        it('renders Screen G08 Campus Occupancy and allows recording exit', async () => {
            visitorLifecycleStore.allowEntry('pass-001', { gateName: 'Gate 01' });
            const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
            await renderWithProviders(<GuardCurrentVisitorsScreen navigation={navigationMock as any}/>);
            expect(screen.getByText('Currently Inside')).toBeTruthy();
            expect(screen.getByText('Rahul Kulkarni')).toBeTruthy();
            expect(screen.getByText(/Record exit/i)).toBeTruthy();
        });
        it('renders Exception E09 Emergency Bypass Modal and logs access', async () => {
            const onCloseMock = jest.fn();
            const onSuccessMock = jest.fn();
            await renderWithProviders(<GuardEmergencyBypassModal visible={true} onClose={onCloseMock} onSuccess={onSuccessMock}/>);
            expect(screen.getByText('EMERGENCY ACCESS')).toBeTruthy();
            expect(screen.getByText('Emergency Gate Bypass')).toBeTruthy();
            expect(screen.getByText('ALLOW EMERGENCY ACCESS →')).toBeTruthy();
            const allowBtn = screen.getByTestId('allow-emergency-access-btn');
            fireEvent.press(allowBtn);
            expect(onSuccessMock).toHaveBeenCalledTimes(1);
            expect(await screen.findByText('Emergency Access Granted')).toBeTruthy();
        });
    });
});

