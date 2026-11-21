import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import type { PrerequisiteCheck } from "../../shared/prerequisites";
import { styles, createViewBackgroundColorBorderColorStyle } from "./styles/PrerequisiteBlockedBanner.styles";
export interface PrerequisiteBlockedBannerProps {
    check: PrerequisiteCheck;
}
export function PrerequisiteBlockedBanner({ check }: PrerequisiteBlockedBannerProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const accent = check.status === 'restricted' ? colors.danger : colors.warning;
    return (<View style={[styles.banner, createViewBackgroundColorBorderColorStyle(dark ? `${accent}20` : `${accent}12`, accent)]}>
      <Ionicons name={check.status === 'restricted' ? 'lock-closed-outline' : 'alert-circle-outline'} size={18} color={accent}/>
      <View style={styles.text}>
        <SafeText variant="bodyStrong" color="primary" numberOfLines={2}>
          {t(messages, check.titleMessageKey)}
        </SafeText>
        <SafeText variant="caption" color="secondary" numberOfLines={3}>
          {t(messages, check.descriptionMessageKey)}
        </SafeText>
      </View>
    </View>);
}

