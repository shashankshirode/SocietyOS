import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/HouseholdEmptyState.styles";
type HouseholdEmptyStateProps = {
    title: string;
    description: string;
    actionLabel?: string;
    onActionPress?: () => void;
};
export function HouseholdEmptyState({ title, description, actionLabel, onActionPress }: HouseholdEmptyStateProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.backgroundSoft, colors.border)]}> 
      <View style={[styles.iconWrap, createViewBackgroundColorStyle(colors.surface)]}> 
        <Ionicons name="folder-open-outline" size={20} color={colors.primary}/>
      </View>
      <SafeText variant="bodyStrong" color="primary">{title}</SafeText>
      <SafeText variant="caption" color="secondary">{description}</SafeText>
      {actionLabel && onActionPress ? <AppButton title={actionLabel} onPress={onActionPress} variant="outline" size="sm"/> : null}
    </View>);
}

