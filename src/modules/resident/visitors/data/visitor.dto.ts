import type { CreateVisitorPayload, Visitor } from '../../../../shared/types/visitor.types';

export type VisitorDto = Partial<Visitor> & Pick<Visitor, 'id'>;

export type CreateVisitorPassRequestDto = CreateVisitorPayload & {
  flatNumber: string;
  societyName: string;
};

