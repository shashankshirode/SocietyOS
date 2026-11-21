import type {
  DomesticHelp,
  ResidentDomesticHelpLink,
  CreateDomesticHelpLinkInput,
  RevokeDomesticHelpLinkInput,
  BlockDomesticHelpInput,
  DomesticHelpType,
  DomesticHelpVerificationStatus,
} from '../../../shared/types/domesticHelp.types';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import {
  assertSocietyContext,
  canManageDomesticHelp,
  canBlockDomesticHelpSociety,
  canApproveDomesticHelp,
} from '../data/staffAttendanceActor';
import { generateOperationId } from '../../../core/api/idempotency';

export interface RegisterDomesticHelpInput {
  name: string;
  helpType: DomesticHelpType;
  mobile: string;
  emergencyContact?: string;
  addressSummary?: string;
  unitId: string;
  unitNumber: string;
  allowedDays: string[];
  allowedTimeFrom?: string;
  allowedTimeTo?: string;
}

export class DomesticHelpOperationsService {
  private profiles = new Map<string, DomesticHelp>();
  private links = new Map<string, ResidentDomesticHelpLink>();
  private auditLogs: { action: string; entityId: string; actorId: string; timestamp: string; details?: string }[] = [];

  constructor(initialProfiles?: DomesticHelp[]) {
    if (initialProfiles) {
      for (const p of initialProfiles) {
        this.profiles.set(p.id, { ...p });
      }
    }
  }

  public registerDomesticHelp(
    actor: StaffOperationsActor,
    societyId: string,
    input: RegisterDomesticHelpInput
  ): { profile: DomesticHelp; link: ResidentDomesticHelpLink } {
    assertSocietyContext(actor, societyId);
    if (!canManageDomesticHelp(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to register domestic help');
    }

    const domesticHelpId = `dh-${generateOperationId('dh')}`;
    const linkId = `dhl-${generateOperationId('dhl')}`;
    const nowIso = new Date().toISOString();

    const maskedMobile = input.mobile.length >= 4
      ? `${input.mobile.slice(0, 2)}******${input.mobile.slice(-2)}`
      : '**********';

    const profile: DomesticHelp = {
      id: domesticHelpId,
      name: input.name.trim(),
      helpType: input.helpType,
      linkedFlatIds: [input.unitId],
      linkedFlatNumbers: [input.unitNumber],
      linkedFlatCount: 1,
      accessStatus: 'ACTIVE',
      allowedEntryDays: input.allowedDays,
      ...(input.allowedTimeFrom ? { allowedEntryTimeFrom: input.allowedTimeFrom } : {}),
      ...(input.allowedTimeTo ? { allowedEntryTimeTo: input.allowedTimeTo } : {}),
      verificationStatus: 'PENDING',
      policeVerificationStatus: 'NOT_SUBMITTED',
      idDocumentStatus: 'NOT_COLLECTED',
      mobileMasked: maskedMobile,
      ...(input.emergencyContact ? { emergencyContactMasked: '******' } : {}),
      ...(input.addressSummary ? { addressSummary: input.addressSummary } : {}),
      approvedByResidents: [actor.userId],
      incidentCount: 0,
      societyApprovalStatus: 'APPROVED',
      registeredAt: nowIso,
      updatedAt: nowIso,
    };

    const link: ResidentDomesticHelpLink = {
      id: linkId,
      domesticHelpId,
      societyId,
      unitId: input.unitId,
      unitNumber: input.unitNumber,
      residentId: actor.userId,
      effectiveFrom: nowIso.split('T')[0] ?? nowIso,
      allowedDays: input.allowedDays,
      ...(input.allowedTimeFrom ? { allowedTimeFrom: input.allowedTimeFrom } : {}),
      ...(input.allowedTimeTo ? { allowedTimeTo: input.allowedTimeTo } : {}),
      linkStatus: 'ACTIVE',
      approvalStatus: 'APPROVED',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.profiles.set(domesticHelpId, profile);
    this.links.set(linkId, link);

    this.auditLogs.push({
      action: 'DOMESTIC_HELP_CREATED',
      entityId: domesticHelpId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Registered ${profile.name} for unit ${input.unitNumber}`,
    });

    return { profile, link };
  }

  public linkToUnit(
    actor: StaffOperationsActor,
    societyId: string,
    input: CreateDomesticHelpLinkInput
  ): ResidentDomesticHelpLink {
    assertSocietyContext(actor, societyId);
    if (!canManageDomesticHelp(actor)) {
      throw new Error('ACCESS_DENIED: Actor not authorized to link domestic help');
    }

    const help = this.profiles.get(input.domesticHelpId);
    if (!help) {
      throw new Error('DOMESTIC_HELP_NOT_FOUND: Helper does not exist');
    }
    if (help.accessStatus === 'BLOCKED') {
      throw new Error('DOMESTIC_HELP_SOCIETY_BLOCKED: Helper is blocked by society security');
    }

    const existingActiveLink = Array.from(this.links.values()).find(
      l => l.domesticHelpId === input.domesticHelpId && l.unitId === input.unitId && l.linkStatus === 'ACTIVE'
    );
    if (existingActiveLink) {
      throw new Error('DOMESTIC_HELP_LINK_ALREADY_ACTIVE: Helper is already linked to this unit');
    }

    const linkId = `dhl-${generateOperationId('dhl')}`;
    const nowIso = new Date().toISOString();

    const link: ResidentDomesticHelpLink = {
      id: linkId,
      domesticHelpId: input.domesticHelpId,
      societyId,
      unitId: input.unitId,
      unitNumber: input.unitNumber,
      residentId: actor.userId,
      effectiveFrom: input.effectiveFrom,
      ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
      allowedDays: input.allowedDays,
      ...(input.allowedTimeFrom ? { allowedTimeFrom: input.allowedTimeFrom } : {}),
      ...(input.allowedTimeTo ? { allowedTimeTo: input.allowedTimeTo } : {}),
      linkStatus: 'ACTIVE',
      approvalStatus: 'APPROVED',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.links.set(linkId, link);

    const activeLinksForHelp = Array.from(this.links.values()).filter(
      l => l.domesticHelpId === input.domesticHelpId && l.linkStatus === 'ACTIVE'
    );
    const linkedFlats = Array.from(new Set(activeLinksForHelp.map(l => l.unitNumber)));
    const linkedFlatIds = Array.from(new Set(activeLinksForHelp.map(l => l.unitId)));

    this.profiles.set(input.domesticHelpId, {
      ...help,
      linkedFlatIds,
      linkedFlatNumbers: linkedFlats,
      linkedFlatCount: linkedFlats.length,
      updatedAt: nowIso,
    });

    this.auditLogs.push({
      action: 'DOMESTIC_HELP_LINK_CREATED',
      entityId: input.domesticHelpId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Linked helper to unit ${input.unitNumber}`,
    });

    return link;
  }

  public revokeUnitLink(
    actor: StaffOperationsActor,
    societyId: string,
    input: RevokeDomesticHelpLinkInput
  ): ResidentDomesticHelpLink {
    assertSocietyContext(actor, societyId);
    const link = this.links.get(input.linkId);
    if (!link) {
      throw new Error('DOMESTIC_HELP_LINK_NOT_FOUND: Link record does not exist');
    }

    if (actor.role === 'RESIDENT' && actor.userId !== link.residentId) {
      throw new Error('ACCESS_DENIED: Resident cannot revoke another resident link');
    }

    const nowIso = new Date().toISOString();
    const updatedLink: ResidentDomesticHelpLink = {
      ...link,
      linkStatus: 'REVOKED',
      revocationReason: input.reason,
      revokedAt: nowIso,
      updatedAt: nowIso,
    };
    this.links.set(input.linkId, updatedLink);

    const help = this.profiles.get(link.domesticHelpId);
    if (help) {
      const remainingActiveLinks = Array.from(this.links.values()).filter(
        l => l.domesticHelpId === link.domesticHelpId && l.linkStatus === 'ACTIVE'
      );
      const linkedFlats = Array.from(new Set(remainingActiveLinks.map(l => l.unitNumber)));
      const linkedFlatIds = Array.from(new Set(remainingActiveLinks.map(l => l.unitId)));

      this.profiles.set(link.domesticHelpId, {
        ...help,
        linkedFlatIds,
        linkedFlatNumbers: linkedFlats,
        linkedFlatCount: linkedFlats.length,
        updatedAt: nowIso,
      });
    }

    this.auditLogs.push({
      action: 'DOMESTIC_HELP_LINK_REVOKED',
      entityId: link.domesticHelpId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Revoked link for unit ${link.unitNumber}. Reason: ${input.reason}`,
    });

    return updatedLink;
  }

  public societyBlockDomesticHelp(
    actor: StaffOperationsActor,
    societyId: string,
    domesticHelpId: string,
    input: BlockDomesticHelpInput
  ): DomesticHelp {
    assertSocietyContext(actor, societyId);
    if (!canBlockDomesticHelpSociety(actor)) {
      throw new Error('ACCESS_DENIED: Only Security Supervisor or HR Admin can perform society-wide block');
    }
    if (!input.reason.trim()) {
      throw new Error('VALIDATION_ERROR: Reason is required for society-wide security block');
    }

    const help = this.profiles.get(domesticHelpId);
    if (!help) {
      throw new Error('DOMESTIC_HELP_NOT_FOUND: Helper does not exist');
    }

    const nowIso = new Date().toISOString();

    for (const [id, link] of this.links.entries()) {
      if (link.domesticHelpId === domesticHelpId && link.linkStatus === 'ACTIVE') {
        this.links.set(id, {
          ...link,
          linkStatus: 'REVOKED',
          revocationReason: `Society Security Block: ${input.reason}`,
          revokedAt: nowIso,
          updatedAt: nowIso,
        });
      }
    }

    const updated: DomesticHelp = {
      ...help,
      accessStatus: 'BLOCKED',
      ...(input.incidentReference ? { incidentCount: help.incidentCount + 1 } : {}),
      notes: input.reason,
      updatedAt: nowIso,
    };
    this.profiles.set(domesticHelpId, updated);

    this.auditLogs.push({
      action: 'DOMESTIC_HELP_SOCIETY_BLOCKED',
      entityId: domesticHelpId,
      actorId: actor.userId,
      timestamp: nowIso,
      details: `Society block applied. Reason: ${input.reason}`,
    });

    return updated;
  }

  public handleResidentMoveOut(
    actor: StaffOperationsActor,
    societyId: string,
    unitId: string
  ): number {
    assertSocietyContext(actor, societyId);
    const nowIso = new Date().toISOString();
    let revokedCount = 0;

    for (const [id, link] of this.links.entries()) {
      if (link.unitId === unitId && link.linkStatus === 'ACTIVE') {
        this.links.set(id, {
          ...link,
          linkStatus: 'EXPIRED',
          revocationReason: 'Resident move-out completed',
          revokedAt: nowIso,
          updatedAt: nowIso,
        });
        revokedCount++;

        const help = this.profiles.get(link.domesticHelpId);
        if (help) {
          const remainingActive = Array.from(this.links.values()).filter(
            l => l.domesticHelpId === link.domesticHelpId && l.linkStatus === 'ACTIVE'
          );
          this.profiles.set(link.domesticHelpId, {
            ...help,
            linkedFlatIds: Array.from(new Set(remainingActive.map(l => l.unitId))),
            linkedFlatNumbers: Array.from(new Set(remainingActive.map(l => l.unitNumber))),
            linkedFlatCount: remainingActive.length,
            updatedAt: nowIso,
          });
        }
      }
    }

    return revokedCount;
  }

  public getProfile(domesticHelpId: string): DomesticHelp | undefined {
    return this.profiles.get(domesticHelpId);
  }

  public getLinksForHelper(domesticHelpId: string): ResidentDomesticHelpLink[] {
    return Array.from(this.links.values()).filter(l => l.domesticHelpId === domesticHelpId);
  }

  public getLinksForUnit(unitId: string): ResidentDomesticHelpLink[] {
    return Array.from(this.links.values()).filter(l => l.unitId === unitId);
  }

  public getAuditLogs() {
    return [...this.auditLogs];
  }
}
