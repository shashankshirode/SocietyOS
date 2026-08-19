import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import type { NoticeListFromHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { SafeText } from "../../../../shared/components/SafeText";
import { SearchInputBar } from "../../../../shared/components/SearchInputBar";
import { useMessages } from "../../../../shared/constants/useMessages";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { ScreenLoadingState } from "../../../../ui/states/ScreenLoadingState";
import { useNotices } from "../data/useNotices";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/screens/NoticeListScreen.styles";
type FilterType = 'ALL' | 'IMPORTANT' | 'MAINTENANCE' | 'EVENT';
export function NoticeListScreen({ navigation }: NoticeListFromHomeScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const noticeMessages = messages.resident.notices;
    const { isEnabled } = useFeatureFlags();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const { data: notices = [], isLoading, error, refetch } = useNotices();
    const filteredNotices = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        return notices.filter((notice) => {
            if (query && !`${notice.title} ${notice.body}`.toLocaleLowerCase().includes(query))
                return false;
            if (filter === 'IMPORTANT')
                return notice.isImportant || notice.priority === 'IMPORTANT' || notice.priority === 'URGENT';
            if (filter === 'MAINTENANCE')
                return notice.category === 'MAINTENANCE' || notice.category === 'WATER_SUPPLY';
            if (filter === 'EVENT')
                return notice.category === 'FESTIVAL_EVENT' || notice.category === 'AGM_MEETING';
            return true;
        });
    }, [filter, notices, search]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: noticeMessages.filters.all },
        { key: 'IMPORTANT', label: noticeMessages.filters.important },
        { key: 'MAINTENANCE', label: noticeMessages.filters.maintenance },
        { key: 'EVENT', label: noticeMessages.filters.event },
    ];
    const header = (<ResidentPageHeader title={noticeMessages.listTitle} subtitle={noticeMessages.listSubtitle} showBackButton/>);
    if (!isEnabled('notices')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        {header}
        <ScreenEmptyState title={noticeMessages.featureUnavailableTitle} description={noticeMessages.featureUnavailableDescription} iconName="lock-closed-outline"/>
      </View>);
    }
    if (isLoading) {
        return <View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>{header}<ScreenLoadingState message={noticeMessages.loading}/></View>;
    }
    if (error) {
        return <View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}>{header}<ScreenErrorState title={noticeMessages.errorTitle} message={noticeMessages.errorDescription} onRetry={refetch}/></View>;
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle4(theme.background)]}>
      {header}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SearchInputBar value={search} onChangeText={setSearch} placeholder={noticeMessages.searchPlaceholder}/>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const selected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.chip, createPressableBackgroundColorBorderColorStyle(selected ? theme.accent : theme.surface, selected ? theme.accent : theme.border)]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(selected ? '#FFFFFF' : theme.textSecondary)}>{chip.label}</SafeText>
              </Pressable>);
        })}
        </WrapRow>

        {filteredNotices.length === 0 ? (<View style={styles.emptyWrap}>
            <ScreenEmptyState title={noticeMessages.emptyTitle} description={noticeMessages.emptyDescription} iconName="megaphone-outline"/>
          </View>) : (<View style={styles.list}>
            {filteredNotices.map((notice) => (<PressableScale key={notice.id} onPress={() => navigation.navigate('NoticeDetailFromHome', { notice })}>
                <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                      <SafeText variant="tiny" color="muted">{formatResidentDate(notice.date)}</SafeText>
                      <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={2}>{notice.title}</SafeText>
                    </View>
                    {notice.isImportant ? <Ionicons name="alert-circle" size={18} color={theme.danger}/> : null}
                  </View>
                  <SafeText variant="caption" color="secondary" numberOfLines={2}>{notice.body}</SafeText>
                  <View style={styles.cardFooter}>
                    <SafeText variant="tiny" color="muted" numberOfLines={1} style={styles.publisher}>
                      {noticeMessages.postedByLine(notice.postedBy, formatResidentDate(notice.date))}
                    </SafeText>
                    <StatusPill label={noticeMessages.categories[notice.category]} tone={notice.category === 'EMERGENCY' ? 'danger' : notice.category === 'MAINTENANCE' || notice.category === 'WATER_SUPPLY' ? 'warning' : 'info'} small/>
                  </View>
                </View>
              </PressableScale>))}
          </View>)}
      </ScrollView>
    </View>);
}
export default NoticeListScreen;

