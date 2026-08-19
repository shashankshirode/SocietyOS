import { useMemo } from "react";
import { View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useParkingHome } from "../data/useParkingHome";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../../ui/patterns/ResidentInfoMosaic";
import { ResidentTimeline } from "../../../../ui/patterns/ResidentTimeline";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ParkingHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createSafeTextColorStyle6 } from "../styles/screens/ParkingHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ParkingHomeScreen({ navigation, route }: ParkingHomeScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const { isEnabled } = useFeatureFlags();
    const { unitId } = route.params;
    const { data } = useParkingHome(unitId);
    const stats = useMemo(() => {
        return [
            { id: 'veh', label: String(localizedUiText.m_9113796a52c0), value: data?.registeredVehiclesCount || 0, iconName: 'car-outline' },
            { id: 'slot', label: String(localizedUiText.m_08a8eba0a48c), value: data?.allocatedParkingSlotsCount || 0, iconName: 'location-outline' },
            { id: 'inc', label: String(localizedUiText.m_3f75292067cb), value: data?.openParkingIncidentsCount || 0, iconName: 'alert-circle-outline' },
            { id: 'stick', label: String(localizedUiText.m_6834971e1c0c), value: data?.pendingStickerRfidCount || 0, iconName: 'radio-outline' },
        ];
    }, [data, localizedUiText]);
    const activities = useMemo(() => {
        return (data?.recentActivity || []).map((act, idx) => ({
            id: `act-${idx}`,
            title: act,
            description: String(localizedUiText.m_7437c91d6db7),
            timestamp: 'Today',
            iconName: 'car-outline',
            status: 'LOGGED',
            statusTone: 'info' as const,
        }));
    }, [data, localizedUiText]);
    const actions = [
        {
            id: 'my-veh',
            title: String(localizedUiText.m_497abe79cafa),
            subtitle: String(localizedUiText.m_ce37da022617),
            icon: 'car-outline',
            onPress: () => navigation.navigate('MyVehicles', { unitId }),
        },
        {
            id: 'wrong-park',
            title: String(localizedUiText.m_bd6620635de4),
            subtitle: String(localizedUiText.m_746d10a5020e),
            icon: 'alert-circle-outline',
            onPress: () => navigation.navigate('WrongParkingReport', { unitId }),
        },
        {
            id: 'block-park',
            title: String(localizedUiText.m_8e538495808c),
            subtitle: String(localizedUiText.m_9c4d7d38f0e1),
            icon: 'warning-outline',
            onPress: () => navigation.navigate('VehicleBlockingReport', { unitId }),
        },
    ];
    if (!isEnabled('parking')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={localizedUiText.m_c7878c573d30} showBackButton/>
        <View style={styles.unavailableContainer}>
          <Ionicons name="lock-closed-outline" size={48} color={theme.textSecondary}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_5031e0f31a53}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>{localizedUiText.m_bfe6b9fd3bbc}</SafeText>
        </View>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_c7878c573d30} subtitle={localizedUiText.m_83f34dcf6780} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PrivacyNoticePanel title={localizedUiText.m_341c222ee099} description={localizedUiText.m_7735ab777383}/>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle4(theme.textPrimary)]}>{localizedUiText.m_592f7d417356}</SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle5(theme.textPrimary)]}>{localizedUiText.m_fe151a94e72d}</SafeText>
          <View style={styles.list}>
            {actions.map((act) => (<PressableScale key={act.id} onPress={act.onPress}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                    <Ionicons name={act.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{act.title}</SafeText>
                    <SafeText variant="caption" color="secondary">{act.subtitle}</SafeText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary}/>
                </View>
              </PressableScale>))}
          </View>
        </View>

        {activities.length > 0 && (<View style={styles.section}>
            <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle6(theme.textPrimary), styles.safeTextPaddingHorizontal]}>{localizedUiText.m_b214d61e5267}</SafeText>
            <ResidentTimeline items={activities}/>
          </View>)}
      </ScrollView>
    </View>);
}
export default ParkingHomeScreen;
