import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle } from "../styles/components/ResidenceAccessEmptyState.styles";
interface ResidenceAccessEmptyStateProps {
    readonly title: string;
    readonly body: string;
    readonly primaryLabel?: string;
    readonly onPrimary?: () => void;
    readonly secondaryLabel?: string;
    readonly onSecondary?: () => void;
}
export function ResidenceAccessEmptyState({ title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary, }: ResidenceAccessEmptyStateProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <View style={[styles.icon, createViewBackgroundColorStyle(colors.primarySoft)]}>
        <Ionicons name="home-outline" size={30} color={colors.primary}/>
      </View>
      <AppText variant="h3" weight="800" style={styles.center}>
        {title}
      </AppText>
      <AppText variant="body" tone="secondary" style={styles.center}>
        {body}
      </AppText>
      {primaryLabel && onPrimary ? (<AppButton title={primaryLabel} onPress={onPrimary} fullWidth/>) : null}
      {secondaryLabel && onSecondary ? (<AppButton title={secondaryLabel} onPress={onSecondary} variant="outline" fullWidth/>) : null}
    </View>);
}

