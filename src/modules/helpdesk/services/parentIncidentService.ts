import type {
  Complaint,
  ParentIncident,
  CorrelationRule,
  CorrelationCandidate,
  CorrelationResult,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../../../shared/types/complaintPhase6';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { slaEngine } from './slaEngine';

export interface CorrelationResult {
  parentIncidentId: string;
  linkedComplaintIds: string[];
  confidence: number;
  ruleId: string;
}

export interface ParentIncidentResolutionInput {
  parentIncidentId: string;
  adminId: string;
  rootCause: string;
  resolutionSummary: string;
}

export interface ParentIncidentCloseInput {
  parentIncidentId: string;
  adminId: string;
}

export class ParentIncidentService {
  private static instance: ParentIncidentService;

  static getInstance(): ParentIncidentService {
    if (!ParentIncidentService.instance) {
      ParentIncidentService.instance = new ParentIncidentService();
    }
    return ParentIncidentService.instance;
  }

  private correlationRules: CorrelationRule[] = [
    {
      id: 'rule-water-pressure',
      name: 'Low Water Pressure Cluster',
      description: 'Multiple low water pressure complaints in same tower within 30 minutes',
      category: 'WATER_LEAKAGE',
      timeWindowMinutes: 30,
      minComplaints: 3,
      sameTower: true,
      sameFloor: false,
      sameCategory: true,
      keywords: ['water pressure', 'low pressure', 'no water'],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rule-power-outage',
      name: 'Power Outage Cluster',
      description: 'Multiple power outage complaints in same area',
      category: 'ELECTRICAL',
      timeWindowMinutes: 15,
      minComplaints: 2,
      sameTower: true,
      sameFloor: false,
      sameCategory: true,
      keywords: ['power outage', 'no electricity', 'power cut'],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rule-lift-stuck',
      name: 'Lift Stuck Cluster',
      description: 'Multiple lift stuck complaints for same lift',
      category: 'LIFT',
      timeWindowMinutes: 60,
      minComplaints: 2,
      sameTower: true,
      sameFloor: false,
      sameCategory: true,
      keywords: ['lift stuck', 'elevator stuck', 'lift not working'],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rule-security',
      name: 'Security Incident Cluster',
      description: 'Multiple security complaints in nearby units',
      category: 'SECURITY',
      timeWindowMinutes: 60,
      minComplaints: 2,
      locationRadiusMeters: 50,
      sameTower: false,
      sameFloor: false,
      sameCategory: true,
      keywords: ['theft', 'break in', 'suspicious', 'unauthorized entry'],
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async evaluateForCorrelation(newComplaint: Complaint): Promise<CorrelationCandidate[]> {
    return this.evaluateCorrelations(newComplaint);
  }

  async evaluateCorrelations(newComplaint: Complaint): Promise<CorrelationCandidate[]> {
    const activeRules = this.correlationRules.filter(r => r.enabled);
    const candidates: CorrelationCandidate[] = [];

    for (const rule of activeRules) {
      if (rule.category && rule.category !== newComplaint.category) continue;

      const timeWindow = rule.timeWindowMinutes * 60 * 1000;
      const cutoffTime = new Date(newComplaint.createdAt).getTime() - timeWindow;

      const complaints = mockStore.getState().complaints || [];
      const relatedComplaints = complaints.filter(c => {
        if (c.id === newComplaint.id) return false;
        if (c.parentIncidentId) return false;
        if (new Date(c.createdAt).getTime() < cutoffTime) return false;
        if (rule.sameCategory && c.category !== newComplaint.category) return false;
        if (rule.sameTower && c.tower !== newComplaint.tower) return false;
        if (rule.sameFloor && c.floor !== newComplaint.floor) return false;
        if (rule.keywords && rule.keywords.length > 0) {
          const text = `${c.title} ${c.description}`.toLowerCase();
          if (!rule.keywords.some(k => text.includes(k.toLowerCase()))) return false;
        }
        return true;
      });

      if (relatedComplaints.length + 1 >= rule.minComplaints) {
        const allComplaints = [newComplaint, ...relatedComplaints];
        const confidence = this.calculateConfidence(allComplaints, rule);
        if (confidence > 0.6) {
          candidates.push(await this.createCandidate(allComplaints, rule, confidence));
        }
      }
    }

    return candidates;
  }

  private calculateConfidence(complaints: Complaint[], rule: CorrelationRule): number {
    let score = 0;
    const times = complaints.map(c => new Date(c.createdAt).getTime());
    const timeSpan = Math.max(...times) - Math.min(...times);
    const maxTimeSpan = rule.timeWindowMinutes * 60 * 1000;
    score += (1 - timeSpan / maxTimeSpan) * 0.3;

    const towers = new Set(complaints.map(c => c.tower).filter(Boolean));
    if (towers.size === 1) score += 0.2;

    const categories = new Set(complaints.map(c => c.category));
    if (categories.size === 1) score += 0.2;

    if (rule.keywords) {
      const matched = complaints.filter(c => rule.keywords!.some(k => `${c.title} ${c.description}`.toLowerCase().includes(k.toLowerCase()))).length;
      score += (matched / complaints.length) * 0.3;
    }

    return Math.min(score, 1);
  }

  private async createCandidate(complaints: Complaint[], rule: CorrelationRule, confidence: number): Promise<CorrelationCandidate> {
    const towers = Array.from(new Set(complaints.map(c => c.tower).filter(Boolean)));
    const floors = Array.from(new Set(complaints.map(c => c.floor).filter(Boolean)));
    const units = Array.from(new Set(complaints.map(c => c.unitId).filter(Boolean)));

    const candidate: CorrelationCandidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      complaintIds: complaints.map(c => c.id),
      confidence,
      suggestedParentTitle: `${rule.name} - ${towers.join(', ')}`,
      suggestedCategory: complaints[0]?.category ?? 'OTHER',
      suggestedPriority: this.calculatePriority(complaints),
      detectedAt: new Date().toISOString(),
      status: 'PENDING_REVIEW',
    };

    mockStore.getState().correlationCandidates = [...(mockStore.getState().correlationCandidates || []), candidate];
    mockStore.notify();

    return candidate;
  }

  private calculatePriority(complaints: Complaint[]): ComplaintPriority {
    const priorities = complaints.map(c => c.priority);
    if (priorities.includes('EMERGENCY')) return 'EMERGENCY';
    if (priorities.includes('CRITICAL')) return 'CRITICAL';
    if (priorities.includes('HIGH')) return 'HIGH';
    if (priorities.includes('MEDIUM')) return 'MEDIUM';
    return 'LOW';
  }

  async getPendingCandidates(societyId: string): Promise<any[]> {
    const candidates = mockStore.getState().correlationCandidates || [];
    return candidates.filter(c => c.societyId === societyId && c.status === 'PENDING_REVIEW');
  }

  async confirmCandidate(candidateId: string, adminId: string): Promise<CorrelationResult | null> {
    const candidates = mockStore.getState().correlationCandidates || [];
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index === -1 || candidates[index].status !== 'PENDING_REVIEW') return null;

    const candidate = candidates[index];
    const parentId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const now = new Date().toISOString();

    const complaints = mockStore.getState().complaints || [];
    const childComplaints = complaints.filter(c => candidate.complaintIds.includes(c.id));
    const towers = Array.from(new Set(childComplaints.map(c => c.tower).filter(Boolean)));
    const floors = Array.from(new Set(childComplaints.map(c => c.floor).filter(Boolean)));
    const units = Array.from(new Set(childComplaints.map(c => c.unitId).filter(Boolean)));

    const parentIncident: any = {
      id: parentId,
      title: candidate.suggestedParentTitle,
      description: `Auto-correlated from ${candidate.complaintIds.length} complaints via rule: ${candidate.ruleName}`,
      category: candidate.suggestedCategory,
      priority: candidate.suggestedPriority,
      status: 'CONFIRMED',
      detectedAt: candidate.detectedAt,
      confirmedAt: now,
      confirmedByUserId: adminId,
      childComplaintIds: candidate.complaintIds,
      affectedUnits: units,
      affectedTowers: towers,
      affectedFloors: floors.map(String),
      correlationRuleId: candidate.ruleId,
      correlationConfidence: candidate.confidence,
      metadata: {},
      createdAt: now,
      updatedAt: now,
      societyId: childComplaints[0]?.societyId,
    };

    mockStore.getState().parentIncidents = [...(mockStore.getState().parentIncidents || []), parentIncident];

    for (const childId of candidate.complaintIds) {
      const complaints = mockStore.getState().complaints || [];
      const childIndex = complaints.findIndex(c => c.id === childId);
      if (childIndex !== -1) {
        complaints[childIndex] = {
          ...complaints[childIndex],
          parentIncidentId: parentId,
          isParentIncident: false,
          updatedAt: now,
        };
      }
    }

    candidates[index] = {
      ...candidates[index],
      status: 'CONFIRMED',
      reviewedByUserId: adminId,
      reviewedAt: now,
      parentIncidentId: parentId,
    };

    mockStore.notify();

    await createAuditEntry({
      actorUserId: adminId,
      actorType: 'ADMIN',
      societyId: '',
      action: 'CREATE',
      entityType: 'PARENT_INCIDENT',
      entityId: parentId,
      newState: { childCount: candidate.complaintIds.length, confidence: candidate.confidence },
      idempotencyKey: createIdempotencyKey('parent_incident'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { parentIncidentId: parentId, linkedComplaintIds: candidate.complaintIds, confidence: candidate.confidence, ruleId: candidate.ruleId };
  }

  async rejectCandidate(candidateId: string, adminId: string): Promise<void> {
    const candidates = mockStore.getState().correlationCandidates || [];
    const index = candidates.findIndex(c => c.id === candidateId);
    if (index === -1) return;

    candidates[index] = {
      ...candidates[index],
      status: 'REJECTED',
      reviewedByUserId: adminId,
      reviewedAt: new Date().toISOString(),
    };

    mockStore.notify();

    await createAuditEntry({
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

  async resolveParentIncident(input: ParentIncidentResolutionInput): Promise<void> {
    const parentIncidents = mockStore.getState().parentIncidents || [];
    const index = parentIncidents.findIndex(p => p.id === input.parentIncidentId);
    if (index === -1) return;

    const parent = parentIncidents[index];
    const now = new Date().toISOString();

    parentIncidents[index] = {
      ...parent,
      status: 'RESOLVED',
      resolvedAt: now,
      resolvedByUserId: input.adminId,
      rootCause: input.rootCause,
      resolutionSummary: input.resolutionSummary,
      updatedAt: now,
    };

    const complaints = mockStore.getState().complaints || [];
    for (const childId of parent.childComplaintIds) {
      const childIndex = complaints.findIndex(c => c.id === childId);
      if (childIndex !== -1 && !['CLOSED', 'CANCELLED', 'REJECTED', 'DUPLICATE'].includes(complaints[childIndex].status)) {
        complaints[childIndex] = {
          ...complaints[childIndex],
          status: 'RESOLVED',
          resolvedAt: now,
          resolutionSummary: input.resolutionSummary,
          updatedAt: now,
        };
      }
    }

    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.adminId,
      actorType: 'ADMIN',
      societyId: '',
      action: 'UPDATE',
      entityType: 'PARENT_INCIDENT',
      entityId: input.parentIncidentId,
      previousState: { status: parent.status },
      newState: { status: 'RESOLVED', rootCause: input.rootCause, resolutionSummary: input.resolutionSummary },
      idempotencyKey: createIdempotencyKey('parent_resolve'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });
  }

  async closeParentIncident(input: ParentIncidentCloseInput): Promise<void> {
    const parentIncidents = mockStore.getState().parentIncidents || [];
    const index = parentIncidents.findIndex(p => p.id === input.parentIncidentId);
    if (index === -1) return;

    const parent = parentIncidents[index];
    if (parent.status !== 'RESOLVED') {
      throw new Error('Parent incident must be resolved before closing');
    }

    const now = new Date().toISOString();

    parentIncidents[index] = {
      ...parent,
      status: 'CLOSED',
      closedAt: now,
      closedByUserId: input.adminId,
      updatedAt: now,
    };

    const complaints = mockStore.getState().complaints || [];
    for (const childId of parent.childComplaintIds) {
      const childIndex = complaints.findIndex(c => c.id === childId);
      if (childIndex !== -1) {
        complaints[childIndex] = {
          ...complaints[childIndex],
          status: 'CLOSED',
          closedAt: now,
          updatedAt: now,
        };
      }
    }

    mockStore.notify();

    await createAuditEntry({
      actorUserId: input.adminId,
      actorType: 'ADMIN',
      societyId: '',
      action: 'UPDATE',
      entityType: 'PARENT_INCIDENT',
      entityId: input.parentIncidentId,
      previousState: { status: 'RESOLVED' },
      newState: { status: 'CLOSED' },
      idempotencyKey: createIdempotencyKey('parent_close'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });
  }

  async getParentIncidents(societyId: string): Promise<any[]> {
    const parentIncidents = mockStore.getState().parentIncidents || [];
    return parentIncidents
      .filter(p => p.societyId === societyId)
      .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
  }

  async getParentIncident(parentId: string): Promise<any | null> {
    const parentIncidents = mockStore.getState().parentIncidents || [];
    return parentIncidents.find(p => p.id === parentId) || null;
  }

  async getChildComplaints(parentId: string): Promise<Complaint[]> {
    const parent = await this.getParentIncident(parentId);
    if (!parent) return [];

    const complaints = mockStore.getState().complaints || [];
    return complaints.filter(c => parent.childComplaintIds.includes(c.id));
  }

  async unlinkFromParent(complaintId: string): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    const complaints = mockStore.getState().complaints || [];
    const index = complaints.findIndex(c => c.id === complaintId);
    if (index === -1) return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };

    const complaint = complaints[index];
    if (!complaint.parentIncidentId) return { success: false, errorCode: 'NOT_LINKED', errorMessage: 'Complaint not linked to parent incident' };

    const parentId = complaint.parentIncidentId;
    const parentIncidents = mockStore.getState().parentIncidents || [];
    const parentIndex = parentIncidents.findIndex(p => p.id === parentId);

    if (parentIndex !== -1) {
      parentIncidents[parentIndex] = {
        ...parentIncidents[parentIndex],
        childComplaintIds: parentIncidents[parentIndex].childComplaintIds.filter(id => id !== complaintId),
        updatedAt: new Date().toISOString(),
      };
    }

    complaints[index] = {
      ...complaint,
      parentIncidentId: undefined,
      updatedAt: new Date().toISOString(),
    };

    mockStore.notify();

    return { success: true };
  }

  async createParentIncidentFromComplaints(
    childComplaintIds: string[],
    correlationRuleId: string,
    correlationConfidence: number,
    adminId: string
  ): Promise<CorrelationResult | null> {
    const complaints = mockStore.getState().complaints || [];
    const childComplaints = complaints.filter(c => childComplaintIds.includes(c.id));

    if (childComplaints.length < 2) {
      return null;
    }

    const rule = this.correlationRules.find(r => r.id === correlationRuleId);
    if (!rule) return null;

    const towers = Array.from(new Set(childComplaints.map(c => c.tower).filter(Boolean)));
    const floors = Array.from(new Set(childComplaints.map(c => c.floor).filter(Boolean)));
    const units = Array.from(new Set(childComplaints.map(c => c.unitId).filter(Boolean)));

    const parentId = `pi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const now = new Date().toISOString();

    const parentIncident: any = {
      id: parentId,
      title: `${rule.name} - ${towers.join(', ')}`,
      description: `Manually created parent incident from ${childComplaints.length} complaints`,
      category: childComplaints[0].category,
      priority: this.calculatePriority(childComplaints),
      status: 'CONFIRMED',
      detectedAt: now,
      confirmedAt: now,
      confirmedByUserId: adminId,
      childComplaintIds,
      affectedUnits: units,
      affectedTowers: towers,
      affectedFloors: floors.map(String),
      correlationRuleId,
      correlationConfidence,
      metadata: {},
      createdAt: now,
      updatedAt: now,
      societyId: childComplaints[0].societyId,
    };

    mockStore.getState().parentIncidents = [...(mockStore.getState().parentIncidents || []), parentIncident];

    for (const childId of childComplaintIds) {
      const complaints = mockStore.getState().complaints || [];
      const childIndex = complaints.findIndex(c => c.id === childId);
      if (childIndex !== -1) {
        complaints[childIndex] = {
          ...complaints[childIndex],
          parentIncidentId: parentId,
          isParentIncident: false,
          updatedAt: now,
        };
      }
    }

    mockStore.notify();

    await createAuditEntry({
      actorUserId: adminId,
      actorType: 'ADMIN',
      societyId: '',
      action: 'CREATE',
      entityType: 'PARENT_INCIDENT',
      entityId: parentId,
      newState: { childCount: childComplaints.length, confidence: correlationConfidence },
      idempotencyKey: createIdempotencyKey('parent_incident_manual'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { parentIncidentId: parentId, linkedComplaintIds: childComplaintIds, confidence: correlationConfidence, ruleId: correlationRuleId };
  }
}

export const parentIncidentService = ParentIncidentService.getInstance();