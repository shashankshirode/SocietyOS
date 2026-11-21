import React from 'react';
import { Pressable, View, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { emergencyTheme } from '../theme/emergencyTheme';
import { useMessages } from '../../../../messages/useMessages';
interface EmergencyCommandProps {
    state: 'CHOOSING' | 'RESPONSE_SELECTED' | 'SENDING' | 'ACTIVE' | 'ACKNOWLEDGED' | 'FAILED' | 'CANCELLED';
    requestLabel: string;
    accentColor: string;
    onRequest: () => void;
    onChangeResponse: () => void;
    onCancelRequest?: () => void;
    onReturnToHome?: () => void;
    onRetry?: () => void;
    onCallGateSecurity?: () => void;
}
export function EmergencyCommand({ state, requestLabel, accentColor, onRequest, onChangeResponse, onCancelRequest, onReturnToHome, onRetry, onCallGateSecurity, }: EmergencyCommandProps) {
    const copy = useMessages().resident.emergency.crisis;
    if (state === 'SENDING') {
        return (<View style={styles.container}>
        <View style={[styles.sendingBar, { backgroundColor: emergencyTheme.surfaceRaised }]}>
          <ActivityIndicator size="small" color={accentColor}/>
          <SafeText variant="bodyStrong" style={[styles.sendingText, { color: emergencyTheme.text }]}>
            {copy.sending}
          </SafeText>
        </View>
      </View>);
    }
    if (state === 'ACTIVE' || state === 'ACKNOWLEDGED') {
        return (<View style={styles.container}>
        {onReturnToHome && (<Pressable onPress={onReturnToHome} accessibilityRole="button" style={[styles.primaryButton, { backgroundColor: emergencyTheme.surfaceRaised, borderColor: emergencyTheme.connector, borderWidth: 1 }]}>
            <SafeText variant="bodyStrong" style={{ color: emergencyTheme.text }}>
              {copy.returnToApp}
            </SafeText>
            <Ionicons name="arrow-forward" size={16} color={emergencyTheme.text}/>
          </Pressable>)}

        {onCancelRequest && (<Pressable onPress={onCancelRequest} accessibilityRole="button" style={styles.textButton}>
            <SafeText variant="caption" style={{ color: emergencyTheme.textSecondary, textDecorationLine: 'underline' }}>
              {copy.falseAlarm}
            </SafeText>
          </Pressable>)}
      </View>);
    }
    if (state === 'FAILED') {
        return (<View style={styles.container}>
        {onRetry && (<Pressable onPress={onRetry} accessibilityRole="button" style={[styles.primaryButton, { backgroundColor: emergencyTheme.core }]}>
            <SafeText variant="bodyStrong" style={{ color: emergencyTheme.text, fontWeight: '800' }}>
              {copy.retry}
            </SafeText>
            <Ionicons name="refresh" size={16} color={emergencyTheme.text}/>
          </Pressable>)}

        {onCallGateSecurity && (<Pressable onPress={onCallGateSecurity} accessibilityRole="button" style={[styles.secondaryButton, { backgroundColor: emergencyTheme.surfaceRaised, borderColor: emergencyTheme.border }]}>
            <Ionicons name="call" size={16} color={emergencyTheme.acknowledged}/>
            <SafeText variant="caption" style={{ color: emergencyTheme.acknowledged, fontWeight: '700' }}>
              {copy.callGateSecurity}
            </SafeText>
          </Pressable>)}

        <Pressable onPress={onChangeResponse} accessibilityRole="button" style={styles.textButton}>
          <SafeText variant="caption" style={{ color: emergencyTheme.textSecondary }}>
            {copy.chooseAnother}
          </SafeText>
        </Pressable>
      </View>);
    }
    if (state === 'RESPONSE_SELECTED') {
        return (<View style={styles.container}>
        <Pressable onPress={onRequest} accessibilityRole="button" style={[styles.primaryButton, { backgroundColor: accentColor }]}>
          <SafeText variant="bodyStrong" style={styles.primaryButtonText}>
            {requestLabel}
          </SafeText>
          <Ionicons name="arrow-forward" size={18} color="#0A120E"/>
        </Pressable>

        <Pressable onPress={onChangeResponse} accessibilityRole="button" style={styles.textButton}>
          <SafeText variant="caption" style={{ color: emergencyTheme.textSecondary }}>
            {copy.chooseAnother}
          </SafeText>
        </Pressable>
      </View>);
    }
    return null;
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 10,
        alignItems: 'center',
        paddingTop: 4,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 52,
        borderRadius: 26,
        paddingHorizontal: 20,
        gap: 8,
    },
    primaryButtonText: {
        color: '#0A120E',
        fontWeight: '800',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        paddingHorizontal: 16,
        gap: 8,
    },
    sendingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 52,
        borderRadius: 26,
        gap: 10,
    },
    sendingText: {
        fontWeight: '700',
        fontSize: 14,
    },
    textButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    hintText: {
        fontSize: 11,
        textAlign: 'center',
    },
});

