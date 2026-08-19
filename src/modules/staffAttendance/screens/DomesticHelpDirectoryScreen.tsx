import { useState } from "react";
import { View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useDomesticHelpDirectory } from "../data/useDomesticHelpDirectory";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { DomesticHelpCard } from "../components/DomesticHelpCard";
import type { DomesticHelpType } from "../../../shared/types/domesticHelp.types";
import { styles } from "../styles/screens/DomesticHelpDirectoryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'DomesticHelpDirectory'>;
const categories: {
    label: string;
    value: DomesticHelpType | 'ALL';
}[] = [
    { get label() {
            return getActiveUiLiteral("m_a52ace420f21");
        }, value: 'ALL' },
    { get label() {
            return getActiveUiLiteral("m_8d1706486dbf");
        }, value: 'MAID' },
    { get label() {
            return getActiveUiLiteral("m_a889a400ef55");
        }, value: 'COOK' },
    { get label() {
            return getActiveUiLiteral("m_e818cee514e1");
        }, value: 'DRIVER' },
    { get label() {
            return getActiveUiLiteral("m_92a2e011a91a");
        }, value: 'NANNY' },
    { get label() {
            return getActiveUiLiteral("m_153ce55fd88a");
        }, value: 'CARETAKER' },
];
export function DomesticHelpDirectoryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<DomesticHelpType | 'ALL'>('ALL');
    const filters = {
        search,
        ...(selectedType !== 'ALL' && { type: selectedType }),
    };
    const { data, isLoading, error, refetch } = useDomesticHelpDirectory(filters);
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_014e23c6a8c6}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_6f3f66a71344}</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.neutral}/>
        <TextInput style={styles.searchInput} placeholder={localizedUiText.m_47ca8e00e157} value={search} onChangeText={setSearch}/>
        {search.length > 0 && (<Pressable onPress={() => setSearch('')}>
            <Ionicons name="close" size={18} color={Colors.neutral}/>
          </Pressable>)}
      </View>

      <View style={styles.filtersContainer}>
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={item => item.value} renderItem={({ item }) => {
            const active = selectedType === item.value;
            return (<Pressable style={[styles.filterChip, active && styles.activeChip]} onPress={() => setSelectedType(item.value)}>
                <Text style={[styles.chipText, active && styles.activeChipText]}>{item.label}</Text>
              </Pressable>);
        }} contentContainerStyle={styles.chipsContent} extraData={localizedUiText}/>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_f7ddddb95d78}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<FlatList data={data} keyExtractor={item => item.id} renderItem={({ item }) => (<DomesticHelpCard help={item} onPress={() => navigation.navigate('DomesticHelpDetail', { domesticHelpId: item.id })}/>)} contentContainerStyle={styles.listContent} ListEmptyComponent={<View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color={Colors.neutral}/>
              <Text style={styles.emptyText}>{localizedUiText.m_a7a6dd6b0b2a}</Text>
            </View>} extraData={localizedUiText}/>)}
    </ScreenContainer>);
}

