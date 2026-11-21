import { useRef } from "react";
import { Animated, PanResponder, Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatResidentTime } from "../../../../core/localization/dateTimeFormatters";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ChatMessage } from "../../../chat/domain/chat.types";
import { ChatReplyPreview } from "./ChatReplyPreview";
import { ChatStatusTicks } from "./ChatStatusTicks";
import { StaffSenderAttribution } from "./StaffSenderAttribution";
import { styles, createSafeTextColorMarginTopStyle, createSafeTextColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/ChatMessageBubble.styles";
type Props = {
    message: ChatMessage;
    quotedMessage?: ChatMessage;
    onRetry: (message: ChatMessage) => void;
    onReply: (message: ChatMessage) => void;
};
export function ChatMessageBubble({ message, quotedMessage, onRetry, onReply }: Props) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const outgoing = message.senderSnapshot.senderType === 'resident';
    const failed = message.deliveryStatus === 'failed';
    const translateX = useRef(new Animated.Value(0)).current;
    const hasTriggeredReply = useRef(false);
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 12 && gestureState.dx > 0;
        },
        onPanResponderGrant: () => {
            hasTriggeredReply.current = false;
        },
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dx > 0) {
                const resistanceDx = Math.min(gestureState.dx * 0.55, 75);
                translateX.setValue(resistanceDx);
                if (resistanceDx >= 40 && !hasTriggeredReply.current) {
                    hasTriggeredReply.current = true;
                }
            }
        },
        onPanResponderRelease: () => {
            if (hasTriggeredReply.current) {
                onReply(message);
            }
            Animated.spring(translateX, {
                toValue: 0,
                bounciness: 5,
                speed: 18,
                useNativeDriver: true,
            }).start();
        },
        onPanResponderTerminate: () => {
            Animated.spring(translateX, {
                toValue: 0,
                bounciness: 5,
                speed: 18,
                useNativeDriver: true,
            }).start();
        },
    })).current;
    const replyIconOpacity = translateX.interpolate({
        inputRange: [0, 20, 50],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    });
    const replyIconScale = translateX.interpolate({
        inputRange: [0, 40],
        outputRange: [0.6, 1],
        extrapolate: 'clamp',
    });
    return (<View style={[styles.row, outgoing ? styles.outgoingRow : styles.incomingRow]} {...panResponder.panHandlers}>
      <Animated.View style={[styles.replyIconContainer, createViewBackgroundColorStyle(colors.primarySoft), { opacity: replyIconOpacity, transform: [{ translateY: -14 }, { scale: replyIconScale }] }]}>
        <Ionicons name="arrow-undo-outline" size={16} color={colors.primary}/>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX }] }}>
        <Pressable onPress={failed ? () => onRetry(message) : () => onReply(message)} onLongPress={() => onReply(message)} accessibilityRole="button" accessibilityLabel={failed
            ? messages.resident.chat.accessibility.retryMessage
            : messages.resident.chat.accessibility.replyToMessage} style={[
            styles.bubble,
            createPressableBackgroundColorBorderColorStyle(outgoing ? colors.primarySoft : colors.surface, failed ? colors.danger : colors.border),
        ]}>
          {quotedMessage ? <ChatReplyPreview message={quotedMessage} compact/> : null}
          <SafeText variant="body" style={createSafeTextColorMarginTopStyle(colors.textPrimary, quotedMessage ? 6 : 0)}>
            {message.deletedAtIso ? messages.resident.chat.deletedMessage : message.messageText}
          </SafeText>
          {!outgoing ? <StaffSenderAttribution sender={message.senderSnapshot}/> : null}
          <View style={styles.meta}>
            <SafeText variant="tiny" style={createSafeTextColorStyle(failed ? colors.danger : colors.textMuted)}>
              {failed ? messages.resident.chat.retry : formatResidentTime(message.sentAtIso)}
            </SafeText>
            {outgoing ? <ChatStatusTicks status={message.deliveryStatus}/> : null}
          </View>
        </Pressable>
      </Animated.View>
    </View>);
}

