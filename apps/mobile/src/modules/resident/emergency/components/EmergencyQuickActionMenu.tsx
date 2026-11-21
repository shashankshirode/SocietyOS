import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { ModalHeader } from "../../../../ui/modal";
import { styles, createSafeTextColorStyle, createPressableBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/EmergencyQuickActionMenu.styles";
export interface EmergencyQuickActionMenuProps {
    visible: boolean;
    onClose: () => void;
    onTriggerAction: (actionId: string, label: string) => void;
}
export function EmergencyQuickActionMenu({ visible, onClose, onTriggerAction, }: EmergencyQuickActionMenuProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const actions: {
        id: string;
        labelKey: string;
        icon: keyof typeof Ionicons.glyphMap;
        color: string;
    }[] = [
        { id: 'medical', labelKey: 'resident.emergency.medical', icon: 'medical', color: colors.danger },
        { id: 'fire', labelKey: 'resident.emergency.fireAlert', icon: 'flame', color: colors.danger },
        { id: 'lift', labelKey: 'resident.emergency.liftStuck', icon: 'arrow-up', color: colors.warning },
        { id: 'security', labelKey: 'resident.emergency.callSecurity', icon: 'call', color: colors.info },
        { id: 'senior', labelKey: 'resident.emergency.seniorHelp', icon: 'heart', color: colors.success },
    ];
    return (<AppBottomSheet visible={visible} onClose={onClose} testID="emergency-quick-action-sheet" header={<ModalHeader title={t(messages, 'resident.emergency.title')} onClose={onClose}/>}>

        <View style={styles.content}>
          {actions.map((act) => (<Pressable key={act.id} style={[
                styles.actionItem,
                createPressableBorderColorStyle(colors.border),
            ]} onPress={() => onTriggerAction(act.id, t(messages, act.labelKey))}>
              <View style={[styles.iconWrap, createViewBackgroundColorStyle(`${act.color}15`)]}>
                <Ionicons name={act.icon} size={20} color={act.color}/>
              </View>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
                {t(messages, act.labelKey)}
              </SafeText>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted}/>
            </Pressable>))}
        </View>
    </AppBottomSheet>);
}
export default EmergencyQuickActionMenu;

