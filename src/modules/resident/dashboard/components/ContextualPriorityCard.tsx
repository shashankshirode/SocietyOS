import { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { ResidentDashboardData } from '../data/dashboard.types';
import {
  createCapsuleTextStyle,
  createCapsuleToneStyle,
  createCardToneStyle,
  createCtaButtonStyle,
  createSectionHeadingStyle,
  createSectionLinkStyle,
  createTimeLabelStyle,
  createCardTitleStyle,
  createCardSubtitleStyle,
  createCtaButtonTextStyle,
  styles,
} from '../styles/components/ContextualPriorityCard.styles';

export interface ContextualPriorityCardProps {
  dashboard: ResidentDashboardData;
  canManageBills: boolean;
  attentionCount: number;
  attentionLabel: string;
  sectionHeading: string;
  onViewAllPriorities: () => void;
  onAction: (actionType: string) => void;
}

type ToneType = 'amber' | 'rose' | 'emerald' | 'sky' | 'violet';

interface PriorityConfig {
  tag: string;
  timeLabel?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tone: ToneType;
  actionType: string;
}

interface SemanticToneStyles {
  border: string;
  bg: string;
  capsuleBg: string;
  text: string;
  buttonBg: string;
}

export const ContextualPriorityCard = memo(function ContextualPriorityCard({
  dashboard,
  canManageBills,
  attentionCount,
  attentionLabel,
  sectionHeading,
  onViewAllPriorities,
  onAction,
}: ContextualPriorityCardProps) {
  const { semantic } = useAppTheme();

  const getToneStyles = (tone: ToneType): SemanticToneStyles => {
    switch (tone) {
      case 'amber':
        return {
          border: semantic.status.warning,
          bg: semantic.status.warningSurface,
          capsuleBg: semantic.status.warningSurface,
          text: semantic.status.warning,
          buttonBg: semantic.status.warning,
        };
      case 'rose':
        return {
          border: semantic.status.danger,
          bg: semantic.status.dangerSurface,
          capsuleBg: semantic.status.dangerSurface,
          text: semantic.status.danger,
          buttonBg: semantic.status.danger,
        };
      case 'emerald':
        return {
          border: semantic.status.success,
          bg: semantic.status.successSurface,
          capsuleBg: semantic.status.successSurface,
          text: semantic.status.success,
          buttonBg: semantic.status.success,
        };
      case 'sky':
        return {
          border: semantic.status.info,
          bg: semantic.status.infoSurface,
          capsuleBg: semantic.status.infoSurface,
          text: semantic.status.info,
          buttonBg: semantic.status.info,
        };
      case 'violet':
        return {
          border: semantic.accent.lavender,
          bg: semantic.accent.lavender + '20',
          capsuleBg: semantic.accent.lavender + '20',
          text: semantic.accent.lavender,
          buttonBg: semantic.accent.lavender,
        };
    }
  };

  const priority = useMemo<PriorityConfig>(() => {
    const waitingVisitor = dashboard.visitorTimeline.find(
      (v) => v.status === 'waitingAtGate',
    );
    if (waitingVisitor) {
      return {
        tag: 'Action Required · Gate',
        timeLabel: 'Waiting now',
        title: `${waitingVisitor.visitorName} is at ${waitingVisitor.gateName}`,
        subtitle: `${waitingVisitor.purpose || 'Visitor arrival'} · Approval pending`,
        ctaText: 'Review & Admit',
        iconName: 'shield-checkmark',
        tone: 'amber' as ToneType,
        actionType: 'act-visitor',
      };
    }

    const urgentNotice = dashboard.notices.find(
      (n) => n.category === 'emergency' || n.category === 'important',
    );
    if (urgentNotice) {
      return {
        tag: 'Urgent Notice',
        timeLabel: 'Society alert',
        title: urgentNotice.title,
        subtitle: urgentNotice.summary || 'Important society communication',
        ctaText: 'Read Notice',
        iconName: 'alert-circle',
        tone: 'rose' as ToneType,
        actionType: 'act-notice',
      };
    }

    const isOverdue =
      dashboard.maintenancePayment.status === 'overdue' && canManageBills;
    if (isOverdue) {
      const amount = (
        dashboard.maintenancePayment.totalOutstanding ??
        dashboard.maintenancePayment.billAmount
      ).toLocaleString('en-IN');
      return {
        tag: 'Payment Overdue',
        timeLabel: 'Immediate',
        title: `${dashboard.maintenancePayment.billingMonth} · ₹${amount}`,
        subtitle: 'Maintenance payment is overdue · Fast UPI payment',
        ctaText: 'Pay via UPI',
        iconName: 'card',
        tone: 'rose' as ToneType,
        actionType: 'act-pay',
      };
    }

    const isDue =
      dashboard.maintenancePayment.status !== 'paid' && canManageBills;
    if (isDue) {
      const amount = (
        dashboard.maintenancePayment.totalOutstanding ??
        dashboard.maintenancePayment.billAmount
      ).toLocaleString('en-IN');
      const dueDays = dashboard.maintenancePayment.dueInDays || 4;
      return {
        tag: 'Maintenance Due',
        timeLabel: `Due in ${dueDays} days`,
        title: `${dashboard.maintenancePayment.billingMonth} · ₹${amount}`,
        subtitle: `Society maintenance bill · Instant digital receipt`,
        ctaText: 'Pay Now',
        iconName: 'card',
        tone: 'amber' as ToneType,
        actionType: 'act-pay',
      };
    }

    if (
      dashboard.complaintProgress &&
      ['high', 'critical'].includes(dashboard.complaintProgress.priority)
    ) {
      return {
        tag: 'Active Service Request',
        timeLabel: dashboard.complaintProgress.slaRemainingLabel || 'In progress',
        title: dashboard.complaintProgress.title,
        subtitle:
          dashboard.complaintProgress.latestUpdate ||
          dashboard.complaintProgress.assignedTo,
        ctaText: 'Track Progress',
        iconName: 'construct',
        tone: 'sky' as ToneType,
        actionType: 'act-complaint',
      };
    }

    const upcomingVisitor = dashboard.visitorTimeline.find(
      (v) => v.status === 'upcoming',
    );
    if (upcomingVisitor) {
      return {
        tag: 'Expected Today',
        timeLabel: upcomingVisitor.validFrom,
        title: `${upcomingVisitor.visitorName} Expected`,
        subtitle: `${upcomingVisitor.purpose || 'Guest visit'} · Pass active`,
        ctaText: 'View Pass Code',
        iconName: 'person',
        tone: 'emerald' as ToneType,
        actionType: 'act-visitor',
      };
    }

    const bookedAmenity = dashboard.amenities.find(
      (a) => a.availabilityStatus === 'limited' || Boolean(a.nextSlotLabel),
    );
    if (bookedAmenity) {
      return {
        tag: 'Upcoming Booking',
        timeLabel: bookedAmenity.nextSlotLabel || 'Today',
        title: `${bookedAmenity.name} Reserved`,
        subtitle: 'Facility booking confirmed for your unit',
        ctaText: 'View Details',
        iconName: 'calendar',
        tone: 'violet' as ToneType,
        actionType: 'act-amenity',
      };
    }

    return {
      tag: 'All Caught Up',
      timeLabel: 'Peace of mind',
      title: 'Everything is in order at home',
      subtitle: 'No pending bills, waiting visitors, or open complaints',
      ctaText: 'Explore Facilities',
      iconName: 'checkmark-circle',
      tone: 'emerald' as ToneType,
      actionType: 'act-amenity',
    };
  }, [dashboard, canManageBills]);

  const toneConfig = getToneStyles(priority.tone);

  return (
    <View style={styles.root}>
      <View style={styles.sectionHeaderRow}>
        <SafeText style={createSectionHeadingStyle(semantic.text.primary)}>{sectionHeading}</SafeText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={attentionLabel}
          onPress={onViewAllPriorities}
        >
          <SafeText style={createSectionLinkStyle(semantic.text.secondary)}>
            {`View all (${Math.max(attentionCount, 1)}) ›`}
          </SafeText>
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          createCardToneStyle(toneConfig.border, toneConfig.bg),
        ]}
      >
        <View style={styles.cardTopRow}>
          <View
            style={[
              styles.tagCapsule,
              createCapsuleToneStyle(toneConfig.capsuleBg),
            ]}
          >
            <Ionicons
              name={priority.iconName}
              size={12}
              color={toneConfig.text}
            />
            <SafeText
              style={[styles.tagText, createCapsuleTextStyle(toneConfig.text)]}
            >
              {priority.tag}
            </SafeText>
          </View>
          {priority.timeLabel ? (
            <SafeText style={createTimeLabelStyle(semantic.text.secondary)}>{priority.timeLabel}</SafeText>
          ) : null}
        </View>

        <View style={styles.cardBody}>
          <SafeText style={createCardTitleStyle(semantic.text.primary)} numberOfLines={2}>
            {priority.title}
          </SafeText>
          <SafeText style={createCardSubtitleStyle(semantic.text.secondary)} numberOfLines={2}>
            {priority.subtitle}
          </SafeText>
        </View>

        <View style={styles.cardBottomRow}>
          <Pressable
            style={[
              styles.ctaButton,
              createCtaButtonStyle(toneConfig.buttonBg),
            ]}
            accessibilityRole="button"
            accessibilityLabel={priority.ctaText}
            onPress={() => onAction(priority.actionType)}
          >
            <SafeText style={createCtaButtonTextStyle(semantic.text.inverse)}>{priority.ctaText}</SafeText>
            <Ionicons name="arrow-forward" size={14} color={semantic.text.inverse} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export default ContextualPriorityCard;
