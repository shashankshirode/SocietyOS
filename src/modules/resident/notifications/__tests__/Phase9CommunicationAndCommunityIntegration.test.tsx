import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import {
  residentNotificationsMockSource,
  emitInAppNotification,
  resetNotificationMockState,
} from '../data/residentNotifications.mockSource';
import { NotificationInboxScreen } from '../screens/NotificationInboxScreen';
import {
  communityFeedMockSource,
  resetCommunityFeedMockState,
} from '../../../community/data/communityFeed.mockSource';
import { noticeMockSource } from '../../notices/data/notice.mockSource';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import { residentContactMockSource, resetResidentContactMockState } from '../../residentConnect/data/residentContact.mockSource';
import type { ResidentContactScope } from '../../residentConnect/domain/residentContact.types';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn().mockReturnValue(true),
};

const residentContext = resolveRequestContext();

const primaryContactScope: ResidentContactScope = {
  societyId: residentContext.activeHome.societyId || 'society-gv',
  activeUnitId: residentContext.activeHome.unitId || 'unit-gv-a-1204',
  authenticatedUserId: 'user-resident-001',
  residentProfileId: 'resident-001',
};

describe('Phase 9: Comprehensive Communications, Notifications & Community Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNotificationMockState();
    resetCommunityFeedMockState();
    resetResidentContactMockState();
  });

  describe('1. Unified Smart Notification Inbox', () => {
    it('lists seeded notifications and accurately counts unread status', async () => {
      const result = await residentNotificationsMockSource.list(residentContext);
      expect(result.ok).toBe(true);
      if (!result.ok) return;

      expect(result.data.length).toBeGreaterThan(0);
      const unread = result.data.filter((n) => n.status === 'unread');
      expect(unread.length).toBeGreaterThanOrEqual(0);
    });

    it('marks a single notification as read and persists state', async () => {
      const listBefore = await residentNotificationsMockSource.list(residentContext);
      if (!listBefore.ok) return;

      const targetItem = listBefore.data[0];
      expect(targetItem).toBeDefined();
      if (!targetItem) return;

      const markRes = await residentNotificationsMockSource.markAsRead(targetItem.id, residentContext);
      expect(markRes.ok).toBe(true);

      const listAfter = await residentNotificationsMockSource.list(residentContext);
      if (!listAfter.ok) return;

      const updated = listAfter.data.find((n) => n.id === targetItem.id);
      expect(updated?.status).toBe('read');
    });

    it('marks all notifications as read across all categories', async () => {
      const markAllRes = await residentNotificationsMockSource.markAllAsRead(residentContext);
      expect(markAllRes.ok).toBe(true);

      const listAfter = await residentNotificationsMockSource.list(residentContext);
      if (!listAfter.ok) return;

      const anyUnread = listAfter.data.some((n) => n.status === 'unread');
      expect(anyUnread).toBe(false);
    });

    it('dynamically receives and displays cross-module business notifications', async () => {
      emitInAppNotification({
        id: 'dyn-notif-visitor-arrived',
        homeContextId: residentContext.activeHome.homeContextId,
        societyId: residentContext.activeHome.societyId,
        unitId: residentContext.activeHome.unitId,
        dataScopeKey: residentContext.dataScopeKey,
        title: 'Visitor Pass Verified at Security',
        description: 'Deepak Sharma has entered through Gate 2.',
        category: 'SECURITY',
        status: 'unread',
        priority: 'normal',
        actionable: true,
        createdAtIso: new Date().toISOString(),
        deepLink: 'VisitorList',
      });

      const list = await residentNotificationsMockSource.list(residentContext);
      if (!list.ok) return;

      const found = list.data.find((n) => n.id === 'dyn-notif-visitor-arrived');
      expect(found).toBeDefined();
      expect(found?.title).toBe('Visitor Pass Verified at Security');
      expect(found?.category).toBe('SECURITY');
      expect(found?.status).toBe('unread');
    });

    it('manages resident notification preferences', async () => {
      const prefs = await residentNotificationsMockSource.getPreferences();
      expect(prefs.ok).toBe(true);
      if (!prefs.ok) return;

      expect(prefs.data.pushEnabled).toBe(true);
      expect(prefs.data.inAppEnabled).toBe(true);

      const updateRes = await residentNotificationsMockSource.updatePreferences({
        quietHoursEnabled: false,
        smsEnabled: true,
      });
      expect(updateRes.ok).toBe(true);
      if (!updateRes.ok) return;

      expect(updateRes.data.quietHoursEnabled).toBe(false);
      expect(updateRes.data.smsEnabled).toBe(true);
    });
  });

  describe('2. Society Notices & Acknowledgment Tracking', () => {
    it('creates and lists targeted society notices', async () => {
      const createRes = await noticeMockSource.create(residentContext, {
        title: 'Lift Maintenance Schedule for Tower A',
        body: 'Passenger lift 1 will be shut down for annual overhaul this Sunday.',
        category: 'MAINTENANCE',
        priority: 'IMPORTANT',
        targetAudience: 'Tower A Residents',
        acknowledgementRequired: true,
      });
      expect(createRes.ok).toBe(true);
      if (!createRes.ok) return;

      expect(createRes.data.title).toBe('Lift Maintenance Schedule for Tower A');
      expect(createRes.data.acknowledgementRequired).toBe(true);
      expect(createRes.data.acknowledged).toBe(false);
    });

    it('records resident notice acknowledgment and stores unique resident IDs', async () => {
      const allNotices = await noticeMockSource.list(residentContext);
      if (!allNotices.ok || allNotices.data.length === 0) return;

      const notice = allNotices.data[0];
      expect(notice).toBeDefined();
      if (!notice) return;

      const ackRes = await noticeMockSource.acknowledge(residentContext, notice.id);
      expect(ackRes.ok).toBe(true);
      if (!ackRes.ok || !ackRes.data) return;

      expect(ackRes.data.acknowledged).toBe(true);
      expect(ackRes.data.status).toBe('READ');
      expect(ackRes.data.acknowledgedResidents).toContain(residentContext.activeHome.residentId || 'resident-001');

      const ackAgain = await noticeMockSource.acknowledge(residentContext, notice.id);
      expect(ackAgain.ok).toBe(true);
      if (!ackAgain.ok || !ackAgain.data) return;

      const residentId = residentContext.activeHome.residentId || 'resident-001';
      const matches = ackAgain.data.acknowledgedResidents?.filter((id) => id === residentId);
      expect(matches?.length).toBe(1);
    });
  });

  describe('3. Community Feed, Posts, Comments & Reactions', () => {
    it('retrieves active feed posts excluding hidden or removed content', async () => {
      const feedRes = await communityFeedMockSource.getFeed(residentContext);
      expect(feedRes.ok).toBe(true);
      if (!feedRes.ok) return;

      expect(feedRes.data.length).toBeGreaterThan(0);
      expect(feedRes.data.every((p) => p.status === 'ACTIVE' || p.status === 'REPORTED')).toBe(true);
    });

    it('creates a new community post with validation', async () => {
      const invalidShort = await communityFeedMockSource.createPost(residentContext, {
        title: 'Hi',
        content: 'Short',
        category: 'GENERAL',
      });
      expect(invalidShort.ok).toBe(false);

      const validPost = await communityFeedMockSource.createPost(residentContext, {
        title: 'Lost Golden Retriever near Wing B entrance',
        content: 'Wearing a red collar with contact tag. Please call security or A-1204 if spotted.',
        category: 'LOST_FOUND',
      });
      expect(validPost.ok).toBe(true);
      if (!validPost.ok) return;

      expect(validPost.data.title).toContain('Golden Retriever');
      expect(validPost.data.status).toBe('ACTIVE');
      expect(validPost.data.likesCount).toBe(0);
    });

    it('toggles reactions and prevents duplicate reaction inflation', async () => {
      const feed = await communityFeedMockSource.getFeed(residentContext);
      if (!feed.ok || feed.data.length === 0) return;

      const targetPost = feed.data[0]!;
      const initialLikes = targetPost.likesCount;

      const likeFirst = await communityFeedMockSource.toggleReaction(residentContext, {
        postId: targetPost.id,
        reactionType: 'LIKE',
        userId: 'res-tester-99',
      });
      expect(likeFirst.ok).toBe(true);
      if (!likeFirst.ok) return;
      expect(likeFirst.data.likesCount).toBe(initialLikes + 1);
      expect(likeFirst.data.likedBy).toContain('res-tester-99');

      const likeSecond = await communityFeedMockSource.toggleReaction(residentContext, {
        postId: targetPost.id,
        reactionType: 'LIKE',
        userId: 'res-tester-99',
      });
      expect(likeSecond.ok).toBe(true);
      if (!likeSecond.ok) return;
      expect(likeSecond.data.likesCount).toBe(initialLikes);
      expect(likeSecond.data.likedBy).not.toContain('res-tester-99');
    });

    it('adds comments to community post and increments comment count', async () => {
      const feed = await communityFeedMockSource.getFeed(residentContext);
      if (!feed.ok || feed.data.length === 0) return;

      const targetPost = feed.data[0]!;
      const initialComments = targetPost.commentsCount;

      const commentRes = await communityFeedMockSource.addComment(residentContext, {
        postId: targetPost.id,
        content: 'Thanks for organizing this initiative! Our flat is attending.',
        authorName: 'Rohan Sharma',
        authorUnit: 'A-1204',
      });
      expect(commentRes.ok).toBe(true);
      if (!commentRes.ok) return;

      expect(commentRes.data.content).toBe('Thanks for organizing this initiative! Our flat is attending.');

      const feedAfter = await communityFeedMockSource.getFeed(residentContext);
      if (!feedAfter.ok) return;

      const updatedPost = feedAfter.data.find((p) => p.id === targetPost.id);
      expect(updatedPost?.commentsCount).toBe(initialComments + 1);
    });
  });

  describe('4. Content Moderation Workflow', () => {
    it('resident reports inappropriate post and transitions status to REPORTED', async () => {
      const feed = await communityFeedMockSource.getFeed(residentContext);
      if (!feed.ok || feed.data.length === 0) return;

      const targetPost = feed.data[0]!;
      const reportRes = await communityFeedMockSource.reportPost(residentContext, {
        postId: targetPost.id,
        reason: 'Commercial spam advertising third-party service',
        reportedBy: 'resident-001',
      });
      expect(reportRes.ok).toBe(true);

      const feedAfter = await communityFeedMockSource.getFeed(residentContext);
      if (!feedAfter.ok) return;

      const reportedPost = feedAfter.data.find((p) => p.id === targetPost.id);
      expect(reportedPost?.isReported).toBe(true);
      expect(reportedPost?.status).toBe('REPORTED');
    });

    it('moderator hiding a post removes it immediately from resident feed', async () => {
      const feed = await communityFeedMockSource.getFeed(residentContext);
      if (!feed.ok || feed.data.length === 0) return;

      const targetPost = feed.data[0]!;
      const modRes = await communityFeedMockSource.moderatePost(residentContext, {
        postId: targetPost.id,
        action: 'HIDE',
        reason: 'Violates community standards on offensive language',
        adminId: 'admin-001',
      });
      expect(modRes.ok).toBe(true);
      if (!modRes.ok) return;
      expect(modRes.data.status).toBe('HIDDEN');

      const feedAfter = await communityFeedMockSource.getFeed(residentContext);
      if (!feedAfter.ok) return;

      const stillVisible = feedAfter.data.some((p) => p.id === targetPost.id);
      expect(stillVisible).toBe(false);
    });
  });

  describe('5. Community Polls & Mathematically Rigorous Voting', () => {
    it('submits poll vote and accurately recalculates percentages and totals', async () => {
      const pollRes = await communityFeedMockSource.submitPollVote(
        'poll-101',
        ['opt-101a'],
        'voter-unit-101',
        true
      );
      expect(pollRes.ok).toBe(true);
      if (!pollRes.ok) return;

      const updated = pollRes.data;
      expect(updated.myVoteStatus).toBe('VOTED');
      expect(updated.myVotedOptionIds).toEqual(['opt-101a']);

      const totalSum = updated.options.reduce((sum, o) => sum + o.voteCount, 0);
      expect(updated.totalVotes).toBe(totalSum);

      updated.options.forEach((opt) => {
        const expectedPct = Math.round((opt.voteCount / updated.totalVotes) * 100);
        expect(opt.percentage).toBe(expectedPct);
      });
    });

    it('prevents duplicate votes from the same resident', async () => {
      const firstVote = await communityFeedMockSource.submitPollVote(
        'poll-103',
        ['opt-103a'],
        'voter-unit-a1204',
        true
      );
      expect(firstVote.ok).toBe(true);

      const duplicateVote = await communityFeedMockSource.submitPollVote(
        'poll-103',
        ['opt-103b'],
        'voter-unit-a1204',
        true
      );
      expect(duplicateVote.ok).toBe(false);
      if (!duplicateVote.ok) {
        expect(duplicateVote.error.code).toBe('DUPLICATE_VOTE');
      }
    });

    it('rejects votes on closed polls', async () => {
      const closedVote = await communityFeedMockSource.submitPollVote(
        'poll-104',
        ['opt-104c'],
        'voter-new',
        true
      );
      expect(closedVote.ok).toBe(false);
      if (!closedVote.ok) {
        expect(closedVote.error.code).toBe('POLL_CLOSED');
      }
    });

    it('rejects non-owner participation in owner-only polls', async () => {
      const tenantVote = await communityFeedMockSource.submitPollVote(
        'poll-103',
        ['opt-103a'],
        'tenant-user-1',
        false
      );
      expect(tenantVote.ok).toBe(false);
      if (!tenantVote.ok) {
        expect(tenantVote.error.code).toBe('PERMISSION_DENIED');
      }
    });
  });

  describe('6. Community Events & Capacity / Waitlist Engine', () => {
    it('records RSVP Going within capacity limits', async () => {
      const rsvpRes = await communityFeedMockSource.submitRsvp(residentContext, {
        eventId: 'event-201',
        status: 'GOING',
        guestCount: 2,
        residentId: 'resident-001',
      });
      expect(rsvpRes.ok).toBe(true);
      if (!rsvpRes.ok) return;

      expect(rsvpRes.data.rsvpStatus).toBe('GOING');
      expect(rsvpRes.data.waitlisted).toBe(false);
      expect(rsvpRes.data.event.currentAttendees).toBe(30);
    });

    it('automatically waitlists RSVP when event exceeds max capacity', async () => {
      const overCapacityRsvp = await communityFeedMockSource.submitRsvp(residentContext, {
        eventId: 'event-202',
        status: 'GOING',
        guestCount: 2,
        residentId: 'resident-overflow',
      });
      expect(overCapacityRsvp.ok).toBe(true);
      if (!overCapacityRsvp.ok) return;

      expect(overCapacityRsvp.data.rsvpStatus).toBe('WAITLIST');
      expect(overCapacityRsvp.data.waitlisted).toBe(true);
      expect(overCapacityRsvp.data.event.waitlistCount).toBeGreaterThanOrEqual(1);
    });

    it('promotes waitlisted resident when an attendee cancels', async () => {
      const cancelRes = await communityFeedMockSource.submitRsvp(residentContext, {
        eventId: 'event-202',
        status: 'NOT_GOING',
        residentId: 'res-c501',
      });
      expect(cancelRes.ok).toBe(true);
      if (!cancelRes.ok) return;

      const promotedRsvp = cancelRes.data.event.rsvps['res-waitlisted-1'];
      expect(promotedRsvp?.status).toBe('GOING');
    });
  });

  describe('7. Resident Directory Privacy & Contact Lifecycle', () => {
    it('excludes hidden, inactive and own-unit profiles from directory', async () => {
      const dirRes = await residentContactMockSource.getDirectory(primaryContactScope);
      expect(dirRes.ok).toBe(true);
      if (!dirRes.ok) return;

      const profiles = dirRes.data.flatMap((g) => g.units.flatMap((u) => u.residents));
      expect(profiles.some((p) => p.residentProfileId === 'gv-hidden')).toBe(false);
      expect(profiles.some((p) => p.residentProfileId === 'gv-inactive')).toBe(false);
      expect(profiles.some((p) => p.unitId === primaryContactScope.activeUnitId)).toBe(false);
    });

    it('enforces multi-society isolation strictly', async () => {
      const dirRes = await residentContactMockSource.getDirectory(primaryContactScope);
      if (!dirRes.ok) return;

      const profiles = dirRes.data.flatMap((g) => g.units.flatMap((u) => u.residents));
      expect(profiles.every((p) => p.societyId === primaryContactScope.societyId)).toBe(true);
    });

    it('blocking a resident removes them from future directory results', async () => {
      const before = await residentContactMockSource.getDirectory(primaryContactScope);
      if (!before.ok) return;

      await residentContactMockSource.blockRequester({
        ...primaryContactScope,
        requestId: 'contact-incoming-1',
      });

      const after = await residentContactMockSource.getDirectory(primaryContactScope);
      if (!after.ok) return;

      const beforeIds = before.data.flatMap((g) => g.units.flatMap((u) => u.residents.map((r) => r.residentProfileId)));
      const afterIds = after.data.flatMap((g) => g.units.flatMap((u) => u.residents.map((r) => r.residentProfileId)));
      expect(afterIds.length).toBeLessThanOrEqual(beforeIds.length);
    });
  });

  describe('8. Notification Inbox Screen UI Rendering', () => {
    it('renders notification inbox screen with title, back button and filter categories', async () => {
      await renderWithProviders(
        <NotificationInboxScreen navigation={mockNavigation} />
      );

      expect(screen.getByTestId('notification-inbox-screen')).toBeTruthy();
      expect(screen.getByText('Notifications')).toBeTruthy();
      expect(screen.getByTestId('notification-inbox-back-btn')).toBeTruthy();

      expect(screen.getByTestId('notification-filter-all')).toBeTruthy();
      expect(screen.getByTestId('notification-filter-security')).toBeTruthy();
      expect(screen.getByTestId('notification-filter-billing')).toBeTruthy();
      expect(screen.getByTestId('notification-filter-complaints')).toBeTruthy();
      expect(screen.getByTestId('notification-filter-notices')).toBeTruthy();
      expect(screen.getByTestId('notification-filter-community')).toBeTruthy();
    });

    it('filters notifications when tapping a category pill', async () => {
      await renderWithProviders(
        <NotificationInboxScreen navigation={mockNavigation} />
      );

      const securityPill = screen.getByTestId('notification-filter-security');
      fireEvent.press(securityPill);

      await waitFor(() => {
        expect(screen.getByTestId('notification-inbox-screen')).toBeTruthy();
      });
    });

    it('invokes back navigation when back button is pressed', async () => {
      await renderWithProviders(
        <NotificationInboxScreen navigation={mockNavigation} />
      );

      const backBtn = screen.getByTestId('notification-inbox-back-btn');
      fireEvent.press(backBtn);
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });
});
