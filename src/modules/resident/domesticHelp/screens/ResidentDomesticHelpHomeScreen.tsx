import { View } from "react-native";
import type { DomesticHelpHomeScreenProps } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { EmptyStatePanel } from "../../../../shared/components/EmptyStatePanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { AppScreen } from "../../../../shared/layouts/AppScreen";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { DomesticHelpProfileCard } from "../components/DomesticHelpProfileCard";
import { useResidentDomesticHelpList } from "../data/useResidentDomesticHelp";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/ResidentDomesticHelpHomeScreen.styles";
export function ResidentDomesticHelpHomeScreen({ navigation }: DomesticHelpHomeScreenProps) {
    const messages = useMessages().resident.domesticHelp;
    const { data, isLoading, error, refetch } = useResidentDomesticHelpList();
    return (<View style={styles.root}>
      <ResidentPageHeader title={messages.homeTitle} subtitle={messages.homeSubtitle}/>
      <AppScreen scroll edges={['bottom']} contentStyle={styles.content} testID="resident-domestic-help-home">
        <SafeText variant="h3">{messages.directoryTitle}</SafeText>
        <SafeText variant="body" color="secondary">{messages.directoryDescription}</SafeText>
        {isLoading ? <LoadingState message={messages.loading} showCardPlaceholder/> : null}
        {error ? (<ErrorState message={error.message} onRetry={refetch} retryLabel={messages.retry}/>) : null}
        {!isLoading && !error && data?.length === 0 ? (<EmptyStatePanel title={messages.emptyTitle} description={messages.emptyDescription} icon="people"/>) : null}
        {!isLoading && !error ? data?.map((profile) => (<DomesticHelpProfileCard key={profile.id} profile={profile} onPress={() => navigation.navigate('DomesticHelpDetail', { domesticHelpId: profile.id })}/>)) : null}
        {!isLoading && !error && data?.length ? (<AppButton title={messages.openAttendance} onPress={() => navigation.navigate('DomesticHelpAttendance', { domesticHelpId: getRequiredItem(data, 0, "ResidentDomesticHelpHomeScreen.tsx").id })} variant="outline" fullWidth/>) : null}
      </AppScreen>
    </View>);
}

