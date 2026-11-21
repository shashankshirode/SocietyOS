import { StatusBadge } from "../../../shared/components/StatusBadge";
import { residenceAccessMessages, residenceAccessStatusLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessStatus } from "../models/residenceAccess.types";
import { styles } from "../styles/components/ResidenceStatusBadge.styles";
interface ResidenceStatusBadgeProps {
    readonly status: ResidenceAccessStatus;
}
function badgeType(status: ResidenceAccessStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
    switch (status) {
        case 'ACTIVE':
        case 'APPROVED':
            return 'success';
        case 'DOCUMENTS_UNDER_REVIEW':
        case 'SOCIETY_APPROVAL_PENDING':
        case 'OWNER_CONSENT_PENDING':
        case 'UNIT_TRANSFER_PENDING':
            return 'info';
        case 'IDENTITY_DETAILS_REQUIRED':
        case 'DOCUMENTS_REQUIRED':
        case 'DOCUMENT_CHANGES_REQUIRED':
        case 'OWNER_CONSENT_REQUIRED':
        case 'ADDITIONAL_INFORMATION_REQUIRED':
        case 'REACTIVATION_REQUIRED':
        case 'MOVE_OUT_PENDING':
        case 'TEMPORARILY_RESTRICTED':
            return 'warning';
        case 'REJECTED':
        case 'SUSPENDED':
        case 'ACCESS_REVOKED':
        case 'EXPIRED':
            return 'danger';
        case 'DISCOVERED':
        case 'CLAIM_NOT_STARTED':
        case 'INACTIVE':
        case 'ARCHIVED':
            return 'neutral';
    }
}
export function ResidenceStatusBadge({ status }: ResidenceStatusBadgeProps) {
    const label = residenceAccessStatusLabels[status];
    return (<StatusBadge label={label} type={badgeType(status)} style={styles.statusBadgeMaxWidth} accessibilityLabel={residenceAccessMessages.accessibility.statusBadge(label)}/>);
}

