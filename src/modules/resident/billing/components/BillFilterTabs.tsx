import { Pressable, View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { BillListFilter } from "../data/residentBilling.types";
import { styles, createSafeTextColorStyle, createPressableBackgroundColorBorderColorStyle } from "../styles/components/BillFilterTabs.styles";
export type BillFilterTabsProps = {
    value: BillListFilter;
    onChange: (filter: BillListFilter) => void;
};
export function BillFilterTabs({ value, onChange }: BillFilterTabsProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const filters: {
        value: BillListFilter;
        label: string;
    }[] = [
        { value: 'all', label: billing.allBills },
        { value: 'unpaid', label: billing.unpaid },
        { value: 'paid', label: billing.paid },
        { value: 'overdue', label: billing.overdue },
    ];
    return (<View style={styles.row} accessibilityRole="tablist" accessibilityLabel={messages.residentAccessibility.billing.filter}>
      {filters.map((filter) => {
            const selected = value === filter.value;
            return (<Pressable key={filter.value} accessibilityRole="tab" accessibilityState={{ selected }} onPress={() => onChange(filter.value)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(selected ? theme.accent : theme.surface, selected ? theme.accent : theme.border),
                ]}>
            <SafeText variant="tiny" style={createSafeTextColorStyle(selected ? '#FFFFFF' : theme.textSecondary)}>
              {filter.label}
            </SafeText>
          </Pressable>);
        })}
    </View>);
}

