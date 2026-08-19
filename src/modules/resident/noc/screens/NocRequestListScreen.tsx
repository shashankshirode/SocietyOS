import { useState, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNocRequests } from "../data/useNocRequests";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { NocRequestListScreenProps } from "../../../../app/navigation/navigation.types";
import type { NocRequest, NocStatus, NocType, TimelineStepStatus } from "../../../../shared/types/noc.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { ListSkeleton } from "../../../../ui/loading/ListSkeleton";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createViewBorderTopColorStyle, createViewBottomStyle, createPressableScaleBackgroundColorStyle } from "../styles/screens/NocRequestListScreen.styles";
type FilterType = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
const typeIcons: Record<NocRequest['nocType'], keyof typeof Ionicons.glyphMap> = {
    NO_DUES: 'cash-outline',
    MOVE_OUT: 'exit-outline',
    TENANT_NOC: 'people-outline',
    PARKING_NOC: 'car-outline',
    VEHICLE_NOC: 'car-sport-outline',
    RENOVATION_NOC: 'construct-outline',
    RESIDENCE_CERTIFICATE: 'ribbon-outline',
};
export function NocRequestListScreen({ navigation }: NocRequestListScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const nocMessages = messages.resident.noc;
    const insets = useSafeAreaInsets();
    const { isEnabled } = useFeatureFlags();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const { data: nocRequests = [], isLoading, error, refetch } = useNocRequests();
    const filteredNocs = useMemo(() => {
        return nocRequests.filter((n) => {
            if (filter === 'PENDING') {
                return (n.status === 'SUBMITTED' ||
                    n.status === 'UNDER_REVIEW' ||
                    n.status === 'PENDING_DUES_CLEARANCE' ||
                    n.status === 'PENDING_FACILITY_CLEARANCE' ||
                    n.status === 'PENDING_SECRETARY_APPROVAL');
            }
            if (filter === 'APPROVED')
                return n.status === 'APPROVED' || n.status === 'GENERATED';
            if (filter === 'REJECTED')
                return n.status === 'REJECTED';
            return true;
        });
    }, [nocRequests, filter]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: nocMessages.filters.all },
        { key: 'PENDING', label: nocMessages.filters.inProgress },
        { key: 'APPROVED', label: nocMessages.filters.approved },
        { key: 'REJECTED', label: nocMessages.filters.rejected },
    ];
    const emptyMessages = filter === 'PENDING'
        ? nocMessages.empty.inProgress
        : filter === 'APPROVED'
            ? nocMessages.empty.approved
            : filter === 'REJECTED'
                ? nocMessages.empty.rejected
                : nocMessages.empty.all;
    const getStatusTone = (status: NocStatus): StatusTone => {
        if (status === 'APPROVED' || status === 'GENERATED')
            return 'success';
        if (status === 'REJECTED' || status === 'CANCELLED')
            return 'danger';
        if (status === 'DRAFT')
            return 'muted';
        return 'warning';
    };
    const typeLabels: Record<NocType, string> = {
        NO_DUES: nocMessages.types.noDues,
        MOVE_OUT: nocMessages.types.moveOut,
        TENANT_NOC: nocMessages.types.tenant,
        PARKING_NOC: nocMessages.types.parking,
        RENOVATION_NOC: nocMessages.types.renovation,
        RESIDENCE_CERTIFICATE: nocMessages.types.residence,
        VEHICLE_NOC: nocMessages.types.vehicle,
    };
    const statusLabels: Record<NocStatus, string> = {
        DRAFT: nocMessages.statusDraft,
        SUBMITTED: nocMessages.statusSubmitted,
        UNDER_REVIEW: nocMessages.statusUnderReview,
        PENDING_DUES_CLEARANCE: nocMessages.statusPendingDues,
        PENDING_FACILITY_CLEARANCE: nocMessages.statusPendingFacility,
        PENDING_SECRETARY_APPROVAL: nocMessages.statusPendingSecretary,
        APPROVED: nocMessages.statusApproved,
        REJECTED: nocMessages.statusRejected,
        GENERATED: nocMessages.statusGenerated,
        EXPIRED: nocMessages.statusExpired,
        CANCELLED: nocMessages.statusCancelled,
    };
    const timelineStatusLabels: Record<TimelineStepStatus, string> = {
        COMPLETED: nocMessages.timelineCompleted,
        CURRENT: nocMessages.timelineCurrent,
        PENDING: nocMessages.statusPending,
        REJECTED: nocMessages.statusRejected,
    };
    if (!isEnabled('digitalNocRequests')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={nocMessages.title} subtitle={nocMessages.subtitle} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {nocMessages.featureUnavailableTitle}
          </SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {nocMessages.featureUnavailableDescription}
          </SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={nocMessages.title} subtitle={nocMessages.subtitle} showBackButton/>

      
      <View style={styles.filterBar}>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const isSelected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} accessibilityRole="button" accessibilityState={{ selected: isSelected }} testID={`noc-filter-${chip.key}`} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                  {chip.label}
                </SafeText>
              </Pressable>);
        })}
        </WrapRow>
      </View>

      {isLoading ? (<ContentFrame style={styles.loading}><ListSkeleton count={4}/></ContentFrame>) : error ? (<ScreenErrorState title={nocMessages.errorTitle} message={nocMessages.errorDescription} onRetry={refetch}/>) : filteredNocs.length === 0 ? (<ScreenEmptyState title={emptyMessages.title} description={emptyMessages.description} iconName="document-text-outline" primaryAction={{ label: nocMessages.requestAction, onPress: () => navigation.navigate('CreateNocRequest') }}/>) : <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {filteredNocs.map((noc) => (<PressableScale key={noc.id} onPress={() => navigation.navigate('NocRequestDetail', { requestId: noc.id })} accessibilityLabel={nocMessages.openRequestAccessibility(noc.requestNumber)}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={typeIcons[noc.nocType]} size={18} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)} numberOfLines={1}>
                      {typeLabels[noc.nocType]}
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      {nocMessages.requestNumber(noc.requestNumber)} • {nocMessages.requestedOn(formatResidentDate(noc.submittedDate))}
                    </SafeText>
                  </View>
                  <StatusPill label={statusLabels[noc.status]} tone={getStatusTone(noc.status)} small/>
                </View>

                {noc.timeline && noc.timeline.length > 0 && (<View style={[styles.progressPreview, createViewBorderTopColorStyle(theme.border)]}>
                    <Ionicons name="git-commit-outline" size={14} color={theme.accent}/>
                    <SafeText variant="tiny" style={createSafeTextColorStyle5(theme.textSecondary)} numberOfLines={1}>
                      {nocMessages.latestStep(getRequiredItem(noc.timeline, noc.timeline.length - 1, "NocRequestListScreen.tsx").title, timelineStatusLabels[getRequiredItem(noc.timeline, noc.timeline.length - 1, "NocRequestListScreen.tsx").status])}
                    </SafeText>
                  </View>)}
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>}

      <View style={[styles.fabContainer, createViewBottomStyle(insets.bottom + 16)]}>
        <PressableScale onPress={() => navigation.navigate('CreateNocRequest')} accessibilityLabel={nocMessages.createRequestAccessibility} style={[styles.fab, createPressableScaleBackgroundColorStyle(theme.accent)]}>
          <Ionicons name="add" size={24} color="#FFFFFF"/>
        </PressableScale>
      </View>
    </View>);
}
export default NocRequestListScreen;

