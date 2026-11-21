import React from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Messages } from "../../shared/constants/messages";
import { styles, createTextColorStyle, createTextColorStyle2, createPressableBackgroundColorStyle } from "./styles/ModalHeader.styles";
interface ModalHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onClose?: () => void;
    showClose?: boolean;
}
export function ModalHeader({ title, subtitle, icon, onClose, showClose = true, }: ModalHeaderProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <View style={styles.titleRow}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <View style={styles.textCol}>
          <Text style={[styles.title, createTextColorStyle(colors.textPrimary)]} numberOfLines={2}>
            {title}
          </Text>
          {subtitle && (<Text style={[styles.subtitle, createTextColorStyle2(colors.textSecondary)]} numberOfLines={2}>
              {subtitle}
            </Text>)}
        </View>
        {showClose && onClose && (<Pressable onPress={onClose} style={[styles.closeBtn, createPressableBackgroundColorStyle(colors.surfaceMuted)]} accessibilityLabel={Messages.accessibility.modal.close} accessibilityRole="button" hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.textSecondary}/>
          </Pressable>)}
      </View>
    </View>);
}
export default ModalHeader;

