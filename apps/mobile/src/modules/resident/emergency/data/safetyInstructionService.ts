import { emergencySafetyRepository } from './emergencySafety.repository';
import type { SafetyInstruction, SafetyDrillRecord, SafetyInstructionCategory, SafetyDrillType, SafetyDrillStatus, CreateSafetyDrillInput, CreatePostIncidentReviewInput, PostIncidentReview } from '../../../../shared/types/safety.types';
import type { EmergencyIncident } from '../../../../shared/types/emergency.types';
import { generateClientOperationId } from './emergencySafety.types';
class SafetyInstructionService {
    private static instance: SafetyInstructionService;
    private instructionCache: Map<SafetyInstructionCategory, SafetyInstruction[]> = new Map();
    static getInstance(): SafetyInstructionService {
        if (!SafetyInstructionService.instance) {
            SafetyInstructionService.instance = new SafetyInstructionService();
        }
        return SafetyInstructionService.instance;
    }
    async getInstructions(category?: SafetyInstructionCategory): Promise<SafetyInstruction[]> {
        const filters = category ? { category } : undefined;
        const instructions = await emergencySafetyRepository.getSafetyInstructions(filters);
        if (category) {
            this.instructionCache.set(category, instructions);
        }
        return instructions;
    }
    async getInstructionById(id: string): Promise<SafetyInstruction | null> {
        for (const [, instructions] of this.instructionCache) {
            const found = instructions.find(i => i.id === id);
            if (found)
                return found;
        }
        const all = await this.getInstructions();
        return all.find(i => i.id === id) ?? null;
    }
    async getInstructionsForEmergency(emergencyType: string): Promise<SafetyInstruction[]> {
        const categoryMap: Record<string, SafetyInstructionCategory> = {
            MEDICAL: 'MEDICAL',
            FIRE: 'FIRE',
            LIFT_STUCK: 'LIFT',
            SECURITY_THREAT: 'SECURITY',
            WATER: 'SECURITY',
            ELECTRICAL: 'SECURITY',
            SENIOR_HELP: 'SENIOR_HELP',
            CHILD_SAFETY: 'CHILD_SAFETY',
            PET_EMERGENCY: 'PET_EMERGENCY',
            SOS: 'MEDICAL',
        };
        const category = categoryMap[emergencyType] || 'OTHER';
        return this.getInstructions(category);
    }
}
class SafetyDrillService {
    private static instance: SafetyDrillService;
    static getInstance(): SafetyDrillService {
        if (!SafetyDrillService.instance) {
            SafetyDrillService.instance = new SafetyDrillService();
        }
        return SafetyDrillService.instance;
    }
    async getDrills(filters?: Record<string, string>): Promise<SafetyDrillRecord[]> {
        return emergencySafetyRepository.getSafetyDrills(filters);
    }
    async createDrill(input: CreateSafetyDrillInput & {
        clientOperationId?: string;
    }): Promise<SafetyDrillRecord> {
        const clientOperationId = input.clientOperationId ?? generateClientOperationId('drill');
        return emergencySafetyRepository.createSafetyDrill({
            ...input,
            clientOperationId,
        });
    }
    async getDrillById(id: string): Promise<SafetyDrillRecord | null> {
        const drills = await this.getDrills();
        return drills.find(d => d.id === id) ?? null;
    }
    async getUpcomingDrills(): Promise<SafetyDrillRecord[]> {
        const drills = await this.getDrills();
        const now = new Date().toISOString();
        return drills
            .filter(d => d.status === 'PLANNED' && d.scheduledDate > now)
            .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));
    }
    async getPastDrills(): Promise<SafetyDrillRecord[]> {
        const drills = await this.getDrills();
        const now = new Date().toISOString();
        return drills
            .filter(d => d.scheduledDate <= now || d.status !== 'PLANNED')
            .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
    }
}
class TestModeService {
    private static instance: TestModeService;
    private testIncidents: Set<string> = new Set();
    static getInstance(): TestModeService {
        if (!TestModeService.instance) {
            TestModeService.instance = new TestModeService();
        }
        return TestModeService.instance;
    }
    isTestMode(): boolean {
        return __DEV__ || process.env.EXPO_PUBLIC_TEST_MODE === 'true';
    }
    async createTestSos(input: {
        unitId: string;
        flatNumber: string;
        tower: string;
        note?: string;
    }): Promise<{
        test: true;
        incidentId: string;
        message: string;
    }> {
        if (!this.isTestMode()) {
            throw new Error('TEST_MODE_NOT_ENABLED: Test mode only available in development');
        }
        const testIncidentId = `test-inc-${generateClientOperationId('test')}`;
        this.testIncidents.add(testIncidentId);
        return {
            test: true,
            incidentId: testIncidentId,
            message: `TEST SOS created: ${input.note || 'Test emergency'}. No real responders notified.`,
        };
    }
    async createTestIncident(input: {
        emergencyType: string;
        severity: string;
        location: string;
        description?: string;
    }): Promise<{
        test: true;
        incidentId: string;
        message: string;
    }> {
        if (!this.isTestMode()) {
            throw new Error('TEST_MODE_NOT_ENABLED: Test mode only available in development');
        }
        const testIncidentId = `test-inc-${generateClientOperationId('test')}`;
        this.testIncidents.add(testIncidentId);
        return {
            test: true,
            incidentId: testIncidentId,
            message: `TEST INCIDENT created: ${input.emergencyType} at ${input.location}. No real responders notified.`,
        };
    }
    isTestIncident(incidentId: string): boolean {
        return this.testIncidents.has(incidentId) || incidentId.startsWith('test-');
    }
    getTestModeWarning(): string {
        return '⚠️ TEST MODE ACTIVE - No real emergency responders will be notified. All actions are simulated.';
    }
}
class PostIncidentReviewService {
    private static instance: PostIncidentReviewService;
    static getInstance(): PostIncidentReviewService {
        if (!PostIncidentReviewService.instance) {
            PostIncidentReviewService.instance = new PostIncidentReviewService();
        }
        return PostIncidentReviewService.instance;
    }
    async createReview(input: CreatePostIncidentReviewInput & {
        clientOperationId?: string;
    }): Promise<PostIncidentReview> {
        const clientOperationId = input.clientOperationId ?? generateClientOperationId('review');
        return emergencySafetyRepository.createPostIncidentReview({
            ...input,
            clientOperationId,
        });
    }
    async getReviewsForIncident(incidentId: string): Promise<PostIncidentReview[]> {
        return [];
    }
    async calculateResponseMetrics(incident: EmergencyIncident): Promise<{
        timeToFirstAck?: number;
        timeToFirstReach?: number;
        timeToUnderControl?: number;
        timeToResolved?: number;
        timeToClosed?: number;
    }> {
        return {};
    }
}
export const safetyInstructionService = SafetyInstructionService.getInstance();
export const safetyDrillService = SafetyDrillService.getInstance();
export const testModeService = TestModeService.getInstance();
export const postIncidentReviewService = PostIncidentReviewService.getInstance();

