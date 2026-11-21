import { useMemo } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, SectionList, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenScaffold } from "../../../shared/layout/ScreenScaffold";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages, residenceRoleLabels, residenceStatusFilterLabels } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessAction, ResidenceAccessListItem, ResidenceAccessRepositoryError, ResidenceAccessRoleFilter, ResidenceAccessStatusFilter, ResidenceRole } from "../models/residenceAccess.types";
import { ResidenceAccessCard } from "../components/ResidenceAccessCard";
import { ResidenceAccessSkeleton } from "../components/ResidenceAccessSkeleton";
import { ResidenceAccessEmptyState } from "../components/ResidenceAccessEmptyState";
import { ResidenceAccessErrorBanner } from "../components/ResidenceAccessErrorBanner";
import { styles, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/ResidenceAccessListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
interface ResidenceSection {
    readonly title: string;
    readonly data: readonly ResidenceAccessListItem[];
}
const statusFilters: readonly ResidenceAccessStatusFilter[] = [
    'ALL',
    'ACTIVE',
    'ACTION_REQUIRED',
    'PENDING',
    'PREVIOUS',
    'UNAVAILABLE',
];
const roleFilters: readonly ResidenceAccessRoleFilter[] = [
    'ALL',
    'OWNER',
    'TENANT',
    'FAMILY_MEMBER',
    'AUTHORIZED_OCCUPANT',
];
function buildSections(items: readonly ResidenceAccessListItem[]): readonly ResidenceSection[] {
    const active: ResidenceAccessListItem[] = [];
    const action: ResidenceAccessListItem[] = [];
    const pending: ResidenceAccessListItem[] = [];
    const future: ResidenceAccessListItem[] = [];
    const previous: ResidenceAccessListItem[] = [];
    const unavailable: ResidenceAccessListItem[] = [];
    const archived: ResidenceAccessListItem[] = [];
    items.forEach((item) => {
        const status = item.accessRecord.status;
        if (item.eligibility.canEnterResidence) {
            active.push(item);
        }
        else if (status === 'APPROVED') {
            future.push(item);
        }
        else if (status === 'ARCHIVED') {
            archived.push(item);
        }
        else if (status === 'INACTIVE' || status === 'EXPIRED') {
            previous.push(item);
        }
        else if (status === 'REJECTED' || status === 'SUSPENDED' || status === 'ACCESS_REVOKED') {
            unavailable.push(item);
        }
        else if (item.accessRecord.residentPendingActions.length > 0) {
            action.push(item);
        }
        else {
            pending.push(item);
        }
    });
    return [
        { get title() {
                return residenceAccessMessages.list.activeSection;
            }, data: active },
        { get title() {
                return residenceAccessMessages.list.actionSection;
            }, data: action },
        { get title() {
                return residenceAccessMessages.list.pendingSection;
            }, data: pending },
        { get title() {
                return residenceAccessMessages.list.futureSection;
            }, data: future },
        { get title() {
                return residenceAccessMessages.list.previousSection;
            }, data: previous },
        { get title() {
                return residenceAccessMessages.list.unavailableSection;
            }, data: unavailable },
        { get title() {
                return residenceAccessMessages.list.archivedSection;
            }, data: archived },
    ].filter((section) => section.data.length > 0);
}
function FilterChip({ label, selected, onPress, }: {
    readonly label: string;
    readonly selected: boolean;
    readonly onPress: () => void;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={[
            styles.filterChip,
            createPressableBackgroundColorBorderColorStyle(selected ? colors.primary : colors.surface, selected ? colors.primary : colors.border),
        ]}>
      <AppText variant="caption" weight="700" color={selected ? colors.primaryText : colors.textSecondary}>
        {label}
      </AppText>
    </Pressable>);
}
interface ResidenceAccessListScreenProps {
    readonly items: readonly ResidenceAccessListItem[];
    readonly totalCount: number;
    readonly isLoading: boolean;
    readonly isRefreshing: boolean;
    readonly isLoadingMore: boolean;
    readonly hasMore: boolean;
    readonly error: ResidenceAccessRepositoryError | null;
    readonly searchText: string;
    readonly statusFilter: ResidenceAccessStatusFilter;
    readonly roleFilter: ResidenceAccessRoleFilter;
    readonly onSearchTextChange: (value: string) => void;
    readonly onStatusFilterChange: (value: ResidenceAccessStatusFilter) => void;
    readonly onRoleFilterChange: (value: ResidenceAccessRoleFilter) => void;
    readonly onRefresh: () => void;
    readonly onLoadMore: () => void;
    readonly onAction: (item: ResidenceAccessListItem, action: ResidenceAccessAction) => void;
    readonly onOpenStatus: (item: ResidenceAccessListItem) => void;
    readonly onLinkHome: () => void;
    readonly onSignOut: () => void;
    readonly onContactSupport: () => void;
}
export function ResidenceAccessListScreen({ items, totalCount, isLoading, isRefreshing, isLoadingMore, hasMore, error, searchText, statusFilter, roleFilter, onSearchTextChange, onStatusFilterChange, onRoleFilterChange, onRefresh, onLoadMore, onAction, onOpenStatus, onLinkHome, onSignOut, onContactSupport, }: ResidenceAccessListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const sections = useMemo(() => buildSections(items), [items]);
    const filtersActive = searchText.trim().length > 0 || statusFilter !== 'ALL' || roleFilter !== 'ALL';
    const hasActiveResidence = items.some((item) => item.eligibility.canEnterResidence);
    const header = (<View style={styles.headerContent}>
      <View style={styles.intro}>
        <AppText variant="caption" color={colors.primary} weight="800" style={styles.eyebrow}>
          {residenceAccessMessages.list.eyebrow}
        </AppText>
        <AppText variant="h1" weight="800">
          {residenceAccessMessages.list.title}
        </AppText>
        <AppText variant="body" tone="secondary">
          {residenceAccessMessages.list.subtitle}
        </AppText>
      </View>
      <View style={[styles.search, createViewBackgroundColorBorderColorStyle(colors.inputBackground, colors.inputBorder)]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted}/>
        <TextInput value={searchText} onChangeText={onSearchTextChange} placeholder={residenceAccessMessages.list.searchPlaceholder} placeholderTextColor={colors.inputPlaceholder} accessibilityLabel={residenceAccessMessages.list.searchAccessibility} style={[styles.searchInput, createTextInputColorStyle(colors.inputText)]} returnKeyType="search"/>
      </View>
      <View accessibilityLabel={residenceAccessMessages.list.filtersAccessibility}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {statusFilters.map((filter) => (<FilterChip key={filter} label={residenceStatusFilterLabels[filter]} selected={statusFilter === filter} onPress={() => onStatusFilterChange(filter)}/>))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {roleFilters.map((filter) => (<FilterChip key={filter} label={filter === 'ALL' ? residenceAccessMessages.list.allRoles : residenceRoleLabels[filter as ResidenceRole]} selected={roleFilter === filter} onPress={() => onRoleFilterChange(filter)}/>))}
        </ScrollView>
      </View>
      {!hasActiveResidence && totalCount > 0 ? (<View style={[styles.notice, createViewBackgroundColorStyle(colors.warningSoft)]}>
          <AppText variant="bodySmall" weight="800" color={colors.warning}>
            {residenceAccessMessages.empty.noActiveTitle}
          </AppText>
          <AppText variant="caption">
            {residenceAccessMessages.empty.noActiveBody}
          </AppText>
        </View>) : null}
      {error && items.length > 0 ? (<ResidenceAccessErrorBanner error={error} onRetry={onRefresh}/>) : null}
    </View>);
    if (isLoading) {
        return (<ScreenScaffold scroll>
        {header}
        <ResidenceAccessSkeleton count={3}/>
      </ScreenScaffold>);
    }
    if (error && items.length === 0) {
        return (<ScreenScaffold scroll>
        {header}
        <ResidenceAccessErrorBanner error={error} onRetry={onRefresh}/>
      </ScreenScaffold>);
    }
    if (totalCount === 0 && !filtersActive) {
        return (<ScreenScaffold scroll>
        {header}
        <ResidenceAccessEmptyState title={residenceAccessMessages.empty.noLinkedTitle} body={residenceAccessMessages.empty.noLinkedBody} primaryLabel={residenceAccessMessages.common.linkHome} onPrimary={onLinkHome} secondaryLabel={residenceAccessMessages.empty.contactSupport} onSecondary={onContactSupport}/>
        <AppButton title={residenceAccessMessages.common.signOut} onPress={onSignOut} variant="ghost" fullWidth/>
      </ScreenScaffold>);
    }
    return (<ScreenScaffold contentStyle={styles.screenContent}>
      <SectionList sections={sections} keyExtractor={(item) => item.accessRecord.residenceAccessId} renderItem={({ item }) => (<ResidenceAccessCard item={item} onAction={onAction} onOpenStatus={onOpenStatus}/>)} renderSectionHeader={({ section }) => (<View style={[styles.sectionHeader, createViewBackgroundColorStyle2(colors.background)]}>
            <AppText variant="sectionTitle" weight="800">
              {section.title}
            </AppText>
          </View>)} ItemSeparatorComponent={() => <View style={styles.itemSeparator}/>} SectionSeparatorComponent={() => <View style={styles.sectionSeparator}/>} ListHeaderComponent={header} ListEmptyComponent={(<ResidenceAccessEmptyState title={residenceAccessMessages.list.noSearchResultsTitle} body={residenceAccessMessages.list.noSearchResultsBody} primaryLabel={residenceAccessMessages.list.clearFilters} onPrimary={() => {
                onSearchTextChange('');
                onStatusFilterChange('ALL');
                onRoleFilterChange('ALL');
            }}/>)} ListFooterComponent={(<View style={styles.footer}>
            {isLoadingMore ? (<View style={styles.loadingMore}>
                <ActivityIndicator color={colors.primary}/>
                <AppText variant="caption" tone="secondary">
                  {residenceAccessMessages.list.loadingMore}
                </AppText>
              </View>) : hasMore ? (<AppButton title={residenceAccessMessages.list.loadMore} onPress={onLoadMore} variant="outline" fullWidth/>) : null}
            <AppButton title={residenceAccessMessages.common.linkHome} onPress={onLinkHome} variant="outline" fullWidth/>
            <AppButton title={residenceAccessMessages.common.signOut} onPress={onSignOut} variant="ghost" fullWidth/>
          </View>)} contentContainerStyle={styles.listContent} refreshControl={(<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]}/>)} onEndReached={hasMore && !isLoadingMore ? onLoadMore : undefined} onEndReachedThreshold={0.45} showsVerticalScrollIndicator={false} extraData={localizedUiText}/>
    </ScreenScaffold>);
}
