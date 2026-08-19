import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "./householdComponentUtils";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/TenantRestrictionBanner.styles";
type TenantRestrictionBannerProps = {
    messageKey: string;
};
export function TenantRestrictionBanner({ messageKey }: TenantRestrictionBannerProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<View style={[styles.banner, createViewBackgroundColorBorderColorStyle(colors.warningSoft, colors.warning)]}>
      <Ionicons name="lock-closed-outline" size={18} color={colors.warning}/>
      <SafeText variant="caption" color="primary">{t(messages, messageKey)}</SafeText>
    </View>);
}

