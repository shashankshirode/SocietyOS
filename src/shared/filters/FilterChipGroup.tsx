import { ScrollView, View } from "react-native";
import { FilterChip } from "./FilterChip";
import type { FilterChipGroupProps } from "./filter.types";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles } from "./styles/FilterChipGroup.styles";
export function FilterChipGroup<T extends string = string>({ filters, selectedValues, onChange, layout = 'horizontal-scroll', multiSelect = false, showClear = false, }: FilterChipGroupProps<T>) {
    function handlePress(value: T) {
        if (multiSelect) {
            const next = selectedValues.includes(value)
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
            onChange(next);
        }
        else {
            onChange(selectedValues.includes(value) ? [] : [value]);
        }
    }
    function handleClear(value: T) {
        onChange(selectedValues.filter((v) => v !== value));
    }
    const chips = filters.map((f) => (<FilterChip key={String(f.value)} label={f.label} selected={selectedValues.includes(f.value)} {...includeWhenPresent("disabled", f.disabled)} {...includeWhenPresent("count", f.count)} {...includeWhenPresent("icon", f.icon)} showClear={showClear} onPress={() => handlePress(f.value)} onClear={() => handleClear(f.value)}/>));
    if (layout === 'wrap') {
        return <View style={styles.wrapContainer}>{chips}</View>;
    }
    return (<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      {chips}
    </ScrollView>);
}

