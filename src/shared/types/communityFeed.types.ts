export type CommunityPostCategory =
  | 'GENERAL'
  | 'EVENT'
  | 'MARKETPLACE'
  | 'HELP'
  | 'LOST_FOUND'
  | 'GOVERNANCE';

export type CommunityPostStatus = 'ACTIVE' | 'REPORTED' | 'HIDDEN' | 'REMOVED';

export type CommunityReactionType = 'LIKE' | 'HELPFUL';

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUnit: string;
  content: string;
  createdAtIso: string;
}

export interface CommunityPost {
  id: string;
  societyId: string;
  authorId: string;
  authorName: string;
  authorUnit: string;
  category: CommunityPostCategory;
  title: string;
  content: string;
  status: CommunityPostStatus;
  createdAtIso: string;
  likesCount: number;
  helpfulCount: number;
  likedBy: string[];
  helpfulBy: string[];
  commentsCount: number;
  comments: CommunityComment[];
  isReported?: boolean;
  reportReason?: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  category: CommunityPostCategory;
  authorName?: string;
  authorUnit?: string;
}

export interface ToggleReactionInput {
  postId: string;
  reactionType: CommunityReactionType;
  userId?: string;
}

export interface AddCommentInput {
  postId: string;
  content: string;
  authorName?: string;
  authorUnit?: string;
  authorId?: string;
}

export interface ReportPostInput {
  postId: string;
  reason: string;
  reportedBy?: string;
}

export interface ModeratePostInput {
  postId: string;
  action: 'HIDE' | 'REMOVE' | 'DISMISS';
  reason?: string;
  adminId: string;
}

