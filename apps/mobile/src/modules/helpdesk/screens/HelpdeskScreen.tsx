import { useState } from "react";
import { Linking, ScrollView, Text, View, Pressable } from "react-native";
import { ResponsiveContainer } from "../../../shared/layouts/ResponsiveContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInUp, FadeInDown, Layout } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { Skeleton } from "../../../shared/feedback/Skeleton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { Messages } from "../../../shared/constants/messages";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { useFaqItems } from "../data/useFaqItems";
import type { HelpdeskScreenProps } from "../../../app/navigation/navigation.types";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { styles } from "../styles/screens/HelpdeskScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
function FaqRow({ question, answer, isOpen, onToggle, }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (<View style={styles.faqItemContainer}>
      <Pressable onPress={onToggle} style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textSecondary}/>
      </Pressable>
      {isOpen && (<Animated.View entering={FadeInUp.duration(200)} layout={Layout.springify()} style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </Animated.View>)}
    </View>);
}
export function HelpdeskScreen({ navigation }: HelpdeskScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
    const { data: faqItems, isLoading, error, refetch } = useFaqItems();
    const toggleFaq = (id: string) => {
        setExpandedFaqId((prev) => (prev === id ? null : id));
    };
    const contactSupport = async () => {
        const emailUrl = 'mailto:support@societyos.app?subject=Resident%20support%20request';
        try {
            await Linking.openURL(emailUrl);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_fb432b312fdf), String(localizedUiText.m_675b3b284730));
        }
    };
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResponsiveContainer>
          <AppHeader title={Messages.helpdesk.screenTitle} showBack onBack={() => navigation.goBack()}/>
          <ScrollView style={styles.scrollViewFlex} contentContainerStyle={styles.scrollContent}>
            <Skeleton height={18} width="50%" style={styles.skeletonMarginBottomMarginTop}/>
            <AppCard style={styles.faqCard}>
              <Skeleton height={40} style={styles.skeletonMarginBottom}/>
              <Skeleton height={40} style={styles.skeletonMarginBottom2}/>
              <Skeleton height={40} style={styles.skeletonMarginBottom3}/>
              <Skeleton height={40}/>
            </AppCard>
          </ScrollView>
        </ResponsiveContainer>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <ResponsiveContainer>
          <AppHeader title={Messages.helpdesk.screenTitle} showBack onBack={() => navigation.goBack()}/>
          <ErrorState message={error.message} onRetry={refetch}/>
        </ResponsiveContainer>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <ResponsiveContainer>
      <AppHeader title={Messages.helpdesk.screenTitle} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={styles.sectionTitle}>{Messages.helpdesk.faqTitle}</Text>
          <AppCard style={styles.faqCard} noPadding>
            {(faqItems ?? []).map((faq) => (<FaqRow key={faq.id} question={faq.question} answer={faq.answer} isOpen={expandedFaqId === faq.id} onToggle={() => toggleFaq(faq.id)}/>))}
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <Text style={styles.sectionTitle}>{Messages.helpdesk.contactTitle}</Text>
          <AppCard style={styles.contactCard}>
            <Text style={styles.contactDescription}>
              {Messages.helpdesk.contactDescription}
            </Text>
            
            <Pressable style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]} onPress={() => void contactSupport()} accessibilityRole="button" accessibilityLabel={localizedUiText.m_533eeba9713c}>
              <View style={styles.iconCircle}>
                <Ionicons name="chatbubbles-outline" size={20} color={Colors.primary}/>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{Messages.helpdesk.contactAdmin}</Text>
                <Text style={styles.contactValue}>{localizedUiText.m_e8623d86c908}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.contactRow, pressed && styles.pressed]} onPress={() => navigation.navigate('CreateComplaintFromHome')} accessibilityRole="button" accessibilityLabel={localizedUiText.m_635ae219ad13}>
              <View style={styles.iconCircle}>
                <Ionicons name="bug-outline" size={20} color={Colors.primary}/>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{Messages.helpdesk.reportIssue}</Text>
                <Text style={styles.contactValue}>{Messages.helpdesk.reportIssueSub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
            </Pressable>
          </AppCard>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </ResponsiveContainer>
    </SafeAreaView>);
}

