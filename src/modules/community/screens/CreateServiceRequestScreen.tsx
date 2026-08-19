import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { useCreateServiceRequest, useResidentServices } from "../data/communityHooks";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/CreateServiceRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function CreateServiceRequestScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [budget, setBudget] = useState('');
    const [timing, setTiming] = useState('');
    const { mutateAsync: createRequest, isPending } = useCreateServiceRequest();
    const { data: services } = useResidentServices();
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!title || !description || !categorySlug) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        try {
            await createRequest({
                title,
                description,
                categorySlug,
                ...includeWhenPresent("budget", budget || undefined),
                ...includeWhenPresent("timing", timing || undefined)
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_2cc0c59d0cd7")));
        }
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_15012b4dbc07} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <FormField label={localizedUiText.m_7963642b106b} placeholder={localizedUiText.m_297c7fd67799} value={title} onChangeText={setTitle}/>

        <Text style={styles.label}>{localizedUiText.m_aba163920774}</Text>
        <View style={styles.categoryGrid}>
          {services?.map((srv) => {
            const isSelected = categorySlug === srv.slug;
            return (<Pressable key={srv.id} style={[styles.categoryChip, isSelected && styles.categoryChipSelected]} onPress={() => setCategorySlug(srv.slug)}>
                <Ionicons name={srv.icon as keyof typeof Ionicons.glyphMap} size={16} color={isSelected ? '#FFF' : Colors.textPrimary}/>
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                  {srv.name}
                </Text>
              </Pressable>);
        })}
        </View>

        <FormField label={localizedUiText.m_9333eafc0d21} placeholder={localizedUiText.m_d5b14f428f34} value={budget} onChangeText={setBudget}/>

        <FormField label={localizedUiText.m_c675b770202d} placeholder={localizedUiText.m_2a2d347794a2} value={timing} onChangeText={setTiming}/>

        <FormField label={localizedUiText.m_593d0db1b613} placeholder={localizedUiText.m_013c10d92c4a} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_15012b4dbc07} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

