import { useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../shared/components/SafeText";
import { useEmergencyHaptics } from "../hooks/useEmergencyHaptics";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle2, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createAnimatedViewBackgroundColorWidthStyle } from "../styles/components/EmergencyHoldToConfirmButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
type EmergencyHoldToConfirmButtonProps = {
    onConfirm: () => void;
    onCancel: () => void;
    actionLabel: string;
    holdMessage: string;
};
export function EmergencyHoldToConfirmButton({ onConfirm, onCancel, actionLabel, holdMessage, }: EmergencyHoldToConfirmButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const haptics = useEmergencyHaptics();
    const [isPressing, setIsPressing] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const handlePressIn = () => {
        setIsPressing(true);
        haptics.triggerSelection();
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
        }).start();
        timerRef.current = setTimeout(() => {
            haptics.triggerSuccess();
            onConfirm();
            handlePressOut();
        }, 2000);
    };
    const handlePressOut = () => {
        setIsPressing(false);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        progressAnim.setValue(0);
    };
    const widthInterpolate = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(colors.textPrimary)]}>
        {holdMessage}
      </SafeText>

      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={({ pressed }) => [
            styles.holdButton,
            createPressableBackgroundColorBorderColorStyle(pressed ? `${colors.danger}20` : `${colors.danger}10`, colors.danger),
        ]} accessibilityRole="button" accessibilityLabel={formatUiLiteral(localizedUiText.m_4cbf952b19ad, [actionLabel])}>
        <Ionicons name="finger-print" size={48} color={colors.danger}/>
        <SafeText variant="caption" style={createSafeTextColorStyle(colors.danger)}>
          {isPressing ? localizedUiText.m_dceab55f44c9 : localizedUiText.m_67a230da2431}
        </SafeText>

        <View style={[styles.progressBarContainer, createViewBackgroundColorStyle(colors.border)]}>
          <Animated.View style={[
            styles.progressBarFill,
            createAnimatedViewBackgroundColorWidthStyle(colors.danger, widthInterpolate),
        ]}/>
        </View>
      </Pressable>

      <Pressable onPress={onCancel} style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel={localizedUiText.m_989e579ede12}>
        <SafeText variant="caption" color="secondary" style={styles.safeTextFontWeight}>{localizedUiText.m_ad8d698573fc}</SafeText>
      </Pressable>
    </View>);
}
export default EmergencyHoldToConfirmButton;

