import { View } from "react-native";
import { formatResidentDateSeparator } from "../../../../core/localization/dateTimeFormatters";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle } from "../styles/components/ChatDateSeparator.styles";
type ChatDateSeparatorProps = {
    date: string;
};
export function ChatDateSeparator({ date }: ChatDateSeparatorProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <View style={[styles.pill, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
        <SafeText variant="tiny" numberOfLines={1} style={createSafeTextColorStyle(colors.textSecondary)}>
          {formatResidentDateSeparator(date)}
        </SafeText>
      </View>
    </View>);
}

