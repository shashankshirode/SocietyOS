import { absentValue } from '../../../../shared/types/absence.types';
import type { NocCertificate, NocRequest, NocType } from '../../../../shared/types/noc.types';
import type {
  DocumentCategoryGroup,
  DocumentOwningEntityType,
  DocumentRecord,
  DocumentVersionRecord,
} from '../../documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../documents/vault/application/ports';
import { computeIntegrity } from '../../documents/vault/domain/engines/integrityEngine';

interface NocVaultPorts extends VaultPorts {
  clock: { now: () => Date };
}

const NOC_CATEGORY_MAP: Record<NocType, { categoryGroup: DocumentCategoryGroup; categoryCode: string }> = {
  NO_DUES: { categoryGroup: 'MOVE_OUT', categoryCode: 'NO_DUES' },
  MOVE_OUT: { categoryGroup: 'MOVE_OUT', categoryCode: 'MOVE_OUT_NOC' },
  TENANT_NOC: { categoryGroup: 'TENANT', categoryCode: 'TENANT_NOC' },
  PARKING_NOC: { categoryGroup: 'MOVE_OUT', categoryCode: 'PARKING_NOC' },
  RENOVATION_NOC: { categoryGroup: 'COMPLIANCE', categoryCode: 'RENOVATION_NOC' },
  RESIDENCE_CERTIFICATE: { categoryGroup: 'TENANT', categoryCode: 'RESIDENCE_CERTIFICATE' },
  VEHICLE_NOC: { categoryGroup: 'MOVE_OUT', categoryCode: 'VEHICLE_NOC' },
};

const NOC_ENTITY_TYPE_MAP: Record<NocType, DocumentOwningEntityType> = {
  NO_DUES: 'NOC',
  MOVE_OUT: 'MOVE_OUT_REQUEST',
  TENANT_NOC: 'TENANT',
  PARKING_NOC: 'PARKING',
  RENOVATION_NOC: 'COMPLIANCE_RECORD',
  RESIDENCE_CERTIFICATE: 'NOC',
  VEHICLE_NOC: 'VEHICLE',
};

export interface StoredNocCertificate {
  document: DocumentRecord;
  version: DocumentVersionRecord;
  pdfBytes: Uint8Array;
}

export class NocVaultIntegration {
  constructor(private vault: NocVaultPorts) {}

  async storeNocCertificate(
    nocCertificate: NocCertificate,
    nocRequest: NocRequest,
    pdfBytes: Uint8Array,
    actor: { userId: string; role: string; societyId: string; sessionId: string; authenticatedAt: string },
  ): Promise<StoredNocCertificate> {
    const categoryInfo = NOC_CATEGORY_MAP[nocCertificate.nocType] ?? {
      categoryGroup: 'MOVE_OUT' as DocumentCategoryGroup,
      categoryCode: 'NOC',
    };
    const entityType = NOC_ENTITY_TYPE_MAP[nocCertificate.nocType] ?? 'NOC';

    const integrity = computeIntegrity(pdfBytes, this.vault.digests, this.vault.clock);

    const duplicate = await this.findDuplicateByChecksum(nocCertificate.nocType, integrity.checksum);
    if (duplicate) {
      return this.getStoredNoc(duplicate);
    }

    const documentId = `doc-noc-${nocCertificate.id}`;
    const versionId = `ver-noc-${nocCertificate.id}-1`;

    const version: DocumentVersionRecord = {
      id: versionId,
      documentId,
      versionNumber: 1,
      fileName: `noc-${nocCertificate.certificateNumber}.pdf`,
      declaredMimeType: 'application/pdf',
      observedMimeType: 'application/pdf',
      byteSize: pdfBytes.length,
      storageLifecycle: 'AVAILABLE',
      versionLifecycle: 'ACTIVE',
      integrity,
      malwareScan: {
        scannerId: 'noc-scanner',
        status: 'CLEAN',
        signatureVersion: 'noc-1.0',
        scannedAt: this.vault.clock.now().toISOString(),
        detail: absentValue,
      },
      quarantineReason: absentValue,
      uploadedBy: actor.userId,
      uploadedAt: this.vault.clock.now().toISOString(),
      effectiveFrom: this.vault.clock.now().toISOString(),
      changeReason: `NOC ${nocCertificate.nocType} issued`,
      supersededAt: absentValue,
      supersededByVersionId: absentValue,
      objectDigestRef: await this.vault.objects.putQuarantined(`noc-${nocCertificate.id}`, pdfBytes),
    };

    const document: DocumentRecord = {
      id: documentId,
      title: nocCertificate.title,
      categoryGroup: categoryInfo.categoryGroup,
      categoryCode: categoryInfo.categoryCode,
      scope: {
        societyId: actor.societyId || 'society-001',
        owningEntityType: entityType,
        owningEntityId: nocRequest.id,
      },
      visibility: 'OWN_ENTITY_ONLY',
      sensitivity: 'CONFIDENTIAL',
      ownerUserId: actor.userId,
      storageLifecycle: 'AVAILABLE',
      verificationLifecycle: 'NOT_REQUIRED',
      signatureLifecycle: 'NOT_REQUIRED',
      expiryLifecycle: nocCertificate.expiryDate ? 'NOT_EXPIRED' : 'NOT_APPLICABLE',
      retentionLifecycle: 'ACTIVE',
      currentVersionId: versionId,
      currentVersionNumber: 1,
      versionCount: 1,
      activeVerificationCaseId: absentValue,
      signatureEnvelopeId: absentValue,
      issuedAt: nocCertificate.issueDate ?? absentValue,
      expiresAt: nocCertificate.expiryDate ?? absentValue,
      metadata: {
        certificateNumber: nocCertificate.certificateNumber,
        verificationCode: nocCertificate.verificationCode,
        ...(nocCertificate.issuedBy ? { issuedBy: nocCertificate.issuedBy } : {}),
      },
      retentionPolicy: {
        policyId: `noc-retention-${nocCertificate.nocType.toLowerCase()}`,
        policyVersion: 1,
        effectiveFrom: this.vault.clock.now().toISOString(),
        retainUntil: nocCertificate.expiryDate ?? new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        disposition: 'ARCHIVE',
      },
      legalHoldIds: [],
      createdAt: this.vault.clock.now().toISOString(),
      createdBy: actor.userId,
      updatedAt: this.vault.clock.now().toISOString(),
      revision: { revision: 1, revisionToken: `rev-${documentId}-1` },
      trace: {
        correlationId: nocRequest.id,
        causationId: absentValue,
      },
    };

    const docInserted = this.vault.documents.insert(document);
    const verInserted = this.vault.versions.insert(version);

    if (!docInserted || !verInserted) {
      throw new Error('Failed to store NOC certificate in Document Vault');
    }

    this.vault.audit.emit({
      id: `aud-noc-${nocCertificate.id}`,
      timestamp: this.vault.clock.now().toISOString(),
      correlationId: nocRequest.id,
      actor: {
        userId: actor.userId,
        type: 'ADMIN',
        role: actor.role,
        societyId: actor.societyId || 'society-001',
      },
      action: 'CREATE',
      entityType: 'DOCUMENT',
      entityId: documentId,
      newState: {
        nocType: nocCertificate.nocType,
        certificateNumber: nocCertificate.certificateNumber,
        verificationCode: nocCertificate.verificationCode,
      },
      metadata: {
        idempotencyKey: `noc-${nocCertificate.id}`,
        source: 'API',
        nocRequestId: nocRequest.id,
        nocType: nocCertificate.nocType,
      },
      outcome: 'SUCCESS',
    });

    return { document, version, pdfBytes };
  }

  async getNocDocument(nocCertificateId: string): Promise<DocumentRecord | undefined> {
    const documentId = `doc-noc-${nocCertificateId}`;
    return this.vault.documents.read(documentId);
  }

  async getNocVersion(nocCertificateId: string): Promise<DocumentVersionRecord | undefined> {
    const document = await this.getNocDocument(nocCertificateId);
    if (!document) return undefined;
    return this.vault.versions.read(document.currentVersionId);
  }

  async getNocPdfBytes(nocCertificateId: string): Promise<Uint8Array | undefined> {
    const version = await this.getNocVersion(nocCertificateId);
    if (!version?.objectDigestRef) return undefined;
    return this.vault.objects.read(version.objectDigestRef);
  }

  private async findDuplicateByChecksum(nocType: NocType, checksum: string): Promise<string | undefined> {
    const societyId = 'society-001';
    const categoryInfo = NOC_CATEGORY_MAP[nocType];
    if (!categoryInfo) return undefined;
    const categoryCode = categoryInfo.categoryCode;
    for (const doc of this.vault.documents.list(societyId)) {
      if (doc.categoryCode !== categoryCode) continue;
      const versions = this.vault.versions.listByDocument(doc.id);
      for (const v of versions) {
        if (v.integrity.checksum === checksum) return doc.id;
      }
    }
    return undefined;
  }

  private async getStoredNoc(documentId: string): Promise<StoredNocCertificate> {
    const document = await this.vault.documents.read(documentId);
    const version = document ? await this.vault.versions.read(document.currentVersionId) : undefined;
    const bytes = version?.objectDigestRef ? await this.vault.objects.read(version.objectDigestRef) : undefined;
    const pdfBytes = bytes ?? new Uint8Array();
    if (!document || !version) throw new Error('Stored NOC not found');
    return { document, version, pdfBytes };
  }
}

export function createNocVaultIntegration(vault: NocVaultPorts): NocVaultIntegration {
  return new NocVaultIntegration(vault);
}