import { View, Pressable } from "react-native";
import { SafeText } from "../typography/SafeText";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createPressableBackgroundColorStyle, createSafeTextColorFontWeightStyle } from "./styles/SegmentedControl.styles";
interface SegmentedControlProps {
    values: string[];
    selectedIndex: number;
    onChange: (index: number) => void;
}
export function SegmentedControl({ values, selectedIndex, onChange }: SegmentedControlProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.backgroundSoft)]}>
      {values.map((value, index) => {
            const isSelected = index === selectedIndex;
            return (<Pressable key={value} onPress={() => onChange(index)} style={[
                    styles.segment,
                    isSelected && createPressableBackgroundColorStyle(colors.surface),
                ]}>
            <SafeText variant="caption" style={[
                    styles.text,
                    createSafeTextColorFontWeightStyle(isSelected ? colors.textPrimary : colors.textMuted, isSelected ? '700' : '500'),
                ]}>
              {value}
            </SafeText>
          </Pressable>);
        })}
    </View>);
}

