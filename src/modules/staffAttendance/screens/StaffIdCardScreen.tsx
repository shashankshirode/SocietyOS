import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useStaffDetail } from "../data/useStaffDetail";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/screens/StaffIdCardScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'StaffIdCard'>;
export function StaffIdCardScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { staffId } = route.params;
    const { data, isLoading, error, refetch } = useStaffDetail(staffId);
    const handleDownload = () => {
        AppAlert.alert(String(localizedUiText.m_84840718db93), String(localizedUiText.m_95ef5f423db2));
    };
    const handlePrint = () => {
        AppAlert.alert(String(localizedUiText.m_3af84c6b1c13), String(localizedUiText.m_15eba307dd64));
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_f5e10ef12568}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_999930725d06}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_e30acaebd126}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_3e39ca772874}</Text>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.idCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.white}/>
            <View>
              <Text style={styles.societyName}>{localizedUiText.m_a3108d0eba8f}</Text>
              <Text style={styles.cardTitle}>{localizedUiText.m_005282e3388a}</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.photoBox}>
              <Ionicons name="person" size={50} color={Colors.neutral}/>
            </View>
            <View style={styles.info}>
              <Text style={styles.nameText}>{data.name}</Text>
              <Text style={styles.categoryText}>{data.category.replace('_', ' ')}</Text>
              <Text style={styles.codeText}>{localizedUiText.m_3ea36adcd1e0 + " "}{data.staffCode}</Text>
              <Text style={styles.validText}>{localizedUiText.m_3fbfd50d73c1}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.qrCodePlaceholder}>
              <Ionicons name="qr-code-outline" size={44} color={Colors.textPrimary}/>
            </View>
            <View style={styles.footerInfo}>
              <Text style={styles.footerLabel}>{localizedUiText.m_e6d3c0aa2771}</Text>
              <Text style={styles.footerVal}>{data.mobileMasked}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleDownload}>
          <Ionicons name="download-outline" size={18} color={Colors.white}/>
          <Text style={styles.btnText}>{localizedUiText.m_6183be0883d2}</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.btnSec]} onPress={handlePrint}>
          <Ionicons name="print-outline" size={18} color={Colors.primary}/>
          <Text style={styles.btnTextSec}>{localizedUiText.m_35cb2aa4c2db}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

