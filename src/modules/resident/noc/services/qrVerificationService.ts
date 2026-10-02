import type { NocCertificate, NocType, NocStatus } from '../../../../shared/types/noc.types';
import type { DocumentRecord, DocumentVersionRecord } from '../../documents/vault/domain/types/document.types';
import type { VaultPorts } from '../../documents/vault/application/ports';
import { verifyIntegrity } from '../../documents/vault/domain/engines/integrityEngine';

export type QrVerificationStatus =
  | 'VALID'
  | 'REVOKED'
  | 'SUPERSEDED'
  | 'NOT_FOUND'
  | 'INTEGRITY_FAILED'
  | 'NETWORK_ERROR';

export interface QrVerificationInput {
  verificationCode: string;
  certificateNumber?: string;
  societyId?: string;
}

export interface QrVerificationResult {
  status: QrVerificationStatus;
  certificate?: QrCertificateInfo;
  error?: string;
  timestamp: string;
}

export interface QrCertificateInfo {
  certificateNumber: string;
  nocType: NocType;
  issuedAt: string;
  societyName: string;
  flatNumber?: string;
  issuedBy: string;
  verificationCode: string;
  status: NocStatus;
  expiresAt?: string;
}

export interface QrVerificationPorts {
  vault: VaultPorts;
}

export class QrVerificationService {
  constructor(private readonly ports: QrVerificationPorts) {}

  async verify(input: QrVerificationInput): Promise<QrVerificationResult> {
    const { verificationCode, societyId } = input;
    const targetSocietyId = societyId ?? 'society-001';

    try {
      const nocDocument = await this.findNocByVerificationCode(verificationCode, targetSocietyId);
      if (!nocDocument) {
        return {
          status: 'NOT_FOUND',
          error: 'Certificate not found',
          timestamp: new Date().toISOString(),
        };
      }

      const version = await this.ports.vault.versions.read(nocDocument.currentVersionId);
      if (!version) {
        return {
          status: 'NOT_FOUND',
          error: 'Certificate version not found',
          timestamp: new Date().toISOString(),
        };
      }

      const payload = await this.ports.vault.objects.read(version.objectDigestRef);
      if (!payload) {
        return {
          status: 'NOT_FOUND',
          error: 'Certificate payload not found',
          timestamp: new Date().toISOString(),
        };
      }

      const integrityCheck = verifyIntegrity(
        version.integrity,
        payload,
        this.ports.vault.digests,
        this.ports.vault.clock,
      );
      if (!integrityCheck.verified) {
        this.ports.vault.audit.emit({
          id: `aud-qr-integrity-${nocDocument.id}`,
          timestamp: new Date().toISOString(),
          correlationId: verificationCode,
          actor: { userId: 'public-verifier', type: 'PUBLIC', role: 'PUBLIC', societyId: targetSocietyId },
          action: 'VERIFY',
          entityType: 'NOC_CERTIFICATE',
          entityId: nocDocument.id,
          previousState: undefined,
          newState: { verificationCode, integrityCheck: 'FAILED' },
          metadata: { source: 'API' },
          outcome: 'FAILURE',
        });

        return {
          status: 'INTEGRITY_FAILED',
          error: 'Certificate integrity check failed',
          timestamp: new Date().toISOString(),
        };
      }

      if (nocDocument.verificationLifecycle === 'REVOKED' || nocDocument.storageLifecycle === 'PURGED') {
        return {
          status: 'REVOKED',
          certificate: this.mapToCertificateInfo(nocDocument, version),
          timestamp: new Date().toISOString(),
        };
      }

      if (nocDocument.versionCount > 1) {
        return {
          status: 'SUPERSEDED',
          certificate: this.mapToCertificateInfo(nocDocument, version),
          timestamp: new Date().toISOString(),
        };
      }

      if (nocDocument.expiresAt && new Date(nocDocument.expiresAt) < new Date()) {
        return {
          status: 'REVOKED',
          certificate: this.mapToCertificateInfo(nocDocument, version),
          timestamp: new Date().toISOString(),
        };
      }

      this.ports.vault.audit.emit({
        id: `aud-qr-verify-${nocDocument.id}`,
        timestamp: new Date().toISOString(),
        correlationId: verificationCode,
        actor: { userId: 'public-verifier', type: 'PUBLIC', role: 'PUBLIC', societyId: targetSocietyId },
        action: 'VERIFY',
        entityType: 'NOC_CERTIFICATE',
        entityId: nocDocument.id,
        previousState: undefined,
        newState: { verificationCode, result: 'VALID' },
        metadata: { source: 'API' },
        outcome: 'SUCCESS',
      });

      return {
        status: 'VALID',
        certificate: this.mapToCertificateInfo(nocDocument, version),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'NETWORK_ERROR',
        error: error instanceof Error ? error.message : 'Unknown verification error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async findNocByVerificationCode(verificationCode: string, societyId: string): Promise<DocumentRecord | undefined> {
    const documents = this.ports.vault.documents.list(societyId);
    return documents.find(
      (doc) =>
        doc.categoryGroup === 'MOVE_OUT' &&
        doc.categoryCode?.startsWith('NOC') &&
        doc.metadata?.verificationCode === verificationCode,
    );
  }

  private mapToCertificateInfo(doc: DocumentRecord, _version: DocumentVersionRecord): QrCertificateInfo {
    const expiresAt = typeof doc.expiresAt === 'string' ? doc.expiresAt : undefined;
    return {
      certificateNumber: doc.metadata?.certificateNumber ?? doc.id,
      nocType: (doc.categoryCode as NocType) ?? 'NO_DUES',
      issuedAt: typeof doc.issuedAt === 'string' ? doc.issuedAt : doc.createdAt,
      societyName: doc.scope.societyId,
      flatNumber: doc.scope.owningEntityId,
      issuedBy: doc.metadata?.issuedBy ?? 'Society Administration',
      verificationCode: doc.metadata?.verificationCode ?? '',
      status: (doc.verificationLifecycle as NocStatus) ?? 'ACTIVE',
      ...(expiresAt ? { expiresAt } : {}),
    };
  }
}

export function createQrVerificationService(vault: VaultPorts): QrVerificationService {
  return new QrVerificationService({ vault });
}