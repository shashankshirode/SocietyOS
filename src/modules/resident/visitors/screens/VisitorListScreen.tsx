import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useVisitors } from '../data/useVisitors';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useFeatureFlags } from '../../../../core/featureFlags/useFeatureFlag';
import { SocietySegmentedControl } from '../../../../shared/components/SocietySegmentedControl';
import { SocietyStatusPill } from '../../../../shared/components/SocietyStatusPill';
import type { VisitorListScreenProps } from '../../../../app/navigation/navigation.types';
import type { Visitor } from '../../../../shared/types/visitor.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function VisitorListScreen({ navigation }: VisitorListScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isEnabled } = useFeatureFlags();
  const [selectedSegment, setSelectedSegment] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { data: rawVisitors = [], isLoading } = useVisitors();

  const visitorsList = useMemo(() => {
    return rawVisitors.filter((v: Visitor) => {
      const isPast =
        v.status === 'COMPLETED' ||
        v.status === 'EXPIRED' ||
        v.status === 'CANCELLED' ||
        v.status === 'REJECTED';
      const matchesSegment = selectedSegment === 'Past' ? isPast : !isPast;
      if (!matchesSegment) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.purpose.toLowerCase().includes(q) ||
          (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rawVisitors, selectedSegment, searchQuery]);

  const handleCardPress = (visitor: Visitor) => {
    navigation.navigate('VisitorDetail', { visitor });
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const canGoBack = Boolean(navigation?.canGoBack && navigation.canGoBack());

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.titleRow}>
          {canGoBack ? (
            <Pressable
              onPress={() => navigation.goBack()}
              hitSlop={8}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="arrow-back" size={24} color="#111613" />
            </Pressable>
          ) : null}
          <Text style={styles.screenTitle}>Visitors</Text>
          <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Visitor Passes</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            style={styles.iconActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Search visitors"
          >
            <Ionicons name="search-outline" size={22} color="#111613" />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('CreateVisitorPass')}
            style={styles.addBtnCircle}
            accessibilityRole="button"
            accessibilityLabel="Add Visitor"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Expandable Search Input */}
      {showSearch && (
        <View style={styles.searchBarBox}>
          <Ionicons name="search-outline" size={18} color="#626A65" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, purpose, vehicle..."
            placeholderTextColor="#8C928E"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color="#8C928E" />
            </Pressable>
          )}
        </View>
      )}

      {/* Segmented Control */}
      <View style={styles.segmentedWrapper}>
        <SocietySegmentedControl
          items={[
            { id: 'Upcoming', label: 'Upcoming' },
            { id: 'Past', label: 'Past' },
          ]}
          selectedId={selectedSegment}
          onSelect={(id) => setSelectedSegment(id as 'Upcoming' | 'Past')}
        />
      </View>

      {/* Main Content Area */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.groupHeaderRow}>
          <Text style={styles.groupTitle}>Today</Text>
          <Text style={styles.groupCount}>{visitorsList.length}</Text>
        </View>

        {visitorsList.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="people-outline" size={32} color="#8C928E" />
            </View>
            <Text style={styles.emptyTitle}>No {selectedSegment.toLowerCase()} visitors</Text>
            <Text style={styles.emptySubtitle}>
              {selectedSegment === 'Upcoming'
                ? 'Create a visitor pass for friends, deliveries, or staff.'
                : 'Past visitors and completed passes will appear here.'}
            </Text>
            {selectedSegment === 'Upcoming' && (
              <Pressable
                style={styles.emptyCtaBtn}
                onPress={() => navigation.navigate('CreateVisitorPass')}
              >
                <Text style={styles.emptyCtaText}>+ Add Visitor</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.listGrid}>
            {visitorsList.map((item: Visitor) => {
              const initials = getInitials(item.name);
              const isApproved = item.status === 'APPROVED';
              return (
                <Pressable
                  key={item.id}
                  style={styles.visitorCard}
                  onPress={() => handleCardPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, ${item.purpose}`}
                >
                  <View style={styles.cardContentRow}>
                    {/* Avatar */}
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>

                    {/* Middle Info */}
                    <View style={styles.infoCol}>
                      <Text style={styles.visitorNameText}>{item.name}</Text>
                      <Text style={styles.visitorSublineText}>
                        {item.purpose || `${item.type} • ${item.expectedTime || '7:30 PM'}`}
                      </Text>
                      <View style={styles.pillRow}>
                        <SocietyStatusPill
                          label={isApproved ? 'Approved' : item.status}
                          tone={isApproved ? 'info' : 'neutral'}
                          showDot={true}
                        />
                      </View>
                    </View>

                    {/* Right Menu Action */}
                    <Pressable
                      style={styles.moreActionBtn}
                      onPress={() => handleCardPress(item)}
                      accessibilityRole="button"
                      accessibilityLabel="Options"
                    >
                      <Ionicons name="ellipsis-vertical" size={18} color="#8C928E" />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: -4,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064F43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
  },
  segmentedWrapper: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 17,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  groupCount: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#8C928E',
  },
  listGrid: {
    gap: 12,
  },
  visitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  avatarInitials: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#064F43',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  visitorNameText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  visitorSublineText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  pillRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreActionBtn: {
    padding: 8,
    marginRight: -4,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
    color: '#111613',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  emptyCtaBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#064F43',
    borderRadius: 14,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
  },
});

export default VisitorListScreen;
