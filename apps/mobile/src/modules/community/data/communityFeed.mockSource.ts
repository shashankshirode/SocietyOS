import { repositorySuccess, repositoryFailure, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../resident/homeContext/data/residentHomeContext.types';
import { resolveRequestContext } from '../../resident/homeContext/utils/resolveRequestContext';
import type {
  CommunityPost,
  CommunityComment,
  CreatePostInput,
  ToggleReactionInput,
  AddCommentInput,
  ReportPostInput,
  ModeratePostInput,
} from '../../../shared/types/communityFeed.types';
import type {
  CommunityEvent,
  SubmitRsvpInput,
  CreateEventInput,
} from '../../../shared/types/communityEvent.types';
import type { Poll } from '../../../shared/types/poll.types';
import { mockPollsList } from '../../../shared/mock/polls.mock';

const initialPosts: CommunityPost[] = [
  {
    id: 'post-101',
    societyId: 'society-gv',
    authorId: 'res-a1204',
    authorName: 'Rohan Sharma',
    authorUnit: 'A-1204',
    category: 'GENERAL',
    title: 'Monsoon balcony drainage and safety precautions',
    content: 'Dear residents, with heavy rains expected this week, please ensure balcony drains are clear of fallen leaves and loose planters are secured against high winds.',
    status: 'ACTIVE',
    createdAtIso: new Date(Date.now() - 3600000 * 5).toISOString(),
    likesCount: 14,
    helpfulCount: 22,
    likedBy: ['res-b804', 'res-c501'],
    helpfulBy: ['res-b804', 'res-c501', 'res-d202'],
    commentsCount: 2,
    comments: [
      {
        id: 'comm-101-1',
        postId: 'post-101',
        authorId: 'res-b804',
        authorName: 'Priya Mehta',
        authorUnit: 'B-804',
        content: 'Thanks for the timely reminder Rohan! Cleaning our drain now.',
        createdAtIso: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: 'comm-101-2',
        postId: 'post-101',
        authorId: 'res-c501',
        authorName: 'Vikram Joshi',
        authorUnit: 'C-501',
        content: 'Housekeeping team is also inspecting common terrace outlets today.',
        createdAtIso: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'post-102',
    societyId: 'society-gv',
    authorId: 'res-b804',
    authorName: 'Priya Mehta',
    authorUnit: 'B-804',
    category: 'HELP',
    title: 'Recommendation needed for pediatric dentist nearby',
    content: 'Can anyone recommend an experienced pediatric dental clinic near Baner / Balewadi for a 5-year-old?',
    status: 'ACTIVE',
    createdAtIso: new Date(Date.now() - 3600000 * 24).toISOString(),
    likesCount: 5,
    helpfulCount: 8,
    likedBy: ['res-a1204'],
    helpfulBy: ['res-a1204'],
    commentsCount: 1,
    comments: [
      {
        id: 'comm-102-1',
        postId: 'post-102',
        authorId: 'res-a1204',
        authorName: 'Rohan Sharma',
        authorUnit: 'A-1204',
        content: 'Dr. Kulkarni at Dental Care Clinic next to Medipoint is wonderful with kids.',
        createdAtIso: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ],
  },
  {
    id: 'post-103',
    societyId: 'society-gv',
    authorId: 'res-admin',
    authorName: 'Managing Committee',
    authorUnit: 'Society Office',
    category: 'GOVERNANCE',
    title: 'Annual General Body Meeting Schedule & Audit Report Preview',
    content: 'The audited financial statements for FY 2025-26 and proposed capital improvement agenda are now available for review in the Document Vault.',
    status: 'ACTIVE',
    createdAtIso: new Date(Date.now() - 3600000 * 48).toISOString(),
    likesCount: 31,
    helpfulCount: 45,
    likedBy: ['res-a1204', 'res-b804'],
    helpfulBy: ['res-a1204', 'res-b804'],
    commentsCount: 0,
    comments: [],
  },
];

const initialEvents: CommunityEvent[] = [
  {
    id: 'event-201',
    societyId: 'society-gv',
    title: 'Monsoon Tree Plantation & Garden Drive',
    description: 'Join your neighbours in planting 50 indigenous saplings along the society perimeter.',
    category: 'SOCIAL',
    venue: 'Central Lawn & Perimeter Garden',
    startDateIso: new Date(Date.now() + 86400000 * 3).toISOString(),
    endDateIso: new Date(Date.now() + 86400000 * 3 + 10800000).toISOString(),
    maxCapacity: 30,
    currentAttendees: 28,
    waitlistCount: 0,
    status: 'UPCOMING',
    isWaitlistAllowed: true,
    rsvps: {
      'res-b804': {
        residentId: 'res-b804',
        residentName: 'Priya Mehta',
        residentUnit: 'B-804',
        status: 'GOING',
        guestCount: 2,
        timestamp: new Date().toISOString(),
      },
    },
  },
  {
    id: 'event-202',
    societyId: 'society-gv',
    title: 'Society Badminton Doubles Championship',
    description: 'Annual monsoon mixed doubles tournament. Trophies and refreshments provided.',
    category: 'SPORTS',
    venue: 'Clubhouse Indoor Badminton Court',
    startDateIso: new Date(Date.now() + 86400000 * 7).toISOString(),
    endDateIso: new Date(Date.now() + 86400000 * 7 + 14400000).toISOString(),
    maxCapacity: 16,
    currentAttendees: 16,
    waitlistCount: 1,
    status: 'UPCOMING',
    isWaitlistAllowed: true,
    rsvps: {
      'res-c501': {
        residentId: 'res-c501',
        residentName: 'Vikram Joshi',
        residentUnit: 'C-501',
        status: 'GOING',
        guestCount: 2,
        timestamp: new Date().toISOString(),
      },
      'res-waitlisted-1': {
        residentId: 'res-waitlisted-1',
        residentName: 'Kunal Verma',
        residentUnit: 'D-302',
        status: 'WAITLIST',
        guestCount: 1,
        timestamp: new Date().toISOString(),
      },
    },
  },
];

let localPosts: CommunityPost[] = [...initialPosts];
let localEvents: CommunityEvent[] = [...initialEvents];
let localPolls: Poll[] = [...mockPollsList];
const scopedPollVoters = new Map<string, Set<string>>();

export function resetCommunityFeedMockState(): void {
  localPosts = [...initialPosts];
  localEvents = [...initialEvents];
  localPolls = [...mockPollsList];
  scopedPollVoters.clear();
}

export const communityFeedMockSource = {
  async getFeed(
    context?: ResidentRepositoryRequestContext,
    categoryFilter?: string
  ): Promise<RepositoryResult<CommunityPost[]>> {
    await withMockDelay();
    const ctx = resolveRequestContext(context);
    const filtered = localPosts.filter((post) => {
      const matchSoc = !ctx.activeHome.societyId || post.societyId === ctx.activeHome.societyId || post.societyId === 'society-gv';
      const isVisible = post.status === 'ACTIVE' || post.status === 'REPORTED';
      const matchCat = !categoryFilter || categoryFilter === 'ALL' || post.category === categoryFilter;
      return matchSoc && isVisible && matchCat;
    });
    return repositorySuccess(filtered);
  },

  async createPost(
    context: ResidentRepositoryRequestContext | undefined,
    input: CreatePostInput
  ): Promise<RepositoryResult<CommunityPost>> {
    await withMockDelay();
    if (!input.title || input.title.trim().length < 4) {
      return repositoryFailure({
        code: 'INVALID_TITLE',
        message: 'Title must be at least 4 characters long.',
      });
    }
    if (!input.content || input.content.trim().length < 10) {
      return repositoryFailure({
        code: 'INVALID_CONTENT',
        message: 'Content must be at least 10 characters long.',
      });
    }

    const ctx = resolveRequestContext(context);
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      societyId: ctx.activeHome.societyId || 'society-gv',
      authorId: ctx.activeHome.residentId || 'res-current',
      authorName: input.authorName || ctx.activeHome.residentRole || 'Resident',
      authorUnit: input.authorUnit || ctx.activeHome.displayUnitName,
      category: input.category,
      title: input.title.trim(),
      content: input.content.trim(),
      status: 'ACTIVE',
      createdAtIso: new Date().toISOString(),
      likesCount: 0,
      helpfulCount: 0,
      likedBy: [],
      helpfulBy: [],
      commentsCount: 0,
      comments: [],
    };

    localPosts.unshift(newPost);
    return repositorySuccess(newPost);
  },

  async toggleReaction(
    context: ResidentRepositoryRequestContext | undefined,
    input: ToggleReactionInput
  ): Promise<RepositoryResult<CommunityPost>> {
    await withMockDelay();
    const ctx = resolveRequestContext(context);
    const userId = input.userId || ctx.activeHome.residentId || 'res-current';
    const post = localPosts.find((p) => p.id === input.postId);
    if (!post) {
      return repositoryFailure({
        code: 'POST_NOT_FOUND',
        message: 'Post does not exist.',
      });
    }

    if (input.reactionType === 'LIKE') {
      const idx = post.likedBy.indexOf(userId);
      if (idx >= 0) {
        post.likedBy.splice(idx, 1);
        post.likesCount = Math.max(0, post.likesCount - 1);
      } else {
        post.likedBy.push(userId);
        post.likesCount += 1;
      }
    } else if (input.reactionType === 'HELPFUL') {
      const idx = post.helpfulBy.indexOf(userId);
      if (idx >= 0) {
        post.helpfulBy.splice(idx, 1);
        post.helpfulCount = Math.max(0, post.helpfulCount - 1);
      } else {
        post.helpfulBy.push(userId);
        post.helpfulCount += 1;
      }
    }

    return repositorySuccess({ ...post });
  },

  async addComment(
    context: ResidentRepositoryRequestContext | undefined,
    input: AddCommentInput
  ): Promise<RepositoryResult<CommunityComment>> {
    await withMockDelay();
    if (!input.content || input.content.trim().length === 0) {
      return repositoryFailure({
        code: 'EMPTY_COMMENT',
        message: 'Comment content cannot be empty.',
      });
    }

    const post = localPosts.find((p) => p.id === input.postId);
    if (!post) {
      return repositoryFailure({
        code: 'POST_NOT_FOUND',
        message: 'Post does not exist.',
      });
    }

    const ctx = resolveRequestContext(context);
    const comment: CommunityComment = {
      id: `comm-${Date.now()}`,
      postId: post.id,
      authorId: input.authorId || ctx.activeHome.residentId || 'res-current',
      authorName: input.authorName || 'Resident',
      authorUnit: input.authorUnit || ctx.activeHome.displayUnitName,
      content: input.content.trim(),
      createdAtIso: new Date().toISOString(),
    };

    post.comments.push(comment);
    post.commentsCount = post.comments.length;
    return repositorySuccess(comment);
  },

  async reportPost(
    _context: ResidentRepositoryRequestContext | undefined,
    input: ReportPostInput
  ): Promise<RepositoryResult<{ success: boolean; postId: string }>> {
    await withMockDelay();
    const post = localPosts.find((p) => p.id === input.postId);
    if (!post) {
      return repositoryFailure({
        code: 'POST_NOT_FOUND',
        message: 'Post does not exist.',
      });
    }

    post.isReported = true;
    post.status = 'REPORTED';
    post.reportReason = input.reason;
    return repositorySuccess({ success: true, postId: post.id });
  },

  async moderatePost(
    _context: ResidentRepositoryRequestContext | undefined,
    input: ModeratePostInput
  ): Promise<RepositoryResult<CommunityPost>> {
    await withMockDelay();
    const post = localPosts.find((p) => p.id === input.postId);
    if (!post) {
      return repositoryFailure({
        code: 'POST_NOT_FOUND',
        message: 'Post does not exist.',
      });
    }

    if (input.action === 'HIDE') {
      post.status = 'HIDDEN';
    } else if (input.action === 'REMOVE') {
      post.status = 'REMOVED';
    } else if (input.action === 'DISMISS') {
      post.status = 'ACTIVE';
      post.isReported = false;
    }

    return repositorySuccess({ ...post });
  },

  async getEvents(
    context?: ResidentRepositoryRequestContext
  ): Promise<RepositoryResult<CommunityEvent[]>> {
    await withMockDelay();
    const ctx = resolveRequestContext(context);
    const filtered = localEvents.filter(
      (ev) => !ctx.activeHome.societyId || ev.societyId === ctx.activeHome.societyId || ev.societyId === 'society-gv'
    );
    return repositorySuccess(filtered);
  },

  async createEvent(
    context: ResidentRepositoryRequestContext | undefined,
    input: CreateEventInput
  ): Promise<RepositoryResult<CommunityEvent>> {
    await withMockDelay();
    const ctx = resolveRequestContext(context);
    const newEvent: CommunityEvent = {
      id: `event-${Date.now()}`,
      societyId: ctx.activeHome.societyId || 'society-gv',
      title: input.title,
      description: input.description,
      category: input.category,
      venue: input.venue,
      startDateIso: input.startDateIso,
      endDateIso: input.endDateIso,
      maxCapacity: input.maxCapacity,
      currentAttendees: 0,
      waitlistCount: 0,
      status: 'UPCOMING',
      isWaitlistAllowed: input.isWaitlistAllowed ?? true,
      rsvps: {},
    };
    localEvents.unshift(newEvent);
    return repositorySuccess(newEvent);
  },

  async submitRsvp(
    context: ResidentRepositoryRequestContext | undefined,
    input: SubmitRsvpInput
  ): Promise<
    RepositoryResult<{
      event: CommunityEvent;
      rsvpStatus: 'GOING' | 'INTERESTED' | 'NOT_GOING' | 'WAITLIST';
      waitlisted: boolean;
    }>
  > {
    await withMockDelay();
    const event = localEvents.find((e) => e.id === input.eventId);
    if (!event) {
      return repositoryFailure({
        code: 'EVENT_NOT_FOUND',
        message: 'Event not found.',
      });
    }
    if (event.status === 'CANCELLED') {
      return repositoryFailure({
        code: 'EVENT_CANCELLED',
        message: 'This event has been cancelled.',
      });
    }

    const ctx = resolveRequestContext(context);
    const residentId = input.residentId || ctx.activeHome.residentId || 'res-current';
    const residentName = input.residentName || 'Resident';
    const residentUnit = input.residentUnit || ctx.activeHome.displayUnitName;
    const requestedGuests = Math.max(1, input.guestCount ?? 1);

    const existingRsvp = event.rsvps[residentId];
    const previousStatus = existingRsvp?.status;
    const previousGuests = existingRsvp?.guestCount ?? 0;

    let finalStatus = input.status;
    let waitlisted = false;

    if (input.status === 'GOING') {
      const neededSlots = previousStatus === 'GOING' ? requestedGuests - previousGuests : requestedGuests;
      if (event.currentAttendees + neededSlots > event.maxCapacity) {
        if (event.isWaitlistAllowed) {
          finalStatus = 'WAITLIST';
          waitlisted = true;
          if (previousStatus === 'GOING') {
            event.currentAttendees = Math.max(0, event.currentAttendees - previousGuests);
          }
          if (previousStatus !== 'WAITLIST') {
            event.waitlistCount += 1;
          }
        } else {
          return repositoryFailure({
            code: 'EVENT_CAPACITY_EXCEEDED',
            message: 'Event is fully booked and waitlisting is not permitted.',
          });
        }
      } else {
        if (previousStatus === 'WAITLIST') {
          event.waitlistCount = Math.max(0, event.waitlistCount - 1);
        }
        event.currentAttendees += neededSlots;
      }
    } else {
      if (previousStatus === 'GOING') {
        event.currentAttendees = Math.max(0, event.currentAttendees - previousGuests);
        if (event.waitlistCount > 0) {
          const waitlistedId = Object.keys(event.rsvps).find(
            (k) => event.rsvps[k]?.status === 'WAITLIST' && k !== residentId
          );
          if (waitlistedId && event.rsvps[waitlistedId]) {
            const promoted = event.rsvps[waitlistedId]!;
            if (event.currentAttendees + promoted.guestCount <= event.maxCapacity) {
              promoted.status = 'GOING';
              event.currentAttendees += promoted.guestCount;
              event.waitlistCount = Math.max(0, event.waitlistCount - 1);
            }
          }
        }
      } else if (previousStatus === 'WAITLIST') {
        event.waitlistCount = Math.max(0, event.waitlistCount - 1);
      }
    }

    event.rsvps[residentId] = {
      residentId,
      residentName,
      residentUnit,
      status: finalStatus,
      guestCount: requestedGuests,
      timestamp: new Date().toISOString(),
    };

    return repositorySuccess({
      event: { ...event },
      rsvpStatus: finalStatus,
      waitlisted,
    });
  },

  async submitPollVote(
    pollId: string,
    selectedOptionIds: string[],
    voterId: string,
    isOwner: boolean = true
  ): Promise<RepositoryResult<Poll>> {
    await withMockDelay();
    const poll = localPolls.find((p) => p.id === pollId);
    if (!poll) {
      return repositoryFailure({
        code: 'POLL_NOT_FOUND',
        message: 'This poll is no longer available.',
      });
    }
    if (poll.status !== 'OPEN' && poll.status !== 'ACTIVE') {
      return repositoryFailure({
        code: 'POLL_CLOSED',
        message: 'Voting is closed for this poll.',
      });
    }

    if (poll.eligibility === 'OWNERS_ONLY' && !isOwner) {
      return repositoryFailure({
        code: 'PERMISSION_DENIED',
        message: 'This poll is restricted to owner memberships.',
      });
    }

    if (!scopedPollVoters.has(pollId)) {
      scopedPollVoters.set(pollId, new Set<string>());
    }
    const voters = scopedPollVoters.get(pollId)!;
    if (voters.has(voterId) || poll.myVotedOptionIds?.length) {
      return repositoryFailure({
        code: 'DUPLICATE_VOTE',
        message: 'A vote is already recorded for this membership.',
      });
    }

    const validOptionIds = new Set(poll.options.map((o) => o.id));
    if (selectedOptionIds.length === 0 || selectedOptionIds.some((id) => !validOptionIds.has(id))) {
      return repositoryFailure({
        code: 'INVALID_BALLOT',
        message: 'Choose a valid option before submitting.',
      });
    }

    if (poll.questionType !== 'MULTI_CHOICE' && selectedOptionIds.length !== 1) {
      return repositoryFailure({
        code: 'INVALID_BALLOT',
        message: 'Choose exactly one option for this poll.',
      });
    }

    voters.add(voterId);

    selectedOptionIds.forEach((selectedId) => {
      const opt = poll.options.find((o) => o.id === selectedId);
      if (opt) {
        opt.voteCount += 1;
      }
    });

    poll.totalVotes = poll.options.reduce((acc, o) => acc + o.voteCount, 0);

    poll.options.forEach((opt) => {
      opt.percentage = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;
    });

    poll.participationRate =
      poll.totalEligibleVoters > 0
        ? Math.round((poll.totalVotes / poll.totalEligibleVoters) * 1000) / 10
        : 0;

    poll.myVoteStatus = 'VOTED';
    poll.myVotedOptionIds = [...selectedOptionIds];

    return repositorySuccess({ ...poll });
  },
};
