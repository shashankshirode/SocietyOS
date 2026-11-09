import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { useComplaintDetail } from '../data/useComplaintDetail';
import { useUpdateComplaintStatus } from '../hooks/useUpdateComplaintStatus';
import type { ComplaintDetailScreenProps } from '../../../../app/navigation/navigation.types';
import type { Complaint } from '../../../../shared/types/complaint.types';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { SocietyStatusPill, type StatusTone } from '../../../../shared/components/SocietyStatusPill';
import { SocietyTimeline, type TimelineStep } from '../../../../shared/components/SocietyTimeline';
import { LoadingState } from '../../../../shared/feedback/LoadingState';
import {
  styles,
  createRootTopInset,
  createScrollPadding,
} from '../styles/screens/ComplaintDetailScreen.styles';

export function ComplaintDetailScreen(props: ComplaintDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const { navigation, route } = props;
  const initialComplaint: Complaint = route.params?.complaint || {
    id: route.params?.complaintId || 'comp-1024',
    title: 'Water leakage in bathroom',
    category: 'PLUMBING',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    description: 'Water is leaking from the ceiling onto the bathroom floor.',
    createdAt: '2026-10-02T10:15:00Z',
    updatedAt: '2026-10-02T10:15:00Z',
    homeContextId: 'ctx-1',
    societyId: 'soc-1',
    unitId: 'unit-1',
    dataScopeKey: 'scope-1',
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

  const isResolved = complaint.status === 'RESOLVED';
  const isClosed = complaint.status === 'CLOSED';
  const isReopened = complaint.status === 'REOPENED';

  const timelineSteps: TimelineStep[] =
    complaint.updates && complaint.updates.length > 0
      ? complaint.updates.map((u, idx) => ({
          id: u.id || `step-${idx}`,
          title: u.note || `Status: ${u.status}`,
          timestamp: new Date(u.timestamp).toLocaleDateString([], {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: idx === complaint.updates.length - 1 ? 'completed' : 'completed',
        }))
      : [
          {
            id: 'step-raised',
            title: 'Complaint raised',
            timestamp: '02 Oct, 10:15 AM',
            status: 'completed',
          },
          {
            id: 'step-assigned',
            title: complaint.assignedTo ? `Assigned to ${complaint.assignedTo}` : 'Awaiting assignment',
            timestamp: complaint.assignedTo ? '02 Oct, 11:30 AM' : 'Pending',
            status: complaint.assignedTo ? 'completed' : 'upcoming',
          },
          {
            id: 'step-progress',
            title: isResolved || isClosed ? 'Work completed' : 'In progress',
            timestamp: isResolved || isClosed ? '02 Oct, 02:45 PM' : 'Active',
            status: isResolved || isClosed ? 'completed' : 'active',
          },
          {
            id: 'step-resolved',
            title: isClosed ? 'Closed' : isResolved ? 'Resolved' : 'Resolution',
            timestamp: isResolved || isClosed ? '02 Oct, 05:00 PM' : 'Pending',
            status: isResolved || isClosed ? 'completed' : 'upcoming',
          },
        ];

  const handleConfirmResolution = async () => {
    await updateComplaintStatus.submit({
      complaintId: complaint.id,
      status: 'CLOSED',
      note: 'Resolution confirmed by resident.',
    });
    navigation.dispatch(
      StackActions.push('ComplaintFeedback', { complaintId: complaint.id }),
    );
  };

  const handleReopen = () => {
    navigation.dispatch(
      StackActions.push('ComplaintReopen', { complaintId: complaint.id }),
    );
  };

  const statusTone: StatusTone = isClosed
    ? 'neutral'
    : isResolved
    ? 'success'
    : isReopened
    ? 'danger'
    : 'warning';

  const statusLabel = isClosed
    ? 'Closed'
    : isResolved
    ? 'Resolved'
    : isReopened
    ? 'Reopened'
    : complaint.status === 'ASSIGNED'
    ? 'Assigned'
    : 'In Progress';

  return (
    <View style={[styles.root, createRootTopInset(insets.top)]}>
      <SocietyDetailHeader
        title={`Complaint ${formattedId}`}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          createScrollPadding(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <SocietyStatusPill
            label={statusLabel}
            tone={statusTone}
            showDot={true}
          />
        </View>

        <Text style={styles.complaintTitle}>{complaint.title}</Text>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>{complaint.category}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Location</Text>
            <Text style={styles.metaValue}>
              {complaint.location || complaint.flatNumber || 'Flat A-1204'}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Assigned Technician</Text>
            <Text style={styles.metaValue}>
              {complaint.assignedTo || 'Facility Team'}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>SLA Commitment</Text>
            <Text style={styles.metaValue}>
              {complaint.slaText || 'Resolution within 24h'}
            </Text>
          </View>
        </View>

        {complaint.description ? (
          <View style={styles.descCard}>
            <Text style={styles.descLabel}>Description</Text>
            <Text style={styles.descText}>{complaint.description}</Text>
          </View>
        ) : null}

        {complaint.rating ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>
              Resident Rating: {'★'.repeat(complaint.rating)} ({complaint.rating}/5)
            </Text>
            {complaint.feedbackComment ? (
              <Text style={styles.feedbackComment}>"{complaint.feedbackComment}"</Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.timelineSection}>
          <Text style={styles.sectionHeaderTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            <SocietyTimeline steps={timelineSteps} />
          </View>
        </View>

        <View style={styles.actionButtonsCol}>
          {isResolved ? (
            <>
              <Pressable
                style={styles.primaryActionBtn}
                onPress={handleConfirmResolution}
                accessibilityRole="button"
                accessibilityLabel="Confirm resolution"
              >
                <Text style={styles.primaryActionBtnText}>
                  Confirm Resolution & Rate
                </Text>
              </Pressable>

              <Pressable
                style={styles.reopenBtn}
                onPress={handleReopen}
                accessibilityRole="button"
                accessibilityLabel="Reopen complaint"
              >
                <Text style={styles.reopenBtnText}>
                  Issue Persists · Reopen Complaint
                </Text>
              </Pressable>
            </>
          ) : isClosed ? (
            !complaint.rating ? (
              <Pressable
                style={styles.primaryActionBtn}
                onPress={() =>
                  navigation.dispatch(
                    StackActions.push('ComplaintFeedback', {
                      complaintId: complaint.id,
                    }),
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Add feedback"
              >
                <Text style={styles.primaryActionBtnText}>Add Feedback</Text>
              </Pressable>
            ) : null
          ) : (
            <Pressable
              style={styles.primaryActionBtn}
              onPress={() =>
                navigation.dispatch(
                  StackActions.push('ComplaintFeedback', {
                    complaintId: complaint.id,
                  }),
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Resolve and feedback"
            >
              <Text style={styles.primaryActionBtnText}>
                Resolve & Give Feedback
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.secondaryActionBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back to complaints"
          >
            <Text style={styles.secondaryActionBtnText}>Back to Complaints</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

export default ComplaintDetailScreen;
