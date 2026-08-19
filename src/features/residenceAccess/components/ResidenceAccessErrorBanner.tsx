import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessRepositoryError } from "../models/residenceAccess.types";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/ResidenceAccessErrorBanner.styles";
interface ResidenceAccessErrorBannerProps {
    readonly error: ResidenceAccessRepositoryError;
    readonly onRetry?: () => void;
    readonly onDismiss?: () => void;
}
export function ResidenceAccessErrorBanner({ error, onRetry, onDismiss, }: ResidenceAccessErrorBannerProps) {
    const { colors } = useAppTheme();
    const retryAfter = presentResidenceDate(error.retryAfter);
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.dangerSoft, colors.danger)]} accessibilityRole="alert">
      <View style={styles.topRow}>
        <Ionicons name="alert-circle-outline" size={22} color={colors.danger}/>
        <AppText variant="bodySmall" style={styles.message}>
          {error.message}
        </AppText>
        {onDismiss ? (<Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel={residenceAccessMessages.common.dismissError} hitSlop={8}>
            <Ionicons name="close" size={20} color={colors.textSecondary}/>
          </Pressable>) : null}
      </View>
      {error.retryAfter ? (<AppText variant="caption" tone="secondary">
          {residenceAccessMessages.reminder.nextAllowed(retryAfter.absolute)}
        </AppText>) : null}
      {error.retryable && onRetry ? (<AppButton title={residenceAccessMessages.list.retry} onPress={onRetry} variant="outline" size="sm"/>) : null}
    </View>);
}

