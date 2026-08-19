import { FlatList, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppCard } from "../../../shared/cards/AppCard";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { EmptyState } from "../../../shared/feedback/EmptyState";
import { useChargeHeads } from "../data/useChargeHeads";
import type { ChargeHead } from "../../../shared/types/accounting.types";
import { styles } from "../styles/screens/ChargeHeadListScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function ChargeHeadListScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: chargeHeads = [], isLoading, error } = useChargeHeads();
    const getCalculationLabel = (method: string) => {
        return method.replace('_', ' ');
    };
    const renderItem = ({ item, index }: {
        item: ChargeHead;
        index: number;
    }) => (<Animated.View entering={FadeInLeft.delay(index * 30).duration(300)}>
      <AppCard style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <StatusBadge label={item.isActive ? localizedUiText.m_630c2f1c0ee1 : localizedUiText.m_df343bd4f0bc} type={item.isActive ? 'success' : 'neutral'}/>
        </View>

        <Text style={styles.type}>{localizedUiText.m_6cc5ad2e47e3 + " "}{item.type}{" " + localizedUiText.m_23e23f26030f + " "}{getCalculationLabel(item.calculationMethod)}</Text>
        {item.description ? (<Text style={styles.desc}>{item.description}</Text>) : null}

        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>{localizedUiText.m_4f84a7bf04e8}</Text>
          <Text style={styles.value}>
            {item.defaultAmount !== undefined ? `₹${item.defaultAmount.toLocaleString()}` : `${item.defaultRate}%`}
          </Text>
        </View>
      </AppCard>
    </Animated.View>);
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_62f117c4bb29} showBack onBack={navigation.goBack}/>

      {isLoading ? (<View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary}/>
        </View>) : error ? (<EmptyState title={localizedUiText.m_5d98597971c6} description={error.message} iconName="alert-circle-outline"/>) : chargeHeads.length === 0 ? (<EmptyState title={localizedUiText.m_6525341851fc} description={localizedUiText.m_1c3e99266bb7} iconName="pricetag-outline"/>) : (<FlatList data={chargeHeads} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>)}
    </SafeAreaView>);
}

