import { Pressable, View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorStyle, createPressableBorderColorBackgroundColorStyle, createAppTextColorBorderColorStyle } from "../styles/components/ConsentRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface ConsentRowProps {
    label: string;
    description: string;
    value: boolean;
    onValueChange: (newValue: boolean) => void;
    required?: boolean;
}
export function ConsentRow({ label, description, value, onValueChange, required = false, }: ConsentRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<Pressable style={[
            styles.rowContainer,
            createPressableBorderColorBackgroundColorStyle(colors.border, colors.card),
        ]} onPress={() => onValueChange(!value)} accessibilityRole="checkbox" accessibilityState={{ checked: value }} accessibilityLabel={`${label}${required ? localizedUiText.m_815117e98a1c : ''}. ${description}`}>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <AppText variant="body" style={styles.boldText}>
            {label}
          </AppText>
          {required && (<AppText variant="caption" style={[styles.requiredBadge, createAppTextColorBorderColorStyle(colors.danger, colors.danger)]}>{localizedUiText.m_4850b174b713}</AppText>)}
        </View>
        <AppText variant="caption" style={createAppTextColorStyle(colors.textSecondary)}>
          {description}
        </AppText>
      </View>
      <View style={styles.checkboxWrapper}>
        <Ionicons name={value ? 'checkbox' : 'square-outline'} size={24} color={value ? colors.primary : colors.textSecondary}/>
      </View>
    </Pressable>);
}

