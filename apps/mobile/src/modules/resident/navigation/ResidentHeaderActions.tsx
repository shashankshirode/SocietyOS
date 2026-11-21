import { Pressable, View } from "react-native";
import { SafeText } from "../../../shared/components/SafeText";
import { AppIcon } from "../../../shared/icons/AppIcon";
import { useMessages } from "../../../shared/constants/useMessages";
import { resolveResidentMessage, type MessageTree } from "./ResidentHeaderTitle";
import type { ResidentHeaderAction } from "./residentHeader.types";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "./styles/ResidentHeaderActions.styles";
export type ResidentHeaderActionsProps = {
    actions?: ResidentHeaderAction[];
    iconColor: string;
    badgeBackgroundColor: string;
    badgeTextColor: string;
};
export function ResidentHeaderActions({ actions = [], iconColor, badgeBackgroundColor, badgeTextColor, }: ResidentHeaderActionsProps) {
    const messages = useMessages();
    const messageTree = messages as MessageTree;
    if (actions.length === 0) {
        return null;
    }
    return (<View style={styles.container}>
      {actions.map((action) => {
            const accessibilityLabel = resolveResidentMessage(messageTree, action.accessibilityLabelKey);
            return (<Pressable key={action.id} accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={10} onPress={action.onPress} style={styles.actionButton}>
            <AppIcon name={action.iconName} size={20} color={iconColor}/>
            {action.badgeCount && action.badgeCount > 0 ? (<View style={[styles.badge, createViewBackgroundColorStyle(badgeBackgroundColor)]}>
                <SafeText variant="tiny" style={[styles.badgeText, createSafeTextColorStyle(badgeTextColor)]}>
                  {action.badgeCount > 99 ? '99+' : String(action.badgeCount)}
                </SafeText>
              </View>) : null}
          </Pressable>);
        })}
    </View>);
}

