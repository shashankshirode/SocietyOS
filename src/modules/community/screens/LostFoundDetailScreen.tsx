import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { CommunityPrivacyNotice, CommunitySafetyNotice } from "../components/CommunityComponents";
import { useLostFoundItemDetail, useClaimLostFoundItem } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/LostFoundDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'LostFoundDetail'>;
export function LostFoundDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { itemId } = route.params;
    const { data: item, isLoading, refetch } = useLostFoundItemDetail(itemId);
    const { mutateAsync: claimItem, isPending } = useClaimLostFoundItem();
    const [claimNote, setClaimNote] = useState('');
    const [showClaimForm, setShowClaimForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleContact = () => {
        if (!item)
            return;
        navigation.navigate('CommunityContactRequest', {
            type: 'LOST_FOUND',
            targetId: item.id,
            targetTitle: item.title,
            receiverId: item.reporterId,
            receiverName: item.reporterName,
            receiverUnit: item.reporterUnit,
        });
    };
    const handleClaim = async () => {
        if (!claimNote)
            return;
        setErrorMessage('');
        try {
            await claimItem({ id: itemId, note: claimNote });
            setShowClaimForm(false);
            refetch();
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_94e6ee606740"));
        }
    };
    if (isLoading || !item) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_47d2a515ef2f} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_eefe44fd0c3e}</Text>
        </View>
      </ScreenContainer>);
    }
    const isLost = item.type === 'LOST';
    const isActive = item.status === 'ACTIVE';
    return (<ScreenContainer>
      <ResponsivePageHeader title={isLost ? localizedUiText.m_ca74610f231e : localizedUiText.m_85025ff7e00d} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <StatusBadge status={item.status} moduleType="lostfound"/>
          </View>

          <View style={styles.divider}/>

          <View style={styles.infoGrid}>
            <InfoRow label={localizedUiText.m_b8c1a8dcd16c} value={`${item.reporterName} (Unit ${item.reporterUnit})`}/>
            <InfoRow label={localizedUiText.m_292c06f0045a} value={item.category}/>
            <InfoRow label={localizedUiText.m_15b61974b270} value={item.location}/>
            <InfoRow label={localizedUiText.m_7ed49b77f506} value={formatResidentDate(item.dateHappened)}/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_526e0087cc3f}</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>

          {item.status === 'CLAIMED' && (<>
              <View style={styles.divider}/>
              <View style={styles.resolvedCard}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.success}/>
                <View style={styles.resolvedInfo}>
                  <Text style={styles.resolvedTitle}>{localizedUiText.m_97e94d4a9187}</Text>
                  <Text style={styles.resolvedText}>{localizedUiText.m_7eee29e2f580}{item.claimantName}{" " + localizedUiText.m_b0713bedb34d + " "}{item.claimantUnit})
                  </Text>
                  {item.claimNote ? (<Text style={styles.resolvedNote}>{formatUiLiteral(localizedUiText.m_8e62bbc43a2c, [item.claimNote])}</Text>) : null}
                </View>
              </View>
            </>)}

          <View style={styles.divider}/>

          <CommunityPrivacyNotice />
          <CommunitySafetyNotice />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {showClaimForm && (<View style={styles.claimForm}>
              <FormField label={localizedUiText.m_d4cc82205209} placeholder={localizedUiText.m_5c712e1ca574} value={claimNote} onChangeText={setClaimNote} multiline numberOfLines={3} style={styles.textArea}/>
              <View style={styles.claimFormButtons}>
                <View style={styles.flexButton}>
                  <AppButton title={localizedUiText.m_19766ed6ccb2} onPress={() => setShowClaimForm(false)} variant="secondary"/>
                </View>
                <View style={styles.flexButton}>
                  <AppButton title={localizedUiText.m_871c4ff38cbc} onPress={handleClaim} variant="success" loading={isPending} disabled={!claimNote}/>
                </View>
              </View>
            </View>)}
        </View>
      </ScrollView>

      {isActive && !showClaimForm && (<View style={styles.footer}>
          <View style={styles.buttonRow}>
            {!isLost && (<View style={styles.flexButton}>
                <AppButton title={localizedUiText.m_6d0e9473c751} onPress={() => setShowClaimForm(true)} variant="success" iconLeft={<Ionicons name="hand-left-outline" size={20} color="#FFF"/>}/>
              </View>)}
            <View style={styles.flexButton}>
              <AppButton title={isLost ? localizedUiText.m_de661aea6b4b : localizedUiText.m_e6044af9be7c} onPress={handleContact} variant="primary" iconLeft={<Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF"/>}/>
            </View>
          </View>
        </View>)}
    </ScreenContainer>);
}

