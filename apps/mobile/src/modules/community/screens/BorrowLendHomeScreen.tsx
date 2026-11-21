import { useMemo } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBorrowRequests } from "../data/communityHooks";
import { useResidentTheme } from "../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../ui/patterns/ResidentPageHeader";
import { PrivacyNoticePanel } from "../../../ui/patterns/PrivacyNoticePanel";
import { ResidentInfoMosaic } from "../../../ui/patterns/ResidentInfoMosaic";
import { SafeText } from "../../../shared/components/SafeText";
import { PressableScale } from "../../../shared/motion/PressableScale";
import { styles, createSafeTextColorStyle, createViewBackgroundColorPaddingTopStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/screens/BorrowLendHomeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function BorrowLendHomeScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { data: incomingReqs } = useBorrowRequests('incoming');
    const { data: outgoingReqs } = useBorrowRequests('outgoing');
    const pendingIncomingCount = incomingReqs?.filter(r => r.status === 'PENDING_APPROVAL').length || 0;
    const pendingOutgoingCount = outgoingReqs?.filter(r => r.status === 'PENDING_APPROVAL').length || 0;
    const stats = useMemo(() => {
        return [
            { id: 'in', label: String(localizedUiText.m_5681118013c3), value: pendingIncomingCount, iconName: 'arrow-down-outline' },
            { id: 'out', label: String(localizedUiText.m_b72c8516e179), value: pendingOutgoingCount, iconName: 'arrow-up-outline' },
        ];
    }, [localizedUiText, pendingIncomingCount, pendingOutgoingCount]);
    const links = [
        {
            id: 'browse',
            title: String(localizedUiText.m_7ea515abd0b3),
            subtitle: String(localizedUiText.m_d8d8ba6c9cf5),
            icon: 'search-outline',
            onPress: () => navigation.navigate('BorrowableItemList'),
        },
        {
            id: 'list-item',
            title: String(localizedUiText.m_fe576b1cb075),
            subtitle: String(localizedUiText.m_d892b04e9dd7),
            icon: 'add-circle-outline',
            onPress: () => navigation.navigate('CreateBorrowableItem'),
        },
        {
            id: 'my-items',
            title: String(localizedUiText.m_d545e1b7f9d1),
            subtitle: String(localizedUiText.m_517b87088ea2),
            icon: 'cube-outline',
            onPress: () => navigation.navigate('MyBorrowableItems'),
        },
    ];
    return (<View style={[styles.root, createViewBackgroundColorPaddingTopStyle(theme.background, insets.top)]}>
      <ResidentPageHeader title={localizedUiText.m_b74ebd90e386} subtitle={localizedUiText.m_43d15e75dc87} showBackButton/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <PrivacyNoticePanel title={localizedUiText.m_1d98db343201} description={localizedUiText.m_3df66522abf1}/>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle2(theme.textPrimary)]}>{localizedUiText.m_a5c46734157a}</SafeText>
          <ResidentInfoMosaic items={stats}/>
        </View>

        
        <View style={styles.section}>
          <SafeText variant="bodyStrong" style={[styles.sectionTitle, createSafeTextColorStyle3(theme.textPrimary)]}>{localizedUiText.m_71b7b95453f9}</SafeText>
          <View style={styles.list}>
            {links.map((link) => (<PressableScale key={link.id} onPress={link.onPress}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle(theme.accentSoft)]}>
                    <Ionicons name={link.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{link.title}</SafeText>
                    <SafeText variant="caption" color="secondary">{link.subtitle}</SafeText>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.textSecondary}/>
                </View>
              </PressableScale>))}
          </View>
        </View>
      </ScrollView>
    </View>);
}
export default BorrowLendHomeScreen;
