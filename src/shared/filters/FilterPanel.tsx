import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useMessages } from "../../messages";
import { AppBottomSheet } from "../../ui/bottomSheet";
import { ModalFooter, ModalHeader } from "../../ui/modal";
import { useAppTheme } from "../theme/useAppTheme";
import { FilterChip } from "./FilterChip";
import type { FilterPanelSection } from "./filter.types";
import { includeWhenPresent } from "../utils/presentProperty";
import { styles, createTextColorStyle } from "./styles/FilterPanel.styles";
interface FilterPanelProps {
    visible: boolean;
    sections: FilterPanelSection[];
    initialSelections?: Record<string, string[]>;
    onApply: (selections: Record<string, string[]>) => void;
    onClear: () => void;
    onCancel: () => void;
}
export function FilterPanel({ visible, sections, initialSelections = {}, onApply, onClear, onCancel, }: FilterPanelProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const [selections, setSelections] = useState<Record<string, string[]>>(initialSelections);
    function handleToggle(sectionKey: string, value: string, multiSelect = false) {
        setSelections((previous) => {
            const current = previous[sectionKey] ?? [];
            if (multiSelect) {
                const next = current.includes(value)
                    ? current.filter((candidate) => candidate !== value)
                    : [...current, value];
                return { ...previous, [sectionKey]: next };
            }
            return { ...previous, [sectionKey]: current.includes(value) ? [] : [value] };
        });
    }
    function handleClear() {
        setSelections({});
        onClear();
    }
    return (<AppBottomSheet visible={visible} onClose={onCancel} testID="filter-panel-sheet" header={<ModalHeader title={messages.common.filter} onClose={onCancel}/>}>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (<View key={section.key} style={styles.section}>
            <Text style={[styles.sectionTitle, createTextColorStyle(colors.textSecondary)]}>{section.title}</Text>
            <View style={styles.chips}>
              {section.options.map((option) => (<FilterChip key={String(option.value)} label={option.label} selected={(selections[section.key] ?? []).includes(String(option.value))} {...includeWhenPresent("count", option.count)} onPress={() => handleToggle(section.key, String(option.value), section.multiSelect)}/>))}
            </View>
          </View>))}
      </ScrollView>
      <ModalFooter secondaryAction={{ label: messages.common.clear, onPress: handleClear }} primaryAction={{ label: messages.common.apply, onPress: () => onApply(selections) }}/>
    </AppBottomSheet>);
}

