import { Text, View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice, CommunitySafetyNotice } from "../components/CommunityComponents";
import { useBorrowableItemDetail } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/BorrowableItemDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'BorrowableItemDetail'>;
export function BorrowableItemDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { itemId } = route.params;
    const { data: item, isLoading } = useBorrowableItemDetail(itemId);
    const handleRequestBorrow = () => {
        if (!item)
            return;
        navigation.navigate('BorrowRequest', { itemId: item.id });
    };
    if (isLoading || !item) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_47d2a515ef2f} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_f0fc55b7839d}</Text>
        </View>
      </ScreenContainer>);
    }
    const isAvailable = item.status === 'AVAILABLE';
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_3877be691f15} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <StatusBadge status={item.status} moduleType="borrow"/>
          </View>

          <Text style={styles.categoryText}>{localizedUiText.m_b330d6701b55 + " "}{item.category}</Text>

          <View style={styles.divider}/>

          <View style={styles.infoGrid}>
            <InfoRow label={localizedUiText.m_330dadfebe57} value={`${item.ownerName} (Unit ${item.ownerUnit})`}/>
            <InfoRow label={localizedUiText.m_e5b10d63b348} value={`${item.maxDurationDays} Days`}/>
            <InfoRow label={localizedUiText.m_0da00b600a2d} value={item.depositRequired ? 'Yes' : getActiveUiLiteral("m_e869fcd6df45")}/>
            {item.depositRequired && item.depositDetails && (<InfoRow label={localizedUiText.m_8358e9966b96} value={item.depositDetails}/>)}
            <InfoRow label={localizedUiText.m_c1729016a32b} value={formatResidentDate(item.createdAt)}/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_526e0087cc3f}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>

          <View style={styles.divider}/>

          <CommunityPrivacyNotice />
          <CommunitySafetyNotice />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title={isAvailable ? localizedUiText.m_8d4d3f7f2b93 : localizedUiText.m_420b88c7c017} onPress={handleRequestBorrow} variant={isAvailable ? "primary" : "secondary"} disabled={!isAvailable} iconLeft={<Ionicons name="time-outline" size={20} color="#FFF"/>}/>
      </View>
    </ScreenContainer>);
}

