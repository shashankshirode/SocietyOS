import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from "react-native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentHomeContexts } from "../hooks/useResidentHomeContexts";
import { useSwitchResidentHome } from "../hooks/useSwitchResidentHome";
import { ResidentHomeContextSummary } from "./ResidentHomeContextSummary";
import { ActiveHomeChangedToast } from "./ActiveHomeChangedToast";
import type { ResidentHomeContext } from "../data/residentHomeContext.types";
import { useActiveResidentHome } from "../hooks/useActiveResidentHome";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { SafeText } from "../../../../shared/components/SafeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBackgroundStyle, createSearchStyle, createTextColorStyle, styles } from "../styles/components/ResidentHomeSwitcherSheet.styles";
export function ResidentHomeSwitcherSheet({ visible, onClose, }: {
    visible: boolean;
    onClose: () => void;
}) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const { data: contexts = [], isLoading: loadingContexts } = useResidentHomeContexts();
    const { activeId } = useActiveResidentHome();
    const { switchHome, isSubmitting, switchingHomeContextId, error: switchError, } = useSwitchResidentHome();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [query, setQuery] = useState('');
    const filteredContexts = contexts.filter((context) => `${context.societyName} ${context.displayUnitName}`.toLowerCase().includes(query.trim().toLowerCase()));
    const handleSelectContext = async (context: ResidentHomeContext) => {
        if (context.homeContextId === activeId) {
            onClose();
            return;
        }
        const success = await switchHome(context.homeContextId);
        if (success) {
            setToastType('success');
            setToastMessage(messages.resident.homeContext.switchedSuccessfully);
            onClose();
        }
        else {
            setToastType('error');
            setToastMessage(switchError || messages.resident.homeContext.unableToSwitch);
            setTimeout(() => setToastMessage(null), 3000);
        }
    };
    const header = (<View style={styles.header}>
      <View style={styles.headerCopy}>
        <SafeText variant="tiny" style={[styles.eyebrow, createTextColorStyle(colors.success)]}>{messages.resident.homeContext.switchHome}</SafeText>
        <SafeText variant="h2" color="primary">{messages.resident.homeContext.switchResidence}</SafeText>
        <SafeText variant="caption" color="muted">{messages.resident.homeContext.switchResidenceDescription}</SafeText>
      </View>
      {!isSubmitting ? (<Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={messages.common.close} style={[styles.closeButton, createBackgroundStyle(colors.surfaceMuted)]}>
          <Ionicons name="close" size={20} color={colors.textPrimary}/>
        </Pressable>) : null}
    </View>);
    return (<AppBottomSheet visible={visible} onClose={onClose} preventDismiss={isSubmitting} testID="resident-home-switcher-sheet" header={header} sheetStyle={styles.sheet}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {contexts.length > 6 ? (<View style={[styles.search, createSearchStyle(colors.border, colors.inputBackground)]}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted}/>
              <TextInput value={query} onChangeText={setQuery} placeholder={messages.resident.homeContext.searchHomes} placeholderTextColor={colors.inputPlaceholder} style={[styles.searchInput, createTextColorStyle(colors.inputText)]}/>
            </View>) : null}
          {loadingContexts ? (<View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary}/>
            </View>) : (<ResidentHomeContextSummary contexts={filteredContexts} activeHomeContextId={activeId} switchingHomeContextId={switchingHomeContextId} onSelectContext={handleSelectContext}/>)}
        </ScrollView>

      {toastMessage && (<ActiveHomeChangedToast message={toastMessage} type={toastType}/>)}
    </AppBottomSheet>);
}
export default ResidentHomeSwitcherSheet;
