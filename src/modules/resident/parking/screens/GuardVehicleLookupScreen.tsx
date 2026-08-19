import React from "react";
import { FlatList, Text, View } from "react-native";
import { FormField } from "../../../../shared/forms/FormField";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../../shared/feedback/EmptyState";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { StatusBadge, getParkingBadgeType } from "../../../../shared/components/StatusBadge";
import { useGuardVehicleLookup } from "../data/useGuardVehicleLookup";
import { DetailRow, labelize, ParkingScreen, WarningText } from "../components/ParkingUi";
import type { GuardVehicleLookupScreenProps } from "../../../../app/navigation/navigation.types";
import type { GuardVehicleLookupResult } from "../../../../shared/types/vehicle.types";
import { styles } from "../styles/screens/GuardVehicleLookupScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function GuardVehicleLookupScreen({ navigation }: GuardVehicleLookupScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [query, setQuery] = React.useState('');
    const [submittedQuery, setSubmittedQuery] = React.useState('');
    const [errorText, setErrorText] = React.useState('');
    const { data = [], isLoading, error, refetch } = useGuardVehicleLookup(submittedQuery);
    function handleSearch() {
        if (!query.trim()) {
            setErrorText(getActiveUiLiteral("m_db0c2afe0319"));
            return;
        }
        setErrorText('');
        setSubmittedQuery(query);
    }
    return (<ParkingScreen title={localizedUiText.m_fe428a3493c6} subtitle={localizedUiText.m_49e2986185d3} onBack={navigation.goBack}>
      <WarningText>{localizedUiText.m_7ec6450a8a3e}</WarningText>
      <FormField label={localizedUiText.m_49c266baaaa7} value={query} onChangeText={setQuery} placeholder={localizedUiText.m_8bd8d0209624} error={errorText}/>
      <AppButton title={localizedUiText.m_96c475ddd9a3} onPress={handleSearch}/>
      {isLoading && submittedQuery ? <LoadingState message={localizedUiText.m_5ed852f856c8}/> : null}
      {error ? <ErrorState message={error.message} onRetry={refetch}/> : null}
      <FlatList data={data} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={submittedQuery ? (<EmptyState title={localizedUiText.m_edc615c15b8f} description={localizedUiText.m_5daf063a64b2} iconName="search-outline"/>) : null} renderItem={({ item }) => <LookupCard result={item}/>}/>
    </ParkingScreen>);
}
function LookupCard({ result }: {
    result: GuardVehicleLookupResult;
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{result.vehicleNumber}</Text>
          <Text style={styles.meta}>{labelize(result.vehicleType)} · {result.linkedFlat}</Text>
        </View>
        <StatusBadge label={labelize(result.verificationStatus)} type={getParkingBadgeType(result.verificationStatus)}/>
      </View>
      {result.watchlistWarning ? <WarningText>{result.watchlistWarning}</WarningText> : null}
      <DetailRow label={localizedUiText.m_280eda6fb8fa} value={result.residentName}/>
      <DetailRow label={localizedUiText.m_56e17b82763a} value={result.parkingSlotNumber ?? getActiveUiLiteral("m_9ea56193b0e7")}/>
      <DetailRow label={localizedUiText.m_26ccd0a5cb4b} value={labelize(result.stickerStatus)}/>
      <DetailRow label={localizedUiText.m_97fb5108078b} value={labelize(result.rfidStatus)}/>
      <DetailRow label={localizedUiText.m_05bd2c54d5a5} value={result.recentEntryStatus}/>
      <View style={styles.actions}>
        <AppButton title={localizedUiText.m_be03b39754d0} onPress={() => undefined} variant="secondary" compact/>
        <AppButton title={localizedUiText.m_2753d8f0121e} onPress={() => undefined} variant="danger" compact/>
        <AppButton title={localizedUiText.m_8beb178da754} onPress={() => undefined} variant="ghost" compact/>
        <AppButton title={localizedUiText.m_ef3be64563b0} onPress={() => undefined} variant="ghost" compact/>
      </View>
    </AppCard>);
}

