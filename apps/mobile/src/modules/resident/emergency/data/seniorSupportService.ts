import { emergencySafetyRepository } from './emergencySafety.repository';
import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, SeniorCareStatus, SeniorCheckInStatus, SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';
import type { EmergencyIncident } from '../../../../shared/types/emergency.types';
import type { EmergencyActorContext } from './emergencyActor.types';
import { generateClientCheckInId, generateClientOperationId } from './emergencySafety.types';
import { emergencyService } from './emergencyService';
interface CheckInOccurrenceKey {
    seniorProfileId: string;
    scheduleRuleId: string;
    localDate: string;
}
class SeniorSupportService {
    private static instance: SeniorSupportService;
    private processedOccurrences: Set<string> = new Set();
    static getInstance(): SeniorSupportService {
        if (!SeniorSupportService.instance) {
            SeniorSupportService.instance = new SeniorSupportService();
        }
        return SeniorSupportService.instance;
    }
    private getOccurrenceKey(profileId: string, ruleId: string, date: string): string {
        return `${profileId}:${ruleId}:${date}`;
    }
    async getProfile(): Promise<SeniorCareProfile> {
        return emergencySafetyRepository.getSeniorCareProfile();
    }
    async updateProfile(input: Partial<SeniorCareProfile>): Promise<SeniorCareProfile> {
        return emergencySafetyRepository.updateSeniorCareProfile(input);
    }
    async enableSeniorSupport(actorContext: EmergencyActorContext, input: {
        dailyCheckInEnabled: boolean;
        checkInHour: number;
        checkInMinute: number;
        timezone: string;
        preferredHelpType?: string;
        priorityComplaintEnabled: boolean;
        securityCheckCallPreference?: string;
        familyConnectEnabled: boolean;
        consentConfirmed: boolean;
    }): Promise<SeniorCareProfile> {
        if (!input.consentConfirmed) {
            throw new Error('SENIOR_CONSENT_REQUIRED');
        }
        return this.updateProfile({
            seniorCareStatus: 'ENABLED',
            dailyCheckInEnabled: input.dailyCheckInEnabled,
            checkInHour: input.checkInHour,
            checkInMinute: input.checkInMinute,
            timezone: input.timezone,
            preferredHelpType: input.preferredHelpType ?? undefined,
            priorityComplaintEnabled: input.priorityComplaintEnabled,
            securityCheckCallPreference: input.securityCheckCallPreference ?? undefined,
            familyConnectEnabled: input.familyConnectEnabled,
            consentConfirmed: true,
            consentDate: new Date().toISOString(),
            missedCheckInEscalationMinutes: 60,
        } as Partial<SeniorCareProfile>);
    }
    async disableSeniorSupport(): Promise<SeniorCareProfile> {
        return this.updateProfile({
            seniorCareStatus: 'NOT_ENABLED',
            dailyCheckInEnabled: false,
            familyConnectEnabled: false,
        });
    }
    async pauseSeniorSupport(actorContext: EmergencyActorContext, input: {
        effectiveFrom: string;
        effectiveTo?: string;
        reason?: string;
    }): Promise<SeniorCareProfile> {
        return this.updateProfile({
            seniorCareStatus: 'PAUSED',
        });
    }
    async resumeSeniorSupport(): Promise<SeniorCareProfile> {
        return this.updateProfile({
            seniorCareStatus: 'ENABLED',
        });
    }
    async submitCheckIn(actorContext: EmergencyActorContext, input: SubmitSeniorCheckInInput & {
        clientCheckInId?: string;
    }): Promise<SeniorDailyCheckIn> {
        const profile = await this.getProfile();
        if (profile.seniorCareStatus !== 'ENABLED') {
            throw new Error('SENIOR_SUPPORT_NOT_ENABLED');
        }
        const today = new Date().toISOString().split('T')[0] ?? '';
        const occurrenceKey = this.getOccurrenceKey(profile.id, 'daily', today);
        if (this.processedOccurrences.has(occurrenceKey)) {
            const existing = await this.getTodaysCheckIn(profile.id);
            if (existing)
                return existing;
        }
        this.processedOccurrences.add(occurrenceKey);
        const clientCheckInId = input.clientCheckInId ?? generateClientCheckInId();
        const checkIn = await emergencySafetyRepository.submitSeniorCheckIn({
            status: input.status,
            notes: input.notes ?? undefined,
            clientCheckInId,
        } as SubmitSeniorCheckInInput & {
            clientCheckInId?: string;
        });
        if (input.status === 'HELP_REQUESTED') {
            await this.escalateHelpRequest(actorContext, profile, checkIn);
        }
        return checkIn;
    }
    private async getTodaysCheckIn(profileId: string): Promise<SeniorDailyCheckIn | null> {
        const today = new Date().toISOString().split('T')[0] ?? '';
        const checkIns = await emergencySafetyRepository.getSeniorCheckIns({ date: today });
        return checkIns.find(c => c.seniorId === profileId) ?? null;
    }
    private async escalateHelpRequest(actorContext: EmergencyActorContext, profile: SeniorCareProfile, checkIn: SeniorDailyCheckIn): Promise<void> {
        await emergencyService.createEmergencyBroadcast(profile.id, {
            broadcastType: 'SENIOR_HELP' as const,
            message: `Senior ${profile.name} (${profile.flatNumber} ${profile.tower}) requested help during check-in: ${checkIn.notes || 'No details provided'}`,
            severity: 'CRITICAL',
            targetAudience: 'SECURITY_FAMILY',
            affectedArea: `${profile.tower} ${profile.flatNumber}`,
        });
        await emergencyService.addTimelineEvent(profile.id, {
            eventType: 'SENIOR_HELP_REQUESTED' as any,
            note: `Senior ${profile.name} requested help during check-in`,
            source: 'RESIDENT_APP',
        });
    }
    async getCheckIns(filters?: Record<string, string>): Promise<SeniorDailyCheckIn[]> {
        return emergencySafetyRepository.getSeniorCheckIns(filters);
    }
    async getInactivityAlerts(filters?: Record<string, string>): Promise<SeniorInactivityAlert[]> {
        return emergencySafetyRepository.getSeniorInactivityAlerts(filters);
    }
    async acknowledgeInactivityAlert(alertId: string, input: {
        notes?: string;
        clientOperationId?: string;
    }): Promise<SeniorInactivityAlert> {
        const clientOperationId = input.clientOperationId ?? generateClientOperationId('ack-inact');
        return emergencySafetyRepository.acknowledgeSeniorInactivityAlert(alertId, {
            notes: input.notes ?? undefined,
            clientOperationId,
        } as {
            notes?: string;
            clientOperationId?: string;
        });
    }
    async escalateInactivityAlert(alertId: string, input: {
        notes?: string;
        clientOperationId?: string;
    }): Promise<SeniorInactivityAlert> {
        const clientOperationId = input.clientOperationId ?? generateClientOperationId('esc-inact');
        return emergencySafetyRepository.escalateSeniorInactivityAlert(alertId, {
            notes: input.notes ?? undefined,
            clientOperationId,
        } as {
            notes?: string;
            clientOperationId?: string;
        });
    }
    async runMissedCheckInJob(): Promise<{
        processed: number;
        missed: number;
        alertsCreated: number;
        errors: string[];
    }> {
        const profile = await this.getProfile();
        const errors: string[] = [];
        let processed = 0;
        let missed = 0;
        let alertsCreated = 0;
        try {
            if (profile.seniorCareStatus !== 'ENABLED' || !profile.dailyCheckInEnabled) {
                return { processed: 0, missed: 0, alertsCreated: 0, errors: ['Senior support not enabled'] };
            }
            const today = new Date().toISOString().split('T')[0] ?? '';
            const occurrenceKey = this.getOccurrenceKey(profile.id, 'daily', today);
            if (this.processedOccurrences.has(occurrenceKey)) {
                return { processed: 0, missed: 0, alertsCreated: 0, errors: ['Already processed'] };
            }
            const todaysCheckIn = await this.getTodaysCheckIn(profile.id);
            if (todaysCheckIn && todaysCheckIn.status !== 'MISSED') {
                this.processedOccurrences.add(occurrenceKey);
                return { processed: 1, missed: 0, alertsCreated: 0, errors: [] };
            }
            if (!todaysCheckIn) {
                missed = 1;
                this.processedOccurrences.add(occurrenceKey);
                const alertId = `inact-${generateClientOperationId('inact')}`;
                alertsCreated = 1;
                if (profile.familyConnectEnabled) {
                    await emergencyService.createEmergencyBroadcast(profile.id, {
                        broadcastType: 'SENIOR_HELP' as const,
                        message: `Missed check-in for ${profile.name} (${profile.flatNumber} ${profile.tower}). Last scheduled: ${profile.checkInHour || 9}:00`,
                        severity: 'WARNING',
                        targetAudience: 'FAMILY_SECURITY',
                        affectedArea: `${profile.tower} ${profile.flatNumber}`,
                    });
                }
                await emergencyService.addTimelineEvent(profile.id, {
                    eventType: 'SENIOR_CHECKIN_MISSED' as any,
                    note: `Missed check-in for ${profile.name}`,
                    source: 'SYSTEM',
                });
            }
            processed = 1;
        }
        catch (e) {
            errors.push(e instanceof Error ? e.message : 'Unknown error');
        }
        return { processed, missed, alertsCreated, errors };
    }
    async runInactivityEscalationJob(): Promise<{
        processed: number;
        escalated: number;
        incidentsCreated: number;
        errors: string[];
    }> {
        const alerts = await this.getInactivityAlerts({ status: 'OPEN' });
        const errors: string[] = [];
        let processed = 0;
        let escalated = 0;
        let incidentsCreated = 0;
        for (const alert of alerts) {
            try {
                const profile = await this.getProfile();
                const missedTime = new Date(alert.missedCheckInTime).getTime();
                const now = Date.now();
                const elapsedMinutes = (now - missedTime) / (1000 * 60);
                if (elapsedMinutes >= (profile.missedCheckInEscalationMinutes ?? 60)) {
                    if (alert.alertStatus === 'OPEN') {
                        await this.escalateInactivityAlert(alert.id, {
                            notes: `Auto-escalated after ${Math.floor(elapsedMinutes)} minutes`,
                        });
                        escalated++;
                        if (elapsedMinutes >= (profile.missedCheckInEscalationMinutes ?? 60) * 2) {
                            await emergencyService.triggerSos({
                                unitId: profile.unitId,
                                flatNumber: profile.flatNumber,
                                tower: profile.tower,
                                note: `Senior inactivity escalation: ${profile.name} missed check-in for ${Math.floor(elapsedMinutes)} minutes`,
                            }, {
                                actorId: 'system',
                                actorName: 'System',
                                actorRole: 'FACILITY_MANAGER',
                                sessionId: 'system',
                                societyId: '',
                                societyName: '',
                                residenceId: '',
                                unitId: profile.unitId,
                                flatNumber: profile.flatNumber,
                                tower: profile.tower,
                                residentRole: 'owner',
                                emergencyPermissions: ['TRIGGER_SOS'],
                                deviceContext: { deviceId: 'system', platform: 'web', appVersion: '1.0.0', hasLocationPermission: false, isOnline: true },
                                isTestMode: false,
                            });
                            incidentsCreated++;
                        }
                    }
                }
                processed++;
            }
            catch (e) {
                errors.push(e instanceof Error ? e.message : 'Unknown error');
            }
        }
        return { processed, escalated, incidentsCreated, errors };
    }
}
export const seniorSupportService = SeniorSupportService.getInstance();

