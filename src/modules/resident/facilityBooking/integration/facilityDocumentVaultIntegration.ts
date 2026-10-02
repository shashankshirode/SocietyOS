import type { VaultActor, VaultClock } from '../../../../../core/identity/personaRegistry';
import type { FacilityBooking } from '../../../models/facilityBooking.models';

export interface DocumentVaultPorts {
  readonly clock: VaultClock;
  readonly uploadDocument: (input: {
    residenceId: string;
    societyId: string;
    facilityId: string;
    bookingId: string;
    file: Uint8Array;
    fileName: string;
    mimeType: string;
    category: 'DAMAGE_EVIDENCE' | 'CHECKIN_PHOTO' | 'CHECKOUT_PHOTO' | 'OTHER';
    title: string;
    description?: string;
  }) => Promise<{ documentId: string; versionId: string }>;
  readonly getDocuments: (input: { bookingId: string; category?: string }) => Promise<readonly { documentId: string; title: string; uploadedAt: string }[]>;
  readonly verifyDocument: (input: { documentId: string; verifiedBy: string; verifiedAt: string }) => Promise<{ success: boolean }>;
}

export interface DamageEvidence {
  documentId: string;
  versionId: string;
  uploadedAt: string;
  title: string;
  mimeType: string;
}

export class FacilityDocumentVaultService {
  constructor(private ports: DocumentVaultPorts) {}

  async uploadDamageEvidence(
    actor: VaultActor,
    booking: FacilityBooking,
    input: {
      file: Uint8Array;
      fileName: string;
      mimeType: string;
      title: string;
      description?: string;
    },
  ): Promise<{ success: boolean; documentId?: string; versionId?: string; errorCode?: string; errorMessage?: string }> {
    try {
      const result = await this.ports.uploadDocument({
        residenceId: booking.residenceId,
        societyId: booking.societyId,
        facilityId: booking.facilityId,
        bookingId: booking.id,
        file: input.file,
        fileName: input.fileName,
        mimeType: input.mimeType,
        category: 'DAMAGE_EVIDENCE',
        title: input.title,
        description: input.description,
      });

      return { success: true, documentId: result.documentId, versionId: result.versionId };
    } catch (error) {
      return { success: false, errorCode: 'UPLOAD_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to upload damage evidence' };
    }
  }

  async uploadCheckinPhoto(
    actor: VaultActor,
    booking: FacilityBooking,
    input: { file: Uint8Array; fileName: string; mimeType: string },
  ): Promise<{ success: boolean; documentId?: string; versionId?: string; errorCode?: string; errorMessage?: string }> {
    try {
      const result = await this.ports.uploadDocument({
        residenceId: booking.residenceId,
        societyId: booking.societyId,
        facilityId: booking.facilityId,
        bookingId: booking.id,
        file: input.file,
        fileName: input.fileName,
        mimeType: input.mimeType,
        category: 'CHECKIN_PHOTO',
        title: `Check-in photo for ${booking.facilityName}`,
        description: `Photo taken at check-in for booking ${booking.bookingReference}`,
      });

      return { success: true, documentId: result.documentId, versionId: result.versionId };
    } catch (error) {
      return { success: false, errorCode: 'UPLOAD_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to upload check-in photo' };
    }
  }

  async getDamageEvidence(bookingId: string): Promise<readonly DamageEvidence[]> {
    const documents = await this.ports.getDocuments({ bookingId, category: 'DAMAGE_EVIDENCE' });
    return documents.map((d) => ({
      documentId: d.documentId,
      versionId: d.versionId,
      uploadedAt: d.uploadedAt,
      title: d.title,
      mimeType: 'application/pdf',
    }));
  }

  async verifyDamageEvidence(
    actor: VaultActor,
    documentId: string,
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string }> {
    try {
      await this.ports.verifyDocument({
        documentId,
        verifiedBy: actor.userId,
        verifiedAt: this.ports.clock.now().toISOString(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, errorCode: 'VERIFICATION_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to verify document' };
    }
  }
}

export function createFacilityDocumentVaultService(ports: DocumentVaultPorts): FacilityDocumentVaultService {
  return new FacilityDocumentVaultService(ports);
}