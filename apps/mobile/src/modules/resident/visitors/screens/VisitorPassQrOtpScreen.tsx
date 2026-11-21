import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Path, Rect } from 'react-native-svg';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { VisitorPassPanel } from '../../../../ui/patterns/VisitorPassPanel';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function VisitorPassQrOtpScreen({
  navigation,
}: {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Top Header / Scanner Mode */}
      {!isCheckedIn ? (
        <View style={styles.scannerContainer}>
          {/* Header Controls */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={8}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>

            {/* Toggle: Scan QR | Enter Manually */}
            <View style={styles.toggleCapsule}>
              <Pressable
                style={[styles.toggleBtn, activeTab === 'scan' && styles.toggleBtnActive]}
                onPress={() => setActiveTab('scan')}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    activeTab === 'scan' && styles.toggleBtnTextActive,
                  ]}
                >
                  Scan QR
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleBtn, activeTab === 'manual' && styles.toggleBtnActive]}
                onPress={() => setActiveTab('manual')}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    activeTab === 'manual' && styles.toggleBtnTextActive,
                  ]}
                >
                  Enter Manually
                </Text>
              </Pressable>
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* Scanner Viewfinder Area */}
          <View style={styles.viewfinderSection}>
            <Pressable
              onPress={() => setIsCheckedIn(true)}
              style={styles.viewfinderBox}
              accessibilityRole="button"
              accessibilityLabel="Tap to scan visitor pass"
            >
              <View style={styles.bracketTopLeft} />
              <View style={styles.bracketTopRight} />
              <View style={styles.bracketBottomLeft} />
              <View style={styles.bracketBottomRight} />

              <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FFFFFF" strokeWidth="1.8" />
                <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FFFFFF" strokeWidth="1.8" />
                <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FFFFFF" strokeWidth="1.8" />
                <Path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h3M20 14v3" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
              </Svg>
            </Pressable>

            <Text style={styles.scannerHintText}>Align QR code to scan</Text>

            <Pressable
              style={styles.todayVisitorsBtn}
              onPress={() => navigation.navigate('VisitorList')}
            >
              <Text style={styles.todayVisitorsText}>View Today's Visitors</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        /* Step 7: Entry confirmed */
        <View style={styles.confirmedContainer}>
          <View style={styles.confirmedHeader}>
            <Pressable
              onPress={() => setIsCheckedIn(false)}
              hitSlop={8}
              style={styles.backButtonDark}
            >
              <Ionicons name="arrow-back" size={24} color="#111613" />
            </Pressable>
          </View>

          <View style={styles.confirmedContent}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </View>

            <Text style={styles.confirmedTitle}>Visitor checked in</Text>
            <Text style={styles.confirmedTime}>Today, 7:32 PM</Text>

            <View style={styles.visitorCardConfirmed}>
              <View style={styles.avatarConfirmed}>
                <Text style={styles.avatarTextConfirmed}>RK</Text>
              </View>
              <View style={styles.visitorTextColConfirmed}>
                <Text style={styles.visitorNameConfirmed}>Rahul Kulkarni</Text>
                <Text style={styles.visitorRoleConfirmed}>Friend</Text>
              </View>
            </View>

            <Pressable
              style={styles.viewDetailsBtn}
              onPress={() => navigation.navigate('VisitorList')}
            >
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#022F2A',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
  },
  toggleCapsule: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleBtnText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  toggleBtnTextActive: {
    color: '#022F2A',
    fontWeight: '700',
  },
  viewfinderSection: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  viewfinderBox: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bracketTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 10,
  },
  bracketTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
    borderTopRightRadius: 10,
  },
  bracketBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 10,
  },
  bracketBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
    borderBottomRightRadius: 10,
  },
  scannerHintText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  todayVisitorsBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  todayVisitorsText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#FFFFFF',
  },
  confirmedContainer: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  confirmedHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButtonDark: {
    padding: 8,
  },
  confirmedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmedTitle: {
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  confirmedTime: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
    marginBottom: 16,
  },
  visitorCardConfirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    gap: 14,
  },
  avatarConfirmed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextConfirmed: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#064F43',
  },
  visitorTextColConfirmed: {
    flex: 1,
    gap: 2,
  },
  visitorNameConfirmed: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  visitorRoleConfirmed: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  viewDetailsBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  viewDetailsBtnText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#064F43',
  },
});

export default VisitorPassQrOtpScreen;
