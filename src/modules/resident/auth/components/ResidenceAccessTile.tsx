import { Pressable, View, Image, type GestureResponderEvent } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { MembershipStatusBadge } from "./MembershipStatusBadge";
import { MembershipProgressPanel } from "./MembershipProgressPanel";
import type { ResidenceMembership } from "../data/membership.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createPressableBackgroundColorBorderColorStyle, createAppTextColorStyle3, createAppTextColorStyle4, createPressableBackgroundColorBorderColorStyle2 } from "../styles/components/ResidenceAccessTile.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
interface ResidenceAccessTileProps {
    membership: ResidenceMembership;
    onPress: (membership: ResidenceMembership) => void;
    onActionPress?: (membership: ResidenceMembership, action: string) => void;
}
export function ResidenceAccessTile({ membership, onPress, onActionPress, }: ResidenceAccessTileProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const isActive = membership.status === 'active';
    const primaryAction = membership.availableActions[0];
    const handleActionClick = (event: GestureResponderEvent) => {
        event.stopPropagation();
        if (onActionPress && primaryAction) {
            onActionPress(membership, primaryAction);
        }
    };
    const getActionLabel = () => {
        switch (primaryAction) {
            case 'openHome':
                return getActiveUiLiteral("m_a5d7e5e32eb4");
            case 'remindApprover':
                return getActiveUiLiteral("m_2b9fda318fff");
            case 'withdrawRequest':
                return 'Withdraw';
            case 'uploadDocuments':
                return 'Upload';
            case 'requestOwnerConsent':
                return getActiveUiLiteral("m_b4421a5b778c");
            case 'correctAndResubmit':
                return 'Resubmit';
            default:
                return undefined;
        }
    };
    const actionLabel = getActionLabel();
    return (<Pressable style={[
            styles.tile,
            createPressableBackgroundColorBorderColorStyle(colors.card, colors.border),
        ]} onPress={() => onPress(membership)} accessibilityRole="button">
      
      <View style={styles.imageHeader}>
        <Image source={{ uri: membership.societyImage.uri }} style={styles.image}/>
        <View style={styles.badgeWrapper}>
          <MembershipStatusBadge status={membership.status}/>
        </View>
      </View>

      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText variant="body" style={[styles.title, createAppTextColorStyle3(colors.textPrimary)]}>
            {membership.societyName}
          </AppText>
          <AppText variant="caption" style={[styles.role, createAppTextColorStyle4(colors.primary)]}>
            {membership.role.toUpperCase()}
          </AppText>
        </View>
        <AppText variant="caption" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_4e545960f1bf}{membership.unitDisplayName} · {membership.buildingName}
        </AppText>

        
        {membership.status === 'societyApprovalPending' && (<View style={styles.trackerArea}>
            <MembershipProgressPanel status={membership.status}/>
          </View>)}

        
        {actionLabel && (<Pressable style={[
                styles.actionBtn,
                createPressableBackgroundColorBorderColorStyle2(isActive ? colors.primary : 'transparent', isActive ? colors.primary : colors.border),
            ]} onPress={handleActionClick}>
            <AppText variant="caption" style={createAppTextColorStyle2(isActive ? colors.primaryText : colors.textPrimary)}>
              {actionLabel}
            </AppText>
            <Ionicons name="arrow-forward" size={12} color={isActive ? colors.primaryText : colors.textMuted}/>
          </Pressable>)}
      </View>
    </Pressable>);
}

