import { MOCK_PERSONAS } from '../identity/personaRegistry';
import { evaluateCapability } from '../permissions/capabilityEngine';
import { domainEventBus } from '../events/DomainEventBus';
import { notificationResolver } from '../notifications/NotificationResolver';
import { updateHouseholdNotificationPolicy } from '../notifications/HouseholdNotificationPolicy';
import { emergencyRoutingService } from '../emergency/EmergencyRoutingService';
import { setCurrentSession } from '../auth/sessionStore';
import { visitorsMockSource } from '../../modules/resident/visitors/data/visitors.mockSource';
import { VisitorPassCancellationReason } from '../../shared/types/visitor.types';
import { facilityMockSource } from '../../modules/resident/facilityBooking/data/facility.mockSource';
import { billMockSource } from '../../modules/resident/billing/data/billing.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { mockStore } from '../mockStore/mockStore';
const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 50));
describe('Society OS — Complete Functional Core & Operating Model', () => {
    beforeEach(async () => {
        notificationResolver.clear();
        emergencyRoutingService.clear();
        domainEventBus.clearHistory();
        mockStore.reset();
    });
    it('Scenario 1: Sunita books Badminton Court -> records Sunita as actor, creates shared booking, and routes notifications to Sunita & Rohan', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.sunita.user.id,
            name: 'Sunita Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'sunita',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const cap = evaluateCapability(MOCK_PERSONAS.sunita, 'FACILITY_BOOK_FREE');
        expect(cap.status).toBe('ALLOWED');
        const res = await facilityMockSource.createFacilityBooking({
            unitId: 'unit-b804',
            facilityId: 'fac-badminton-01',
            facilityName: 'Badminton Court',
            bookingType: 'HOURLY',
            date: '2026-07-15',
            slot: '07:00 PM - 08:00 PM',
            purpose: 'Evening Practice',
            guestCount: 2,
            contactNumber: '+919876543211',
            setupRequired: false,
            rulesAccepted: true,
            damageConsentAccepted: true,
            chargeAmount: 0,
            depositAmount: 0,
            approvalRequired: false,
        });
        expect(res.ok).toBe(true);
        if (!res.ok)
            return;
        expect(res.data.createdByUserId).toBe(MOCK_PERSONAS.sunita.user.id);
        expect(res.data.createdByDisplayName).toBe('Sunita Sharma');
        await flushAsync();
        const sunitaNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.sunita.user.id);
        expect(sunitaNotifs.length).toBeGreaterThanOrEqual(1);
        expect(sunitaNotifs[0]?.title).toBe('Booking Confirmed');
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.length).toBeGreaterThanOrEqual(1);
        expect(rohanNotifs[0]?.body).toContain('Sunita booked Badminton Court');
        const activities = notificationResolver.getUnitActivities('unit-b804');
        expect(activities.length).toBeGreaterThanOrEqual(1);
        expect(activities[0]?.description).toContain('Sunita booked Badminton Court for 2026-07-15 · 07:00 PM - 08:00 PM');
    });
    it('Scenario 2: Amit creates Visitor Pass for Rajesh -> records Amit as host, shared in Unit B-804', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.amit.user.id,
            name: 'Amit Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'amit',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const res = await visitorsMockSource.create({
            name: 'Rajesh Kumar',
            phone: '+919876500001',
            type: 'GUEST',
            expectedDate: '2026-07-16',
            expectedTime: '04:30 PM',
            purpose: 'Friend visiting',
        });
        expect(res.ok).toBe(true);
        if (!res.ok)
            return;
        expect(res.data.createdByUserId).toBe(MOCK_PERSONAS.amit.user.id);
        expect(res.data.createdByDisplayName).toBe('Amit Sharma');
        await flushAsync();
        const amitNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.amit.user.id);
        expect(amitNotifs.length).toBeGreaterThanOrEqual(1);
        expect(amitNotifs[0]?.title).toBe('Visitor Pass Created');
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.length).toBeGreaterThanOrEqual(1);
        expect(rohanNotifs[0]?.body).toContain('Amit created visitor access for Rajesh Kumar');
    });
    it('Scenario 3: Sunita pays maintenance dues -> ledger attributes Sunita as payer, unit balance clears', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.sunita.user.id,
            name: 'Sunita Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'sunita',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const res = await billMockSource.mockPayment({
            activeHome: {
                homeContextId: 'ctx-palm-grove-sunita',
                residentId: 'res-sunita',
                societyId: 'soc-palm-grove-01',
                societyName: 'Palm Grove',
                societyAreaId: 'area-01',
                societyAreaName: 'Main',
                city: 'Mumbai',
                unitId: 'unit-b804',
                flatNumber: '804',
                displayUnitName: 'B-804',
                residentRole: 'familyMember',
                status: 'active',
                featureFlagScopeId: 'scope-default',
                permissionScopeId: 'scope-family',
                dataScopeKey: 'soc-palm-grove-01:unit-b804',
            },
            dataScopeKey: 'soc-palm-grove-01:unit-b804',
        }, {
            billId: 'advance_payment_maintenance',
            amount: 4850,
            paymentMethod: 'UPI',
        });
        expect(res.ok).toBe(true);
        if (!res.ok)
            return;
        const ledger = mockStore.getState().ledgerEntries;
        const latestPayment = ledger.find((e) => e.amount === 4850);
        expect(latestPayment).toBeDefined();
        expect(latestPayment?.description).toContain('Sunita Sharma');
        await flushAsync();
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.length).toBeGreaterThanOrEqual(1);
        expect(rohanNotifs[0]?.body).toContain('Sunita paid ₹4850 toward Advance Maintenance');
    });
    it('Scenario 4: Amit reports leakage complaint -> ticket attributes Amit as reporter', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.amit.user.id,
            name: 'Amit Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'amit',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const res = await complaintMockSource.create({
            title: 'Water Leakage in Bathroom',
            description: 'Pipe leaking under the sink.',
            category: 'WATER_LEAKAGE',
            priority: 'HIGH',
            location: 'Flat B-804 Master Bathroom',
        });
        expect(res.ok).toBe(true);
        if (!res.ok)
            return;
        expect(res.data.reportedByUserId).toBe(MOCK_PERSONAS.amit.user.id);
        expect(res.data.reportedByDisplayName).toBe('Amit Sharma');
        await flushAsync();
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.length).toBeGreaterThanOrEqual(1);
        expect(rohanNotifs[0]?.body).toContain('Amit reported Water Leakage in Bathroom');
    });
    it('Scenario 5 & 7: Amit triggers Medical SOS -> resolves mandatory society responders & household snapshot, Guard acknowledges same incident', async () => {
        const incident = await emergencyRoutingService.triggerEmergency(MOCK_PERSONAS.amit, 'MEDICAL', 'Tower B Floor 8');
        expect(incident.actor.userId).toBe(MOCK_PERSONAS.amit.user.id);
        expect(incident.actor.displayName).toBe('Amit');
        expect(incident.status).toBe('TRIGGERED');
        expect(incident.routingSnapshot.societyGroups).toContain('Main Gate Security');
        expect(incident.routingSnapshot.societyGroups).toContain('Society Emergency Primary');
        expect(incident.routingSnapshot.resolvedRecipients).toContain(MOCK_PERSONAS.vikram.user.id);
        expect(incident.routingSnapshot.resolvedRecipients).toContain(MOCK_PERSONAS.rohan.user.id);
        await flushAsync();
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.some((n) => n.body.includes('Amit requested urgent help'))).toBe(true);
        const acknowledged = await emergencyRoutingService.acknowledgeEmergency(MOCK_PERSONAS.vikram, incident.id, 'Guard Vikram dispatched to Tower B Unit 804 with first aid kit.');
        expect(acknowledged).not.toBeNull();
        expect(acknowledged?.id).toBe(incident.id);
        expect(acknowledged?.status).toBe('ACKNOWLEDGED');
        expect(acknowledged?.acknowledgedBy?.displayName).toBe('Vikram');
    });
    it('Scenario 6: SOS works with 0 configured household contacts via mandatory society fallback', async () => {
        await emergencyRoutingService.updateHouseholdEmergencyPolicy('unit-b804', []);
        const incident = await emergencyRoutingService.triggerEmergency(MOCK_PERSONAS.amit, 'FIRE', 'Kitchen Smoke');
        expect(incident).toBeDefined();
        expect(incident.status).toBe('TRIGGERED');
        expect(incident.routingSnapshot.societyGroups).toContain('Main Gate Security');
        expect(incident.routingSnapshot.societyGroups).toContain('Society Emergency Primary');
        expect(incident.routingSnapshot.resolvedRecipients).toContain(MOCK_PERSONAS.vikram.user.id);
    });
    it('Scenario 8: Notification delivery mode changes take effect on future events', async () => {
        await updateHouseholdNotificationPolicy('unit-b804', { FACILITIES: 'OFF' });
        await updateHouseholdNotificationPolicy('unit-a-1204', { FACILITIES: 'OFF' });
        await setCurrentSession({
            userId: MOCK_PERSONAS.sunita.user.id,
            name: 'Sunita Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'sunita',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        await facilityMockSource.createFacilityBooking({
            unitId: 'unit-b804',
            facilityId: 'fac-tennis-01',
            facilityName: 'Tennis Court',
            bookingType: 'HOURLY',
            date: '2026-07-20',
            slot: '06:00 PM - 07:00 PM',
            purpose: 'Match',
            guestCount: 2,
            contactNumber: '+919876543211',
            setupRequired: false,
            rulesAccepted: true,
            damageConsentAccepted: true,
            chargeAmount: 0,
            depositAmount: 0,
            approvalRequired: false,
        });
        await flushAsync();
        const sunitaNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.sunita.user.id);
        expect(sunitaNotifs.some((n) => n.title === 'Booking Confirmed')).toBe(true);
        const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
        expect(rohanNotifs.filter((n) => n.category === 'FACILITIES').length).toBe(0);
    });
    it('Scenario 9: Guard validates visitor pass at gate and rejects cancelled passes', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.sunita.user.id,
            name: 'Sunita Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'sunita',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const createRes = await visitorsMockSource.create({
            name: 'Pooja Varma',
            phone: '+919876543210',
            type: 'GUEST',
            expectedDate: '2026-07-16',
            expectedTime: '05:00 PM',
            purpose: 'Dinner',
        });
        expect(createRes.ok).toBe(true);
        if (!createRes.ok)
            return;
        const passId = createRes.data.id;
        const otp = createRes.data.otp;
        const gateRes = await visitorsMockSource.validatePassAtGate(passId, otp);
        expect(gateRes.ok).toBe(true);
        if (gateRes.ok) {
            expect(gateRes.data.visitor.status).toBe('CHECKED_IN');
        }
        const createRes2 = await visitorsMockSource.create({
            name: 'Karan Mehra',
            phone: '+919876543299',
            type: 'DELIVERY',
            expectedDate: '2026-07-16',
            expectedTime: '06:00 PM',
            purpose: 'Courier',
        });
        expect(createRes2.ok).toBe(true);
        if (!createRes2.ok)
            return;
        await visitorsMockSource.cancelVisitorPass({
            residenceId: 'unit-b804',
            visitorPassId: createRes2.data.id,
            reason: VisitorPassCancellationReason.Other,
            notes: 'Changed plans',
            requestedAt: new Date().toISOString(),
        });
        const cancelGateRes = await visitorsMockSource.validatePassAtGate(createRes2.data.id, createRes2.data.otp);
        expect(cancelGateRes.ok).toBe(false);
        if (!cancelGateRes.ok) {
            expect(cancelGateRes.error.code).toBe('PASS_CANCELLED');
        }
    });
    it('Scenario 10: Final slot race condition prevents double booking', async () => {
        await setCurrentSession({
            userId: MOCK_PERSONAS.sunita.user.id,
            name: 'Sunita Sharma',
            role: 'RESIDENT_FAMILY',
            personaKey: 'sunita',
            societyId: 'soc-palm-grove-01',
            unitId: 'unit-b804',
            unitLabel: 'B-804',
            isMockSession: true,
        });
        const firstBooking = await facilityMockSource.createFacilityBooking({
            unitId: 'unit-b804',
            facilityId: 'fac-squash-01',
            facilityName: 'Squash Court',
            bookingType: 'HOURLY',
            date: '2026-07-22',
            slot: '08:00 AM - 09:00 AM',
            purpose: 'Tournament',
            guestCount: 2,
            contactNumber: '+919876543211',
            setupRequired: false,
            rulesAccepted: true,
            damageConsentAccepted: true,
            chargeAmount: 0,
            depositAmount: 0,
            approvalRequired: false,
        });
        expect(firstBooking.ok).toBe(true);
        const secondBooking = await facilityMockSource.createFacilityBooking({
            unitId: 'unit-a-302',
            facilityId: 'fac-squash-01',
            facilityName: 'Squash Court',
            bookingType: 'HOURLY',
            date: '2026-07-22',
            slot: '08:00 AM - 09:00 AM',
            purpose: 'Practice',
            guestCount: 2,
            contactNumber: '+919876543222',
            setupRequired: false,
            rulesAccepted: true,
            damageConsentAccepted: true,
            chargeAmount: 0,
            depositAmount: 0,
            approvalRequired: false,
        });
        expect(secondBooking.ok).toBe(false);
        if (!secondBooking.ok) {
            expect(secondBooking.error.code).toBe('SLOT_UNAVAILABLE');
        }
    });
});

