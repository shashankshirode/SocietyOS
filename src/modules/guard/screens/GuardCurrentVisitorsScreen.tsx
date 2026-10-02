import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Platform, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { GuardStackParamList } from '../../../app/navigation/navigation.types';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../shared/theme/typography';
import { useVisitorLifecycle, type ActiveVisitorRecord } from '../../resident/visitors/data/visitorLifecycle.store';
type Props = NativeStackScreenProps<GuardStackParamList, 'GuardCurrentVisitors'>;
export function GuardCurrentVisitorsScreen({ navigation }: Props) {
    const { currentlyInside, recordExit } = useVisitorLifecycle();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'GUEST' | 'DELIVERY' | 'SERVICE' | 'VENDOR'>('ALL');
    const [visitorToExit, setVisitorToExit] = useState<ActiveVisitorRecord | null>(null);
    const [exitSuccessMessage, setExitSuccessMessage] = useState<string | null>(null);
    const filteredVisitors = currentlyInside.filter((v) => {
        const matchesQuery = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.passCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));
        if (selectedFilter === 'ALL')
            return matchesQuery;
        if (selectedFilter === 'GUEST')
            return matchesQuery && v.type === 'GUEST';
        if (selectedFilter === 'DELIVERY')
            return matchesQuery && v.type === 'DELIVERY';
        if (selectedFilter === 'SERVICE')
            return matchesQuery && v.type === 'SERVICE_PROVIDER';
        if (selectedFilter === 'VENDOR')
            return matchesQuery && v.type === 'VENDOR';
        return matchesQuery;
    });
    const handleConfirmExit = () => {
        if (visitorToExit) {
            const result = recordExit(visitorToExit.id, {
                gateId: 'Gate 01',
                guardName: 'Officer Deshmukh',
            });
            if (result.success) {
                setExitSuccessMessage(`Exit recorded for ${visitorToExit.name} (${result.durationString || '1h 17m'}).`);
                setVisitorToExit(null);
                setTimeout(() => setExitSuccessMessage(null), 3500);
            }
        }
    };
    return (<View style={styles.container}>
      
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#064F45" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Currently Inside</Text>
          <Text style={styles.headerSubtitle}>Gate 01 · {currentlyInside.length} active on campus</Text>
        </View>
        <View style={{ width: 36 }}/>
      </View>

      
      {exitSuccessMessage ? (<View style={styles.toastBanner}>
          <Text style={styles.toastText}>✓ {exitSuccessMessage}</Text>
        </View>) : null}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.searchBar}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#69716D" strokeWidth={2} strokeLinecap="round"/>
          </Svg>
          <TextInput style={styles.searchInput} placeholder="Search visitor, unit, vehicle or pass..." placeholderTextColor="#9CA3AF" value={searchQuery} onChangeText={setSearchQuery} testID="occupancy-search-input"/>
        </View>

        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {(['ALL', 'GUEST', 'DELIVERY', 'SERVICE', 'VENDOR'] as const).map((tab) => {
            const isActive = selectedFilter === tab;
            return (<Pressable key={tab} style={[styles.filterChip, isActive && styles.filterChipActive]} onPress={() => setSelectedFilter(tab)}>
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {tab}
                </Text>
              </Pressable>);
        })}
        </ScrollView>

        
        {filteredVisitors.length > 0 ? (<View style={styles.listContainer}>
            {filteredVisitors.map((vis) => (<View key={vis.id} style={styles.occupantCard} testID={`occupant-card-${vis.id}`}>
                <View style={styles.occupantTopRow}>
                  <View style={styles.occupantInfo}>
                    <Text style={styles.occupantName}>{vis.name}</Text>
                    <Text style={styles.occupantSub}>
                      Unit {vis.flatNumber} · {vis.type} · Pass {vis.passCode}
                    </Text>
                  </View>
                  <View style={styles.gateBadge}>
                    <Text style={styles.gateBadgeText}>{vis.entryGate || 'Gate 01'}</Text>
                  </View>
                </View>

                <View style={styles.timeVehicleRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagLabel}>Entered:</Text>
                    <Text style={styles.tagValue}>{vis.entryTime || '7:35 PM'}</Text>
                  </View>
                  {vis.vehicleNumber ? (<View style={styles.tag}>
                      <Text style={styles.tagLabel}>Vehicle:</Text>
                      <Text style={styles.tagValue}>{vis.vehicleNumber}</Text>
                    </View>) : null}
                </View>

                
                <Pressable style={styles.recordExitBtn} onPress={() => setVisitorToExit(vis)} accessibilityRole="button" accessibilityLabel={`Record exit for ${vis.name}`} testID={`record-exit-btn-${vis.id}`}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                    <Path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                  <Text style={styles.recordExitBtnText}>Record exit</Text>
                </Pressable>
              </View>))}
          </View>) : (<View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No visitors currently inside</Text>
            <Text style={styles.emptySub}>
              All admitted visitors have checked out through the gate.
            </Text>
          </View>)}
      </ScrollView>

      
      <Modal visible={Boolean(visitorToExit)} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </View>

            <Text style={styles.modalTitle}>Record exit now?</Text>
            <Text style={styles.modalVisitorName}>{visitorToExit?.name}</Text>
            <Text style={styles.modalSub}>
              Unit {visitorToExit?.flatNumber} · Entered {visitorToExit?.entryTime || '7:35 PM'}
            </Text>

            <View style={styles.modalActionsRow}>
              <Pressable style={styles.modalCancelBtn} onPress={() => setVisitorToExit(null)} accessibilityRole="button" accessibilityLabel="Cancel">
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.modalConfirmBtn} onPress={handleConfirmExit} accessibilityRole="button" accessibilityLabel="Confirm exit" testID="confirm-exit-action-btn">
                <Text style={styles.modalConfirmBtnText}>Confirm exit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF8F1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 52 : 20,
        paddingHorizontal: 18,
        paddingBottom: 14,
        backgroundColor: '#FAF8F1',
        borderBottomWidth: 1,
        borderBottomColor: '#F0EFEA',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E7E9E8',
    },
    headerTitleWrap: {
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: 18,
        fontWeight: '700',
        color: '#10201D',
    },
    headerSubtitle: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 12,
        color: '#69716D',
    },
    toastBanner: {
        backgroundColor: '#064F45',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    toastText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 13,
        color: '#FAF8F1',
    },
    scrollContent: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 40,
        gap: 14,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E7E9E8',
        paddingHorizontal: 12,
        height: 46,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 14,
        color: '#10201D',
    },
    filtersRow: {
        gap: 8,
        paddingVertical: 2,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: '#064F45',
        borderColor: '#064F45',
    },
    filterChipText: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 12,
        color: '#4B5563',
    },
    filterChipTextActive: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#FAF8F1',
    },
    listContainer: {
        gap: 12,
    },
    occupantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E7E9E8',
        padding: 16,
        gap: 10,
        shadowColor: '#10201D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    occupantTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    occupantInfo: {
        gap: 2,
        flex: 1,
    },
    occupantName: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 16,
        color: '#10201D',
    },
    occupantSub: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 12.5,
        color: '#69716D',
    },
    gateBadge: {
        backgroundColor: '#E8F3EE',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    gateBadgeText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 11,
        color: '#064F45',
    },
    timeVehicleRow: {
        flexDirection: 'row',
        gap: 10,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagLabel: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 11.5,
        color: '#69716D',
    },
    tagValue: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 11.5,
        color: '#10201D',
    },
    recordExitBtn: {
        flexDirection: 'row',
        height: 44,
        backgroundColor: '#064F45',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    recordExitBtnText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 14,
        color: '#FAF8F1',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 8,
    },
    emptyTitle: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: 18,
        fontWeight: '700',
        color: '#10201D',
    },
    emptySub: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 13,
        color: '#69716D',
        textAlign: 'center',
        maxWidth: 240,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(16, 32, 29, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#FAF8F1',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#10201D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        elevation: 8,
    },
    modalIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#E8F3EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontFamily: FONT_FAMILY_SERIF,
        fontSize: 22,
        fontWeight: '700',
        color: '#10201D',
        marginBottom: 6,
    },
    modalVisitorName: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 17,
        color: '#064F45',
        marginBottom: 4,
    },
    modalSub: {
        fontFamily: FONT_FAMILY_INTER,
        fontSize: 13,
        color: '#69716D',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalActionsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalCancelBtn: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelBtnText: {
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        fontSize: 14,
        color: '#4B5563',
    },
    modalConfirmBtn: {
        flex: 1,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#064F45',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalConfirmBtnText: {
        fontFamily: FONT_FAMILY_INTER_BOLD,
        fontSize: 14,
        color: '#FAF8F1',
    },
});

