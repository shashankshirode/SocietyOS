import { StyleProp, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppButton } from "../components/AppButton";
import { AppIcon } from "../icons/AppIcon";
import { SafeText } from "../components/SafeText";
import { styles, createViewBackgroundColorStyle } from "./styles/SuccessState.styles";
export type SuccessStateProps = {
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    style?: StyleProp<ViewStyle>;
};
export function SuccessState({ title, message, actionLabel, onAction, secondaryActionLabel, onSecondaryAction, style, }: SuccessStateProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, style]}>
      <View style={[styles.iconCircle, createViewBackgroundColorStyle(colors.successSoft)]}>
        <AppIcon name="success" size={36} color={colors.success}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>{title}</SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={5} style={styles.message}>{message}</SafeText>
      <View style={styles.actions}>
        {actionLabel && onAction ? (<AppButton title={actionLabel} onPress={onAction} fullWidth/>) : null}
        {secondaryActionLabel && onSecondaryAction ? (<AppButton title={secondaryActionLabel} onPress={onSecondaryAction} variant="outline" fullWidth/>) : null}
      </View>
    </View>);
}
export default SuccessState;

