import { useState, useMemo } from "react";
import { View, ScrollView, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePolls } from "../data/usePolls";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { PollListScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle2 } from "../styles/screens/PollListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'ALL' | 'ACTIVE' | 'CLOSED';
export function PollListScreen({ navigation }: PollListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const { data: polls = [] } = usePolls();
    const filteredPolls = useMemo(() => {
        return polls.filter((p) => {
            const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'ALL' || p.status === filter;
            return matchSearch && matchFilter;
        });
    }, [polls, filter, search]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_d4c572a785ba) },
        { key: 'ACTIVE', label: String(localizedUiText.m_92340695899b) },
        { key: 'CLOSED', label: String(localizedUiText.m_c21ead0614e7) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_4827d897c4d4}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary}/>
            <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_a92183a02f65} placeholderTextColor={theme.textSecondary} style={[styles.searchInput, createTextInputColorStyle(theme.textPrimary)]}/>
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
          {filteredPolls.map((poll) => (<PressableScale key={poll.id} onPress={() => navigation.navigate('PollDetail', { pollId: poll.id })}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                <View style={styles.cardHeader}>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                      {poll.title}
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      {poll.totalVotes}{" " + localizedUiText.m_30335e427ca6 + " "}{poll.participationRate}{localizedUiText.m_ee13c1acf460}</SafeText>
                  </View>
                  <StatusPill label={poll.status} tone={poll.status === 'ACTIVE' ? 'success' : 'muted'} small/>
                </View>

                <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>

                <View style={styles.footer}>
                  <SafeText variant="tiny" color="secondary">{localizedUiText.m_f4f7e72baff4}{poll.myVoteStatus}
                  </SafeText>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                </View>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>
    </View>);
}
export default PollListScreen;

