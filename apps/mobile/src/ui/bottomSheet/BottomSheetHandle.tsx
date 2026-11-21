import { View, type ViewStyle } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import { styles, createViewBackgroundColorStyle } from "./styles/BottomSheetHandle.styles";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface BottomSheetHandleProps {
    style?: ViewStyle;
}
export function BottomSheetHandle({ style }: BottomSheetHandleProps) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const messages = useMessages();
    const dragLabel = t(messages, 'resident.accessibility.dailyInsights.dragHandle') || getActiveUiLiteral("m_b5e7387dcd7b");
    return (<View style={styles.container}>
      <View style={[styles.handle, createViewBackgroundColorStyle(colors.border), style]} accessibilityRole="button" accessibilityLabel={dragLabel} importantForAccessibility="yes" accessible={true}/>
    </View>);
}
export default BottomSheetHandle;

