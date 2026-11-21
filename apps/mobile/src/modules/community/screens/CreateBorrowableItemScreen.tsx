import { useState } from "react";
import { Text, View, ScrollView, Switch, Pressable } from "react-native";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { useCreateBorrowableItem } from "../data/communityHooks";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/CreateBorrowableItemScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function CreateBorrowableItemScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'TOOLS' | 'BOOKS' | 'APPLIANCES' | 'SPORTS' | 'TOYS' | 'OTHERS'>('TOOLS');
    const [maxDurationDays, setMaxDurationDays] = useState('');
    const [depositRequired, setDepositRequired] = useState(false);
    const [depositDetails, setDepositDetails] = useState('');
    const { mutateAsync: createItem, isPending } = useCreateBorrowableItem();
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!title || !description || !maxDurationDays) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        try {
            await createItem({
                title,
                description,
                category,
                maxDurationDays: Number(maxDurationDays),
                depositRequired,
                ...includeWhenPresent("depositDetails", depositRequired ? depositDetails : undefined)
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_70490f9fbb8d")));
        }
    };
    const categories: ('TOOLS' | 'BOOKS' | 'APPLIANCES' | 'SPORTS' | 'TOYS' | 'OTHERS')[] = [
        'TOOLS',
        'BOOKS',
        'APPLIANCES',
        'SPORTS',
        'TOYS',
        'OTHERS',
    ];
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_b9ccae3f48e0} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        <FormField label={localizedUiText.m_8b664cebf0a5} placeholder={localizedUiText.m_f7935df38c2e} value={title} onChangeText={setTitle}/>

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

        <FormField label={localizedUiText.m_299c6df0f5a1} placeholder={localizedUiText.m_3b4ed27ace4e} value={maxDurationDays} onChangeText={setMaxDurationDays} keyboardType="numeric"/>

        
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>{localizedUiText.m_a23dd01801b9}</Text>
            <Text style={styles.toggleSublabel}>{localizedUiText.m_50097c3d46d8}</Text>
          </View>
          <Switch value={depositRequired} onValueChange={(val) => {
            setDepositRequired(val);
            if (!val)
                setDepositDetails('');
        }} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        
        {depositRequired ? (<FormField label={localizedUiText.m_f04e4b41d47a} placeholder={localizedUiText.m_b2b0b8ff0526} value={depositDetails} onChangeText={setDepositDetails}/>) : null}

        <FormField label={localizedUiText.m_056722e9d5c7} placeholder={localizedUiText.m_34a40cae8df2} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_aea8e657d026} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

