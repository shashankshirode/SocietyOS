import { Text, View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { ResponsiveGrid } from "../../../shared/layouts/ResponsiveGrid";
import { useCommunityDashboard } from "../data/communityHooks";
import type { CommunityDashboard } from "../../../shared/types/community.types";
import { formatResidentRelativeTime } from "../../../core/localization/dateTimeFormatters";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/CommunityHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type CommunityActivityType = CommunityDashboard['recentActivities'][number]['type'];
type CommunityQuickLinkRoute = 'MarketplaceListingFeed' | 'ResidentSkillDirectory' | 'BorrowLendHome' | 'LostFoundList' | 'VerifiedVendors';
type Props = {
    navigation: {
        navigate: (screen: CommunityQuickLinkRoute) => void;
        goBack: () => void;
    };
};
const quickLinks: readonly {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    screen: CommunityQuickLinkRoute;
    color: string;
}[] = [
    { id: '1', get title() {
            return getActiveUiLiteral("m_c608981d8d68");
        }, icon: 'cart-outline', screen: 'MarketplaceListingFeed', color: Colors.info },
    { id: '2', get title() {
            return getActiveUiLiteral("m_b0f76f451e7d");
        }, icon: 'school-outline', screen: 'ResidentSkillDirectory', color: Colors.primary },
    { id: '3', get title() {
            return getActiveUiLiteral("m_b74ebd90e386");
        }, icon: 'hammer-outline', screen: 'BorrowLendHome', color: Colors.warning },
    { id: '4', get title() {
            return getActiveUiLiteral("m_b9b39c7466af");
        }, icon: 'search-outline', screen: 'LostFoundList', color: Colors.danger },
    { id: '5', get title() {
            return getActiveUiLiteral("m_7bc8d0563571");
        }, icon: 'ribbon-outline', screen: 'VerifiedVendors', color: Colors.success },
];
export function CommunityHomeScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: dashboard, isLoading } = useCommunityDashboard();
    const handleQuickLink = (screen: CommunityQuickLinkRoute) => {
        navigation.navigate(screen);
    };
    const activityIcons: Record<CommunityActivityType, keyof typeof Ionicons.glyphMap> = {
        MARKETPLACE: 'cart-outline',
        SKILL: 'school-outline',
        BORROW: 'hammer-outline',
        LOST_FOUND: 'search-outline',
    };
    const activityColors: Record<CommunityActivityType, string> = {
        MARKETPLACE: Colors.info,
        SKILL: Colors.primary,
        BORROW: Colors.warning,
        LOST_FOUND: Colors.danger,
    };
    return (<ScreenContainer>
      <ResidentPageHeader title={localizedUiText.m_27039d3dc5a7} titleKey="resident.navigation.communityHub.title" subtitleKey="resident.navigation.communityHub.subtitle" variant="community" showBackButton onBackPress={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{isLoading ? '...' : dashboard?.activeListingsCount || 0}</Text>
            <Text style={styles.metricLabel}>{localizedUiText.m_5009238dba6b}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{isLoading ? '...' : dashboard?.skillsRegisteredCount || 0}</Text>
            <Text style={styles.metricLabel}>{localizedUiText.m_66d0f523a379}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{isLoading ? '...' : dashboard?.activeBorrowsCount || 0}</Text>
            <Text style={styles.metricLabel}>{localizedUiText.m_120f1d079499}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{isLoading ? '...' : dashboard?.lostItemsActiveCount || 0}</Text>
            <Text style={styles.metricLabel}>{localizedUiText.m_50ffb8519c02}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{localizedUiText.m_d70d0614fb56}</Text>
        <ResponsiveGrid columnsPhone={2} columnsTablet={3}>
          {quickLinks.map((item) => (<Pressable key={item.id} style={styles.gridCard} onPress={() => handleQuickLink(item.screen)}>
              <View style={[styles.iconWrapper, createViewBackgroundColorStyle(item.color + '15')]}> 
                <Ionicons name={item.icon} size={24} color={item.color}/>
              </View>
              <Text style={styles.gridTitle}>{item.title}</Text>
            </Pressable>))}
        </ResponsiveGrid>

        <Text style={styles.sectionTitle}>{localizedUiText.m_9ef7d438ce5b}</Text>
        {isLoading ? (<Text style={styles.loadingText}>{localizedUiText.m_bda29e43cd6c}</Text>) : (<View style={styles.activityList}>
            {dashboard?.recentActivities?.map((act) => (<View key={act.id} style={styles.activityItem}>
                <View style={[styles.activityIconWrapper, createViewBackgroundColorStyle2(activityColors[act.type] + '15')]}>
                  <Ionicons name={activityIcons[act.type]} size={18} color={activityColors[act.type]}/>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityText}>{act.description}</Text>
                  <Text style={styles.activityTime}>{formatResidentRelativeTime(act.timestamp)}</Text>
                </View>
              </View>))}
          </View>)}
      </ScrollView>
    </ScreenContainer>);
}

