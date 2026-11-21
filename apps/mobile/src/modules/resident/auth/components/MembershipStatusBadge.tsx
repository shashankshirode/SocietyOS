import { View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidenceMembershipStatus } from "../data/membership.types";
import { styles, createAppTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/MembershipStatusBadge.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
interface MembershipStatusBadgeProps {
    status: ResidenceMembershipStatus;
}
type BadgeConfig = {
    label: string;
    textColor: string;
    backgroundColor: string;
};
function resolveBadgeConfig(status: ResidenceMembershipStatus, colors: ReturnType<typeof useAppTheme>['colors']): BadgeConfig {
    switch (status) {
        case 'active':
            return { get label() {
                    return getActiveUiLiteral("m_92340695899b");
                }, textColor: colors.success, backgroundColor: colors.successSoft };
        case 'invited':
            return { get label() {
                    return getActiveUiLiteral("m_63b17becd812");
                }, textColor: colors.info, backgroundColor: colors.infoSoft };
        case 'profileIncomplete':
            return { get label() {
                    return getActiveUiLiteral("m_828e2b3b0717");
                }, textColor: colors.warning, backgroundColor: colors.warningSoft };
        case 'documentsRequired':
            return { get label() {
                    return getActiveUiLiteral("m_f6527bef0242");
                }, textColor: colors.warning, backgroundColor: colors.warningSoft };
        case 'ownerConsentRequired':
            return { get label() {
                    return getActiveUiLiteral("m_cb860f8d2d00");
                }, textColor: colors.warning, backgroundColor: colors.warningSoft };
        case 'societyApprovalPending':
            return { get label() {
                    return getActiveUiLiteral("m_9b4b89746c3e");
                }, textColor: colors.warning, backgroundColor: colors.warningSoft };
        case 'rejected':
            return { get label() {
                    return getActiveUiLiteral("m_aea4a04a8042");
                }, textColor: colors.danger, backgroundColor: colors.dangerSoft };
        case 'suspended':
            return { get label() {
                    return getActiveUiLiteral("m_e392a3891c07");
                }, textColor: colors.danger, backgroundColor: colors.dangerSoft };
        case 'revoked':
            return { get label() {
                    return getActiveUiLiteral("m_f6f738d04392");
                }, textColor: colors.danger, backgroundColor: colors.dangerSoft };
        case 'expired':
            return { get label() {
                    return getActiveUiLiteral("m_424a2551d356");
                }, textColor: colors.textMuted, backgroundColor: colors.surfaceMuted };
        case 'societyInactive':
            return { get label() {
                    return getActiveUiLiteral("m_f00c74308310");
                }, textColor: colors.textMuted, backgroundColor: colors.surfaceMuted };
        case 'unitTransferPending':
            return { get label() {
                    return getActiveUiLiteral("m_3486533a7899");
                }, textColor: colors.info, backgroundColor: colors.infoSoft };
    }
}
export function MembershipStatusBadge({ status }: MembershipStatusBadgeProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const config = resolveBadgeConfig(status, colors);
    return (<View style={[styles.badge, createViewBackgroundColorStyle(config.backgroundColor)]} accessibilityRole="text" accessibilityLabel={formatUiLiteral(localizedUiText.m_ab597980cbad, [config.label])}>
      <View style={[styles.dot, createViewBackgroundColorStyle2(config.textColor)]}/>
      <AppText variant="caption" style={createAppTextColorStyle(config.textColor)}>
        {config.label}
      </AppText>
    </View>);
}

