import { Complaint, ParentIncident, CorrelationRule, CorrelationCandidate, CorrelationResult, ComplaintCategory, ComplaintStatus, DEFAULT_CORRELATION_RULES, } from './parentIncident.types';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../../core/audit';
import { mockStore } from '../../../../core/mockStore/mockStore';
class ParentIncidentEngine {
    private complaints: Map<string, Complaint> = new Map();
    private parentIncidents: Map<string, ParentIncident> = new Map();
    private correlationRules: Map<string, CorrelationRule> = new Map();
    private candidates: Map<string, CorrelationCandidate> = new Map();
    private listeners: Array<(incident: ParentIncident | null, type: 'created' | 'updated' | 'resolved' | 'candidate') => void> = [];
    constructor() {
        DEFAULT_CORRELATION_RULES.forEach(r => this.correlationRules.set(r.id, r));
        this.loadFromStorage();
    }
    private loadFromStorage(): void {
        try {
            if (typeof localStorage === 'undefined')
                return;
            const stored = localStorage.getItem('parent_incidents');
            if (stored) {
                const incidents = JSON.parse(stored);
                incidents.forEach((i: ParentIncident) => this.parentIncidents.set(i.id, i));
            }
            const complaints = localStorage.getItem('complaints');
            if (complaints) {
                const parsed = JSON.parse(complaints);
                parsed.forEach((c: Complaint) => this.complaints.set(c.id, c));
            }
            const candidates = localStorage.getItem('correlation_candidates');
            if (candidates) {
                const parsed = JSON.parse(candidates);
                parsed.forEach((c: CorrelationCandidate) => this.candidates.set(c.id, c));
            }
        }
        catch (_error) {
        }
    }
    private saveToStorage(): void {
        try {
            if (typeof localStorage === 'undefined')
                return;
            localStorage.setItem('parent_incidents', JSON.stringify(Array.from(this.parentIncidents.values())));
            localStorage.setItem('complaints', JSON.stringify(Array.from(this.complaints.values())));
            localStorage.setItem('correlation_candidates', JSON.stringify(Array.from(this.candidates.values())));
        }
        catch (_error) {
        }
    }
    registerComplaint(complaint: Complaint): void {
        this.complaints.set(complaint.id, complaint);
        this.saveToStorage();
        this.evaluateCorrelations(complaint);
    }
    getComplaint(id: string): Complaint | null {
        return this.complaints.get(id) ?? null;
    }
    getAllComplaints(): Complaint[] {
        return Array.from(this.complaints.values());
    }
    getParentIncidents(): ParentIncident[] {
        return Array.from(this.parentIncidents.values()).sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
    }
    getParentIncident(id: string): ParentIncident | null {
        return this.parentIncidents.get(id) ?? null;
    }
    getComplaintsByParent(parentId: string): Complaint[] {
        return Array.from(this.complaints.values()).filter(c => c.parentIncidentId === parentId);
    }
    getCandidates(): CorrelationCandidate[] {
        return Array.from(this.candidates.values()).filter(c => c.status === 'PENDING_REVIEW');
    }
    private evaluateCorrelations(newComplaint: Complaint): void {
        const activeRules = Array.from(this.correlationRules.values()).filter(r => r.enabled);
        for (const rule of activeRules) {
            if (rule.category && rule.category !== newComplaint.category)
                continue;
            const timeWindow = rule.timeWindowMinutes * 60 * 1000;
            const cutoffTime = new Date(newComplaint.reportedAt).getTime() - timeWindow;
            const relatedComplaints = Array.from(this.complaints.values()).filter(c => {
                if (c.id === newComplaint.id)
                    return false;
                if (c.parentIncidentId)
                    return false;
                if (new Date(c.reportedAt).getTime() < cutoffTime)
                    return false;
                if (rule.sameCategory && c.category !== newComplaint.category)
                    return false;
                if (rule.sameTower && c.tower !== newComplaint.tower)
                    return false;
                if (rule.sameFloor && c.floor !== newComplaint.floor)
                    return false;
                if (rule.keywords && rule.keywords.length > 0) {
                    const text = `${c.title} ${c.description}`.toLowerCase();
                    if (!rule.keywords.some(k => text.includes(k.toLowerCase())))
                        return false;
                }
                return true;
            });
            if (relatedComplaints.length + 1 >= rule.minComplaints) {
                const allComplaints = [newComplaint, ...relatedComplaints];
                const confidence = this.calculateConfidence(allComplaints, rule);
                if (confidence > 0.6) {
                    this.createCandidate(allComplaints, rule, confidence);
                }
            }
        }
    }
    private calculateConfidence(complaints: Complaint[], rule: CorrelationRule): number {
        let score = 0;
        const factors = 0;
        const times = complaints.map(c => new Date(c.reportedAt).getTime());
        const timeSpan = Math.max(...times) - Math.min(...times);
        const maxTimeSpan = rule.timeWindowMinutes * 60 * 1000;
        score += (1 - timeSpan / maxTimeSpan) * 0.3;
        const towers = new Set(complaints.map(c => c.tower));
        if (towers.size === 1)
            score += 0.2;
        const categories = new Set(complaints.map(c => c.category));
        if (categories.size === 1)
            score += 0.2;
        if (rule.keywords) {
            const matched = complaints.filter(c => rule.keywords!.some(k => `${c.title} ${c.description}`.toLowerCase().includes(k.toLowerCase()))).length;
            score += (matched / complaints.length) * 0.3;
        }
        return Math.min(score, 1);
    }
    private createCandidate(complaints: Complaint[], rule: CorrelationRule, confidence: number): void {
        const candidateId = `cand_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        const towers = Array.from(new Set(complaints.map(c => c.tower)));
        const floors = Array.from(new Set(complaints.map(c => c.floor)));
        const units = Array.from(new Set(complaints.map(c => c.unitId)));
        const candidate: CorrelationCandidate = {
            id: candidateId,
            ruleId: rule.id,
            ruleName: rule.name,
            complaints,
            confidence,
            suggestedParentTitle: `${rule.name} - ${towers.join(', ')}`,
            suggestedCategory: complaints[0]?.category ?? 'OTHER',
            suggestedPriority: this.calculatePriority(complaints),
            detectedAt: new Date().toISOString(),
            status: 'PENDING_REVIEW',
        };
        this.candidates.set(candidateId, candidate);
        this.saveToStorage();
        this.notifyListeners(null, 'candidate');
    }
    private calculatePriority(complaints: Complaint[]): 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY' {
        const priorities = complaints.map(c => c.priority);
        if (priorities.includes('EMERGENCY'))
            return 'EMERGENCY';
        if (priorities.includes('CRITICAL'))
            return 'CRITICAL';
        if (priorities.includes('HIGH'))
            return 'HIGH';
        if (priorities.includes('NORMAL'))
            return 'NORMAL';
        return 'LOW';
    }
    async confirmCandidate(candidateId: string, adminId: string): Promise<CorrelationResult | null> {
        const candidate = this.candidates.get(candidateId);
        if (!candidate || candidate.status !== 'PENDING_REVIEW')
            return null;
        const parentId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        const now = new Date().toISOString();
        const towers = Array.from(new Set(candidate.complaints.map(c => c.tower)));
        const floors = Array.from(new Set(candidate.complaints.map(c => c.floor)));
        const units = Array.from(new Set(candidate.complaints.map(c => c.unitId)));
        const parentIncident: ParentIncident = {
            id: parentId,
            title: candidate.suggestedParentTitle,
            description: `Auto-correlated from ${candidate.complaints.length} complaints via rule: ${candidate.ruleName}`,
            category: candidate.suggestedCategory,
            priority: candidate.suggestedPriority,
            status: 'CONFIRMED',
            detectedAt: candidate.detectedAt,
            confirmedAt: now,
            childComplaintIds: candidate.complaints.map(c => c.id),
            affectedUnits: units,
            affectedTowers: towers,
            affectedFloors: floors.map(String),
            correlationRuleId: candidate.ruleId,
            correlationConfidence: candidate.confidence,
            metadata: {},
            createdAt: now,
            updatedAt: now,
        };
        this.parentIncidents.set(parentId, parentIncident);
        for (const complaint of candidate.complaints) {
            complaint.parentIncidentId = parentId;
            complaint.isParentIncident = false;
            this.complaints.set(complaint.id, complaint);
        }
        candidate.status = 'CONFIRMED';
        candidate.reviewedBy = adminId;
        candidate.reviewedAt = now;
        candidate.parentIncidentId = parentId;
        this.candidates.set(candidateId, candidate);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'CREATE',
            entityType: 'PARENT_INCIDENT',
            entityId: parentId,
            newState: { childCount: candidate.complaints.length, confidence: candidate.confidence },
            idempotencyKey: createIdempotencyKey('parent_incident'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(parentIncident, 'created');
        return { parentIncidentId: parentId, linkedComplaintIds: candidate.complaints.map(c => c.id), confidence: candidate.confidence, ruleId: candidate.ruleId };
    }
    async rejectCandidate(candidateId: string, adminId: string): Promise<void> {
        const candidate = this.candidates.get(candidateId);
        if (!candidate)
            return;
        candidate.status = 'REJECTED';
        candidate.reviewedBy = adminId;
        candidate.reviewedAt = new Date().toISOString();
        this.candidates.set(candidateId, candidate);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'REJECT',
            entityType: 'PARENT_INCIDENT',
            entityId: candidateId,
            previousState: { status: 'PENDING_REVIEW' },
            newState: { status: 'REJECTED' },
            idempotencyKey: createIdempotencyKey('candidate_reject'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
    }
    async resolveParentIncident(parentId: string, adminId: string, rootCause: string, resolutionSummary: string): Promise<void> {
        const parent = this.parentIncidents.get(parentId);
        if (!parent)
            return;
        const now = new Date().toISOString();
        parent.status = 'RESOLVED';
        parent.resolvedAt = now;
        parent.rootCause = rootCause;
        parent.resolutionSummary = resolutionSummary;
        parent.updatedAt = now;
        this.parentIncidents.set(parentId, parent);
        for (const childId of parent.childComplaintIds) {
            const child = this.complaints.get(childId);
            if (child && child.status !== 'CLOSED') {
                child.status = 'RESOLVED';
                child.resolvedAt = now;
                child.resolutionSummary = resolutionSummary;
                this.complaints.set(childId, child);
            }
        }
        this.saveToStorage();
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'UPDATE',
            entityType: 'PARENT_INCIDENT',
            entityId: parentId,
            previousState: { status: parent.status },
            newState: { status: 'RESOLVED', rootCause, resolutionSummary },
            idempotencyKey: createIdempotencyKey('parent_resolve'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(parent, 'resolved');
    }
    async closeParentIncident(parentId: string, adminId: string): Promise<void> {
        const parent = this.parentIncidents.get(parentId);
        if (!parent)
            return;
        if (parent.status !== 'RESOLVED') {
            throw new Error('Parent incident must be resolved before closing');
        }
        const now = new Date().toISOString();
        parent.status = 'CLOSED';
        parent.closedAt = now;
        parent.updatedAt = now;
        this.parentIncidents.set(parentId, parent);
        for (const childId of parent.childComplaintIds) {
            const child = this.complaints.get(childId);
            if (child) {
                child.status = 'CLOSED';
                child.closedAt = now;
                this.complaints.set(childId, child);
            }
        }
        this.saveToStorage();
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'UPDATE',
            entityType: 'PARENT_INCIDENT',
            entityId: parentId,
            previousState: { status: 'RESOLVED' },
            newState: { status: 'CLOSED' },
            idempotencyKey: createIdempotencyKey('parent_close'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(parent, 'updated');
    }
    onUpdate(listener: (incident: ParentIncident | null, type: 'created' | 'updated' | 'resolved' | 'candidate') => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    private notifyListeners(incident: ParentIncident | null, type: 'created' | 'updated' | 'resolved' | 'candidate'): void {
        this.listeners.forEach(l => l(incident, type));
    }
}
export const parentIncidentEngine = new ParentIncidentEngine();

