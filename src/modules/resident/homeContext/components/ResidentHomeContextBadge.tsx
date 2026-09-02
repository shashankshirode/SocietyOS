import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { ResidentHomeRole, ResidentHomeStatus } from "../data/residentHomeContext.types";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../styles/components/ResidentHomeContextBadge.styles";
export type BadgeType = 'role' | 'status';
export function ResidentHomeContextBadge({ value, type, }: {
    value: ResidentHomeRole | ResidentHomeStatus;
    type: BadgeType;
}) {
    const messages = useMessages();
    const { colors } = useAppTheme();
    let text: string = value;
    let bg = colors.surfaceMuted;
    let fg = colors.textSecondary;
    if (type === 'role') {
        if (value === 'owner') {
            text = messages.resident.homeContext.owner;
            bg = colors.primarySoft;
            fg = colors.success;
        }
        else if (value === 'coOwner') {
            text = messages.resident.homeContext.coOwner;
            bg = colors.primarySoft;
            fg = colors.success;
        }
        else if (value === 'tenant') {
            text = messages.resident.homeContext.tenant;
            bg = colors.primarySoft;
            fg = colors.success;
        }
        else if (value === 'familyMember') {
            text = messages.resident.homeContext.familyMember;
            bg = colors.surfaceMuted;
            fg = colors.textSecondary;
        }
        else if (value === 'authorizedOccupant') {
            text = messages.resident.homeContext.authorizedOccupant;
            bg = colors.surfaceMuted;
            fg = colors.textSecondary;
        }
    }
    else if (type === 'status') {
        if (value === 'active') {
            return null;
        }
        else if (value === 'pendingApproval') {
            text = messages.resident.homeContext.pendingApproval;
            bg = colors.warningSoft;
            fg = colors.warning;
        }
        else if (value === 'accessRestricted') {
            text = messages.resident.homeContext.accessRestricted;
            bg = colors.dangerSoft;
            fg = colors.danger;
        }
        else if (value === 'moveOutPending') {
            text = messages.resident.homeContext.moveOutPending;
            bg = colors.warningSoft;
            fg = colors.warning;
        }
        else if (value === 'inactive') {
            text = messages.resident.homeContext.inactive;
            bg = colors.surfaceMuted;
            fg = colors.textMuted;
        }
    }
    return (<View style={[styles.badge, createViewBackgroundColorStyle(bg)]} testID={`badge-${type}-${value}`}>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(fg)]}>
        {text}
      </SafeText>
    </View>);
}
