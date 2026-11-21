import { Pressable, View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { authMessages } from "../messages/auth.messages";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createAppTextColorStyle2, createAppTextColorStyle3, createAppTextColorStyle4, createAppTextColorStyle5, createAppTextColorStyle6 } from "../styles/components/AuthenticationTrustFooter.styles";
interface AuthenticationTrustFooterProps {
    onTermsPress?: () => void;
    onPrivacyPress?: () => void;
    onHelpPress?: () => void;
}
export function AuthenticationTrustFooter({ onTermsPress, onPrivacyPress, onHelpPress, }: AuthenticationTrustFooterProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <View style={styles.shieldRow}>
        <Ionicons name="shield-checkmark" size={14} color={colors.success}/>
        <AppText variant="caption" style={[styles.trustText, createAppTextColorStyle3(colors.textSecondary)]}>
          {authMessages.trustStrip}
        </AppText>
      </View>
      <View style={styles.linksRow}>
        <Pressable onPress={onPrivacyPress} accessibilityRole="link" accessibilityLabel={authMessages.privacy}>
          <AppText variant="caption" style={[styles.link, createAppTextColorStyle4(colors.primary)]}>
            {authMessages.privacy}
          </AppText>
        </Pressable>
        <AppText variant="caption" style={createAppTextColorStyle(colors.divider)}>·</AppText>
        <Pressable onPress={onTermsPress} accessibilityRole="link" accessibilityLabel={authMessages.terms}>
          <AppText variant="caption" style={[styles.link, createAppTextColorStyle5(colors.primary)]}>
            {authMessages.terms}
          </AppText>
        </Pressable>
        <AppText variant="caption" style={createAppTextColorStyle2(colors.divider)}>·</AppText>
        <Pressable onPress={onHelpPress} accessibilityRole="link" accessibilityLabel={authMessages.needHelp}>
          <AppText variant="caption" style={[styles.link, createAppTextColorStyle6(colors.primary)]}>
            {authMessages.needHelp}
          </AppText>
        </Pressable>
      </View>
    </View>);
}

