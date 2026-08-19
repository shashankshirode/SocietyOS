import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { styles, createPressableBackgroundColorStyle } from "../styles/components/ResidenceAccessPageHeader.styles";
interface ResidenceAccessPageHeaderProps {
    readonly title: string;
    readonly subtitle?: string;
    readonly onBack: () => void;
}
export function ResidenceAccessPageHeader({ title, subtitle, onBack, }: ResidenceAccessPageHeaderProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.header}>
      <Pressable onPress={onBack} style={[styles.back, createPressableBackgroundColorStyle(colors.surfaceMuted)]} accessibilityRole="button" accessibilityLabel={residenceAccessMessages.common.back} hitSlop={8}>
        <Ionicons name="arrow-back" size={21} color={colors.textPrimary}/>
      </Pressable>
      <View style={styles.title}>
        <AppText variant="h2" weight="800">
          {title}
        </AppText>
        {subtitle ? (<AppText variant="bodySmall" tone="secondary">
            {subtitle}
          </AppText>) : null}
      </View>
    </View>);
}

