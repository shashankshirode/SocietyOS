import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, ScrollView } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice } from "../components/CommunityComponents";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { useResidentServiceRequest } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ServiceRequestDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<CommunityStackParamList, 'ServiceRequestDetail'>;
export function ServiceRequestDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestId } = route.params;
    const { data: request, isLoading, error, refetch } = useResidentServiceRequest(requestId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_f8f2683301b7} showCardPlaceholder/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!request)
        return <ErrorState message={localizedUiText.m_046261ea3a1f} onRetry={refetch}/>;
    const handleOfferHelp = () => {
        navigation.navigate('CommunityContactRequest', {
            type: 'SKILL',
            targetId: request.id,
            targetTitle: request.title,
            receiverId: request.postedById,
            receiverName: request.postedByName,
            receiverUnit: request.postedByUnit,
        });
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_cc973c287945} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.title}>{request.title}</Text>
          
          <View style={styles.divider}/>

          <View style={styles.infoGrid}>
            <InfoRow label={localizedUiText.m_6258d3570d9e} value={`${request.postedByName} (Unit ${request.postedByUnit})`}/>
            <InfoRow label={localizedUiText.m_292c06f0045a} value={request.categorySlug.toUpperCase()}/>
            {request.budget ? <InfoRow label={localizedUiText.m_934efba12b63} value={request.budget}/> : null}
            {request.timing ? <InfoRow label={localizedUiText.m_aff07b915aa1} value={request.timing}/> : null}
            <InfoRow label={localizedUiText.m_1ebf754362fa} value={formatResidentDate(request.createdAt)}/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_f2d8f2de1fa5}</Text>
          <Text style={styles.descriptionText}>{request.description}</Text>

          <View style={styles.divider}/>

          <CommunityPrivacyNotice />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title={localizedUiText.m_7be76a7a5496} onPress={handleOfferHelp} variant="primary" iconLeft={<Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF"/>}/>
      </View>
    </ScreenContainer>);
}

