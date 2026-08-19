import { Pressable, ScrollView, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { FilterChip } from "./FilterChip";
import { AppIcon } from "../icons/AppIcon";
import { styles, createTextColorStyle } from "./styles/ActiveFilterBar.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface ActiveFilter {
    key: string;
    label: string;
}
interface ActiveFilterBarProps {
    filters: ActiveFilter[];
    onRemove: (key: string) => void;
    onClearAll: () => void;
}
export function ActiveFilterBar({ filters, onRemove, onClearAll }: ActiveFilterBarProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    if (filters.length === 0)
        return null;
    return (<View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((f) => (<FilterChip key={f.key} label={f.label} selected showClear onClear={() => onRemove(f.key)}/>))}
      </ScrollView>
      <Pressable onPress={onClearAll} style={styles.clearAll} hitSlop={8} accessibilityLabel={localizedUiText.m_de22447d91bb}>
        <AppIcon name="close" size={14} color={colors.textMuted}/>
        <Text style={[styles.clearText, createTextColorStyle(colors.textMuted)]}>{localizedUiText.m_83b12c2216ef}</Text>
      </Pressable>
    </View>);
}

