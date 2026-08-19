import { useState, useMemo } from "react";
import { View, ScrollView, Pressable, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMeetings } from "../data/useMeetings";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { MeetingListScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle2 } from "../styles/screens/MeetingListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'ALL' | 'AGM' | 'COMMITTEE';
export function MeetingListScreen({ navigation }: MeetingListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const { data: meetings = [] } = useMeetings();
    const filteredMeetings = useMemo(() => {
        return meetings.filter((m) => {
            const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'ALL' || m.meetingType === filter;
            return matchSearch && matchFilter;
        });
    }, [meetings, filter, search]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_2f651cdfc466) },
        { key: 'AGM', label: String(localizedUiText.m_e1b7f10d6689) },
        { key: 'COMMITTEE', label: String(localizedUiText.m_7bde5d425ff3) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_429d35fcb844}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary}/>
            <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_48b82226b82c} placeholderTextColor={theme.textSecondary} style={[styles.searchInput, createTextInputColorStyle(theme.textPrimary)]}/>
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
          {filteredMeetings.map((meet) => (<PressableScale key={meet.id} onPress={() => navigation.navigate('MeetingDetail', { meetingId: meet.id })}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                <View style={styles.cardHeader}>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                      {meet.title}
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      {formatResidentDate(meet.scheduledDate)} • {meet.scheduledTime}
                    </SafeText>
                  </View>
                  <StatusPill label={meet.status} tone={meet.status === 'SCHEDULED' ? 'info' : 'success'} small/>
                </View>

                <View style={[styles.divider, createViewBackgroundColorStyle2(theme.border)]}/>

                <View style={styles.footer}>
                  <SafeText variant="tiny" color="secondary">{localizedUiText.m_0bc7f4b51942}{meet.venue}{" " + localizedUiText.m_6299d8a02dcf + " "}{meet.confirmedCount}/{meet.totalMembers}
                  </SafeText>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                </View>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>
    </View>);
}
export default MeetingListScreen;

