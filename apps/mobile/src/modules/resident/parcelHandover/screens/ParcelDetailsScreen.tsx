import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../../shared/layouts/ResponsivePageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useParcelHandover, useConfirmPickup } from "../hooks/useParcelHandover";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { AppButton } from "../../../../shared/components/AppButton";
import { styles, createTextColorStyle, createViewBackgroundColorBorderColorStyle, createTextColorStyle2, createTextColorStyle3, createTextColorStyle4, createTextColorStyle5, createTextColorStyle6, createTextColorStyle7, createViewBackgroundColorBorderColorStyle2, createTextColorStyle8, createTextInputColorBorderColorStyle } from "../styles/screens/ParcelDetailsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
export function ParcelDetailsScreen({ route, navigation }: LegacyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { parcelId } = route.params;
    const { colors } = useAppTheme();
    const { data } = useParcelHandover();
    const { submit: pickup } = useConfirmPickup();
    const [otp, setOtp] = useState('');
    const parcel = data?.find((p) => p.id === parcelId);
    if (!parcel)
        return <ErrorState message={localizedUiText.m_02ccf7711b85}/>;
    const handleVerify = () => {
        pickup({ id: parcel.id, otp });
        navigation.goBack();
    };
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={formatUiLiteral(localizedUiText.m_19f55abca92b, [parcel.courierCompany])} subtitle={localizedUiText.m_6d0c263683d6} onBack={() => navigation.goBack()}/>
        <View style={styles.content}>
          <View style={[styles.box, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
            <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_37a3300fc8ea}</Text>
            <Text style={[styles.val, createTextColorStyle3(colors.textPrimary)]}>{parcel.recipientName} ({parcel.recipientFlat})</Text>

            <Text style={[styles.label, createTextColorStyle4(colors.textSecondary)]}>{localizedUiText.m_dbcaf35fa2e8}</Text>
            <Text style={[styles.val, createTextColorStyle5(colors.textPrimary)]}>{parcel.receivedTime}</Text>

            <Text style={[styles.label, createTextColorStyle6(colors.textSecondary)]}>{localizedUiText.m_5b7c4c081e9c}</Text>
            <Text style={[styles.val, createTextColorStyle7(colors.textPrimary)]}>{parcel.status}</Text>
          </View>

          {parcel.status === 'PENDING_PICKUP' && (<View style={[styles.box, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}>
              <Text style={[styles.label, createTextColorStyle8(colors.textSecondary)]}>{localizedUiText.m_80abdcd17088}</Text>
              <TextInput style={[styles.input, createTextInputColorBorderColorStyle(colors.textPrimary, colors.border)]} keyboardType="number-pad" value={otp} onChangeText={setOtp} placeholder={localizedUiText.m_7b346904f63c} placeholderTextColor={colors.textMuted}/>
            </View>)}

          <View style={styles.actions}>
            {parcel.status === 'PENDING_PICKUP' ? (<AppButton title={localizedUiText.m_f952faeb7156} onPress={handleVerify} variant="primary"/>) : (<Text style={createTextColorStyle(colors.success)}>{localizedUiText.m_a76d7e22b531}</Text>)}
          </View>
        </View>
      </SafeAreaView>
    </ScreenContainer>);
}

