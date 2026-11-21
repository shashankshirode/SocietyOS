import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { useCreateSkillProfile, useResidentServices } from "../data/communityHooks";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/CreateSkillProfileScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function CreateSkillProfileScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillsString, setSkillsString] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [experienceYears, setExperienceYears] = useState('');
    const [availabilityHours, setAvailabilityHours] = useState('');
    const { mutateAsync: createProfile, isPending } = useCreateSkillProfile();
    const { data: services } = useResidentServices();
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!title || !description || !categorySlug || !skillsString) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        const skills = skillsString.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
        try {
            await createProfile({
                title,
                description,
                skills,
                categorySlug,
                ...includeWhenPresent("experienceYears", experienceYears ? Number(experienceYears) : undefined),
                ...includeWhenPresent("availabilityHours", availabilityHours || undefined)
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_66575f57673c")));
        }
    };
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_2987b8e8dcc5} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <FormField label={localizedUiText.m_31fc97456ba3} placeholder={localizedUiText.m_bddccd0f140a} value={title} onChangeText={setTitle}/>

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

        <FormField label={localizedUiText.m_363b0726fdab} placeholder={localizedUiText.m_9c0278b9241b} value={skillsString} onChangeText={setSkillsString}/>

        <FormField label={localizedUiText.m_dfa80a281c6c} placeholder={localizedUiText.m_8841ee8b9b8f} value={experienceYears} onChangeText={setExperienceYears} keyboardType="numeric"/>

        <FormField label={localizedUiText.m_db4651a1c0e2} placeholder={localizedUiText.m_4f2ff6507c2c} value={availabilityHours} onChangeText={setAvailabilityHours}/>

        <FormField label={localizedUiText.m_005eb8519e0d} placeholder={localizedUiText.m_eeeabae8a802} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_a4212f1e2fb0} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

