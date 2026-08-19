import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "./styles/PrerequisiteInlineHint.styles";
export interface PrerequisiteInlineHintProps {
    messageKey: string;
    tone?: 'info' | 'warning' | 'restricted';
}
export function PrerequisiteInlineHint({ messageKey, tone = 'info' }: PrerequisiteInlineHintProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const accent = tone === 'restricted' ? colors.danger : tone === 'warning' ? colors.warning : colors.info;
    return (<View style={[styles.hint, createViewBackgroundColorStyle(dark ? `${accent}1F` : `${accent}12`)]}>
      <Ionicons name={tone === 'restricted' ? 'lock-closed-outline' : 'information-circle-outline'} size={14} color={accent}/>
      <SafeText variant="tiny" style={[styles.text, createSafeTextColorStyle(accent)]} numberOfLines={2}>
        {t(messages, messageKey)}
      </SafeText>
    </View>);
}

