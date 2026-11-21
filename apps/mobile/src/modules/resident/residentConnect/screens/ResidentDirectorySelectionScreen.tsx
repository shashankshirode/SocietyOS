import { useMemo, useState } from "react";
import { Pressable, SectionList, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ChatStackParamList } from "../../../../app/navigation/navigation.types";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { SearchInputBar } from "../../../../shared/components/SearchInputBar";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../../ui/bottomSheet/AppBottomSheet";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { ListSkeleton } from "../../../../ui/loading/ListSkeleton";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import type { ResidentDirectoryProfile, ResidentDirectoryUnit } from "../domain/residentContact.types";
import { useResidentDirectory } from "../hooks/useResidentContactData";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle4, createPressableBorderColorBackgroundColorStyle, createViewBackgroundColorStyle5 } from "../styles/screens/ResidentDirectorySelectionScreen.styles";
type Props = NativeStackScreenProps<ChatStackParamList, 'ResidentDirectorySelection'>;
export function ResidentDirectorySelectionScreen({ navigation }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const copy = messages.resident.residentConnect;
    const { isEnabled } = useFeatureFlags();
    const [query, setQuery] = useState('');
    const [selectedUnit, setSelectedUnit] = useState<ResidentDirectoryUnit | null>(null);
    const [selectedResident, setSelectedResident] = useState<ResidentDirectoryProfile | null>(null);
    const { data: groups = [], isLoading, error, refetch } = useResidentDirectory(query);
    const sections = useMemo(() => groups.map((group) => ({
        title: `${group.towerOrWing} · ${group.floorLabel}`,
        data: group.units,
    })), [groups]);
    const openApproval = (unit: ResidentDirectoryUnit) => {
        setSelectedUnit(unit);
        setSelectedResident(unit.residents.length === 1 ? getRequiredItem(unit.residents, 0, "ResidentDirectorySelectionScreen.tsx") : null);
    };
    const closeApproval = () => {
        setSelectedUnit(null);
        setSelectedResident(null);
    };
    const continueToRequest = () => {
        if (!selectedResident)
            return;
        const residentProfileId = selectedResident.residentProfileId;
        closeApproval();
        navigation.navigate('NewResidentContactRequest', { residentProfileId });
    };
    if (!isEnabled('privacyDirectory')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}>
        <ResidentPageHeader title={copy.directory.title} subtitle={copy.directory.subtitle} showBackButton/>
        <ScreenEmptyState title={copy.directory.unavailableTitle} description={copy.directory.unavailableDescription} iconName="lock-closed-outline"/>
      </View>);
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]}>
      <ResidentPageHeader title={copy.directory.title} subtitle={copy.directory.subtitle} showBackButton/>
      <ContentFrame style={styles.searchContainer}>
        <SearchInputBar value={query} onChangeText={setQuery} placeholder={copy.directory.searchPlaceholder}/>
      </ContentFrame>
      {isLoading ? (<ContentFrame><ListSkeleton count={6}/></ContentFrame>) : error ? (<ScreenErrorState title={copy.directory.errorTitle} message={copy.directory.errorDescription} onRetry={refetch}/>) : sections.length === 0 ? (<ScreenEmptyState title={query.trim() ? copy.directory.noResultsTitle : copy.directory.noResidentsTitle} description={query.trim() ? copy.directory.noResultsDescription : copy.directory.noResidentsDescription} iconName="people-outline"/>) : (<SectionList sections={sections} keyExtractor={(unit) => unit.unitId} stickySectionHeadersEnabled keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list} renderSectionHeader={({ section }) => (<View style={[styles.sectionHeader, createViewBackgroundColorStyle3(colors.background)]}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>{section.title}</SafeText>
            </View>)} renderItem={({ item }) => (<Pressable onPress={() => openApproval(item)} accessibilityRole="button" accessibilityLabel={copy.directory.openUnitAccessibility(item.flatNumber)} style={[styles.unitCard, createPressableBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
              <View style={[styles.avatar, createViewBackgroundColorStyle4(colors.primarySoft)]}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle2(colors.primary)}>{item.flatNumber.slice(0, 2)}</SafeText>
              </View>
              <View style={styles.unitDetails}>
                <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(colors.textPrimary)}>{item.flatNumber}</SafeText>
                {item.residents.slice(0, 2).map((resident) => (<SafeText key={resident.residentProfileId} variant="caption" style={createSafeTextColorStyle4(colors.textSecondary)} numberOfLines={1}>
                    {resident.displayNameVisible ? resident.displayName : copy.directory.maskedResident} · {resident.occupancyLabel}
                  </SafeText>))}
                {item.residents.length > 2 ? (<SafeText variant="tiny" style={createSafeTextColorStyle5(colors.textMuted)}>{copy.directory.residentsAvailable(item.residents.length)}</SafeText>) : null}
              </View>
              <View style={styles.availability}>
                <Ionicons name="shield-checkmark-outline" size={17} color={colors.success}/>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted}/>
              </View>
            </Pressable>)}/>)}

      <AppBottomSheet visible={selectedUnit !== null} onClose={closeApproval} testID="contact-approval-sheet">
        <View style={styles.sheetContent}>
          <SafeText variant="title" style={createSafeTextColorStyle6(colors.textPrimary)}>{copy.approval.title}</SafeText>
          <SafeText variant="body" style={createSafeTextColorStyle7(colors.textSecondary)}>{copy.approval.description}</SafeText>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle8(colors.textPrimary)}>{copy.approval.selectedResident}</SafeText>
          {selectedUnit?.residents.map((resident) => {
            const selected = selectedResident?.residentProfileId === resident.residentProfileId;
            return (<Pressable key={resident.residentProfileId} onPress={() => setSelectedResident(resident)} style={[styles.residentChoice, createPressableBorderColorBackgroundColorStyle(selected ? colors.primary : colors.border, selected ? colors.primarySoft : colors.surface)]} accessibilityRole="radio" accessibilityState={{ selected }}>
                <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? colors.primary : colors.textMuted}/>
                <View style={styles.unitDetails}>
                  <SafeText variant="bodyStrong" style={createSafeTextColorStyle9(colors.textPrimary)}>
                    {resident.displayNameVisible ? resident.displayName : copy.directory.maskedResident}
                  </SafeText>
                  <SafeText variant="caption" style={createSafeTextColorStyle10(colors.textSecondary)}>{resident.flatNumber} · {resident.occupancyLabel}</SafeText>
                </View>
              </Pressable>);
        })}
          <View style={[styles.notice, createViewBackgroundColorStyle5(colors.surfaceSoft)]}>
            {[copy.approval.noImmediateChat, copy.approval.notification, copy.approval.requiredContext, copy.approval.moderation].map((line) => (<View key={line} style={styles.noticeLine}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary}/>
                <SafeText variant="caption" style={createSafeTextColorStyle11(colors.textSecondary)}>{line}</SafeText>
              </View>))}
          </View>
          <View style={styles.sheetActions}>
            <AppButton title={copy.approval.cancel} onPress={closeApproval} variant="ghost" style={styles.sheetButton}/>
            <AppButton title={copy.approval.continue} onPress={continueToRequest} disabled={!selectedResident} style={styles.sheetButton}/>
          </View>
        </View>
      </AppBottomSheet>
    </View>);
}
export default ResidentDirectorySelectionScreen;

