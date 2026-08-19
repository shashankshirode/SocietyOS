import { useState, useMemo } from "react";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { AppBottomSheet } from "../../../../ui/bottomSheet/AppBottomSheet";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { SupportedCountry } from "../data/membership.types";
import { supportedCountries } from "../data/membership.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createAppTextColorFontWeightStyle, createAppTextColorStyle, createAppTextColorStyle2, createPressableBackgroundColorBorderColorStyle, createTextInputColorStyle } from "../styles/components/CountrySelectionSheet.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface CountrySelectionSheetProps {
    visible: boolean;
    selectedCountry: SupportedCountry;
    onSelect: (country: SupportedCountry) => void;
    onDismiss: () => void;
}
export function CountrySelectionSheet({ visible, selectedCountry, onSelect, onDismiss, }: CountrySelectionSheetProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [search, setSearch] = useState('');
    const filtered = useMemo(() => {
        if (!search.trim())
            return supportedCountries;
        const query = search.toLowerCase();
        return supportedCountries.filter((c) => c.displayName.toLowerCase().includes(query) ||
            c.callingCode.includes(query) ||
            c.isoCode.toLowerCase().includes(query));
    }, [search]);
    const handleCountryPress = (country: SupportedCountry) => {
        onSelect(country);
        setSearch('');
        onDismiss();
    };
    const renderItem = ({ item }: {
        item: SupportedCountry;
    }) => {
        const isSelected = item.isoCode === selectedCountry.isoCode;
        return (<Pressable style={[
                styles.itemRow,
                createPressableBackgroundColorBorderColorStyle(isSelected ? colors.primarySoft : 'transparent', isSelected ? colors.primary : 'transparent'),
            ]} onPress={() => handleCountryPress(item)}>
        <AppText style={styles.flag}>{item.flag}</AppText>
        <View style={styles.infoCol}>
          <AppText variant="body" style={createAppTextColorFontWeightStyle(colors.textPrimary, isSelected ? '600' : '400')}>
            {item.displayName}
          </AppText>
          <AppText variant="caption" style={createAppTextColorStyle(colors.textSecondary)}>
            {item.callingCode}
          </AppText>
        </View>
        {isSelected && <Ionicons name="checkmark-circle" size={18} color={colors.primary}/>}
      </Pressable>);
    };
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss}>
      <View style={styles.sheetHeader}>
        <AppText variant="h2" style={createAppTextColorStyle2(colors.textPrimary)}>{localizedUiText.m_5f3404d8b730}</AppText>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={colors.textMuted}/>
        <TextInput style={[styles.searchInput, createTextInputColorStyle(colors.textPrimary)]} placeholder={localizedUiText.m_6b9ce01aaf40} placeholderTextColor={colors.inputPlaceholder} value={search} onChangeText={setSearch} autoCapitalize="none" autoCorrect={false}/>
      </View>

      <FlatList data={filtered} keyExtractor={(item) => item.isoCode} renderItem={renderItem} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>
    </AppBottomSheet>);
}

