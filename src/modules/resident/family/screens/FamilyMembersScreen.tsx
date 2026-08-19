import { AppAlert } from "../../../../ui/modal/AppAlert";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { StatusBadge, getKycStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import type { FamilyMembersScreenProps } from "../../../../app/navigation/navigation.types";
import type { FamilyMember } from "../../../../shared/types/ownerTenant.types";
import { styles } from "../styles/screens/FamilyMembersScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
type Props = {
    navigation: Pick<FamilyMembersScreenProps['navigation'], 'goBack'>;
    route: {
        params?: {
            unitId?: string;
        };
    };
};
export function FamilyMembersScreen({ navigation, route }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const unitId = route.params?.unitId ?? 'unit-a-1204';
    const { data: members = [], isLoading, error, refetch } = useFamilyMembers(unitId);
    if (isLoading)
        return <LoadingState />;
    if (error) {
        return (<ErrorState title={localizedUiText.m_3a6dc0d11ce3} message={localizedUiText.m_e549aac48ea0} onRetry={refetch}/>);
    }
    const getAccessBadgeType = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'INVITED': return 'warning';
            case 'DISABLED': return 'neutral';
            case 'REVOKED': return 'danger';
            default: return 'neutral';
        }
    };
    const handleMemberPress = (member: FamilyMember) => {
        AppAlert.alert(String(localizedUiText.m_7248cdf079b0), formatUiLiteral(String(localizedUiText.m_d5c48378e92b), [member.name, member.relationship, member.appAccessStatus, member.verificationStatus]), [{ text: String(localizedUiText.m_565339bc4d33) }]);
    };
    const renderMemberItem = ({ item, index }: {
        item: FamilyMember;
        index: number;
    }) => {
        return (<Animated.View entering={FadeInLeft.delay(index * 40).duration(400)}>
        <AppCard style={styles.memberCard} onPress={() => handleMemberPress(item)}>
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={Colors.primary}/>
            </View>

            <View style={styles.details}>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{item.name}</Text>
                {item.isEmergencyContact && (<View style={styles.sosBadge}>
                    <Text style={styles.sosText}>{localizedUiText.m_f8df2bea26dc}</Text>
                  </View>)}
              </View>
              <Text style={styles.relationshipText}>
                {item.relationship} · {item.ageGroup}
              </Text>
              {item.mobile ? (<Text style={styles.phoneText}>{localizedUiText.m_6a8c4e0e0703 + " "}{item.mobile}</Text>) : (<Text style={styles.noPhoneText}>{localizedUiText.m_1fe21e410157}</Text>)}
              <Text style={styles.dateText}>{localizedUiText.m_d71b0b010154 + " "}{item.moveInDate}</Text>
            </View>

            <View style={styles.badgesCol}>
              <StatusBadge label={item.appAccessStatus} type={getAccessBadgeType(item.appAccessStatus)} style={styles.badge}/>
              <StatusBadge label={item.verificationStatus} type={getKycStatusBadgeType(item.verificationStatus)} style={StyleSheet.flatten([styles.badge, styles.statusBadgeMarginTop])}/>
            </View>
          </View>
        </AppCard>
      </Animated.View>);
    };
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_ae59bb70f396} showBack onBack={() => navigation.goBack()}/>
      <FlatList data={members} renderItem={renderMemberItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ListEmptyComponent={<EmptyState title={localizedUiText.m_de8c35b0d7e4} description={localizedUiText.m_b1e1cdff4454} iconName="people-outline"/>}/>
    </SafeAreaView>);
}

