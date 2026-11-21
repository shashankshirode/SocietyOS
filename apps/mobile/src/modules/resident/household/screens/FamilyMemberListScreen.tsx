import { View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { FamilyMemberCard } from "../components/FamilyMemberCard";
import { useFamilyMembers } from "../hooks/useFamilyMembers";
import { HouseholdEmptyState, HouseholdErrorScreen, HouseholdLoadingScreen, HouseholdScreenLayout, useHouseholdMessages } from "./HouseholdScreenLayout";
import { styles } from "../styles/screens/FamilyMemberListScreen.styles";
type Props = NativeStackScreenProps<HomeStackParamList, 'FamilyMemberList'>;
export function FamilyMemberListScreen({ navigation }: Props) {
    const { data, isLoading, error, refetch } = useFamilyMembers();
    const { text } = useHouseholdMessages();
    if (isLoading) {
        return <HouseholdLoadingScreen titleKey="resident.navigation.familyMembers.title" subtitleKey="resident.navigation.familyMembers.subtitle"/>;
    }
    if (error) {
        return <HouseholdErrorScreen titleKey="resident.navigation.familyMembers.title" subtitleKey="resident.navigation.familyMembers.subtitle" onRetry={refetch}/>;
    }
    return (<HouseholdScreenLayout titleKey="resident.navigation.familyMembers.title" subtitleKey="resident.navigation.familyMembers.subtitle">
      <AppButton title={text('resident.household.profile.actions.addFamilyMember')} onPress={() => navigation.navigate('AddFamilyMember')}/>
      <View style={styles.list}>
        {data.length === 0 ? (<HouseholdEmptyState titleKey="resident.family.emptyTitle" descriptionKey="resident.family.emptyDescription"/>) : (data.map((member) => (<FamilyMemberCard key={member.id} member={member} onPress={() => navigation.navigate('FamilyMemberDetail', { familyMemberId: member.id })}/>)))}
      </View>
    </HouseholdScreenLayout>);
}
export default FamilyMemberListScreen;

