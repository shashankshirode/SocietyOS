import type { NoticeWorkflowParams } from './notices.mockSource';

export class NoticesApiSource {
  async createNoticeDraft(params?: NoticeWorkflowParams) {
    throw new Error('Backend Integration required');
  }
  async updateNoticeAudience(params?: NoticeWorkflowParams) {
    throw new Error('Backend Integration required');
  }
  async publishNotice(params?: NoticeWorkflowParams) {
    throw new Error('Backend Integration required');
  }
  async markNoticeRead(params?: NoticeWorkflowParams) {
    throw new Error('Backend Integration required');
  }
  async getNoticeAcknowledgementReport(params?: NoticeWorkflowParams) {
    throw new Error('Backend Integration required');
  }
}
