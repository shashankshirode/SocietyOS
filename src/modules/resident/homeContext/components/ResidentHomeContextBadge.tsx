import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { ResidentHomeRole, ResidentHomeStatus } from "../data/residentHomeContext.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../styles/components/ResidentHomeContextBadge.styles";
export type BadgeType = 'role' | 'status';
export function ResidentHomeContextBadge({ value, type, }: {
    value: ResidentHomeRole | ResidentHomeStatus;
    type: BadgeType;
}) {
    const messages = useMessages();
    let text: string = value;
    let bg = 'rgba(0,0,0,0.05)';
    let fg = '#4B5563';
    if (type === 'role') {
        if (value === 'owner') {
            text = messages.resident.homeContext.owner;
            bg = '#EEF2FF';
            fg = '#4F46E5';
        }
        else if (value === 'coOwner') {
            text = messages.resident.homeContext.coOwner;
            bg = '#EEF2FF';
            fg = '#4F46E5';
        }
        else if (value === 'tenant') {
            text = messages.resident.homeContext.tenant;
            bg = '#ECFDF5';
            fg = '#059669';
        }
        else if (value === 'familyMember') {
            text = messages.resident.homeContext.familyMember;
            bg = '#FDF2F8';
            fg = '#DB2777';
        }
        else if (value === 'authorizedOccupant') {
            text = messages.resident.homeContext.authorizedOccupant;
            bg = '#FDF2F8';
            fg = '#DB2777';
        }
    }
    else if (type === 'status') {
        if (value === 'active') {
            return null;
        }
        else if (value === 'pendingApproval') {
            text = messages.resident.homeContext.pendingApproval;
            bg = '#FFFBEB';
            fg = '#D97706';
        }
        else if (value === 'accessRestricted') {
            text = messages.resident.homeContext.accessRestricted;
            bg = '#FEF2F2';
            fg = '#DC2626';
        }
        else if (value === 'moveOutPending') {
            text = messages.resident.homeContext.moveOutPending;
            bg = '#FFFBEB';
            fg = '#D97706';
        }
        else if (value === 'inactive') {
            text = messages.resident.homeContext.inactive;
            bg = '#F3F4F6';
            fg = '#4B5563';
        }
    }
    return (<View style={[styles.badge, createViewBackgroundColorStyle(bg)]} testID={`badge-${type}-${value}`}>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(fg)]}>
        {text}
      </SafeText>
    </View>);
}

