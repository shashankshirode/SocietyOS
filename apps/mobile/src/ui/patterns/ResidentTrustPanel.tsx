import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/ResidentTrustPanel.styles";
export interface ResidentTrustPanelProps {
    message: string;
}
export function ResidentTrustPanel({ message }: ResidentTrustPanelProps) {
    const { dark } = useAppTheme();
    const messages = useMessages();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? 'rgba(16,185,129,0.1)' : '#F0FDF4', dark ? 'rgba(16,185,129,0.2)' : '#D1FAE5'),
        ]} accessibilityLabel={messages.residentAccessibility.trustPanel}>
      <Ionicons name="shield-checkmark" size={16} color="#10B981"/>
      <SafeText variant="tiny" style={createSafeTextColorStyle(dark ? '#34D399' : '#065F46')}>
        {message}
      </SafeText>
    </View>);
}

