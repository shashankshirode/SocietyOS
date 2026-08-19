import { useState } from "react";
import { FlatList, Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { HardwareDeviceCard } from "../components/HardwareDeviceCard";
import { useHardwareDevices } from "../hooks/useHardwareDevices";
import { styles } from "../styles/screens/DeviceRegistryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function DeviceRegistryScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data: devices, isLoading } = useHardwareDevices();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredDevices = (devices || []).filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.deviceCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return (<ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary}/>
          </Pressable>
          <Text style={styles.title}>{localizedUiText.m_0aad4f473504}</Text>
          <Pressable onPress={() => navigation.navigate('RegisterHardwareDevice')} style={styles.addButton}>
            <Ionicons name="add" size={24} color={Colors.primary}/>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon}/>
          <TextInput style={styles.searchInput} placeholder={localizedUiText.m_ba095c9299be} value={searchQuery} onChangeText={setSearchQuery}/>
        </View>

        {isLoading ? (<Text style={styles.loading}>{localizedUiText.m_d772d5d146a4}</Text>) : (<FlatList data={filteredDevices} keyExtractor={item => item.id} renderItem={({ item }) => (<HardwareDeviceCard device={item} onPress={() => navigation.navigate('HardwareDeviceDetail', { deviceId: item.id })}/>)} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>{localizedUiText.m_48fa7c7a53dc}</Text>}/>)}
      </SafeAreaView>
    </ScreenContainer>);
}

