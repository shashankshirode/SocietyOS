import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComplaintListScreenProps } from '../../../../app/navigation/navigation.types';
import { useComplaints } from '../data/useComplaints';
import { SocietySegmentedControl } from '../../../../shared/components/SocietySegmentedControl';
import { SocietyStatusPill } from '../../../../shared/components/SocietyStatusPill';
import type { Complaint } from '../../../../shared/types/complaint.types';
import {
  styles,
  createRootTopInset,
  createScrollPadding,
} from '../styles/screens/ComplaintListScreen.styles';

const categoryIconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  PLUMBING: 'water-outline',
  WATER_LEAKAGE: 'water-outline',
  LIFT: 'hardware-chip-outline',
  ELECTRICAL: 'flash-outline',
  SECURITY: 'shield-outline',
  HOUSEKEEPING: 'sparkles-outline',
  PARKING: 'car-outline',
  OTHER: 'alert-circle-outline',
};

export function ComplaintListScreen({ navigation }: ComplaintListScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { data: rawComplaints = [] } = useComplaints();

  const filteredList = useMemo(() => {
    return rawComplaints.filter((item: Complaint) => {
      if (selectedFilter === 'Open' && item.status !== 'OPEN') return false;
      if (selectedFilter === 'In Progress' && item.status !== 'IN_PROGRESS' && item.status !== 'ASSIGNED') return false;
      if (selectedFilter === 'Resolved' && item.status !== 'RESOLVED' && item.status !== 'CLOSED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [rawComplaints, selectedFilter, searchQuery]);

  const handleCardPress = (complaint: Complaint) => {
    navigation.navigate('ComplaintDetail', {
      complaintId: complaint.id,
      complaint,
    });
  };

  const canGoBack = Boolean(navigation?.canGoBack && navigation.canGoBack());

  return (
    <View style={[styles.root, createRootTopInset(insets.top)]}>
      <View style={styles.topHeader}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={8}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#111613" />
          </Pressable>
          <View>
            <Text style={styles.screenTitle}>Complaints</Text>
            <Text style={styles.headerSubtitle}>Track service requests and SLA</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            style={styles.iconActionBtn}
            accessibilityRole="button"
            accessibilityLabel="Search complaints"
          >
            <Ionicons name="search-outline" size={22} color="#111613" />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('CreateComplaint')}
            style={styles.addBtnCircle}
            accessibilityRole="button"
            accessibilityLabel="Raise Complaint"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchBarBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#626A65"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, category, ticket #..."
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

      <View style={styles.segmentedWrapper}>
        <SocietySegmentedControl
          items={[
            { id: 'All', label: 'All' },
            { id: 'Open', label: 'Open' },
            { id: 'In Progress', label: 'In Progress' },
            { id: 'Resolved', label: 'Resolved' },
          ]}
          selectedId={selectedFilter}
          onSelect={(id) =>
            setSelectedFilter(id as 'All' | 'Open' | 'In Progress' | 'Resolved')
          }
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          createScrollPadding(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.groupHeaderRow}>
          <Text style={styles.groupTitle}>{selectedFilter} Tickets</Text>
          <Text style={styles.groupCount}>{filteredList.length}</Text>
        </View>

        {filteredList.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="construct-outline" size={32} color="#8C928E" />
            </View>
            <Text style={styles.emptyTitle}>No complaints yet</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'All'
                ? 'No active or past complaints have been reported yet.'
                : `No complaints currently in "${selectedFilter}" status.`}
            </Text>
            <Pressable
              style={styles.emptyCtaBtn}
              onPress={() => navigation.navigate('CreateComplaint')}
              accessibilityRole="button"
              accessibilityLabel="Raise Complaint"
            >
              <Text style={styles.emptyCtaText}>Raise Complaint</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.listGrid}>
            {filteredList.map((item: Complaint) => {
              const iconName = categoryIconMap[item.category] || 'construct-outline';
              const ticketNum = item.id.startsWith('comp-')
                ? `#C-${item.id.replace('comp-', '')}`
                : `#${item.id}`;

              const isResolved = item.status === 'RESOLVED';
              const isClosed = item.status === 'CLOSED';
              const isReopened = item.status === 'REOPENED';
              const isInProgress = item.status === 'IN_PROGRESS' || item.status === 'ASSIGNED';

              const tone = isClosed
                ? 'neutral'
                : isResolved
                ? 'success'
                : isReopened
                ? 'critical'
                : isInProgress
                ? 'info'
                : 'warning';

              const statusLabel = isClosed
                ? 'Closed'
                : isResolved
                ? 'Resolved'
                : isReopened
                ? 'Reopened'
                : isInProgress
                ? 'In Progress'
                : 'Open';

              return (
                <Pressable
                  key={item.id}
                  style={styles.complaintCard}
                  onPress={() => handleCardPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title}, ${statusLabel}`}
                >
                  <View style={styles.cardContentRow}>
                    <View style={styles.iconCircle}>
                      <Ionicons name={iconName} size={22} color="#064F43" />
                    </View>

                    <View style={styles.infoCol}>
                      <Text style={styles.ticketRefText}>
                        {ticketNum} · {item.category}
                      </Text>
                      <Text style={styles.titleText}>{item.title}</Text>
                      <Text style={styles.sublineText} numberOfLines={2}>
                        {item.description}
                      </Text>

                      <View style={styles.pillRow}>
                        <SocietyStatusPill
                          label={statusLabel}
                          tone={tone}
                          showDot={true}
                        />
                      </View>
                    </View>
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

export default ComplaintListScreen;
