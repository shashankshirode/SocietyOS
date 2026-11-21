import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVisitors } from '../data/useVisitors';
import { useVisitorLifecycle } from '../data/visitorLifecycle.store';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { useFeatureFlags } from '../../../../core/featureFlags/useFeatureFlag';
import { SocietySegmentedControl } from '../../../../shared/components/SocietySegmentedControl';
import { SocietyStatusPill } from '../../../../shared/components/SocietyStatusPill';
import type { VisitorListScreenProps } from '../../../../app/navigation/navigation.types';
import type { Visitor } from '../../../../shared/types/visitor.types';
import {
  styles,
  createRootTopInset,
  createScrollContentPadding,
} from '../styles/screens/VisitorListScreen.styles';

export function VisitorListScreen({ navigation }: VisitorListScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isEnabled } = useFeatureFlags();
  const [selectedSegment, setSelectedSegment] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { data: rawVisitors = [], isLoading } = useVisitors();
  const {
    getPendingApprovals,
    respondToWalkIn,
    getParcels,
    confirmParcelPickup,
  } = useVisitorLifecycle();

  const pendingApprovals = getPendingApprovals('A-1204');
  const pendingParcels = getParcels('A-1204').filter(
    (p) => p.status === 'WAITING_COLLECTION',
  );

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
    <View style={[styles.root, createRootTopInset(insets.top)]}>
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
          <Text style={styles.hiddenAccessibilityText}>Visitor Passes</Text>
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

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          createScrollContentPadding(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {selectedSegment === 'Upcoming' && (pendingApprovals.length > 0 || pendingParcels.length > 0) ? (
          <View style={styles.bannerSection}>
            {pendingApprovals.map((req) => (
              <View key={req.requestId} style={styles.approvalCard}>
                <View style={styles.approvalHeader}>
                  <View style={styles.approvalIconBox}>
                    <Ionicons name="person-outline" size={20} color="#7D4A00" />
                  </View>
                  <View style={styles.approvalInfo}>
                    <Text style={styles.approvalTitle}>
                      {req.visitorName} is at {req.gateName || 'Main Gate'}
                    </Text>
                    <Text style={styles.approvalSubtitle}>
                      {req.visitorCategory} · Waiting for your approval
                    </Text>
                  </View>
                </View>
                <View style={styles.approvalActions}>
                  <Pressable
                    style={styles.allowBtn}
                    onPress={() => respondToWalkIn(req.requestId || req.id, 'APPROVE')}
                    accessibilityRole="button"
                    accessibilityLabel="Allow entry"
                  >
                    <Text style={styles.allowBtnText}>Allow Entry</Text>
                  </Pressable>
                  <Pressable
                    style={styles.denyBtn}
                    onPress={() => respondToWalkIn(req.requestId || req.id, 'DENY', 'res-001', 'Denied by resident')}
                    accessibilityRole="button"
                    accessibilityLabel="Deny entry"
                  >
                    <Text style={styles.denyBtnText}>Deny</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {pendingParcels.map((parcel) => (
              <View key={parcel.id} style={styles.parcelCard}>
                <View style={styles.parcelInfo}>
                  <Text style={styles.parcelTitle}>
                    {parcel.deliveryPartner} parcel at {parcel.gateName}
                  </Text>
                  <Text style={styles.parcelSubtitle}>
                    Tracking: {parcel.trackingNumber} · Awaiting pickup
                  </Text>
                </View>
                <Pressable
                  style={styles.collectBtn}
                  onPress={() => confirmParcelPickup(parcel.id, 'Resident')}
                  accessibilityRole="button"
                  accessibilityLabel="Confirm pickup"
                >
                  <Text style={styles.collectBtnText}>Collected</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

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
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>

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

export default VisitorListScreen;
