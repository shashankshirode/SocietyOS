import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingUnit } from '../data/residentOnboarding.types';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, } from '../../../../shared/theme/typography';
interface UnitSelectorProps {
    units: OnboardingUnit[];
    selectedUnit: OnboardingUnit | null;
    onSelectUnit: (unit: OnboardingUnit) => void;
}
export function UnitSelector({ units, selectedUnit, onSelectUnit, }: UnitSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredUnits = useMemo(() => {
        if (!searchQuery.trim())
            return units;
        const query = searchQuery.toLowerCase().trim();
        return units.filter((u) => u.unitNumber.toLowerCase().includes(query) ||
            u.tower.toLowerCase().includes(query));
    }, [units, searchQuery]);
    const groupedUnits = useMemo(() => {
        const map = new Map<string, OnboardingUnit[]>();
        filteredUnits.forEach((unit) => {
            const list = map.get(unit.tower) || [];
            list.push(unit);
            map.set(unit.tower, list);
        });
        return Array.from(map.entries());
    }, [filteredUnits]);
    return (<View style={styles.container}>
      
      <View style={styles.searchBarBox}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
          <Path d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" stroke="#69716D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
        <TextInput style={styles.searchInput} placeholder="Search flat / unit number (e.g. A-1204)" placeholderTextColor="#A0A5A2" value={searchQuery} onChangeText={setSearchQuery} autoCapitalize="characters"/>
        {searchQuery.length > 0 && (<Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#69716D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </Pressable>)}
      </View>

      
      {groupedUnits.length === 0 ? (<View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No units found</Text>
          <Text style={styles.emptyDesc}>
            Check the unit number or contact your society management office.
          </Text>
        </View>) : (groupedUnits.map(([tower, towerUnits]) => (<View key={tower} style={styles.towerGroup}>
            <View style={styles.towerHeader}>
              <Text style={styles.towerTitle}>{tower}</Text>
              <Text style={styles.towerCount}>{towerUnits.length} available</Text>
            </View>

            <View style={styles.unitsGrid}>
              {towerUnits.map((unit) => {
                const isSelected = selectedUnit?.id === unit.id;
                return (<Pressable key={unit.id} onPress={() => onSelectUnit(unit)} style={({ pressed }) => [
                        styles.unitPill,
                        isSelected && styles.unitPillSelected,
                        pressed && styles.unitPillPressed,
                    ]} accessibilityRole="button" accessibilityLabel={`Unit ${unit.unitNumber}, ${unit.tower}, ${unit.wing}`}>
                    <Text style={[
                        styles.unitNumberText,
                        isSelected && styles.unitNumberTextSelected,
                    ]}>
                      {unit.unitNumber}
                    </Text>
                    <Text style={[
                        styles.unitMetaText,
                        isSelected && styles.unitMetaTextSelected,
                    ]}>
                      Floor {unit.floor} • {unit.wing}
                    </Text>
                  </Pressable>);
            })}
            </View>
          </View>)))}
    </View>);
}
const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    searchBarBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#EBE8DE',
        paddingHorizontal: 14,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#10201D',
    },
    towerGroup: {
        gap: 8,
    },
    towerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
    },
    towerTitle: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    towerCount: {
        fontSize: 12,
        color: '#7C8581',
        fontFamily: FONT_FAMILY_INTER,
    },
    unitsGrid: {
        gap: 8,
    },
    unitPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#EBE8DE',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    unitPillSelected: {
        backgroundColor: '#064F45',
        borderColor: '#064F45',
    },
    unitPillPressed: {
        opacity: 0.88,
    },
    unitNumberText: {
        fontSize: 16,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    unitNumberTextSelected: {
        color: '#FFFFFF',
    },
    unitMetaText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
    },
    unitMetaTextSelected: {
        color: '#A3C6BE',
    },
    emptyState: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EBE8DE',
        padding: 24,
        alignItems: 'center',
        gap: 6,
    },
    emptyTitle: {
        fontSize: 15,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    emptyDesc: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
        textAlign: 'center',
    },
});

