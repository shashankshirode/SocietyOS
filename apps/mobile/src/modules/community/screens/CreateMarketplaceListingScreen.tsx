import { useState } from "react";
import { Text, View, ScrollView, Switch, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { ResponsivePageHeader } from "../../../shared/layouts/ResponsivePageHeader";
import { FormField } from "../../../shared/forms/FormField";
import { AppButton } from "../../../shared/components/AppButton";
import { getErrorMessage } from "../../../core/errors/getErrorMessage";
import { useCreateMarketplaceListing, useMarketplaceCategories } from "../data/communityHooks";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/screens/CreateMarketplaceListingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export function CreateMarketplaceListingScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [isGiveaway, setIsGiveaway] = useState(false);
    const [condition, setCondition] = useState<'NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR'>('EXCELLENT');
    const [categorySlug, setCategorySlug] = useState('');
    const { mutateAsync: createListing, isPending } = useCreateMarketplaceListing();
    const { data: categories } = useMarketplaceCategories();
    const [error, setError] = useState('');
    const handleSubmit = async () => {
        if (!title || !description || !categorySlug) {
            setError(getActiveUiLiteral("m_d1641a4df419"));
            return;
        }
        if (!isGiveaway && (!price || isNaN(Number(price)))) {
            setError(getActiveUiLiteral("m_20f8a7816154"));
            return;
        }
        try {
            await createListing({
                title,
                description,
                ...includeWhenPresent("price", isGiveaway ? undefined : Number(price)),
                isGiveaway,
                condition,
                categorySlug
            });
            navigation.goBack();
        }
        catch (err) {
            setError(getErrorMessage(err, getActiveUiLiteral("m_c5bf66554c8f")));
        }
    };
    const conditions: ('NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR')[] = [
        'NEW',
        'LIKE_NEW',
        'EXCELLENT',
        'GOOD',
        'FAIR',
    ];
    return (<ScreenContainer>
      <ResponsivePageHeader title={localizedUiText.m_71ba64b977f9} onBack={() => navigation.goBack()}/>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {error ? (<View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>) : null}

        
        <FormField label={localizedUiText.m_8b664cebf0a5} placeholder={localizedUiText.m_fd33ff60ef91} value={title} onChangeText={setTitle}/>

        
        <Text style={styles.label}>{localizedUiText.m_1539ace74940}</Text>
        <View style={styles.categoryGrid}>
          {categories?.map((cat) => {
            const isSelected = categorySlug === cat.slug;
            return (<Pressable key={cat.id} style={[styles.categoryChip, isSelected && styles.categoryChipSelected]} onPress={() => setCategorySlug(cat.slug)}>
                <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={16} color={isSelected ? '#FFF' : Colors.textPrimary}/>
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                  {cat.name}
                </Text>
              </Pressable>);
        })}
        </View>

        
        <Text style={styles.label}>{localizedUiText.m_0025c3a9b4c9}</Text>
        <View style={styles.conditionRow}>
          {conditions.map((cond) => {
            const isSelected = condition === cond;
            return (<Pressable key={cond} style={[styles.conditionChip, isSelected && styles.conditionChipSelected]} onPress={() => setCondition(cond)}>
                <Text style={[styles.conditionChipText, isSelected && styles.conditionChipTextSelected]}>
                  {cond.replace('_', ' ')}
                </Text>
              </Pressable>);
        })}
        </View>

        
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>{localizedUiText.m_977e3c2ff3eb}</Text>
            <Text style={styles.toggleSublabel}>{localizedUiText.m_e3ac5a177c88}</Text>
          </View>
          <Switch value={isGiveaway} onValueChange={(val) => {
            setIsGiveaway(val);
            if (val)
                setPrice('');
        }} trackColor={{ false: Colors.border, true: Colors.primary }}/>
        </View>

        
        {!isGiveaway ? (<FormField label={localizedUiText.m_2b20ca63a623} placeholder={localizedUiText.m_d3edec8b22d6} value={price} onChangeText={setPrice} keyboardType="numeric"/>) : null}

        
        <FormField label={localizedUiText.m_056722e9d5c7} placeholder={localizedUiText.m_cc095a137089} value={description} onChangeText={setDescription} multiline numberOfLines={4} style={styles.textArea}/>

        <View style={styles.buttonContainer}>
          <AppButton title={localizedUiText.m_cc6fd270663b} onPress={handleSubmit} variant="primary" loading={isPending}/>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

