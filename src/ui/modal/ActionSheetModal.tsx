import React from "react";
import { Pressable, Text, View } from "react-native";
import { AppModal } from "./AppModal";
import { ModalHeader } from "./ModalHeader";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Messages } from "../../shared/constants/messages";
import { styles, createPressableBackgroundColorStyle, createTextColorStyle, createPressableBackgroundColorStyle2, createTextColorStyle2 } from "./styles/ActionSheetModal.styles";
export interface ActionSheetItem {
    label: string;
    icon?: React.ReactNode;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
    accessibilityLabel?: string;
}
interface ActionSheetModalProps {
    visible: boolean;
    title?: string;
    actions: ActionSheetItem[];
    onClose: () => void;
}
export function ActionSheetModal({ visible, title, actions, onClose, }: ActionSheetModalProps) {
    const { colors } = useAppTheme();
    return (<AppModal visible={visible} onClose={onClose}>
      {title && <ModalHeader title={title} onClose={onClose}/>}
      <View style={styles.actions}>
        {actions.map((action, i) => (<Pressable key={i} onPress={() => {
                action.onPress();
                onClose();
            }} disabled={action.disabled} style={({ pressed }) => [
                styles.actionRow,
                createPressableBackgroundColorStyle(pressed ? colors.surfaceMuted : 'transparent'),
                action.disabled && styles.disabled,
            ]} accessibilityLabel={action.accessibilityLabel || action.label} accessibilityRole="button">
            {action.icon && <View style={styles.actionIcon}>{action.icon}</View>}
            <Text style={[
                styles.actionLabel,
                createTextColorStyle(action.destructive ? colors.danger : colors.textPrimary),
            ]} numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>))}
      </View>
      
      <View style={styles.cancelContainer}>
        <Pressable onPress={onClose} style={[styles.cancelBtn, createPressableBackgroundColorStyle2(colors.surfaceMuted)]} accessibilityLabel={Messages.accessibility.modal.cancel} accessibilityRole="button">
          <Text style={[styles.cancelText, createTextColorStyle2(colors.textPrimary)]}>
            {Messages.common.cancel}
          </Text>
        </Pressable>
      </View>
    </AppModal>);
}
export default ActionSheetModal;

