import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { ResidentContactRequest, DepartmentChatShortcut } from "../../modules/resident/dashboard/data/dashboard.types";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorStyle, createPressableBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorStyle4 } from "./styles/ResidentConnectPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ResidentConnectPanelProps {
    contactRequest?: ResidentContactRequest;
    departmentChats: DepartmentChatShortcut[];
    onAcceptRequest: (id: string) => void;
    onRejectRequest: (id: string) => void;
    onOpenDepartmentChat: (id: string) => void;
    onOpenResidentConnect: () => void;
    sectionTitle?: string;
    sectionSubtitle?: string;
    openLabel?: string;
    privacyNote?: string;
    contactRequestTitle?: string;
    contactRequestFromPrefix?: string;
    acceptLabel?: string;
    declineLabel?: string;
    acceptedStatusLabel?: string;
    rejectedStatusLabel?: string;
    unreadAccessibilityLabel?: (count: number) => string;
}
export function ResidentConnectPanel({ contactRequest, departmentChats, onAcceptRequest, onRejectRequest, onOpenDepartmentChat, onOpenResidentConnect, sectionTitle = getActiveUiLiteral("m_4c20f72beb96"), sectionSubtitle, openLabel = 'Open', privacyNote = getActiveUiLiteral("m_689b764057ed"), contactRequestTitle = getActiveUiLiteral("m_b7353d45ab5a"), contactRequestFromPrefix = getActiveUiLiteral("m_1323d66a2100"), acceptLabel = 'Accept', declineLabel = 'Decline', acceptedStatusLabel = getActiveUiLiteral("m_6d6b6066e5c5"), rejectedStatusLabel = getActiveUiLiteral("m_c281bf80079c"), unreadAccessibilityLabel, }: ResidentConnectPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <DashboardSectionHeader title={sectionTitle} {...includeWhenPresent("subtitle", sectionSubtitle)} actionLabel={openLabel} onActionPress={onOpenResidentConnect}/>

      <View style={styles.content}>
        
        <View style={[styles.privacyBanner, createViewBackgroundColorStyle(colors.primarySoft)]}> 
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary}/>
          <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textSecondary)}>
            {privacyNote}
          </SafeText>
        </View>

        
        {contactRequest && contactRequest.status === 'pending' && (<View style={[styles.requestCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
            <View style={styles.requestHeader}>
              <View style={[styles.requestIcon, createViewBackgroundColorStyle2(colors.warningSoft)]}> 
                <Ionicons name="mail-outline" size={16} color={colors.warning}/>
              </View>
              <View style={styles.requestText}>
                <SafeText variant="bodyStrong" color="primary" numberOfLines={1}>{contactRequestTitle}</SafeText>
                <SafeText variant="tiny" color="muted" numberOfLines={1}>{contactRequestFromPrefix} {contactRequest.fromFlat}</SafeText>
              </View>
            </View>
            <SafeText variant="caption" color="secondary" numberOfLines={2}>{contactRequest.subject}</SafeText>
            <View style={styles.requestActions}>
              <Pressable onPress={() => onAcceptRequest(contactRequest.id)} style={[styles.acceptBtn, createPressableBackgroundColorStyle(colors.successSoft)]}>
                <Ionicons name="checkmark" size={14} color={colors.success}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.success)}>{acceptLabel}</SafeText>
              </Pressable>
              <Pressable onPress={() => onRejectRequest(contactRequest.id)} style={[styles.rejectBtn, createPressableBackgroundColorStyle2(colors.dangerSoft)]}>
                <Ionicons name="close" size={14} color={colors.danger}/>
                <SafeText variant="tiny" style={createSafeTextColorStyle3(colors.danger)}>{declineLabel}</SafeText>
              </Pressable>
            </View>
          </View>)}

        {contactRequest && contactRequest.status !== 'pending' && (<View style={[styles.requestDone, createViewBackgroundColorStyle3(contactRequest.status === 'accepted' ? colors.successSoft : colors.dangerSoft)]}> 
            <Ionicons name={contactRequest.status === 'accepted' ? 'checkmark-circle' : 'close-circle'} size={16} color={contactRequest.status === 'accepted' ? colors.success : colors.danger}/>
            <SafeText variant="caption" style={createSafeTextColorStyle4(contactRequest.status === 'accepted' ? colors.success : colors.danger)}>
              {contactRequest.status === 'accepted' ? acceptedStatusLabel : rejectedStatusLabel}
            </SafeText>
          </View>)}

        
        <View style={styles.chatsGrid}>
          {departmentChats.map((chat) => (<PressableScale key={chat.id} onPress={() => onOpenDepartmentChat(chat.id)} style={styles.chatItem}>
              <View style={[styles.chatCard, createViewBackgroundColorBorderColorStyle2(colors.surface, colors.border)]}> 
                <View style={[styles.chatIcon, createViewBackgroundColorStyle4(colors.primarySoft)]}> 
                  <Ionicons name={resolveChatIcon(chat.iconName)} size={18} color={colors.primary}/>
                </View>
                <SafeText variant="caption" color="primary" numberOfLines={1} style={styles.chatLabel}>{chat.label}</SafeText>
                {chat.unreadCount > 0 && (<View style={styles.unreadBadge} {...includeWhenPresent("accessibilityLabel", unreadAccessibilityLabel?.(chat.unreadCount))}>
                    <SafeText variant="tiny" style={styles.unreadText}>
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </SafeText>
                  </View>)}
              </View>
            </PressableScale>))}
        </View>
      </View>
    </View>);
}
function resolveChatIcon(iconName: string): keyof typeof Ionicons.glyphMap {
    return iconName in Ionicons.glyphMap
        ? iconName as keyof typeof Ionicons.glyphMap
        : 'chatbubble-ellipses-outline';
}

