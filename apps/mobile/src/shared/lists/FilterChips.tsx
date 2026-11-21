import { Pressable, ScrollView, StyleProp, Text, useWindowDimensions, View, ViewStyle } from "react-native";
import { Layout } from "../theme/layout";
import type { Absent } from "../types/absence.types";
import { styles } from "./styles/FilterChips.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
interface FilterOption<T> {
    label: string;
    value?: T;
    key?: T;
    count?: number;
}
interface FilterChipsProps<T> {
    options: FilterOption<T>[];
    selected?: T;
    selectedKey?: T;
    onChange?: (value: T) => void;
    onSelect?: (value: T) => void;
    style?: StyleProp<ViewStyle>;
}
export function FilterChips<T extends string | Absent>({ options, selected, selectedKey, onChange, onSelect, style, }: FilterChipsProps<T>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { width } = useWindowDimensions();
    const isTablet = width > Layout.maxTabletContentWidth;
    const finalSelected = (selected !== undefined ? selected : selectedKey) as T;
    const finalOnChange = onChange || onSelect;
    const content = options.map((option) => {
        const val = (option.value !== undefined ? option.value : option.key) as T;
        const isSelected = val === finalSelected;
        return (<Pressable key={String(val)} style={[
                styles.chip,
                isSelected && styles.chipActive,
            ]} onPress={() => finalOnChange?.(val)} accessibilityRole="button" accessibilityState={{ selected: isSelected }} accessibilityLabel={formatUiLiteral(localizedUiText.m_77d53878eaef, [option.label])}>
        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
          {option.label}
        </Text>
        {option.count !== undefined && (<View style={[styles.badge, isSelected && styles.badgeActive]}>
            <Text style={[styles.badgeText, isSelected && styles.badgeTextActive]}>
              {option.count}
            </Text>
          </View>)}
      </Pressable>);
    });
    if (isTablet) {
        return <View style={[styles.tabletContainer, style]}>{content}</View>;
    }
    return (<ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.scrollContainer, style]} contentContainerStyle={styles.scrollContent}>
      {content}
    </ScrollView>);
}
export default FilterChips;

