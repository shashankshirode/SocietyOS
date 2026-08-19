export type DocumentMockRow = { id: string; name: string; status: 'ACTIVE' | 'PENDING' };

const documentRows: DocumentMockRow[] = [
  { id: 'mock-1', name: 'Mock Item 1', status: 'ACTIVE' },
  { id: 'mock-2', name: 'Mock Item 2', status: 'PENDING' },
];

export const documentUploadMockData = documentRows;
export const categorizedDocumentsMockData = documentRows;
export const documentAccessLogMockData = documentRows;
export const documentVersionHistoryMockData = documentRows;
export const restrictedDocumentAccessMockData = documentRows;
