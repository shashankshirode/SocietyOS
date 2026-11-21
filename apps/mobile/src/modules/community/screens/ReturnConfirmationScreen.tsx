import { useState } from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { useBorrowRequestDetail, useConfirmReturn } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/ReturnConfirmationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'ReturnConfirmation'>;
export function ReturnConfirmationScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestId } = route.params;
    const { data: req, isLoading } = useBorrowRequestDetail(requestId);
    const { mutateAsync: confirmReturn, isPending } = useConfirmReturn();
    const [errorMessage, setErrorMessage] = useState('');
    const handleConfirm = async () => {
        try {
            setErrorMessage('');
            await confirmReturn(requestId);
            navigation.goBack();
        }
        catch {
            setErrorMessage(getActiveUiLiteral("m_22490ac4e833"));
        }
    };
    if (isLoading || !req) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_6ec1149cf27f} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_47d2a515ef2f}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_6ec1149cf27f} onBack={() => navigation.goBack()}/>

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={80} color={Colors.success}/>
        </View>

        <Text style={styles.promptTitle}>{localizedUiText.m_82f89db4213b}</Text>
        <Text style={styles.promptDesc}>
          {formatUiLiteral(localizedUiText.m_d4fb74f9b14d, [req.borrowerName, req.itemTitle])}
        </Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.detailsCard}>
          <InfoRow label={localizedUiText.m_652bcc3a4784} value={req.itemTitle}/>
          <InfoRow label={localizedUiText.m_9b2ddc6f1d6c} value={`${req.borrowerName} (${req.borrowerUnit})`}/>
          <InfoRow label={localizedUiText.m_4fc7c384aee7} value={req.borrowedAt ? formatResidentDate(req.borrowedAt) : getActiveUiLiteral("m_b37c7879f6c3")}/>
          <InfoRow label={localizedUiText.m_57870fd03032} value={req.dueDate ? formatResidentDate(req.dueDate) : getActiveUiLiteral("m_b37c7879f6c3")}/>
        </View>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_718745eebe26} onPress={handleConfirm} variant="success" loading={isPending} iconLeft={<Ionicons name="checkbox-outline" size={20} color="#FFF"/>}/>
        </View>
      </View>
    </ScreenContainer>);
}

