import { useState, useMemo } from "react";
import { View, ScrollView, Pressable, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMyVehicles } from "../data/useMyVehicles";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { MyVehiclesScreenProps } from "../../../../app/navigation/navigation.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createTextInputColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBottomStyle, createPressableScaleBackgroundColorStyle } from "../styles/screens/MyVehiclesScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'ALL' | 'CAR' | 'TWO_WHEELER';
export function MyVehiclesScreen({ navigation, route }: MyVehiclesScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const insets = useSafeAreaInsets();
    const { unitId } = route.params;
    const { data: vehicles = [] } = useMyVehicles(unitId);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [search, setSearch] = useState('');
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            const matchSearch = v.vehicleNumber.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'ALL' || v.vehicleType === filter;
            return matchSearch && matchFilter;
        });
    }, [vehicles, filter, search]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_51678bdbc5aa) },
        { key: 'CAR', label: String(localizedUiText.m_9e499e4cdaf4) },
        { key: 'TWO_WHEELER', label: String(localizedUiText.m_23a7924cd282) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_497abe79cafa}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <Ionicons name="search-outline" size={16} color={theme.textSecondary}/>
            <TextInput value={search} onChangeText={setSearch} placeholder={localizedUiText.m_47d159240974} placeholderTextColor={theme.textSecondary} style={[styles.searchInput, createTextInputColorStyle(theme.textPrimary)]}/>
          </View>
        </View>

        
        <View style={styles.filterBar}>
          <WrapRow gap={8}>
            {chips.map((chip) => {
            const isSelected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                  <SafeText variant="tiny" style={createSafeTextColorStyle(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                    {chip.label}
                  </SafeText>
                </Pressable>);
        })}
          </WrapRow>
        </View>

        
        <View style={styles.list}>
          {filteredVehicles.map((vehicle) => (<PressableScale key={vehicle.id} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: vehicle.id })}>
              <View style={[styles.card, createViewBackgroundColorBorderColorStyle2(theme.surface, theme.border)]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle2(theme.accentSoft)]}>
                    <Ionicons name={vehicle.vehicleType === 'CAR' ? 'car-outline' : 'bicycle-outline'} size={20} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(theme.textPrimary)}>
                      {vehicle.vehicleNumber}
                    </SafeText>
                    <SafeText variant="tiny" color="muted">
                      {vehicle.makeModel} • {vehicle.color}
                    </SafeText>
                  </View>
                  <StatusPill label={vehicle.verificationStatus} tone={vehicle.verificationStatus === 'VERIFIED' ? 'success' : 'warning'} small/>
                </View>

                <View style={[styles.divider, createViewBackgroundColorStyle3(theme.border)]}/>

                <View style={styles.footer}>
                  <SafeText variant="tiny" color="secondary">{localizedUiText.m_6ade7afbc2f3}{vehicle.parkingSlotNumber || localizedUiText.m_1e31d9596d67}{" " + localizedUiText.m_6c6d99068d01 + " "}{vehicle.stickerStatus}
                  </SafeText>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                </View>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>

      
      <View style={[styles.fabContainer, createViewBottomStyle(insets.bottom + 16)]}>
        <PressableScale onPress={() => navigation.navigate('AddVehicle', { unitId })} style={[styles.fab, createPressableScaleBackgroundColorStyle(theme.accent)]}>
          <Ionicons name="add" size={24} color="#FFFFFF"/>
        </PressableScale>
      </View>
    </View>);
}
export default MyVehiclesScreen;

