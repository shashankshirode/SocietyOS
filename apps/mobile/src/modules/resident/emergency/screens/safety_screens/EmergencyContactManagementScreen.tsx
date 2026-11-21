import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useEmergencyContacts } from "../../data/useEmergencyContacts";
import { LoadingState } from "../../../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { EmergencyContactCard } from "../../components/EmergencyContactCard";
import type { EmergencyContactRelationship } from "../../../../../shared/types/emergency.types";
import { styles } from "../../styles/screens/safety_screens/EmergencyContactManagementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyContactManagement'>;
export function EmergencyContactManagementScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, addContact, removeContact, refetch } = useEmergencyContacts();
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState<EmergencyContactRelationship>('FAMILY');
    const [mobileNumber, setMobileNumber] = useState('');
    const [priority,] = useState('1');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!name.trim())
            temp.name = getActiveUiLiteral("m_e9b86a62317e");
        if (!mobileNumber.trim() || mobileNumber.length !== 10) {
            temp.mobileNumber = getActiveUiLiteral("m_dbd208a6f663");
        }
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleAdd = async () => {
        if (!validate())
            return;
        try {
            await addContact({
                name,
                relationship,
                mobileNumber,
                priority: parseInt(priority, 10) || 1,
                notifyForAll: true,
                notifyForSeniorOnly: false,
                consentConfirmed: true,
            });
            setName('');
            setMobileNumber('');
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_1be6c8b14d72));
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_2b1bad116001));
        }
    };
    const handleDelete = (contactId: string, contactName: string) => {
        AppAlert.alert(String(localizedUiText.m_326d43c1ecee), formatUiLiteral(String(localizedUiText.m_9d7980c3d761), [contactName]), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            {
                text: String(localizedUiText.m_e2d0a54968ea),
                style: 'destructive',
                onPress: async () => {
                    await removeContact(contactId);
                    AppAlert.alert(String(localizedUiText.m_b48ff39c2e0f), String(localizedUiText.m_5ddb6c7cab71));
                }
            }
        ]);
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_4cfb4a053c2d}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    return (<ScreenContainer style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} contentContainerStyle={styles.scroll} renderItem={({ item }) => (<EmergencyContactCard contact={item} onPress={() => handleDelete(item.id, item.name)}/>)} ListHeaderComponent={<View>
            <Text style={styles.title}>{localizedUiText.m_06eaf514bc71}</Text>
            <Text style={styles.subtitle}>{localizedUiText.m_fc261bc188cc}</Text>

            <View style={styles.form}>
              <Text style={styles.formTitle}>{localizedUiText.m_6cf080b245a1}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{localizedUiText.m_862fead051be}</Text>
                <TextInput style={[styles.input, errors.name && styles.inputError]} placeholder={localizedUiText.m_aba86a948019} value={name} onChangeText={setName}/>
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{localizedUiText.m_40ea7b74fdcd}</Text>
                <TextInput style={styles.input} placeholder={localizedUiText.m_7bb037bfef83} value={relationship} onChangeText={val => setRelationship(val as EmergencyContactRelationship)}/>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{localizedUiText.m_90da80bbab87}</Text>
                <TextInput style={[styles.input, errors.mobileNumber && styles.inputError]} placeholder={localizedUiText.m_77290962379c} keyboardType="phone-pad" maxLength={10} value={mobileNumber} onChangeText={setMobileNumber}/>
                {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber}</Text>}
              </View>

              <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]} onPress={handleAdd}>
                <Text style={styles.addBtnText}>{localizedUiText.m_aeb71d6de03b}</Text>
              </Pressable>
            </View>

            <Text style={styles.listTitle}>{localizedUiText.m_227fe2f22b96}{(data)?.length || 0})</Text>
          </View>} ListEmptyComponent={<View style={styles.empty}>
            <Text style={styles.emptyText}>{localizedUiText.m_6376e1c09d92}</Text>
          </View>}/>
    </ScreenContainer>);
}

