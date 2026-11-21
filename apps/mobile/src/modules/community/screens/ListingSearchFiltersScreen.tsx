import { useState } from "react";
import { Text, View, Switch, Pressable } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CommunityStackParamList } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/ListingSearchFiltersScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<CommunityStackParamList, 'ListingSearchFilters'>;
type SortOption = 'recent' | 'price_asc' | 'price_desc';
const sortOptions: readonly {
    label: string;
    value: SortOption;
}[] = [
    { get label() {
            return getActiveUiLiteral("m_7ffd1b8aed40");
        }, value: 'recent' },
    { get label() {
            return getActiveUiLiteral("m_3044c75602f0");
        }, value: 'price_asc' },
    { get label() {
            return getActiveUiLiteral("m_8abbc1606cfd");
        }, value: 'price_desc' },
];
export function ListingSearchFiltersScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [giveawayOnly, setGiveawayOnly] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const handleApply = () => {
        navigation.goBack();
    };
    const handleReset = () => {
        setMinPrice('');
        setMaxPrice('');
        setGiveawayOnly(false);
        setSelectedCondition(null);
        setSortBy('recent');
    };
    const conditions = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'];
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_546ebb8eb993} onBack={() => navigation.goBack()} rightActions={<Pressable onPress={handleReset}>
            <Text style={styles.resetText}>{localizedUiText.m_e1c518097f23}</Text>
          </Pressable>}/>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_6d2227555fcc}</Text>
        <View style={styles.sortContainer}>
          {sortOptions.map((opt) => {
            const isSelected = sortBy === opt.value;
            return (<Pressable key={opt.value} style={[styles.sortRow, isSelected && styles.sortRowSelected]} onPress={() => setSortBy(opt.value)}>
                <Text style={[styles.sortLabel, isSelected && styles.sortLabelSelected]}>
                  {opt.label}
                </Text>
              </Pressable>);
        })}
        </View>

        <View style={styles.divider}/>

        <Text style={styles.sectionTitle}>{localizedUiText.m_a8cc1abd339d}</Text>
        <View style={styles.priceRow}>
          <FormField label="" placeholder={localizedUiText.m_dea79332147f} value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={styles.priceInput}/>
          <Text style={styles.toText}>{localizedUiText.m_663ea1bfffe5}</Text>
          <FormField label="" placeholder={localizedUiText.m_a1a5936d3b0f} value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={styles.priceInput}/>
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>{localizedUiText.m_0b5c423b42c0}</Text>
            <Text style={styles.toggleSublabel}>{localizedUiText.m_f52c496c594f}</Text>
          </View>
          <Switch value={giveawayOnly} onValueChange={setGiveawayOnly} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        <View style={styles.divider}/>

        <Text style={styles.sectionTitle}>{localizedUiText.m_b83c83a95cf1}</Text>
        <View style={styles.conditionContainer}>
          {conditions.map((cond) => {
            const isSelected = selectedCondition === cond;
            return (<Pressable key={cond} style={[styles.conditionChip, isSelected && styles.conditionChipSelected]} onPress={() => setSelectedCondition(isSelected ? null : cond)}>
                <Text style={[styles.conditionChipText, isSelected && styles.conditionChipTextSelected]}>
                  {cond.replace('_', ' ')}
                </Text>
              </Pressable>);
        })}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_09b2e220c665} onPress={handleApply} variant="primary"/>
        </View>
      </View>
    </ScreenContainer>);
}

