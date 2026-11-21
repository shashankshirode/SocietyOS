import { useState, useMemo } from "react";
import { View, ScrollView, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResolutions } from "../data/useResolutions";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ResolutionListScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle2 } from "../styles/screens/ResolutionListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'ALL' | 'OPEN' | 'PASSED' | 'REJECTED';
export function ResolutionListScreen({ navigation }: ResolutionListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const { data: resolutions = [] } = useResolutions();
    const filteredResolutions = useMemo(() => {
        return resolutions.filter((r) => {
            const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'ALL' ||
                (filter === 'OPEN' && r.status === 'OPEN_FOR_VOTING') ||
                (filter === 'PASSED' && r.status === 'PASSED') ||
                (filter === 'REJECTED' && r.status === 'REJECTED');
            return matchSearch && matchFilter;
        });
    }, [resolutions, filter, search]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_a52ace420f21) },
        { key: 'OPEN', label: String(localizedUiText.m_ed077f3d8125) },
        { key: 'PASSED', label: String(localizedUiText.m_436fe71bb956) },
        { key: 'REJECTED', label: String(localizedUiText.m_aea4a04a8042) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_794706028a6d}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary}/>
            <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_1ad459dae8d1} placeholderTextColor={theme.textSecondary} style={[styles.searchInput, createTextInputColorStyle(theme.textPrimary)]}/>
          </View>
        </View>

        
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

        
        <View style={styles.list}>
          {filteredResolutions.map((res) => (<PressableScale key={res.id} onPress={() => navigation.navigate('ResolutionDetail', { resolutionId: res.id })}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                <View style={styles.cardHeader}>
                  <View style={styles.info}>
                    <SafeText variant="tiny" color="muted">
                      {res.resolutionNumber}
                    </SafeText>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                      {res.title}
                    </SafeText>
                  </View>
                  <StatusPill label={res.status === 'OPEN_FOR_VOTING' ? localizedUiText.m_6e10953f3e4c : res.status} tone={res.status === 'OPEN_FOR_VOTING' ? 'success' : 'muted'} small/>
                </View>

                <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>

                <View style={styles.footer}>
                  <SafeText variant="tiny" color="secondary">{localizedUiText.m_42e07a17a8e7}{res.votesFor}{" " + localizedUiText.m_7c27fff56cee + " "}{res.votesAgainst}
                  </SafeText>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                </View>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>
    </View>);
}
export default ResolutionListScreen;

