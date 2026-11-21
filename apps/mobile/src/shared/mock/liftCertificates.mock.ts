import { CertificateStatus } from '../types/fireSafety.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface LiftCertificate {
    id: string;
    liftId: string;
    liftNumber: string;
    certificateType: string;
    certificateNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    status: CertificateStatus;
    renewalOwner: string;
}
export const mockLiftCertificates: LiftCertificate[] = Array.from({ length: 8 }, (_, idx) => {
    const liftNumbers = ['LIFT-A1', 'LIFT-A2', 'LIFT-B1', 'LIFT-B2', 'LIFT-C1', 'LIFT-C2', 'LIFT-CH1', 'LIFT-P1'];
    const statuses: CertificateStatus[] = ['VALID', 'EXPIRING_SOON', 'EXPIRED', 'RENEWAL_IN_PROGRESS'];
    const status = idx === 2 ? 'EXPIRING_SOON' : idx === 4 ? 'EXPIRED' : getRequiredItem(statuses, idx % statuses.length, "liftCertificates.mock.ts");
    return {
        id: `cert-${idx + 1}`,
        liftId: `lift-${idx + 1}`,
        liftNumber: getRequiredItem(liftNumbers, idx, "liftCertificates.mock.ts"),
        certificateType: 'Annual Lift License',
        certificateNumber: `LIC-LIFT-${2026 - idx}-99${idx}`,
        issuingAuthority: 'Public Works Department (PWD)',
        issueDate: '2025-07-15',
        expiryDate: status === 'EXPIRED' ? '2026-06-15' : '2026-07-15',
        status,
        renewalOwner: 'Suresh Patil (FM)'
    };
});

