import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { AppText } from "../../../../shared/components/AppText";
import { AppCard } from "../../../../shared/cards/AppCard";
import { StatusBadge } from "../../../../shared/components/StatusBadge";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createAppTextColorStyle, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/ResidentVehicleSummaryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
export function ResidentVehicleSummaryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const vehicles = [
        { plateNumber: 'MH-12-AB-1234', type: 'Car', rfidStatus: 'ACTIVE' },
        { plateNumber: 'MH-12-CD-5678', type: 'Bike', rfidStatus: 'ACTIVE' },
    ];
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={[]}>
      <AppHeader title={localizedUiText.m_f27a870c5d49} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        {vehicles.map((v, index) => (<AppCard key={index} style={styles.card}>
            <View style={styles.row}>
              <AppText variant="body" weight="700">{v.plateNumber}</AppText>
              <StatusBadge label={v.rfidStatus} type="success"/>
            </View>
            <AppText variant="body" style={createAppTextColorStyle(colors.textSecondary)}>{localizedUiText.m_ed5c314032fa + " "}{v.type}</AppText>
          </AppCard>))}
      </ScrollView>
    </SafeAreaView>);
}

