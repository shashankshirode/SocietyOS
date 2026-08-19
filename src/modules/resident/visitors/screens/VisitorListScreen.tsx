import { useState, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
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
import type { VisitorListScreenProps } from "../../../../app/navigation/navigation.types";
import type { VisitorAccessItem, VisitorType, VisitorStatus, AccessType } from "../../dashboard/data/dashboard.types";
import { useWindowDimensions } from "react-native";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import { getAppPlatform } from "../../../../shared/platform";
import { formatVisitorEntryExit } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createViewBottomStyle, createPressableScaleBackgroundColorStyle } from "../styles/screens/VisitorListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type TabType = 'UPCOMING' | 'INSIDE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
export function VisitorListScreen({ navigation }: VisitorListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabBarObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
    const { isEnabled } = useFeatureFlags();
    const [activeTab, setActiveTab] = useState<TabType>('UPCOMING');
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
        { key: 'UPCOMING', label: String(localizedUiText.m_5f1a2542e4e4) },
        { key: 'INSIDE', label: String(localizedUiText.m_123a3ebc57e3) },
        { key: 'COMPLETED', label: String(localizedUiText.m_22a970d2e5b1) },
        { key: 'EXPIRED', label: String(localizedUiText.m_424a2551d356) },
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
                    createPressableBackgroundColorBorderColorStyle(isActive ? theme.accent : theme.surface, isActive ? 'transparent' : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(isActive ? '#FFFFFF' : theme.textSecondary)}>
                  {tab.label}
                </SafeText>
              </Pressable>);
        })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarObstruction + 72 }]} showsVerticalScrollIndicator={false}>
        <ContentFrame>
          <VisitorAccessTimeline items={filteredVisitors} onCreateVisitorPress={() => navigation.navigate('CreateVisitorPass')} onVisitorPress={(id) => {
            const originalVisitor = visitorsData.find((v) => v.id === id);
            if (originalVisitor) {
                navigation.navigate('VisitorDetail', { visitor: originalVisitor });
            }
        }} contentPaddingHorizontal={0}/>
        </ContentFrame>
      </ScrollView>

      <View style={[styles.fabContainer, createViewBottomStyle(tabBarObstruction + 16)]}>
        <PressableScale onPress={() => navigation.navigate('CreateVisitorPass')} style={[styles.fab, createPressableScaleBackgroundColorStyle(theme.accent)]}>
          <Ionicons name="add" size={24} color="#FFFFFF"/>
        </PressableScale>
      </View>
    </View>);
}
export default VisitorListScreen;

