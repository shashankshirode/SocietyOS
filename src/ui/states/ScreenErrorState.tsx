import { View } from "react-native";
import { ErrorState } from "../../shared/feedback/ErrorState";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle } from "./styles/ScreenErrorState.styles";
export interface ScreenErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    canRetry?: boolean;
}
export function ScreenErrorState({ title, message, onRetry, canRetry = true, }: ScreenErrorStateProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]}>
      <ErrorState {...includeWhenPresent("title", title)} message={message} {...includeWhenPresent("onRetry", canRetry ? onRetry : undefined)}/>
    </View>);
}

