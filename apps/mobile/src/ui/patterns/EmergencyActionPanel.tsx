import { useRef, useCallback } from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { EmergencyAction } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createSafeTextColorStyle3 } from "./styles/EmergencyActionPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export interface EmergencyActionPanelProps {
    actions: EmergencyAction[];
    onSosHoldComplete: () => void;
    onEmergencyActionPress: (id: string) => void;
}
const SOS_HOLD_DURATION = 2000;
export function EmergencyActionPanel({ actions, onSosHoldComplete, onEmergencyActionPress, }: EmergencyActionPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { dark } = useAppTheme();
    const holdProgress = useSharedValue(0);
    const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerSos = useCallback(() => {
        onSosHoldComplete();
    }, [onSosHoldComplete]);
    const handlePressIn = useCallback(() => {
        holdProgress.value = withTiming(1, { duration: SOS_HOLD_DURATION });
        holdTimer.current = setTimeout(() => {
            runOnJS(triggerSos)();
        }, SOS_HOLD_DURATION);
    }, [holdProgress, triggerSos]);
    const handlePressOut = useCallback(() => {
        holdProgress.value = withTiming(0, { duration: 200 });
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
    }, [holdProgress]);
    const progressStyle = useAnimatedStyle(() => ({
        width: `${holdProgress.value * 100}%`,
    }));
    const dangerBg = dark ? '#2D0A0A' : '#FEF2F2';
    const dangerBorder = dark ? '#7F1D1D' : '#FECACA';
    return (<View style={styles.container}>
      <DashboardSectionHeader title={localizedUiText.m_4538f2dc67b5} subtitle={localizedUiText.m_31779211577e}/>

      <View style={[styles.panel, createViewBackgroundColorBorderColorStyle(dangerBg, dangerBorder)]}>
        
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} accessibilityLabel={localizedUiText.m_0eade1209b30} accessibilityRole="button" style={styles.sosArea}>
          <View style={styles.sosButton}>
            <Ionicons name="alert-circle" size={32} color="#FFFFFF"/>
            <SafeText variant="title" style={styles.sosText}>{localizedUiText.m_f8df2bea26dc}</SafeText>
            
            <Animated.View style={[styles.sosProgress, progressStyle]}/>
          </View>
          <View style={styles.sosInfo}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle(dark ? '#F87171' : '#991B1B')}>{localizedUiText.m_8116591e7e70}</SafeText>
            <SafeText variant="tiny" style={createSafeTextColorStyle2(dark ? '#FCA5A5' : '#B91C1C')}>{localizedUiText.m_dfbcecf560cf}</SafeText>
          </View>
        </Pressable>

        
        <View style={styles.chips}>
          {actions.map((action) => (<PressableScale key={action.id} onPress={() => onEmergencyActionPress(action.id)} accessibilityLabel={action.label} accessibilityRole="button">
              <View style={[styles.chip, createViewBackgroundColorBorderColorStyle2(dark ? '#1C0505' : '#FFF5F5', dark ? '#450A0A' : '#FEE2E2')]}>
                <Ionicons name={action.iconName as keyof typeof Ionicons.glyphMap} size={18} color={dark ? '#F87171' : '#DC2626'}/>
                <SafeText variant="tiny" style={[styles.chipLabel, createSafeTextColorStyle3(dark ? '#FCA5A5' : '#991B1B')]} numberOfLines={1}>
                  {action.label}
                </SafeText>
              </View>
            </PressableScale>))}
        </View>
      </View>
    </View>);
}

