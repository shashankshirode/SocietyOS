import { Text, View, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import { AppButton } from "../../../shared/components/AppButton";
import { CommunityPrivacyNotice } from "../components/CommunityComponents";
import { useSkillProfileDetail } from "../data/communityHooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../core/localization/dateTimeFormatters";
import { styles } from "../styles/screens/SkillProfileDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<CommunityStackParamList, 'SkillProfileDetail'>;
export function SkillProfileDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { profileId } = route.params;
    const { data: profile, isLoading } = useSkillProfileDetail(profileId);
    const handleContact = () => {
        if (!profile)
            return;
        navigation.navigate('CommunityContactRequest', {
            type: 'SKILL',
            targetId: profile.id,
            targetTitle: profile.title,
            receiverId: profile.residentId,
            receiverName: profile.residentName,
            receiverUnit: profile.residentUnit,
        });
    };
    if (isLoading || !profile) {
        return (<ScreenContainer>
        <ResponsivePageHeader title={localizedUiText.m_47d2a515ef2f} onBack={() => navigation.goBack()}/>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{localizedUiText.m_4a47f12d23c4}</Text>
        </View>
      </ScreenContainer>);
    }
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_d0bbea88177a} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.residentName.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{profile.title}</Text>
            <Text style={styles.subtitle}>{profile.residentName} ({profile.residentUnit})</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700"/>
              <Text style={styles.ratingText}>{profile.averageRating.toFixed(1)}</Text>
              <Text style={styles.reviewsText}>({profile.reviewsCount}{" " + localizedUiText.m_4750d8da5828}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider}/>

        <View style={styles.infoGrid}>
          {profile.experienceYears !== undefined && (<InfoRow label={localizedUiText.m_8eab0f09df01} value={`${profile.experienceYears} Years`}/>)}
          {profile.availabilityHours && (<InfoRow label={localizedUiText.m_12f67f8539c4} value={profile.availabilityHours}/>)}
          <InfoRow label={localizedUiText.m_9d37c5a9aa68} value={formatResidentDate(profile.createdAt)}/>
        </View>

        <View style={styles.divider}/>

        <Text style={styles.sectionTitle}>{localizedUiText.m_92686c9861a8}</Text>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill, idx) => (<View key={idx} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{skill}</Text>
            </View>))}
        </View>

        <View style={styles.divider}/>

        <Text style={styles.sectionTitle}>{localizedUiText.m_5a7944a349b5}</Text>
        <Text style={styles.descriptionText}>{profile.description}</Text>

        <View style={styles.divider}/>

        <CommunityPrivacyNotice />

        <View style={styles.divider}/>

        <Text style={styles.sectionTitle}>{localizedUiText.m_e864b15387c4}</Text>
        {profile.reviews && profile.reviews.length > 0 ? (<View style={styles.reviewsList}>
            {profile.reviews.map((rev) => (<View key={rev.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{rev.reviewerName} ({rev.reviewerUnit})</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700"/>
                    <Text style={styles.reviewerRating}>{rev.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
                <Text style={styles.reviewDate}>{formatResidentDate(rev.createdAt)}</Text>
              </View>))}
          </View>) : (<Text style={styles.noReviewsText}>{localizedUiText.m_1e1bb23a19c4}</Text>)}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title={localizedUiText.m_6f242c51b937} onPress={handleContact} variant="primary" iconLeft={<Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF"/>}/>
      </View>
    </ScreenContainer>);
}

