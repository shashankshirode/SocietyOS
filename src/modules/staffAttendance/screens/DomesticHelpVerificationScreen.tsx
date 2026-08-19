import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useDomesticHelpDetail } from "../data/useDomesticHelpDetail";
import { useDomesticHelpVerification } from "../data/useDomesticHelpVerification";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/screens/DomesticHelpVerificationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'DomesticHelpVerification'>;
interface ChecklistItem {
    key: string;
    label: string;
    verified: boolean;
}
export function DomesticHelpVerificationScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { domesticHelpId } = route.params;
    const { data, isLoading, error, refetch } = useDomesticHelpDetail(domesticHelpId);
    const { verify, isSubmitting } = useDomesticHelpVerification();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        { key: 'resident_sponsor', label: String(localizedUiText.m_abf5d8070db0), verified: true },
        { key: 'id_proof', label: String(localizedUiText.m_0f69751ec95f), verified: false },
        { key: 'address_proof', label: String(localizedUiText.m_0c30c2c6d22f), verified: false },
        { key: 'police_verification', label: String(localizedUiText.m_594d14e76482), verified: false },
        { key: 'photo', label: String(localizedUiText.m_ffeabcc91f55), verified: true },
        { key: 'mobile_verified', label: String(localizedUiText.m_3fb7b8a259a1), verified: true },
        { key: 'access_pass', label: String(localizedUiText.m_bcf6da72e140), verified: false },
    ]);
    const toggleItem = (key: string) => {
        setChecklist(prev => prev.map(item => (item.key === key ? { ...item, verified: !item.verified } : item)));
    };
    const handleVerifyItem = async (key: string, label: string) => {
        const item = checklist.find(i => i.key === key);
        if (!item)
            return;
        const nextStatus = item.verified ? 'REJECTED' as const : 'VERIFIED' as const;
        AppAlert.alert(formatUiLiteral(String(localizedUiText.m_e0f9132ce190), [nextStatus === 'VERIFIED' ? String(localizedUiText.m_eea2745e2867) : String(localizedUiText.m_b0dee41ff901)]), formatUiLiteral(String(localizedUiText.m_a1bbce157673), [label]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_eebdd24a77d9),
                onPress: async () => {
                    await verify(domesticHelpId, key, nextStatus, getActiveUiLiteral("m_a3f342b9e9f5"));
                    toggleItem(key);
                },
            },
        ]);
    };
    const handleFinalApprove = () => {
        const unverified = checklist.filter(i => !i.verified);
        if (unverified.length > 0) {
            AppAlert.alert(String(localizedUiText.m_e981ddae45d8), formatUiLiteral(String(localizedUiText.m_442b5b31c4f4), [unverified.length]), [
                { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
                {
                    text: String(localizedUiText.m_41f381da21b6),
                    onPress: () => {
                        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_3a18ab95f7d8));
                        navigation.goBack();
                    },
                },
            ]);
        }
        else {
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_3a18ab95f7d8));
            navigation.goBack();
        }
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_e7987854269d}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_999930725d06}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_562d04c4f800}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_451c88beb47d + " "}{data.name}</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="alert-circle-outline" size={18} color={Colors.warning}/>
        <Text style={styles.alertText}>{localizedUiText.m_3370801a95c2}</Text>
      </View>

      <View style={styles.checklistCard}>
        {checklist.map(item => (<Pressable key={item.key} style={styles.checkRow} onPress={() => handleVerifyItem(item.key, item.label)}>
            <View style={styles.checkLeft}>
              <View style={[styles.checkbox, item.verified && styles.checkboxChecked]}>
                {item.verified && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
              </View>
              <Text style={[styles.itemLabel, item.verified && styles.itemLabelChecked]}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.neutral}/>
          </Pressable>))}
      </View>

      <Pressable style={({ pressed }) => [styles.approveButton, pressed && styles.approveButtonPressed]} onPress={handleFinalApprove} disabled={isSubmitting}>
        <Text style={styles.approveText}>{localizedUiText.m_c7d5e19644b1}</Text>
      </Pressable>
    </ScreenContainer>);
}

