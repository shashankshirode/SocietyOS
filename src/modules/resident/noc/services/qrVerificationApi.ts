import type { NocType, NocStatus } from '../../../../shared/types/noc.types';
import { createQrVerificationService, type QrVerificationStatus, type QrCertificateInfo } from './qrVerificationService';
import type { VaultPorts } from '../../documents/vault/application/ports';

export interface QrVerificationApiResponse {
  status: QrVerificationStatus;
  certificate?: QrCertificateInfo;
  error?: string;
  timestamp: string;
  publicVerification: boolean;
}

export interface QrVerificationRequest {
  verificationCode: string;
  certificateNumber?: string;
  societyId?: string;
}

export function createQrVerificationApi(port: VaultPorts) {
  return {
    async verify(request: QrVerificationRequest): Promise<QrVerificationApiResponse> {
      const service = createQrVerificationService(port);
      const result = await service.verify({
        verificationCode: request.verificationCode,
        ...(request.certificateNumber ? { certificateNumber: request.certificateNumber } : {}),
        ...(request.societyId ? { societyId: request.societyId } : {}),
      });

      return {
        status: result.status,
        ...(result.certificate ? { certificate: result.certificate } : {}),
        ...(result.error ? { error: result.error } : {}),
        timestamp: result.timestamp,
        publicVerification: true,
      };
    },

    async verifyByCertificateNumber(certificateNumber: string, societyId: string): Promise<QrVerificationApiResponse> {
      const documents = port.documents.list(societyId);
      const nocDoc = documents.find(
        (doc) =>
          doc.categoryGroup === 'MOVE_OUT' &&
          doc.categoryCode?.startsWith('NOC') &&
          doc.metadata?.certificateNumber === certificateNumber,
      );

      if (!nocDoc) {
        return {
          status: 'NOT_FOUND',
          error: 'Certificate not found',
          timestamp: new Date().toISOString(),
          publicVerification: true,
        };
      }

      const service = createQrVerificationService(port);
      const result = await service.verify({ verificationCode: nocDoc.metadata?.verificationCode ?? '', societyId });

      return {
        status: result.status,
        ...(result.certificate ? { certificate: result.certificate } : {}),
        ...(result.error ? { error: result.error } : {}),
        timestamp: result.timestamp,
        publicVerification: true,
      };
    },

    async getCertificateInfo(verificationCode: string, societyId: string): Promise<QrCertificateInfo | null> {
      const documents = port.documents.list(societyId);
      const nocDoc = documents.find(
        (doc) =>
          doc.categoryGroup === 'MOVE_OUT' &&
          doc.categoryCode?.startsWith('NOC') &&
          doc.metadata?.verificationCode === verificationCode,
      );

      if (!nocDoc) return null;

      const version = await port.versions.read(nocDoc.currentVersionId);
      if (!version) return null;

      const expiresAt = typeof nocDoc.expiresAt === 'string' ? nocDoc.expiresAt : undefined;

      return {
        certificateNumber: nocDoc.metadata?.certificateNumber ?? nocDoc.id,
        nocType: (nocDoc.categoryCode as NocType) ?? 'NO_DUES',
        issuedAt: typeof nocDoc.issuedAt === 'string' ? nocDoc.issuedAt : nocDoc.createdAt,
        societyName: nocDoc.scope.societyId,
        flatNumber: nocDoc.scope.owningEntityId,
        issuedBy: nocDoc.metadata?.issuedBy ?? 'Society Administration',
        verificationCode: nocDoc.metadata?.verificationCode ?? '',
        status: (nocDoc.verificationLifecycle as NocStatus) ?? 'ACTIVE',
        ...(expiresAt ? { expiresAt } : {}),
      };
    },
  };
}

export type QrVerificationApi = ReturnType<typeof createQrVerificationApi>;