import { useState, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import type { VisitorType } from "../../../../shared/types/visitor.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createPressableBackgroundColorBorderColorStyle } from "../styles/screens/VisitorHistoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type FilterType = 'ALL' | VisitorType;
const HISTORY_ITEMS = [
    {
        id: 'h-1',
        get title() {
            return getActiveUiLiteral("m_2d426be6a607");
        },
        get description() {
            return getActiveUiLiteral("m_9ed4d435b4b3");
        },
        timestamp: 'Yesterday, 5:00 PM',
        iconName: 'checkmark-circle-outline',
        type: 'GUEST' as VisitorType,
        status: 'COMPLETED',
        statusTone: 'neutral' as const,
    },
    {
        id: 'h-2',
        get title() {
            return getActiveUiLiteral("m_0d0f8c90fa31");
        },
        get description() {
            return getActiveUiLiteral("m_e9982cb7b3eb");
        },
        timestamp: 'Yesterday, 10:15 AM',
        iconName: 'bicycle-outline',
        type: 'DELIVERY' as VisitorType,
        status: 'COMPLETED',
        statusTone: 'neutral' as const,
    },
    {
        id: 'h-3',
        get title() {
            return getActiveUiLiteral("m_ce1d147f298d");
        },
        get description() {
            return getActiveUiLiteral("m_4260e65b9645");
        },
        timestamp: '3 days ago',
        iconName: 'close-circle-outline',
        type: 'CAB' as VisitorType,
        status: 'CANCELLED',
        statusTone: 'danger' as const,
    },
    {
        id: 'h-4',
        get title() {
            return getActiveUiLiteral("m_0f294555e06a");
        },
        get description() {
            return getActiveUiLiteral("m_b62a866871f1");
        },
        timestamp: 'Last week',
        iconName: 'bug-outline',
        type: 'VENDOR' as VisitorType,
        status: 'COMPLETED',
        statusTone: 'neutral' as const,
    },
];
export function VisitorHistoryScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const filteredItems = useMemo(() => {
        if (filter === 'ALL')
            return HISTORY_ITEMS;
        return HISTORY_ITEMS.filter((item) => item.type === filter);
    }, [filter]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_dc3602b8c196) },
        { key: 'GUEST', label: String(localizedUiText.m_3c8e0fde6fcc) },
        { key: 'DELIVERY', label: String(localizedUiText.m_2eb75b5144e5) },
        { key: 'CAB', label: String(localizedUiText.m_67d3d419f6af) },
        { key: 'VENDOR', label: String(localizedUiText.m_720b6017f2e9) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_65239e42f576}/>

      <View style={styles.filterBar}>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const isSelected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                  {chip.label}
                </SafeText>
              </Pressable>);
        })}
        </WrapRow>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ResidentTimeline items={filteredItems}/>
      </ScrollView>
    </View>);
}
export default VisitorHistoryScreen;

