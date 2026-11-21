import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppModal } from "./AppModal";
import { ModalHeader } from "./ModalHeader";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createPressableBackgroundColorStyle, createTextColorFontWeightStyle } from "./styles/PickerModal.styles";
export interface PickerOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
}
interface PickerModalProps {
    visible: boolean;
    title: string;
    options: PickerOption[];
    selectedValue?: string;
    onSelect: (value: string) => void;
    onClose: () => void;
}
export function PickerModal({ visible, title, options, selectedValue, onSelect, onClose, }: PickerModalProps) {
    const { colors } = useAppTheme();
    return (<AppModal visible={visible} onClose={onClose}>
      <ModalHeader title={title} onClose={onClose}/>
      <FlatList data={options} keyExtractor={(item) => item.value} style={styles.list} renderItem={({ item }) => {
            const isSelected = item.value === selectedValue;
            return (<Pressable onPress={() => {
                    onSelect(item.value);
                    onClose();
                }} style={({ pressed }) => [
                    styles.option,
                    createPressableBackgroundColorStyle(pressed
                        ? colors.surfaceMuted
                        : isSelected
                            ? colors.primarySoft
                            : 'transparent'),
                ]} accessibilityLabel={item.label} accessibilityRole="radio" accessibilityState={{ selected: isSelected }}>
              {item.icon && <View style={styles.optionIcon}>{item.icon}</View>}
              <Text style={[
                    styles.optionLabel,
                    createTextColorFontWeightStyle(isSelected ? colors.primary : colors.textPrimary, isSelected ? '600' : '400'),
                ]} numberOfLines={1}>
                {item.label}
              </Text>
              {isSelected && (<Ionicons name="checkmark" size={20} color={colors.primary}/>)}
            </Pressable>);
        }}/>
    </AppModal>);
}
export default PickerModal;

