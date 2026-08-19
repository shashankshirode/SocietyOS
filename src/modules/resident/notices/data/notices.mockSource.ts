import * as mockData from './notices.mockData';
import type { NoticeWorkflowRecord } from './notices.mockData';

export type NoticeWorkflowParams = { noticeId?: string; homeContextId?: string };

export class NoticesMockSource {
  async createNoticeDraft(_params?: NoticeWorkflowParams): Promise<NoticeWorkflowRecord[]> {
    return mockData.noticeDraftMockData;
  }
  async updateNoticeAudience(_params?: NoticeWorkflowParams): Promise<NoticeWorkflowRecord[]> {
    return mockData.noticeAudienceMockData;
  }
  async publishNotice(_params?: NoticeWorkflowParams): Promise<NoticeWorkflowRecord[]> {
    return mockData.publishedNoticeMockData;
  }
  async markNoticeRead(_params?: NoticeWorkflowParams): Promise<NoticeWorkflowRecord[]> {
    return mockData.noticeReadStatusMockData;
  }
  async getNoticeAcknowledgementReport(_params?: NoticeWorkflowParams): Promise<NoticeWorkflowRecord[]> {
    return mockData.noticeAcknowledgementMockData;
  }
}
