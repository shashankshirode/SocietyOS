import {
  AiHumanReview,
  AiResponse,
  AiReviewStatus,
  SubmitAiReviewCommand,
} from '../types';

const reviews: Map<string, AiHumanReview> = new Map();
const reviewsByRequest: Map<string, string> = new Map();
const reviewsByComplaint: Map<string, string[]> = new Map();

function generateId(): string {
  return `review_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNow(): string {
  return new Date().toISOString();
}

export const humanReviewService = {
  submitReview(command: SubmitAiReviewCommand): AiHumanReview {
    const review: AiHumanReview = {
      id: generateId(),
      requestId: command.requestId,
      responseId: command.responseId,
      capability: command.capability,
      reviewerId: command.reviewerId,
      reviewerRole: command.reviewerRole,
      reviewedAt: getNow(),
      status: command.status,
      originalOutput: command.originalOutput,
      correctedOutput: command.correctedOutput,
      correctionReason: command.correctionReason,
      feedback: command.feedback,
      modelVersion: command.modelVersion,
      templateVersion: command.templateVersion,
    };

    reviews.set(review.id, review);
    reviewsByRequest.set(command.requestId, review.id);

    if (!reviewsByComplaint.has(command.complaintId)) {
      reviewsByComplaint.set(command.complaintId, []);
    }
    reviewsByComplaint.get(command.complaintId)!.push(review.id);

    return review;
  },

  getReview(reviewId: string): AiHumanReview | undefined {
    return reviews.get(reviewId);
  },

  getReviewByRequest(requestId: string): AiHumanReview | undefined {
    const reviewId = reviewsByRequest.get(requestId);
    if (!reviewId) return undefined;
    return reviews.get(reviewId);
  },

  getReviewsByComplaint(complaintId: string): AiHumanReview[] {
    const ids = reviewsByComplaint.get(complaintId) || [];
    return ids.map(id => reviews.get(id)!).filter(Boolean);
  },

  getPendingReviewsForUser(userId: string, userRoles: string[]): AiHumanReview[] {
    return Array.from(reviews.values())
      .filter(r => r.status === 'PENDING')
      .filter(r => this.canUserReview(r, userId, userRoles));
  },

  canUserReview(review: AiHumanReview, userId: string, userRoles: string[]): boolean {
    if (review.reviewerId === userId) return true;
    if (userRoles.includes('SUPER_ADMIN')) return true;
    if (userRoles.includes('FACILITY_MANAGER') && review.capability === 'MAINTENANCE_RISK') return true;
    return false;
  },

  getReviewStats(): {
    total: number;
    pending: number;
    accepted: number;
    corrected: number;
    rejected: number;
  } {
    const all = Array.from(reviews.values());
    return {
      total: all.length,
      pending: all.filter(r => r.status === 'PENDING').length,
      accepted: all.filter(r => r.feedback === 'ACCEPTED').length,
      corrected: all.filter(r => r.feedback === 'CORRECTED').length,
      rejected: all.filter(r => r.feedback === 'REJECTED').length,
    };
  },

  getReviewStatsByCapability(): Record<string, { total: number; accepted: number; corrected: number; rejected: number }> {
    const stats: Record<string, { total: number; accepted: number; corrected: number; rejected: number }> = {};

    Array.from(reviews.values()).forEach(review => {
      if (!stats[review.capability]) {
        stats[review.capability] = { total: 0, accepted: 0, corrected: 0, rejected: 0 };
      }
      stats[review.capability].total += 1;
      if (review.feedback === 'ACCEPTED') stats[review.capability].accepted += 1;
      if (review.feedback === 'CORRECTED') stats[review.capability].corrected += 1;
      if (review.feedback === 'REJECTED') stats[review.capability].rejected += 1;
    });

    return stats;
  },

  getCorrectionRate(capability?: string): number {
    const relevant = capability
      ? Array.from(reviews.values()).filter(r => r.capability === capability)
      : Array.from(reviews.values());

    if (relevant.length === 0) return 0;
    const corrected = relevant.filter(r => r.feedback === 'CORRECTED').length;
    return corrected / relevant.length;
  },

  getAcceptanceRate(capability?: string): number {
    const relevant = capability
      ? Array.from(reviews.values()).filter(r => r.capability === capability)
      : Array.from(reviews.values());

    if (relevant.length === 0) return 0;
    const accepted = relevant.filter(r => r.feedback === 'ACCEPTED').length;
    return accepted / relevant.length;
  },

  getAllReviews(): AiHumanReview[] {
    return Array.from(reviews.values());
  },

  clearReviews(): void {
    reviews.clear();
    reviewsByRequest.clear();
    reviewsByComplaint.clear();
  },
};