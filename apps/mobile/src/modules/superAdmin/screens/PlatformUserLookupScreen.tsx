import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { SearchBar } from "../../../shared/lists/SearchBar";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { usePlatformUserLookup } from "../hooks/usePlatformUserLookup";
import { styles } from "../styles/screens/PlatformUserLookupScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function PlatformUserLookupScreen() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch, searchQuery, setSearchQuery } = usePlatformUserLookup();
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe}>
        <ResponsivePageHeader title={localizedUiText.m_a206732601a4} subtitle={localizedUiText.m_e810be094d27}/>
        <View style={styles.searchBar}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder={localizedUiText.m_f7b42dadccec}/>
        </View>

        {isLoading ? (<LoadingState />) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.row}>
                <View style={styles.infoCol}>
                  <Text style={styles.name}>{item.displayName}</Text>
                  <Text style={styles.society}>{item.society} • {item.role.replace(/_/g, ' ')}</Text>
                  <Text style={styles.contact}>{localizedUiText.m_17507dcf8457 + " "}{item.emailMasked}</Text>
                  <Text style={styles.contact}>{localizedUiText.m_6a8c4e0e0703 + " "}{item.mobileMasked}</Text>
                </View>
                <Text style={styles.status}>{item.status}</Text>
              </View>)} ListEmptyComponent={<EmptyState title={localizedUiText.m_bf1e104fb3c8} description={localizedUiText.m_b4038d14a240}/>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

