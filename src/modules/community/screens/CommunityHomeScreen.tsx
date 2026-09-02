import { ScrollView, Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResidentPageHeader } from '../../../ui/patterns/ResidentPageHeader';
import { SafeText } from '../../../shared/components/SafeText';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { ScreenLoadingState } from '../../../ui/states/ScreenLoadingState';
import { ScreenEmptyState } from '../../../ui/states/ScreenEmptyState';
import { useCommunityDashboard } from '../data/communityHooks';
import { formatResidentRelativeTime } from '../../../core/localization/dateTimeFormatters';
import {
  createBackgroundStyle,
  createBorderStyle,
  createColorStyle,
  styles,
} from '../styles/screens/CommunityHomeScreen.styles';
import { getActiveUiLiteral } from '../../../shared/localization/activeUiLiteral';

type CommunityQuickLinkRoute = 'MarketplaceListingFeed' | 'ResidentSkillDirectory' | 'BorrowLendHome' | 'LostFoundList' | 'VerifiedVendors';
type Props = {
  navigation: {
    navigate: (screen: CommunityQuickLinkRoute) => void;
    goBack: () => void;
    canGoBack?: () => boolean;
  };
};

const quickLinks: readonly {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: CommunityQuickLinkRoute;
}[] = [
  { id: 'marketplace', get title() { return getActiveUiLiteral('m_c608981d8d68'); }, icon: 'storefront-outline', screen: 'MarketplaceListingFeed' },
  { id: 'neighbours', get title() { return getActiveUiLiteral('m_b0f76f451e7d'); }, icon: 'people-outline', screen: 'ResidentSkillDirectory' },
  { id: 'borrow', get title() { return getActiveUiLiteral('m_b74ebd90e386'); }, icon: 'swap-horizontal-outline', screen: 'BorrowLendHome' },
  { id: 'lost-found', get title() { return getActiveUiLiteral('m_b9b39c7466af'); }, icon: 'search-outline', screen: 'LostFoundList' },
  { id: 'services', get title() { return getActiveUiLiteral('m_7bc8d0563571'); }, icon: 'ribbon-outline', screen: 'VerifiedVendors' },
];

export function CommunityHomeScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const messages = useMessages();
  const copy = messages.resident.dashboard.communityHome;
  const { data: dashboard, isLoading } = useCommunityDashboard();
  const canGoBack = navigation.canGoBack?.() ?? true;

  if (isLoading && !dashboard) return <ScreenLoadingState />;

  return (
    <ScreenContainer style={createBackgroundStyle(theme.semantic.surface.canvas)}>
      <ResidentPageHeader
        title={copy.title}
        subtitle={copy.subtitle}
        variant="community"
        showBackButton={canGoBack}
        onBackPress={navigation.goBack}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {dashboard?.recentActivities?.[0] ? (
          <Pressable
            onPress={() => navigation.navigate('MarketplaceListingFeed')}
            style={[styles.feature, createBackgroundStyle(theme.semantic.surface.focus)]}
            accessibilityRole="button"
          >
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.accent.moss)]}>{copy.thisWeek}</SafeText>
            <SafeText variant="h2" color="primary">{dashboard.recentActivities[0].description}</SafeText>
            <SafeText variant="caption" color="muted">{formatResidentRelativeTime(dashboard.recentActivities[0].timestamp)}</SafeText>
            <Ionicons name="arrow-forward" size={20} color={theme.semantic.text.primary} />
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>{copy.usefulAroundYou}</SafeText>
          <View style={[styles.utilityList, createBorderStyle(theme.semantic.border.subtle)]}>
            {quickLinks.map((item, index) => (
              <Pressable key={item.id} onPress={() => navigation.navigate(item.screen)} style={styles.utilityRow} accessibilityRole="button">
                <View style={[styles.icon, createBackgroundStyle(theme.semantic.surface.soft)]}>
                  <Ionicons name={item.icon} size={20} color={theme.semantic.accent.moss} />
                </View>
                <SafeText variant="bodyStrong" color="primary" style={styles.utilityTitle}>{item.title}</SafeText>
                <Ionicons name="arrow-forward" size={18} color={theme.semantic.text.tertiary} />
                {index < quickLinks.length - 1 ? <View style={[styles.divider, createBackgroundStyle(theme.semantic.border.subtle)]} /> : null}
              </Pressable>
            ))}
          </View>
        </View>

        {dashboard?.recentActivities?.length ? (
          <View style={styles.section}>
            <SafeText variant="tiny" style={[styles.eyebrow, createColorStyle(theme.semantic.text.tertiary)]}>{copy.recent}</SafeText>
            {dashboard.recentActivities.slice(1, 4).map((activity) => (
              <View key={activity.id} style={[styles.activityRow, createBorderStyle(theme.semantic.border.subtle)]}>
                <SafeText variant="body" color="primary" style={styles.utilityTitle}>{activity.description}</SafeText>
                <SafeText variant="caption" color="muted">{formatResidentRelativeTime(activity.timestamp)}</SafeText>
              </View>
            ))}
          </View>
        ) : (
          <ScreenEmptyState title={copy.quietTitle} description={copy.quietDescription} iconName="leaf-outline" />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
