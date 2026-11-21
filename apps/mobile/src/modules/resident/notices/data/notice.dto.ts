import type { Notice } from '../../../../shared/types/notice.types';

export type NoticeDto = Partial<Notice> & Pick<Notice, 'id'>;

