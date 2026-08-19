import type { FaqItem } from '../../../shared/types/helpdesk.types';

export type FaqItemDto = Partial<FaqItem> & Pick<FaqItem, 'id'>;

