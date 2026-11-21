export type PageRequest = {
  cursor?: string;
  limit: number;
};

export type PageResult<T> = {
  readonly items: readonly T[];
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
};
