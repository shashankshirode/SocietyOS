import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { InfoRow } from "../../../../shared/components/InfoRow";
import type { OwnershipTenancySummaryScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/OwnershipTenancySummaryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function OwnershipTenancySummaryScreen({ navigation }: OwnershipTenancySummaryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_7e05e125ad57} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)} style={styles.statsCardGrid}>
          <View style={styles.statCardItem}>
            <Text style={styles.statNum}>1</Text>
            <Text style={styles.statLabel}>{localizedUiText.m_4dd138f8e4e8}</Text>
          </View>
          <View style={styles.statCardItem}>
            <Text style={styles.statNum}>1</Text>
            <Text style={styles.statLabel}>{localizedUiText.m_67b4b9a1129b}</Text>
          </View>
          <View style={styles.statCardItem}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLabel}>{localizedUiText.m_a6a014d1e9b2}</Text>
          </View>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>{localizedUiText.m_dcb18acebf49}</Text>
            <InfoRow label={localizedUiText.m_d333178b4a4d} value="3 Owners" valueBold/>
            <InfoRow label={localizedUiText.m_50e1fa8bb86a} value="5 Tenants" valueBold/>
            <InfoRow label={localizedUiText.m_dd05a9b4d7f6} value="1 Request" valueBold/>
            <InfoRow label={localizedUiText.m_1c0fde0c87c7} value="100%" valueBold isLast/>
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInUp.delay(150).duration(450)}>
          <AppCard style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>{localizedUiText.m_e341a049a769}</Text>
            
            <View style={styles.issueRow}>
              <Ionicons name="shield-outline" size={20} color={Colors.success}/>
              <View style={styles.issueDetails}>
                <Text style={styles.issueText}>{localizedUiText.m_ea5897a6eb5b}</Text>
                <Text style={styles.issueSub}>{localizedUiText.m_3d152d7c5162}</Text>
              </View>
              <Text style={styles.issueStatusText}>{localizedUiText.m_8766e017df3d}</Text>
            </View>

            <View style={styles.issueRow}>
              <Ionicons name="document-text-outline" size={20} color={Colors.success}/>
              <View style={styles.issueDetails}>
                <Text style={styles.issueText}>{localizedUiText.m_eeb1421a0606}</Text>
                <Text style={styles.issueSub}>{localizedUiText.m_6b8c1577c9cf}</Text>
              </View>
              <Text style={[styles.issueStatusText, styles.textColor]}>{localizedUiText.m_b0055e6950e4}</Text>
            </View>

            <View style={styles.issueRow}>
              <Ionicons name="warning-outline" size={20} color={Colors.warning}/>
              <View style={styles.issueDetails}>
                <Text style={styles.issueText}>{localizedUiText.m_a30e9c9c5cee}</Text>
                <Text style={styles.issueSub}>{localizedUiText.m_3ad5ced14368}</Text>
              </View>
              <Text style={[styles.issueStatusText, styles.textColor2]}>{localizedUiText.m_332011b91ccd}</Text>
            </View>
          </AppCard>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

