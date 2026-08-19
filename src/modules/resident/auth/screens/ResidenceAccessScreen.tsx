import { useState } from "react";
import { ScrollView, View } from "react-native";
import { ScreenScaffold } from "../../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../../shared/components/AppText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useResponsiveLayout } from "../../../../shared/layout/useResponsiveLayout";
import { ResidencePortfolio } from "../components/ResidencePortfolio";
import { ApprovalReminderSheet } from "../components/ApprovalReminderSheet";
import { authMessages } from "../messages/auth.messages";
import type { ResidenceMembership, AccessReminderResult } from "../data/membership.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createScreenScaffoldBackgroundColorStyle, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3 } from "../styles/screens/ResidenceAccessScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface ResidenceAccessScreenProps {
    memberships: readonly ResidenceMembership[];
    onSelectActive: (membership: ResidenceMembership) => void;
    onSelectPending?: (membership: ResidenceMembership) => void;
    onSendReminder: (membershipId: string, note: string) => Promise<AccessReminderResult>;
    onWithdrawRequest: (membershipId: string) => void;
    onAddNewHome: () => void;
    onLogout: () => void;
}
export function ResidenceAccessScreen({ memberships, onSelectActive, onSelectPending, onSendReminder, onWithdrawRequest, onAddNewHome, onLogout, }: ResidenceAccessScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    const [reminderMembership, setReminderMembership] = useState<ResidenceMembership | null>(null);
    const handleActionPress = (membership: ResidenceMembership, action: string) => {
        if (action === 'openHome') {
            onSelectActive(membership);
        }
        else if (action === 'remindApprover') {
            setReminderMembership(membership);
        }
        else if (action === 'withdrawRequest') {
            onWithdrawRequest(membership.membershipId);
        }
    };
    return (<ScreenScaffold style={createScreenScaffoldBackgroundColorStyle(colors.background)}>
      <ScrollView contentContainerStyle={[
            styles.scroll,
            isTablet && styles.tabletScroll,
        ]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="caption" style={[styles.eyebrow, createAppTextColorStyle3(colors.primary)]}>
            {authMessages.portfolioEyebrow}
          </AppText>
          <AppText variant="h1" style={createAppTextColorStyle(colors.textPrimary)}>
            {authMessages.portfolioTitle}
          </AppText>
          <AppText variant="body" style={createAppTextColorStyle2(colors.textSecondary)}>
            {authMessages.portfolioSubtitle}
          </AppText>
        </View>

        <ResidencePortfolio memberships={memberships} onSelectActive={onSelectActive} {...includeWhenPresent("onSelectPending", onSelectPending)} onActionPress={handleActionPress}/>

        <View style={styles.footerRow}>
          <AppButton title={localizedUiText.m_e1f03a2fcb89} variant="outline" onPress={onAddNewHome} fullWidth iconLeft={<Ionicons name="add-circle-outline" size={18} color={colors.textPrimary}/>}/>
          <AppButton title={localizedUiText.m_08c781859bca} variant="ghost" onPress={onLogout} fullWidth/>
        </View>
      </ScrollView>

      <ApprovalReminderSheet visible={reminderMembership !== null} membership={reminderMembership} onSendReminder={onSendReminder} onDismiss={() => setReminderMembership(null)}/>
    </ScreenScaffold>);
}

