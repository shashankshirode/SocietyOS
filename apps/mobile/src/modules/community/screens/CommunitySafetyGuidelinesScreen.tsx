import { Text, View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { styles } from "../styles/screens/CommunitySafetyGuidelinesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function CommunitySafetyGuidelinesScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_a619b9b3565f} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <Ionicons name="shield-checkmark" size={32} color={Colors.success}/>
          <Text style={styles.bannerTitle}>{localizedUiText.m_35b7a3786ed1}</Text>
          <Text style={styles.bannerDesc}>{localizedUiText.m_6d34e6442283}</Text>
        </View>

        <View style={styles.guidelinesList}>
          <View style={styles.guidelineCard}>
            <View style={[styles.iconWrapper, styles.viewBackgroundColor]}>
              <Ionicons name="people-outline" size={20} color={Colors.info}/>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>{localizedUiText.m_4b6ebfaf0218}</Text>
              <Text style={styles.guidelineText}>{localizedUiText.m_36850a306ea5}</Text>
            </View>
          </View>

          <View style={styles.guidelineCard}>
            <View style={[styles.iconWrapper, styles.viewBackgroundColor2]}>
              <Ionicons name="cash-outline" size={20} color={Colors.warning}/>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>{localizedUiText.m_cf849dedaf29}</Text>
              <Text style={styles.guidelineText}>{localizedUiText.m_bc1df4ce5b7a}</Text>
            </View>
          </View>

          <View style={styles.guidelineCard}>
            <View style={[styles.iconWrapper, styles.viewBackgroundColor3]}>
              <Ionicons name="chatbubbles-outline" size={20} color={Colors.primary}/>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>{localizedUiText.m_f1aae207eae0}</Text>
              <Text style={styles.guidelineText}>{localizedUiText.m_2cabe66ec4f5}</Text>
            </View>
          </View>

          <View style={styles.guidelineCard}>
            <View style={[styles.iconWrapper, styles.viewBackgroundColor4]}>
              <Ionicons name="flag-outline" size={20} color={Colors.danger}/>
            </View>
            <View style={styles.guidelineContent}>
              <Text style={styles.guidelineTitle}>{localizedUiText.m_4d71f362626c}</Text>
              <Text style={styles.guidelineText}>{localizedUiText.m_88ce8f34bb70}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

