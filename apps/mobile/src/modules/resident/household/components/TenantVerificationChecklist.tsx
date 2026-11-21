import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { TenantEligibilityResult } from "../data/residentHousehold.types";
import { t } from "./householdComponentUtils";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorBorderLeftColorStyle, createViewBackgroundColorStyle } from "../styles/components/TenantVerificationChecklist.styles";
type TenantVerificationChecklistProps = {
    eligibility: TenantEligibilityResult;
};
export function TenantVerificationChecklist({ eligibility }: TenantVerificationChecklistProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const getStatusMeta = (status: string) => {
        switch (status) {
            case 'BLOCKED':
                return { color: colors.danger, bg: `${colors.danger}10`, icon: 'close-circle' as const };
            case 'WARNING':
                return { color: colors.warning, bg: `${colors.warning}10`, icon: 'warning' as const };
            default:
                return { color: colors.success, bg: `${colors.success}10`, icon: 'checkmark-circle' as const };
        }
    };
    return (<View style={styles.container}>
      <SafeText variant="bodyStrong" color="primary" style={styles.safeTextMarginBottom}>
        {t(messages, 'resident.tenant.eligibility.title')}
      </SafeText>
      {eligibility.checks.map((check) => {
            const meta = getStatusMeta(check.status);
            return (<View key={check.id} style={[
                    styles.card,
                    createViewBackgroundColorBorderColorBorderLeftColorStyle(colors.surface, colors.border, meta.color),
                ]}>
            <View style={[styles.iconWrap, createViewBackgroundColorStyle(meta.bg)]}>
              <Ionicons name={meta.icon} size={20} color={meta.color}/>
            </View>
            <View style={styles.text}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
                {t(messages, check.titleKey)}
              </SafeText>
              <SafeText variant="caption" color="secondary">
                {t(messages, check.descriptionKey)}
              </SafeText>
            </View>
          </View>);
        })}
    </View>);
}
export default TenantVerificationChecklist;

