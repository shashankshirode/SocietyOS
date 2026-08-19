import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { Colors } from "../../../shared/constants/colors";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppButton } from "../../../shared/components/AppButton";
import { AppHeader } from "../../../shared/components/AppHeader";
import { InfoRow } from "../../../shared/components/InfoRow";
import type { QuickEntryScreenProps } from "../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/QuickEntryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { formatUiLiteral } from "../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type EntryCategory = 'DELIVERY' | 'CAB' | 'VENDOR' | 'MATERIAL';
export function QuickEntryScreen({ navigation }: QuickEntryScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const [category, setCategory] = useState<EntryCategory>('DELIVERY');
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [partner, setPartner] = useState('Amazon');
    const [deliveryFlat, setDeliveryFlat] = useState('');
    const [packages, setPackages] = useState('1');
    const [cabProvider, setCabProvider] = useState('Uber');
    const [cabVehicle, setCabVehicle] = useState('');
    const [cabFlat, setCabFlat] = useState('');
    const [vendorCompany, setVendorCompany] = useState('');
    const [vendorName, setVendorName] = useState('');
    const [vendorFlat, setVendorFlat] = useState('');
    const [materialType, setMaterialType] = useState('');
    const [materialVehicle, setMaterialVehicle] = useState('');
    const [materialQty, setMaterialQty] = useState('');
    const entryTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const handleSubmit = () => {
        const nextErrors: Record<string, string> = {};
        if (category === 'DELIVERY') {
            if (!deliveryFlat.trim())
                nextErrors.deliveryFlat = getActiveUiLiteral("m_bea2854b6aa8");
            if (!packages.trim() || isNaN(parseInt(packages, 10)) || parseInt(packages, 10) < 1) {
                nextErrors.packages = getActiveUiLiteral("m_7833d0c270a1");
            }
        }
        else if (category === 'CAB') {
            if (!cabVehicle.trim())
                nextErrors.cabVehicle = getActiveUiLiteral("m_c41a6490bd4b");
            if (!cabFlat.trim())
                nextErrors.cabFlat = getActiveUiLiteral("m_bea2854b6aa8");
        }
        else if (category === 'VENDOR') {
            if (!vendorCompany.trim())
                nextErrors.vendorCompany = getActiveUiLiteral("m_2013910ec6d1");
            if (!vendorName.trim())
                nextErrors.vendorName = getActiveUiLiteral("m_5ce3aa8f145c");
            if (!vendorFlat.trim())
                nextErrors.vendorFlat = getActiveUiLiteral("m_15388caac2d0");
        }
        else if (category === 'MATERIAL') {
            if (!materialType.trim())
                nextErrors.materialType = getActiveUiLiteral("m_29e66e2fc2e3");
            if (!materialVehicle.trim())
                nextErrors.materialVehicle = getActiveUiLiteral("m_b6406e3f8560");
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }
        setErrors({});
        setIsSuccess(true);
    };
    const handleDone = () => {
        navigation.popToTop();
    };
    const renderDeliveryForm = () => (<View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_98893dd80a23}</Text>
        <View style={styles.partnerRow}>
          {['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Blinkit'].map((p) => {
            const active = partner === p;
            return (<Pressable key={p} style={[styles.partnerChip, active && styles.partnerChipActive]} onPress={() => setPartner(p)}>
                <Text style={[styles.partnerChipText, active && styles.partnerChipTextActive]}>
                  {p}
                </Text>
              </Pressable>);
        })}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_7c9bdb179535}</Text>
        <TextInput value={deliveryFlat} onChangeText={(text) => {
            setDeliveryFlat(text);
            if (errors.deliveryFlat)
                setErrors({ ...errors, deliveryFlat: '' });
        }} placeholder={localizedUiText.m_ee30e7b261bc} style={[styles.textInput, errors.deliveryFlat ? styles.inputError : styles.textInput2]}/>
        {errors.deliveryFlat ? <Text style={styles.errorText}>{errors.deliveryFlat}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_be26a018c183}</Text>
        <TextInput value={packages} onChangeText={(text) => {
            setPackages(text);
            if (errors.packages)
                setErrors({ ...errors, packages: '' });
        }} placeholder="1" keyboardType="number-pad" style={[styles.textInput, errors.packages ? styles.inputError : styles.textInput3]}/>
        {errors.packages ? <Text style={styles.errorText}>{errors.packages}</Text> : null}
      </View>
    </View>);
    const renderCabForm = () => (<View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_6e84abeefa4c}</Text>
        <View style={styles.partnerRow}>
          {['Uber', 'Ola', 'Rapido', 'Private'].map((p) => {
            const active = cabProvider === p;
            return (<Pressable key={p} style={[styles.partnerChip, active && styles.partnerChipActive]} onPress={() => setCabProvider(p)}>
                <Text style={[styles.partnerChipText, active && styles.partnerChipTextActive]}>
                  {p}
                </Text>
              </Pressable>);
        })}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_200ef042ec7b}</Text>
        <TextInput value={cabVehicle} onChangeText={(text) => {
            setCabVehicle(text);
            if (errors.cabVehicle)
                setErrors({ ...errors, cabVehicle: '' });
        }} placeholder={localizedUiText.m_3e8b69fe0f5a} autoCapitalize="characters" style={[styles.textInput, errors.cabVehicle ? styles.inputError : styles.textInput4]}/>
        {errors.cabVehicle ? <Text style={styles.errorText}>{errors.cabVehicle}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_7c9bdb179535}</Text>
        <TextInput value={cabFlat} onChangeText={(text) => {
            setCabFlat(text);
            if (errors.cabFlat)
                setErrors({ ...errors, cabFlat: '' });
        }} placeholder={localizedUiText.m_fd8dfa0cede5} style={[styles.textInput, errors.cabFlat ? styles.inputError : styles.textInput5]}/>
        {errors.cabFlat ? <Text style={styles.errorText}>{errors.cabFlat}</Text> : null}
      </View>
    </View>);
    const renderVendorForm = () => (<View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_89563e481242}</Text>
        <TextInput value={vendorCompany} onChangeText={(text) => {
            setVendorCompany(text);
            if (errors.vendorCompany)
                setErrors({ ...errors, vendorCompany: '' });
        }} placeholder={localizedUiText.m_e7aa4560ccea} style={[styles.textInput, errors.vendorCompany ? styles.inputError : styles.textInput6]}/>
        {errors.vendorCompany ? <Text style={styles.errorText}>{errors.vendorCompany}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_6e801726b60a}</Text>
        <TextInput value={vendorName} onChangeText={(text) => {
            setvendorName(text);
            if (errors.vendorName)
                setErrors({ ...errors, vendorName: '' });
        }} placeholder={localizedUiText.m_a840fdff9106} style={[styles.textInput, errors.vendorName ? styles.inputError : styles.textInput7]}/>
        {errors.vendorName ? <Text style={styles.errorText}>{errors.vendorName}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_81e8d8145dc0}</Text>
        <TextInput value={vendorFlat} onChangeText={(text) => {
            setvendorFlat(text);
            if (errors.vendorFlat)
                setErrors({ ...errors, vendorFlat: '' });
        }} placeholder={localizedUiText.m_98bac304b2a4} style={[styles.textInput, errors.vendorFlat ? styles.inputError : styles.textInput8]}/>
        {errors.vendorFlat ? <Text style={styles.errorText}>{errors.vendorFlat}</Text> : null}
      </View>
    </View>);
    const renderMaterialForm = () => (<View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_3a4996e1c4f3}</Text>
        <TextInput value={materialType} onChangeText={(text) => {
            setMaterialType(text);
            if (errors.materialType)
                setErrors({ ...errors, materialType: '' });
        }} placeholder={localizedUiText.m_7fb24b73b7ea} style={[styles.textInput, errors.materialType ? styles.inputError : styles.textInput9]}/>
        {errors.materialType ? <Text style={styles.errorText}>{errors.materialType}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_a2ff585319c8}</Text>
        <TextInput value={materialVehicle} onChangeText={(text) => {
            setMaterialVehicle(text);
            if (errors.materialVehicle)
                setErrors({ ...errors, materialVehicle: '' });
        }} placeholder={localizedUiText.m_79a2f5c18c64} autoCapitalize="characters" style={[styles.textInput, errors.materialVehicle ? styles.inputError : styles.textInput10]}/>
        {errors.materialVehicle ? <Text style={styles.errorText}>{errors.materialVehicle}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>{localizedUiText.m_54cea52cf303}</Text>
        <TextInput value={materialQty} onChangeText={setMaterialQty} placeholder={localizedUiText.m_516814958803} style={styles.textInput}/>
      </View>
    </View>);
    const setvendorName = (name: string) => {
        setVendorName(name);
    };
    const setvendorFlat = (flat: string) => {
        setVendorFlat(flat);
    };
    const getSuccessSummary = () => {
        if (category === 'DELIVERY') {
            return (<AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{localizedUiText.m_306d538d6850}</Text>
          <InfoRow label={localizedUiText.m_13b120a637ca} value={partner}/>
          <InfoRow label={localizedUiText.m_7ebc765e1de9} value={deliveryFlat}/>
          <InfoRow label={localizedUiText.m_dc37fb59bee6} value={packages}/>
          <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime} isLast/>
        </AppCard>);
        }
        else if (category === 'CAB') {
            return (<AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{localizedUiText.m_b0fcb673ef6b}</Text>
          <InfoRow label={localizedUiText.m_3aedfa9340bc} value={cabProvider}/>
          <InfoRow label={localizedUiText.m_2861a6989dc2} value={cabVehicle}/>
          <InfoRow label={localizedUiText.m_7ebc765e1de9} value={cabFlat}/>
          <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime} isLast/>
        </AppCard>);
        }
        else if (category === 'VENDOR') {
            return (<AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{localizedUiText.m_ecbe47ec4117}</Text>
          <InfoRow label={localizedUiText.m_0261c166e632} value={vendorCompany}/>
          <InfoRow label={localizedUiText.m_524540a60d1c} value={vendorName}/>
          <InfoRow label={localizedUiText.m_4d40e072a45e} value={vendorFlat}/>
          <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime} isLast/>
        </AppCard>);
        }
        else {
            return (<AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{localizedUiText.m_cac28ad2f69e}</Text>
          <InfoRow label={localizedUiText.m_f3a896df75d8} value={materialType}/>
          <InfoRow label={localizedUiText.m_2861a6989dc2} value={materialVehicle}/>
          {materialQty ? <InfoRow label={localizedUiText.m_6228f785d252} value={materialQty}/> : null}
          <InfoRow label={localizedUiText.m_294ef7803b6f} value={entryTime} isLast/>
        </AppCard>);
        }
    };
    if (isSuccess) {
        return (<SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.successContainer}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.successIconOuter}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.success}/>
          </Animated.View>
          <Text style={styles.successTitle}>{localizedUiText.m_b563f897a6e0}</Text>
          <Text style={styles.successSubtitle}>
            {category}{" " + localizedUiText.m_f6800a012e19 + " "}{entryTime}.
          </Text>

          {getSuccessSummary()}

          <AppButton title={localizedUiText.m_6ac30e7d74f4} onPress={handleDone} variant="primary" fullWidth style={styles.doneBtn}/>
        </View>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader title={localizedUiText.m_ccb62ff3dec4} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <Animated.View entering={FadeInUp.duration(400)} style={styles.tabContainer}>
          {(['DELIVERY', 'CAB', 'VENDOR', 'MATERIAL'] as EntryCategory[]).map((tab) => {
            const active = category === tab;
            return (<Pressable key={tab} style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={() => {
                    setCategory(tab);
                    setErrors({});
                }}>
                <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>
                  {tab}
                </Text>
              </Pressable>);
        })}
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(100).duration(450)}>
          <AppCard style={styles.formCard}>
            {category === 'DELIVERY' && renderDeliveryForm()}
            {category === 'CAB' && renderCabForm()}
            {category === 'VENDOR' && renderVendorForm()}
            {category === 'MATERIAL' && renderMaterialForm()}
          </AppCard>
        </Animated.View>

        
        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppButton title={formatUiLiteral(localizedUiText.m_a94404ca8d1b, [category])} onPress={handleSubmit} variant="primary" fullWidth style={styles.submitBtn}/>
        </Animated.View>

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

