import { View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppButton } from "../components/AppButton";
import { AppIcon } from "../icons/AppIcon";
import { AppIconName } from "../icons/icon.types";
import { SafeText } from "../components/SafeText";
import { WrapRow } from "../layout/WrapRow";
import { styles, createViewBackgroundColorStyle } from "./styles/EmptyState.styles";
export interface EmptyStateProps {
    title: string;
    description: string;
    icon?: AppIconName;
    iconName?: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}
export function EmptyState({ title, description, icon, iconName, actionLabel, onAction, secondaryActionLabel, onSecondaryAction, }: EmptyStateProps) {
    const { colors } = useAppTheme();
    const resolvedIcon = (icon || iconName || 'empty') as AppIconName;
    return (<View style={styles.container}>
      <View style={[styles.iconCircle, createViewBackgroundColorStyle(colors.surfaceSoft)]}>
        <AppIcon name={resolvedIcon} size={36} color={colors.textMuted}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>{title}</SafeText>
      <SafeText variant="body" color="muted" align="center" numberOfLines={5} style={styles.description}>{description}</SafeText>
      <WrapRow style={styles.buttonRow}>
        {actionLabel && onAction && (<AppButton title={actionLabel} onPress={onAction} variant="primary" size="sm"/>)}
        {secondaryActionLabel && onSecondaryAction && (<AppButton title={secondaryActionLabel} onPress={onSecondaryAction} variant="ghost" size="sm"/>)}
      </WrapRow>
    </View>);
}
export default EmptyState;

