import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { useBorrowRequestDetail, useDecideBorrowRequest } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/BorrowApprovalScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'BorrowApproval'>;
export function BorrowApprovalScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestId } = route.params;
    const { data: req, isLoading } = useBorrowRequestDetail(requestId);
    const { mutateAsync: decideRequest, isPending } = useDecideBorrowRequest();
    const [decisionNote, setDecisionNote] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleDecision = async (status: 'APPROVED' | 'REJECTED') => {
        try {
            setErrorMessage('');
            await decideRequest({
                id: requestId,
                dto: {
                    status,
                    ...includeWhenPresent("decisionNote", decisionNote || undefined)
                }
            });
            navigation.goBack();
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_7e266af0fd06"));
        }
    };
    if (isLoading || !req) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_1acafc9093af} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_0801ab542215}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_ab23bdeaf15d} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.title}>{localizedUiText.m_45ff03a9cf23 + " "}{req.itemTitle}</Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          
          <View style={styles.divider}/>

          <View style={styles.infoGrid}>
            <InfoRow label={localizedUiText.m_9b2ddc6f1d6c} value={`${req.borrowerName} (Unit ${req.borrowerUnit})`}/>
            <InfoRow label={localizedUiText.m_05e166917c57} value={`${req.durationDays} Days`}/>
            <InfoRow label={localizedUiText.m_cc5a41e4b6bf} value={formatResidentDate(req.createdAt)}/>
          </View>

          <View style={styles.divider}/>

          <Text style={styles.sectionTitle}>{localizedUiText.m_577cd57b80bc}</Text>
          <Text style={styles.purposeText}>{`"${req.purpose}"`}</Text>

          <View style={styles.divider}/>

          <FormField label={localizedUiText.m_c6ea4ddd0b6a} placeholder={localizedUiText.m_957fe67a5b1f} value={decisionNote} onChangeText={setDecisionNote} multiline numberOfLines={3} style={styles.textArea}/>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <View style={styles.flexButton}>
            <AppButton title={localizedUiText.m_ab604a360777} onPress={() => handleDecision('REJECTED')} variant="danger" loading={isPending}/>
          </View>
          <View style={styles.flexButton}>
            <AppButton title={localizedUiText.m_6007acbe30b2} onPress={() => handleDecision('APPROVED')} variant="primary" loading={isPending}/>
          </View>
        </View>
      </View>
    </ScreenContainer>);
}

