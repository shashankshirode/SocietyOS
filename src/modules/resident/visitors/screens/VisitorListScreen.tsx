import { useState, useMemo } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useVisitors } from "../data/useVisitors";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { VisitorAccessTimeline } from "../../../../ui/patterns/VisitorAccessTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { DeliveryPreApprovalPanel } from "../components/DeliveryPreApprovalPanel";
import { PartyPassModal } from "../components/PartyPassModal";
import type { VisitorListScreenProps } from "../../../../app/navigation/navigation.types";
import type { VisitorAccessItem, VisitorType, VisitorStatus, AccessType } from "../../dashboard/data/dashboard.types";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import { getAppPlatform } from "../../../../shared/platform";
import { formatVisitorEntryExit } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createViewBottomStyle, createPressableScaleBackgroundColorStyle, createScrollPaddingBottomStyle } from "../styles/screens/VisitorListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { useMessages } from "../../../../shared/constants/useMessages";
type TabType = 'UPCOMING' | 'INSIDE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
export function VisitorListScreen({ navigation }: VisitorListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const messages = useMessages();
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabBarObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
    const { isEnabled } = useFeatureFlags();
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
    const [partyPassModalVisible, setPartyPassModalVisible] = useState(false);
    const { data: visitorsData = [] } = useVisitors();
    const mappedVisitors = useMemo((): VisitorAccessItem[] => {
        return visitorsData.map((v) => {
            let mappedStatus: VisitorStatus = 'upcoming';
            if (v.status === 'COMPLETED')
                mappedStatus = 'completed';
            else if (v.status === 'EXPIRED')
                mappedStatus = 'expired';
            else if (v.status === 'REJECTED')
                mappedStatus = 'cancelled';
            else if (v.actualEntryTime && !v.actualExitTime)
                mappedStatus = 'inside';
            let mappedType: VisitorType = 'guest';
            if (v.type === 'DELIVERY')
                mappedType = 'delivery';
            else if (v.type === 'CAB')
                mappedType = 'cab';
            else if (v.type === 'VENDOR')
                mappedType = 'vendor';
            let validFrom = v.expectedTime || '12:00 PM';
            let validTill = '8:00 PM';
            if (v.exitTracking?.expectedEntryAtIso) {
                const formatted = formatVisitorEntryExit(v.exitTracking.expectedEntryAtIso, v.exitTracking.expectedExitAtIso);
                validFrom = formatted.validFrom;
                validTill = formatted.validTill;
            }
            else if (v.expectedDate && v.expectedTime) {
                const entryIso = `${v.expectedDate}T${v.expectedTime}:00`;
                const formatted = formatVisitorEntryExit(entryIso);
                validFrom = formatted.validFrom;
                validTill = formatted.validTill;
            }
            return {
                id: v.id,
                visitorName: v.name,
                visitorType: mappedType,
                accessType: 'oneDay' as AccessType,
                purpose: v.purpose || String(localizedUiText.m_1c8ac867f052),
                validFrom,
                validTill,
                status: mappedStatus,
                gateName: 'Main Gate',
                otpAvailable: v.status === 'APPROVED' || v.status === 'EXPECTED',
            };
        });
    }, [visitorsData, localizedUiText]);
    const filteredVisitors = useMemo(() => {
        return mappedVisitors.filter((v) => {
            if (activeTab === 'UPCOMING')
                return v.status === 'upcoming';
            if (activeTab === 'INSIDE')
                return v.status === 'inside';
            if (activeTab === 'COMPLETED')
                return v.status === 'completed';
            if (activeTab === 'EXPIRED')
                return v.status === 'expired';
            if (activeTab === 'CANCELLED')
                return v.status === 'cancelled';
            return true;
        });
    }, [mappedVisitors, activeTab]);
    const tabs: {
        key: TabType;
        label: string;
    }[] = [
        { key: 'UPCOMING', label: messages.visitors.arrivingSection },
        { key: 'INSIDE', label: messages.visitors.atGateSection },
        { key: 'COMPLETED', label: messages.visitors.enteredTodaySection },
        { key: 'EXPIRED', label: messages.visitors.pastSection },
    ];
    if (!isEnabled('visitorManagement')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_87209f8a9b7d} titleKey="resident.navigation.visitors.title" subtitleKey="resident.navigation.visitors.subtitle" showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_a015fb02e331}</SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_025e4e11c0b1} titleKey="resident.navigation.visitors.title" subtitleKey="resident.navigation.visitors.subtitle" showBackButton/>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (<Pressable key={tab.key} onPress={() => setActiveTab(tab.key)} style={[
                    styles.tabChip,
                    createPressableBackgroundColorBorderColorStyle(isActive ? theme.selectedBackground : theme.surface, isActive ? theme.selectedBorder : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(isActive ? theme.selectedForeground : theme.textSecondary)}>
                  {tab.label}
                </SafeText>
              </Pressable>);
        })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, createScrollPaddingBottomStyle(tabBarObstruction + 72)]} showsVerticalScrollIndicator={false}>
        <ContentFrame>
          <View style={[styles.arrivalHero, createViewBackgroundColorStyle(theme.surface)]}>
            <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.accentSecondary)}>{messages.visitors.screenTitle.toUpperCase()}</SafeText>
            <SafeText variant="h2" style={createSafeTextColorStyle3(theme.textPrimary)}>{messages.visitors.arrivalWorldTitle}</SafeText>
            <SafeText variant="body" style={createSafeTextColorStyle3(theme.textSecondary)}>
              {mappedVisitors.filter((visitor) => visitor.status === 'upcoming').length > 0
                ? messages.visitors.expectedToday(mappedVisitors.filter((visitor) => visitor.status === 'upcoming').length)
                : messages.visitors.quietToday}
            </SafeText>
          </View>
          <DeliveryPreApprovalPanel />
          <Pressable
            onPress={() => setPartyPassModalVisible(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderColor: '#F59E0B',
              borderWidth: 1,
              borderRadius: 16,
              padding: 14,
              marginHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="sparkles" size={22} color="#D97706" />
              <View>
                <SafeText variant="bodyStrong" style={{ color: '#B45309' }}>Host an Event / Party Pass</SafeText>
                <SafeText variant="caption" style={{ color: '#D97706' }}>Bulk invite link for multiple guests</SafeText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D97706" />
          </Pressable>
          <VisitorAccessTimeline items={filteredVisitors} onCreateVisitorPress={() => navigation.navigate('CreateVisitorPass')} onVisitorPress={(id) => {
            const originalVisitor = visitorsData.find((v) => v.id === id);
            if (originalVisitor) {
                navigation.navigate('VisitorDetail', { visitor: originalVisitor });
            }
        }} contentPaddingHorizontal={0}/>
        </ContentFrame>
      </ScrollView>

      <PartyPassModal visible={partyPassModalVisible} onClose={() => setPartyPassModalVisible(false)} />

      {mappedVisitors.length > 0 ? <View style={[styles.fabContainer, createViewBottomStyle(tabBarObstruction + 16)]}>
        <PressableScale onPress={() => navigation.navigate('CreateVisitorPass')} style={[styles.fab, createPressableScaleBackgroundColorStyle(theme.selectedBackground)]}>
          <Ionicons name="add" size={20} color={theme.selectedForeground}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.selectedForeground)}>{messages.visitors.createVisitor}</SafeText>
        </PressableScale>
      </View> : null}
    </View>);
}
export default VisitorListScreen;
