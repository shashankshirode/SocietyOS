import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatResidentDate } from '../../../../core/localization/dateTimeFormatters';
import type { NoticeListFromHomeScreenProps } from '../../../../app/navigation/navigation.types';
import { useFeatureFlags } from '../../../../core/featureFlags/useFeatureFlag';
import { SafeText } from '../../../../shared/components/SafeText';
import { SearchInputBar } from '../../../../shared/components/SearchInputBar';
import { useMessages } from '../../../../shared/constants/useMessages';
import { FilterChip } from '../../../../shared/filters/FilterChip';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import { AppButton } from '../../../../shared/components/AppButton';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { WrapRow } from '../../../../ui/layout/WrapRow';
import { ResidentPageHeader } from '../../../../ui/patterns/ResidentPageHeader';
import { ScreenEmptyState } from '../../../../ui/states/ScreenEmptyState';
import { ScreenErrorState } from '../../../../ui/states/ScreenErrorState';
import { NoticesListSkeleton } from '../../../../ui/skeletons/FeatureSkeletons';
import { TemporalFilter, matchesTemporalFilter, type TemporalFilterValue } from '../../../../ui/filters/TemporalFilter';
import type { Notice } from '../../../../shared/types/notice.types';
import { useNotices } from '../data/useNotices';
import { createAccentSurfaceStyle, createBorderStyle, createColorStyle, createRootStyle, styles } from '../styles/screens/NoticeListScreen.styles';

type CategoryFilter = 'ALL' | 'IMPORTANT' | 'MAINTENANCE' | 'EVENT';
type DateGroup = 'today' | 'thisWeek' | 'earlier';
const PAGE_SIZE = 12;

function dateGroup(dateValue: string, now = new Date()): DateGroup {
  const date = new Date(`${dateValue}T00:00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (date.getTime() === today.getTime()) return 'today';
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return date >= weekStart ? 'thisWeek' : 'earlier';
}

function isImportant(notice: Notice): boolean {
  return notice.isImportant || notice.priority === 'IMPORTANT' || notice.priority === 'URGENT';
}

export function NoticeListScreen({ navigation }: NoticeListFromHomeScreenProps) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const copy = messages.resident.notices;
  const { isEnabled } = useFeatureFlags();
  const [category, setCategory] = useState<CategoryFilter>('ALL');
  const [temporal, setTemporal] = useState<TemporalFilterValue>({ preset: 'thisMonth' });
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { data: notices = [], isLoading, error, refetch } = useNotices();

  useEffect(() => setVisibleCount(PAGE_SIZE), [category, search, temporal]);

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return notices.filter((notice) => {
      if (!matchesTemporalFilter(notice.date, temporal)) return false;
      if (query && !`${notice.title} ${notice.body}`.toLocaleLowerCase().includes(query)) return false;
      if (category === 'IMPORTANT') return isImportant(notice);
      if (category === 'MAINTENANCE') return notice.category === 'MAINTENANCE' || notice.category === 'WATER_SUPPLY';
      if (category === 'EVENT') return notice.category === 'FESTIVAL_EVENT' || notice.category === 'AGM_MEETING';
      return true;
    }).sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
  }, [category, notices, search, temporal]);

  const visibleNotices = filteredNotices.slice(0, visibleCount);
  const importantNotice = visibleNotices.find(isImportant);
  const routineNotices = visibleNotices.filter((notice) => notice.id !== importantNotice?.id);
  const groups: { key: DateGroup; label: string; notices: Notice[] }[] = [
    { key: 'today', label: copy.sections.today, notices: routineNotices.filter((notice) => dateGroup(notice.date) === 'today') },
    { key: 'thisWeek', label: copy.sections.thisWeek, notices: routineNotices.filter((notice) => dateGroup(notice.date) === 'thisWeek') },
    { key: 'earlier', label: copy.sections.earlier, notices: routineNotices.filter((notice) => dateGroup(notice.date) === 'earlier') },
  ];
  const categoryFilters: { key: CategoryFilter; label: string }[] = [
    { key: 'ALL', label: copy.filters.all },
    { key: 'IMPORTANT', label: copy.filters.important },
    { key: 'MAINTENANCE', label: copy.filters.maintenance },
    { key: 'EVENT', label: copy.filters.event },
  ];
  const openNotice = (notice: Notice) => navigation.navigate('NoticeDetailFromHome', { notice });
  const header = <ResidentPageHeader title={copy.listTitle} subtitle={copy.listSubtitle} showBackButton />;

  if (!isEnabled('notices')) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<ScreenEmptyState title={copy.featureUnavailableTitle} description={copy.featureUnavailableDescription} iconName="lock-closed-outline" /></View>;
  if (isLoading) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<View style={styles.loading}><NoticesListSkeleton /></View></View>;
  if (error) return <View style={[styles.root, createRootStyle(theme.background)]}>{header}<ScreenErrorState title={copy.errorTitle} message={copy.errorDescription} onRetry={refetch} canRetry={error.retryable !== false} /></View>;

  return (
    <View style={[styles.root, createRootStyle(theme.background)]}>
      {header}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SearchInputBar value={search} onChangeText={setSearch} placeholder={copy.searchPlaceholder} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {categoryFilters.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              selected={category === filter.key}
              onPress={() => setCategory(filter.key)}
            />
          ))}
        </ScrollView>

        <TemporalFilter value={temporal} onChange={setTemporal} horizontal testID="notice-temporal-filter" />

        {visibleNotices.length === 0 ? (
          <View style={styles.emptyWrap}>
            <ScreenEmptyState title={copy.emptyTitle} description={copy.emptyDescription} iconName="megaphone-outline" />
          </View>
        ) : null}

        {importantNotice ? (
          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.danger)]}>{copy.sections.important}</SafeText>
            <PressableScale onPress={() => openNotice(importantNotice)}>
              <View style={[styles.hero, createAccentSurfaceStyle(theme.warningSoft, theme.warning)]}>
                <View style={styles.heroHeader}>
                  <SafeText variant="tiny" style={createColorStyle(theme.warning)}>{copy.categories[importantNotice.category]}</SafeText>
                  <SafeText variant="caption" style={createColorStyle(theme.textMuted)}>{formatResidentDate(importantNotice.date)}</SafeText>
                </View>
                <SafeText variant="title" style={createColorStyle(theme.textPrimary)}>{importantNotice.title}</SafeText>
                <SafeText variant="body" style={createColorStyle(theme.textSecondary)} numberOfLines={2}>{importantNotice.body}</SafeText>
                <View style={styles.heroFooter}>
                  <SafeText variant="bodyStrong" style={createColorStyle(theme.warning)}>{copy.readNotice} →</SafeText>
                </View>
              </View>
            </PressableScale>
          </View>
        ) : null}

        {groups.map((group) => group.notices.length > 0 ? (
          <View key={group.key} style={styles.section}>
            <SafeText variant="tiny" style={[styles.sectionLabel, createColorStyle(theme.textMuted)]}>{group.label}</SafeText>
            <View>{group.notices.map((notice) => (
              <Pressable key={notice.id} onPress={() => openNotice(notice)} style={[styles.row, createBorderStyle(theme.border)]} accessibilityRole="button">
                <View style={styles.rowCopy}>
                  <SafeText variant="tiny" style={createColorStyle(theme.textMuted)}>{copy.categories[notice.category]} · {formatResidentDate(notice.date)}</SafeText>
                  <SafeText variant="title" style={createColorStyle(theme.textPrimary)}>{notice.title}</SafeText>
                  <SafeText variant="caption" style={createColorStyle(theme.textSecondary)} numberOfLines={2}>{notice.body}</SafeText>
                  {notice.acknowledgementRequired ? <SafeText variant="tiny" style={createColorStyle(theme.warning)}>{copy.acknowledgementRequired}</SafeText> : null}
                </View>
                <View style={styles.rowMeta}>
                  {notice.attachment ? <Ionicons name="attach-outline" size={17} color={theme.textMuted} /> : null}
                  <Ionicons name="arrow-forward" size={18} color={theme.textSecondary} />
                </View>
              </Pressable>
            ))}</View>
          </View>
        ) : null)}

        {visibleCount < filteredNotices.length ? <AppButton title={copy.viewMore} variant="ghost" onPress={() => setVisibleCount((count) => count + PAGE_SIZE)} /> : null}
      </ScrollView>
    </View>
  );
}

export default NoticeListScreen;

