import { View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppButton } from "../components/AppButton";
import { AppIcon } from "../icons/AppIcon";
import { SafeText } from "../components/SafeText";
import { useMessages } from "../constants/useMessages";
import { styles, createViewBackgroundColorStyle } from "./styles/ErrorState.styles";
export interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    supportCode?: string;
    retryLabel?: string;
}
export function ErrorState({ title, message, onRetry, supportCode, retryLabel, }: ErrorStateProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const resolvedTitle = title ?? messages.common.unableToLoadData;
    return (<View style={styles.container}>
      <View style={[styles.iconContainer, createViewBackgroundColorStyle(colors.dangerSoft)]}>
        <AppIcon name="error" size={32} color={colors.danger}/>
      </View>
      <SafeText variant="title" color="primary" align="center" numberOfLines={3} style={styles.title}>{resolvedTitle}</SafeText>
      <SafeText variant="body" color="secondary" align="center" numberOfLines={5} style={styles.message}>{message}</SafeText>
      {supportCode && (<SafeText variant="caption" color="muted" align="center" numberOfLines={2} style={styles.supportCode}>{messages.common.supportCode(supportCode)}</SafeText>)}
      {onRetry && (<AppButton title={retryLabel ?? messages.common.retry} onPress={onRetry} variant="outline" size="sm" style={styles.button}/>)}
    </View>);
}
export default ErrorState;

