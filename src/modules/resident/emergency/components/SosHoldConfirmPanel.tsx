import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../shared/components/SafeText";
import { useEmergencyHaptics } from "../hooks/useEmergencyHaptics";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import type { SosCommandActionConfig } from "../data/sosCommand.types";
import { useReducedMotion } from "../../../../shared/motion/useReducedMotion";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle4, createPressableBackgroundColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createAnimatedViewBackgroundColorWidthStyle } from "../styles/components/SosHoldConfirmPanel.styles";
interface SosHoldConfirmPanelProps {
    config: SosCommandActionConfig;
    onConfirm: () => void;
    onCancel: () => void;
}
export function SosHoldConfirmPanel({ config, onConfirm, onCancel }: SosHoldConfirmPanelProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const haptics = useEmergencyHaptics();
    const reducedMotion = useReducedMotion();
    const [isPressing, setIsPressing] = useState(false);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const handlePressIn = () => {
        setIsPressing(true);
        haptics.triggerSelection();
        if (reducedMotion) {
            progressAnim.setValue(1);
        }
        else {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            }).start();
        }
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
    const isCallSecurity = config.id === 'CALL_SECURITY';
    useEffect(() => () => {
        if (timerRef.current)
            clearTimeout(timerRef.current);
        progressAnim.stopAnimation();
    }, [progressAnim]);
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle4(colors.textPrimary)]}>
        {t(messages, config.confirmationMessageKey)}
      </SafeText>

      {isCallSecurity ? (<View style={styles.confirmRow}>
          <Pressable onPress={() => {
                haptics.triggerSuccess();
                onConfirm();
            }} style={[styles.confirmBtn, createPressableBackgroundColorStyle(colors.primary)]} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.emergency.confirmCallSecurity')}>
            <SafeText variant="caption" style={createSafeTextColorStyle(colors.textInverse)}>
              {messages.common.confirm}
            </SafeText>
          </Pressable>
          <Pressable onPress={onCancel} style={[styles.cancelBtn, createPressableBorderColorStyle(colors.border)]} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.emergency.cancelCallSecurity')}>
            <SafeText variant="caption" style={createSafeTextColorStyle2(colors.textPrimary)}>
              {messages.common.cancel}
            </SafeText>
          </Pressable>
        </View>) : (<>
          <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={({ pressed }) => [
                styles.holdButton,
                createPressableBackgroundColorBorderColorStyle(pressed ? `${colors.danger}20` : `${colors.danger}10`, colors.danger),
            ]} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.emergency.holdToTrigger')}>
            <Ionicons name="finger-print" size={48} color={colors.danger}/>
            <SafeText variant="caption" style={createSafeTextColorStyle3(colors.danger)}>
              {isPressing
                ? t(messages, 'resident.emergency.confirm.releaseToCancel')
                : t(messages, 'resident.emergency.confirm.holdToConfirm')}
            </SafeText>

            <View style={[styles.progressBarContainer, createViewBackgroundColorStyle(colors.border)]}>
              <Animated.View style={[
                styles.progressBarFill,
                createAnimatedViewBackgroundColorWidthStyle(colors.danger, widthInterpolate),
            ]}/>
            </View>
          </Pressable>

          <Pressable onPress={onCancel} style={styles.cancelBtnText} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.emergency.cancelTrigger')}>
            <SafeText variant="caption" color="secondary" style={styles.safeTextFontWeight}>
              {messages.common.cancel}
            </SafeText>
          </Pressable>
        </>)}
    </View>);
}
export default SosHoldConfirmPanel;

