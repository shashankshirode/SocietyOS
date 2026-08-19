import { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice } from "../components/CommunityComponents";
import { useCreateBorrowRequest, useBorrowableItemDetail } from "../data/communityHooks";
import type { BorrowRequestScreenProps } from "../../../app/navigation/navigation.types";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { styles } from "../styles/screens/BorrowRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function BorrowRequestScreen({ route, navigation }: BorrowRequestScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { itemId } = route.params;
    const { data: item, isLoading } = useBorrowableItemDetail(itemId);
    const [durationDays, setDurationDays] = useState('');
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { mutateAsync: requestBorrow, isPending } = useCreateBorrowRequest();
    const handleSubmit = async () => {
        if (!durationDays || !purpose) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        if (item && Number(durationDays) > item.maxDurationDays) {
            setError(`Max duration allowed is ${item.maxDurationDays} days.`);
            return;
        }
        try {
            await requestBorrow({
                itemId,
                durationDays: Number(durationDays),
                purpose,
            });
            setSuccess(true);
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_3ae27e37986f")));
        }
    };
    if (isLoading || !item) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_55deee53fba5} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_47d2a515ef2f}</Text>
        </View>
      </ScreenContainer>);
    }
    if (success) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_a6c31fb43daf}/>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successEmoji}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>{localizedUiText.m_04acbd9cc6c6}</Text>
          <Text style={styles.successDescription}>
            {formatUiLiteral(localizedUiText.m_096f425aa858, [item.title, item.ownerName, item.ownerUnit])}{localizedUiText.m_021c76de4625}</Text>
          <View style={styles.successButtonContainer}>
            <AppButton title={localizedUiText.m_da32848de7ec} onPress={() => navigation.navigate('BorrowLendHome')} variant="primary"/>
          </View>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_8d4d3f7f2b93} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <CommunityPrivacyNotice />

        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <View style={styles.itemSummary}>
          <Text style={styles.summaryLabel}>{localizedUiText.m_8dceee63f4a8}</Text>
          <Text style={styles.summaryTitle}>{item.title}</Text>
          <Text style={styles.summaryOwner}>{localizedUiText.m_9a638cfefd87 + " "}{item.ownerName} ({item.ownerUnit})</Text>
        </View>

        <FormField label={formatUiLiteral(localizedUiText.m_7aa5e162be0a, [item.maxDurationDays])} placeholder={formatUiLiteral(localizedUiText.m_9100274c45b1, [item.maxDurationDays])} value={durationDays} onChangeText={setDurationDays} keyboardType="numeric"/>

        <FormField label={localizedUiText.m_5450a7f48f2f} placeholder={localizedUiText.m_ff384a1d6d52} value={purpose} onChangeText={setPurpose} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_8966a6b6c895} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

