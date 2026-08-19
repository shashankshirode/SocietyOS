import { useState } from "react";
import { Text, View, ScrollView, Pressable } from "react-native";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { useCreateLostFoundReport } from "../data/communityHooks";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/CreateLostFoundReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function CreateLostFoundReportScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'LOST' | 'FOUND'>('LOST');
    const [category, setCategory] = useState<'ELECTRONICS' | 'KEYS' | 'WALLETS' | 'DOCUMENTS' | 'PETS' | 'OTHERS'>('KEYS');
    const [location, setLocation] = useState('');
    const [dateHappened, setDateHappened] = useState(getRequiredItem(new Date().toISOString().split('T'), 0, "CreateLostFoundReportScreen.tsx"));
    const { mutateAsync: createReport, isPending } = useCreateLostFoundReport();
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!title || !description || !location) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        try {
            await createReport({
                title: `${type === 'LOST' ? String(localizedUiText.m_51e1357de85b) : String(localizedUiText.m_b0ee315f4ac6)}: ${title}`,
                description,
                type,
                category,
                location,
                dateHappened: new Date(dateHappened).toISOString(),
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_4fd65ff8fec4")));
        }
    };
    const categories: ('ELECTRONICS' | 'KEYS' | 'WALLETS' | 'DOCUMENTS' | 'PETS' | 'OTHERS')[] = [
        'KEYS',
        'WALLETS',
        'ELECTRONICS',
        'DOCUMENTS',
        'PETS',
        'OTHERS',
    ];
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_572e12b24269} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <Text style={styles.label}>{localizedUiText.m_eb48fc09a29a}</Text>
        <View style={styles.typeRow}>
          <Pressable style={[styles.typeButton, type === 'LOST' && styles.typeButtonLostActive]} onPress={() => setType('LOST')}>
            <Text style={[styles.typeButtonText, type === 'LOST' && styles.typeButtonTextActive]}>{localizedUiText.m_b242034a1859}</Text>
          </Pressable>
          <Pressable style={[styles.typeButton, type === 'FOUND' && styles.typeButtonFoundActive]} onPress={() => setType('FOUND')}>
            <Text style={[styles.typeButtonText, type === 'FOUND' && styles.typeButtonTextActive]}>{localizedUiText.m_bc3c589e4a22}</Text>
          </Pressable>
        </View>

        <FormField label={localizedUiText.m_3760b8f10d3d} placeholder={localizedUiText.m_586b596c2661} value={title} onChangeText={setTitle}/>

        <Text style={styles.label}>{localizedUiText.m_1539ace74940}</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (<Pressable key={cat} style={[styles.categoryChip, isSelected && styles.categoryChipSelected]} onPress={() => setCategory(cat)}>
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                  {cat}
                </Text>
              </Pressable>);
        })}
        </View>

        <FormField label={type === 'LOST' ? localizedUiText.m_a66f17aad246 : localizedUiText.m_c795e3c0479f} placeholder={localizedUiText.m_a7688b598437} value={location} onChangeText={setLocation}/>

        <FormField label={localizedUiText.m_c218c8b08e3a} placeholder={localizedUiText.m_6c48580bf8e9} value={dateHappened} onChangeText={setDateHappened}/>

        <FormField label={localizedUiText.m_593d0db1b613} placeholder={type === 'LOST'
            ? localizedUiText.m_06e5d290b108 : localizedUiText.m_8924a6ff66db} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={type === 'LOST' ? localizedUiText.m_7b6c6104998b : localizedUiText.m_81278f692711} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

