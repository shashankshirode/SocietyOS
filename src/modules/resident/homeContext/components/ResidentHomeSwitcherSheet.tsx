import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentHomeContexts } from "../hooks/useResidentHomeContexts";
import { useSwitchResidentHome } from "../hooks/useSwitchResidentHome";
import { ResidentHomeContextSummary } from "./ResidentHomeContextSummary";
import { ActiveHomeChangedToast } from "./ActiveHomeChangedToast";
import type { ResidentHomeContext } from "../data/residentHomeContext.types";
import { useActiveResidentHome } from "../hooks/useActiveResidentHome";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { ModalHeader } from "../../../../ui/modal";
import { styles } from "../styles/components/ResidentHomeSwitcherSheet.styles";
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
    return (<AppBottomSheet visible={visible} onClose={onClose} preventDismiss={isSubmitting} testID="resident-home-switcher-sheet" header={<ModalHeader title={messages.resident.homeContext.switchHome} onClose={onClose} showClose={!isSubmitting}/>}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {loadingContexts ? (<View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary}/>
            </View>) : (<ResidentHomeContextSummary contexts={contexts} activeHomeContextId={activeId} switchingHomeContextId={switchingHomeContextId} onSelectContext={handleSelectContext}/>)}
        </ScrollView>

      {toastMessage && (<ActiveHomeChangedToast message={toastMessage} type={toastType}/>)}
    </AppBottomSheet>);
}
export default ResidentHomeSwitcherSheet;

