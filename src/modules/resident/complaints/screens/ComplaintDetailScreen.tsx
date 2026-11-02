import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StackActions } from '@react-navigation/native';
import { useComplaintDetail } from '../data/useComplaintDetail';
import { useUpdateComplaintStatus } from '../hooks/useUpdateComplaintStatus';
import type { ComplaintDetailScreenProps } from '../../../../app/navigation/navigation.types';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { SocietyStatusPill } from '../../../../shared/components/SocietyStatusPill';
import { SocietyTimeline, type TimelineStep } from '../../../../shared/components/SocietyTimeline';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

export function ComplaintDetailScreen(props: ComplaintDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { navigation, route } = props;
  const initialComplaint = route.params?.complaint || {
    id: route.params?.complaintId || 'comp-1024',
    title: 'Water leakage in bathroom',
    category: 'PLUMBING',
    status: 'IN_PROGRESS',
    description: 'Water is leaking from the ceiling onto the bathroom floor.',
    createdAt: '2026-10-02T10:15:00Z',
  };

  const { data: fetchedComplaint, isLoading } = useComplaintDetail(initialComplaint.id);
  const complaint = fetchedComplaint ?? initialComplaint;
  const updateComplaintStatus = useUpdateComplaintStatus();

  if (isLoading && !complaint) {
    return <LoadingState message="Loading complaint details..." />;
  }

  const formattedId = complaint.id.startsWith('comp-')
    ? `#C-${complaint.id.replace('comp-', '')}`
    : `#${complaint.id}`;

  const timelineSteps: TimelineStep[] = [
    {
      id: 'step-raised',
      title: 'Complaint raised',
      timestamp: '02 Oct, 10:15 AM',
      status: 'completed',
    },
    {
      id: 'step-assigned',
      title: 'Assigned to staff',
      timestamp: '02 Oct, 11:30 AM',
      status: 'completed',
    },
    {
      id: 'step-progress',
      title: 'In progress',
      timestamp: '02 Oct, 02:45 PM',
      status: complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? 'completed' : 'active',
    },
    {
      id: 'step-resolved',
      title: 'Resolved',
      timestamp: complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? '02 Oct, 05:00 PM' : 'Pending',
      status: complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? 'completed' : 'upcoming',
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <SocietyDetailHeader
        title={`Complaint ${formattedId}`}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Pill Header */}
        <View style={styles.statusPillRow}>
          <SocietyStatusPill
            label={
              complaint.status === 'RESOLVED' || complaint.status === 'CLOSED'
                ? 'Resolved'
                : 'In Progress'
            }
            tone={
              complaint.status === 'RESOLVED' || complaint.status === 'CLOSED'
                ? 'success'
                : 'warning'
            }
            showDot={true}
          />
        </View>

        {/* Title & Metadata */}
        <Text style={styles.complaintTitle}>{complaint.title}</Text>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>{complaint.category}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created</Text>
            <Text style={styles.metaValue}>02 Oct 2026, 10:15 AM</Text>
          </View>
        </View>

        {/* Description Section */}
        {complaint.description ? (
          <View style={styles.descCard}>
            <Text style={styles.descLabel}>Description</Text>
            <Text style={styles.descText}>{complaint.description}</Text>
          </View>
        ) : null}

        {/* Timeline Section */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionHeaderTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            <SocietyTimeline steps={timelineSteps} />
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionButtonsCol}>
          {complaint.status === 'RESOLVED' || complaint.status === 'CLOSED' ? (
            <Pressable
              style={styles.primaryActionBtn}
              onPress={() =>
                navigation.dispatch(
                  StackActions.push('ComplaintFeedback', { complaintId: complaint.id })
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Add Feedback"
            >
              <Text style={styles.primaryActionBtnText}>Add Feedback</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.primaryActionBtn}
              onPress={() =>
                navigation.dispatch(
                  StackActions.push('ComplaintFeedback', { complaintId: complaint.id })
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Resolve & Feedback"
            >
              <Text style={styles.primaryActionBtnText}>Resolve & Give Feedback</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.secondaryActionBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back to Complaints"
          >
            <Text style={styles.secondaryActionBtnText}>Back to Complaints</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  statusPillRow: {
    flexDirection: 'row',
  },
  complaintTitle: {
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
    lineHeight: 28,
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  metaValue: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F2F1EB',
  },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    gap: 8,
  },
  descLabel: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#8C928E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    lineHeight: 22,
  },
  timelineSection: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  actionButtonsCol: {
    gap: 10,
    marginTop: 12,
  },
  primaryActionBtn: {
    backgroundColor: '#064F43',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionBtnText: {
    color: '#064F43',
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
  },
});

export default ComplaintDetailScreen;
