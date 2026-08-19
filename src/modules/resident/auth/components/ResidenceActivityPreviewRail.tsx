import { useState, useEffect, useRef } from "react";
import { View, AppState, AppStateStatus, AccessibilityInfo } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from "react-native-reanimated";
import { AppText } from "../../../../shared/components/AppText";
import { authMessages, type AuthenticationMessageKey, type ResidenceActivityIconName } from "../messages/auth.messages";
import type { ResidenceActivityPreview } from "../data/residentAuth.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { styles, createViewBackgroundColorStyle } from "../styles/components/ResidenceActivityPreviewRail.styles";
const ACTIVITIES: readonly ResidenceActivityPreview[] = [
    { id: '1', type: 'visitor', messageKey: 'activityVisitor', status: 'success' },
    { id: '2', type: 'maintenance', messageKey: 'activityPayment', status: 'success' },
    { id: '3', type: 'parcel', messageKey: 'activityParcel', status: 'information' },
    { id: '4', type: 'complaint', messageKey: 'activityComplaint', status: 'attention' },
    { id: '5', type: 'notice', messageKey: 'activityNotice', status: 'information' },
    { id: '6', type: 'emergency', messageKey: 'activityEmergency', status: 'attention' },
    { id: '7', type: 'family', messageKey: 'activityFamily', status: 'success' },
    { id: '8', type: 'noc', messageKey: 'activityNoc', status: 'success' },
] as const;
export function ResidenceActivityPreviewRail() {
    const [index, setIndex] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(8);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
            setReducedMotion(enabled);
        });
    }, []);
    const current = getRequiredItem(ACTIVITIES, index, "ResidenceActivityPreviewRail.tsx");
    const triggerNext = () => {
        setIndex((prev) => (prev + 1) % ACTIVITIES.length);
    };
    useEffect(() => {
        let appActive = true;
        if (reducedMotion) {
            opacity.value = 1;
            translateY.value = 0;
        }
        else {
            opacity.value = 0;
            translateY.value = 8;
            opacity.value = withTiming(1, { duration: 500 });
            translateY.value = withTiming(0, { duration: 500 });
        }
        const startTimer = () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                if (appActive) {
                    if (reducedMotion) {
                        triggerNext();
                    }
                    else {
                        opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                            if (finished && appActive) {
                                runOnJS(triggerNext)();
                            }
                        });
                        translateY.value = withTiming(-8, { duration: 500 });
                    }
                }
            }, 4000);
        };
        startTimer();
        const handleStateChange = (nextStatus: AppStateStatus) => {
            appActive = nextStatus === 'active';
            if (appActive) {
                startTimer();
            }
            else {
                if (timerRef.current)
                    clearInterval(timerRef.current);
            }
        };
        const sub = AppState.addEventListener('change', handleStateChange);
        return () => {
            if (timerRef.current)
                clearInterval(timerRef.current);
            sub.remove();
            appActive = false;
        };
    }, [index, opacity, reducedMotion, translateY]);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ translateY: translateY.value }],
        };
    });
    const getStatusColor = () => {
        switch (current.status) {
            case 'success':
                return '#10B981';
            case 'attention':
                return '#EF4444';
            case 'information':
            default:
                return '#3B82F6';
        }
    };
    const statusColor = getStatusColor();
    const getIconName = (): ResidenceActivityIconName => {
        switch (current.type) {
            case 'visitor':
                return 'people-outline';
            case 'maintenance':
                return 'card-outline';
            case 'parcel':
                return 'cube-outline';
            case 'complaint':
                return 'construct-outline';
            case 'notice':
                return 'notifications-outline';
            case 'emergency':
                return 'shield-checkmark-outline';
            case 'family':
                return 'person-add-outline';
            case 'noc':
                return 'document-text-outline';
            default:
                return 'notifications-outline';
        }
    };
    const getActivityMessage = (key: AuthenticationMessageKey): string => {
        const message = authMessages[key];
        return typeof message === 'string' ? message : '';
    };
    return (<View style={styles.container}>
      <Animated.View style={[
            styles.railCard,
            animatedStyle,
            styles.animatedViewBackgroundColorBorderColor,
        ]}>
        <Ionicons name={getIconName()} size={14} color={statusColor}/>
        <AppText variant="caption" numberOfLines={1} style={styles.text}>
          {getActivityMessage(current.messageKey)}
        </AppText>
        <View style={[styles.dot, createViewBackgroundColorStyle(statusColor)]}/>
      </Animated.View>
    </View>);
}

