import React, { useEffect } from "react";
import { View, Animated, Pressable, AccessibilityInfo, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { SOS_COMMAND_ACTIONS } from "../data/sosCommandActions";
import { useSosCommandDockLayout } from "../hooks/useSosCommandDockLayout";
import { SosCommandAction } from "./SosCommandAction";
import { SosHoldConfirmPanel } from "./SosHoldConfirmPanel";
import type { SosCommandActionConfig, SosCommandActionId } from "../data/sosCommand.types";
import type { SosCommandDockState } from "../data/residentEmergency.types";
import type { EmergencyActionId } from "../data/emergencyAction.types";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppModal } from "../../../../ui/modal";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle6, createViewBackgroundColorBorderColorStyle2, createSafeTextColorStyle7, createViewBackgroundColorBorderColorStyle3, createSafeTextColorStyle8, createPressableBackgroundColorStyle, createPressableBorderColorStyle, createSafeTextColorStyle9, createSafeTextColorStyle10, createAnimatedViewBottomRightAlignSelfStyle, createAnimatedViewBackgroundColorBorderColorOpacityTransformStyle, createAnimatedViewTranslateYStyle } from "../styles/components/SosCommandDock.styles";
type SosCommandDockProps = {
    dockState: {
        state: SosCommandDockState;
        setState: React.Dispatch<React.SetStateAction<SosCommandDockState>>;
        isOpen: boolean;
        animValue: Animated.Value;
        reducedMotion: boolean;
        openDock: () => void;
        closeDock: () => void;
        selectAction: (actionId: EmergencyActionId) => void;
        cancelConfirmation: () => void;
    };
    triggerAction: (actionId: EmergencyActionId) => Promise<void>;
};
function toEmergencyActionId(actionId: SosCommandActionId): EmergencyActionId {
    return actionId === 'TRIGGER_SOS' ? 'MAIN_SOS' : actionId;
}
function findActionConfig(actionId: EmergencyActionId): SosCommandActionConfig | Absent {
    return SOS_COMMAND_ACTIONS.find((action) => (action.id === actionId || (actionId === 'MAIN_SOS' && action.id === 'TRIGGER_SOS')));
}
export function SosCommandDock({ dockState, triggerAction }: SosCommandDockProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { mode, bottomOffset, rightOffset, constants } = useSosCommandDockLayout();
    const { state, isOpen, animValue, closeDock, selectAction, cancelConfirmation } = dockState;
    useEffect(() => {
        if (state.status === 'open') {
            AccessibilityInfo.announceForAccessibility(t(messages, 'residentAccessibility.emergency.openSosDock'));
        }
    }, [messages, state.status]);
    const handleActionSelect = (config: SosCommandActionConfig) => {
        selectAction(toEmergencyActionId(config.id));
    };
    const handleConfirm = () => {
        if (state.status === 'confirming') {
            triggerAction(state.actionId);
        }
    };
    const handleClose = () => {
        closeDock();
    };
    const slideAnim = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
    });
    const opacityAnim = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const isCompactTray = mode === 'compactTray';
    const isTablet = mode === 'tabletDock';
    const renderActionsGrid = () => {
        const rows = [];
        for (let i = 0; i < SOS_COMMAND_ACTIONS.length; i += 2) {
            const act1 = getRequiredItem(SOS_COMMAND_ACTIONS, i, "SosCommandDock.tsx");
            const act2 = getRequiredItem(SOS_COMMAND_ACTIONS, i + 1, "SosCommandDock.tsx");
            rows.push(<View key={i} style={styles.gridRow}>
          <SosCommandAction config={act1} labelText={t(messages, act1.labelKey)} accessibilityLabel={t(messages, act1.accessibilityKey)} onPress={() => handleActionSelect(act1)}/>
          {act2 && (<SosCommandAction config={act2} labelText={t(messages, act2.labelKey)} accessibilityLabel={t(messages, act2.accessibilityKey)} onPress={() => handleActionSelect(act2)}/>)}
        </View>);
        }
        return rows;
    };
    const renderContent = () => {
        switch (state.status) {
            case 'confirming': {
                const selectedAction = findActionConfig(state.actionId);
                if (!selectedAction)
                    return null;
                return (<View style={styles.centerOverlay}>
            <SosHoldConfirmPanel config={selectedAction} onConfirm={handleConfirm} onCancel={cancelConfirmation}/>
          </View>);
            }
            case 'triggering': {
                return (<View style={styles.centerOverlay}>
            <View style={[styles.dialogCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <ActivityIndicator size="large" color={colors.danger}/>
              <SafeText variant="bodyStrong" style={[styles.dialogTitle, createSafeTextColorStyle6(colors.textPrimary)]}>
                {t(messages, 'resident.emergency.sos.triggering')}
              </SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle(colors.textSecondary)}>
                {t(messages, 'resident.emergency.sos.triggeringDescription')}
              </SafeText>
            </View>
          </View>);
            }
            case 'success': {
                const selectedAction = findActionConfig(state.actionId);
                const actionLabel = selectedAction ? t(messages, selectedAction.labelKey) : '';
                return (<View style={styles.centerOverlay}>
            <View style={[styles.dialogCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success}/>
              <SafeText variant="bodyStrong" style={[styles.dialogTitle, createSafeTextColorStyle7(colors.textPrimary)]}>
                {t(messages, 'resident.emergency.triggerSuccessTitle')}
              </SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle2(colors.textSecondary)}>
                {`${t(messages, 'resident.emergency.triggerSuccessDescription')} (${actionLabel})`}
              </SafeText>
              <AppButton title={messages.common.done} onPress={handleClose} style={styles.dialogBtn}/>
            </View>
          </View>);
            }
            case 'failed': {
                return (<View style={styles.centerOverlay}>
            <View style={[styles.dialogCard, createViewBackgroundColorBorderColorStyle3(colors.surface, colors.border)]}>
              <Ionicons name="alert-circle" size={48} color={colors.danger}/>
              <SafeText variant="bodyStrong" style={[styles.dialogTitle, createSafeTextColorStyle8(colors.textPrimary)]}>
                {t(messages, 'resident.emergency.triggerFailedTitle')}
              </SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle3(colors.textSecondary)}>
                {t(messages, 'resident.emergency.triggerFailedDescription')}
              </SafeText>
              <View style={styles.actionRow}>
                <Pressable onPress={() => triggerAction(state.actionId)} style={[styles.retryBtn, createPressableBackgroundColorStyle(colors.danger)]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textInverse)}>
                    {messages.common.retry}
                  </SafeText>
                </Pressable>
                <Pressable onPress={handleClose} style={[styles.cancelBtn, createPressableBorderColorStyle(colors.border)]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle5(colors.textPrimary)}>
                    {messages.common.cancel}
                  </SafeText>
                </Pressable>
              </View>
            </View>
          </View>);
            }
            case 'open':
            default:
                return (<Animated.View style={[
                        isCompactTray ? styles.compactTray : styles.floatingDock,
                        !isCompactTray && createAnimatedViewBottomRightAlignSelfStyle(bottomOffset + 64 + constants.dockVerticalGap, isTablet ? undefined : rightOffset, isTablet ? 'center' : 'auto'),
                        createAnimatedViewBackgroundColorBorderColorOpacityTransformStyle(colors.surface, colors.border, opacityAnim, [createAnimatedViewTranslateYStyle(slideAnim)]),
                    ]}>
            {isCompactTray && <View style={styles.dragHandle}/>}
            <View style={styles.header}>
              <View style={styles.titleArea}>
                <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle9(colors.textPrimary)]}>
                  {t(messages, 'resident.emergency.sos.commandDockTitle')}
                </SafeText>
                <SafeText variant="tiny" style={[styles.subtitle, createSafeTextColorStyle10(colors.textSecondary)]}>
                  {t(messages, 'resident.emergency.sos.commandDockSubtitle')}
                </SafeText>
              </View>

              <Pressable onPress={handleClose} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.emergency.closeSosDock')} style={styles.closeIcon}>
                <Ionicons name="close" size={20} color={colors.textSecondary}/>
              </Pressable>
            </View>

            <View style={styles.gridContainer}>{renderActionsGrid()}</View>
          </Animated.View>);
        }
    };
    return (<AppModal visible={isOpen} onClose={handleClose} preventDismiss={state.status === 'triggering'} fullScreen showDragHandle={false} contentStyle={styles.transparentModalContent}>
      <View style={styles.fullscreen}>
        {renderContent()}
      </View>
    </AppModal>);
}
export default SosCommandDock;

