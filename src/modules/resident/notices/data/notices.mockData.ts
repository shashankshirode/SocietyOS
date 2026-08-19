export type NoticeWorkflowRecord = {
  id: string;
  label: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETE';
};

export const noticeDraftMockData: NoticeWorkflowRecord[] = [
  { id: 'notice-draft-water', label: 'Water supply maintenance', status: 'ACTIVE' },
];
export const noticeAudienceMockData: NoticeWorkflowRecord[] = [
  { id: 'notice-audience-residents', label: 'All active residents', status: 'COMPLETE' },
];
export const publishedNoticeMockData: NoticeWorkflowRecord[] = [
  { id: 'notice-published-agm', label: 'Annual General Meeting', status: 'COMPLETE' },
];
export const noticeReadStatusMockData: NoticeWorkflowRecord[] = [
  { id: 'notice-read-status', label: 'Resident read status', status: 'ACTIVE' },
];
export const noticeAcknowledgementMockData: NoticeWorkflowRecord[] = [
  { id: 'notice-ack-status', label: 'Acknowledgement status', status: 'PENDING' },
];
