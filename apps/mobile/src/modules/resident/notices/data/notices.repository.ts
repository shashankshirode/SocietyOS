import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { NoticesMockSource } from './notices.mockSource';
import { NoticesApiSource } from './notices.apiSource';
import type { NoticeWorkflowParams } from './notices.mockSource';

const mockSource = new NoticesMockSource();
const apiSource = new NoticesApiSource();

function getActiveSource() {
  return resolveDataSource('residentNotices').isApi ? apiSource : mockSource;
}

export class NoticesRepository {
  static async createNoticeDraft(params?: NoticeWorkflowParams) {
    return getActiveSource().createNoticeDraft(params);
  }
  static async updateNoticeAudience(params?: NoticeWorkflowParams) {
    return getActiveSource().updateNoticeAudience(params);
  }
  static async publishNotice(params?: NoticeWorkflowParams) {
    return getActiveSource().publishNotice(params);
  }
  static async markNoticeRead(params?: NoticeWorkflowParams) {
    return getActiveSource().markNoticeRead(params);
  }
  static async getNoticeAcknowledgementReport(params?: NoticeWorkflowParams) {
    return getActiveSource().getNoticeAcknowledgementReport(params);
  }
}
