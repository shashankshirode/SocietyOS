import type { FaqItem } from '../../../shared/types/helpdesk.types';
import type { FaqItemDto } from './helpdesk.dto';

export function mapFaqItemDtoToDomain(dto: FaqItemDto): FaqItem {
  return {
    id: dto.id,
    question: dto.question ?? '',
    answer: dto.answer ?? '',
    category: dto.category ?? 'General',
  };
}

