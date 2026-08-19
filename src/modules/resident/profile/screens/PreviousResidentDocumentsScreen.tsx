import { AppAlert } from "../../../../ui/modal/AppAlert";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { AccessRestrictedState } from "../../../../shared/feedback/AccessRestrictedState";
import { usePermission } from "../../../../core/permissions/usePermission";
import { usePreviousResidentDocuments } from "../hooks/usePreviousResidentDetail";
import type { PreviousResidentDocumentsScreenProps } from "../../../../app/navigation/navigation.types";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { styles } from "../styles/screens/PreviousResidentDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function PreviousResidentDocumentsScreen({ navigation, route }: PreviousResidentDocumentsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { unitId, residentHistoryId } = route.params;
    const { data: docs = [], isLoading, error, refetch } = usePreviousResidentDocuments(unitId, residentHistoryId);
    const { isAllowed } = usePermission({ permission: 'OWNER_TENANT_VIEW_RESTRICTED_DOCS' });
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_dba974b66b72} message={localizedUiText.m_8df4cec9b65f} onRetry={refetch}/>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_1a9edc22856c} showBack onBack={() => navigation.goBack()}/>
      {!isAllowed ? (<AccessRestrictedState title={localizedUiText.m_34081694701d} description={localizedUiText.m_829ec8ae18da} requiredPermission="OWNER_TENANT_VIEW_RESTRICTED_DOCS" onBack={() => navigation.goBack()}/>) : (<View style={styles.mainContainer}>
        
        <WarningBanner message={localizedUiText.m_3f5057aba528} type="danger" style={styles.banner}/>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          
          <Animated.View entering={ZoomIn.duration(400)} style={styles.lockBox}>
            <View style={styles.lockIconCircle}>
              <Ionicons name="lock-closed" size={48} color={Colors.danger}/>
            </View>
            <Text style={styles.lockTitle}>{localizedUiText.m_a3966fe9958a}</Text>
            <Text style={styles.lockSubtitle}>{localizedUiText.m_b18c9ac0bb39}</Text>
          </Animated.View>

          
          <Animated.View entering={FadeInUp.delay(100).duration(450)} style={styles.filesListContainer}>
            <Text style={styles.sectionHeader}>{localizedUiText.m_2dcad6cb35ff}</Text>
            {docs.map((doc, idx) => (<View key={doc.id || idx} style={styles.lockedDocItem}>
                <Ionicons name="document-lock-outline" size={20} color={Colors.textMuted}/>
                <View style={styles.viewFlexMarginLeft}>
                  <Text style={styles.docNameMuted}>{doc.title}</Text>
                  <Text style={styles.docCatMuted}>{doc.category.replace('_', ' ')}{" " + localizedUiText.m_a8239d1e8a54}</Text>
                </View>
                <View style={styles.lockTag}>
                  <Ionicons name="lock-closed" size={10} color={Colors.textMuted}/>
                  <Text style={styles.lockTagText}>{localizedUiText.m_a424e33d9093}</Text>
                </View>
              </View>))}
          </Animated.View>

          
          <Animated.View entering={FadeInUp.delay(150).duration(450)} style={styles.actions}>
            <AppButton title={localizedUiText.m_96604cd7681a} onPress={() => AppAlert.alert(String(localizedUiText.m_f70c0622f07e), String(localizedUiText.m_cba80f39f2c1) + Math.floor(1000 + Math.random() * 9000))} variant="secondary" fullWidth/>
          </Animated.View>

          <View style={styles.bottomSpacer}/>
        </ScrollView>
      </View>)}
    </SafeAreaView>);
}

