import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import type { Absent } from "../../shared/types/absence.types";
export interface QrPassCardProps {
    passCode: string;
    referenceNumber: string;
    validityLabel: string;
    gateOrVenueLabel?: string | Absent;
    style?: ViewStyle | Absent;
    testID?: string | Absent;
}
export function QrPassCard({ passCode, referenceNumber, validityLabel, gateOrVenueLabel, style, testID = 'qr-pass-card', }: QrPassCardProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[
            styles.card,
            {
                backgroundColor: dark ? '#1E293B' : '#FFFFFF',
                borderColor: dark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
            },
            style,
        ]} testID={testID}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
          <Ionicons name="shield-checkmark" size={14} color={colors.success}/>
          <SafeText variant="tiny" style={{ color: colors.success, fontWeight: '700' }}>
            VERIFIED PASS
          </SafeText>
        </View>
        <SafeText variant="tiny" style={{ color: colors.textMuted }}>
          Ref: {referenceNumber}
        </SafeText>
      </View>

      <View style={[styles.qrContainer, { backgroundColor: '#FFFFFF' }]}>
        
        <View style={styles.qrGrid}>
          <Ionicons name="qr-code" size={130} color="#0F172A"/>
        </View>
        <SafeText variant="tiny" style={{ color: '#64748B', fontWeight: '600', marginTop: 4 }}>
          Scan at turnstile / entry gate
        </SafeText>
      </View>

      <View style={styles.infoBlock}>
        <View style={styles.codeRow}>
          <SafeText variant="tiny" style={{ color: colors.textMuted }}>
            Access Code:
          </SafeText>
          <SafeText variant="bodyStrong" style={{ color: colors.primary, fontWeight: '800', letterSpacing: 2, fontSize: 16 }}>
            {passCode}
          </SafeText>
        </View>

        <View style={styles.validityRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary}/>
          <SafeText variant="caption" style={{ color: colors.textSecondary }}>
            {validityLabel}
          </SafeText>
        </View>

        {gateOrVenueLabel ? (<View style={styles.venueRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary}/>
            <SafeText variant="caption" style={{ color: colors.textSecondary }}>
              {gateOrVenueLabel}
            </SafeText>
          </View>) : null}
      </View>
    </View>);
}
const styles = StyleSheet.create({
    card: {
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        gap: 14,
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    qrContainer: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    qrGrid: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoBlock: {
        width: '100%',
        gap: 6,
        alignItems: 'center',
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    validityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    venueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});
export default QrPassCard;

