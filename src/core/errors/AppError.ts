export type AppError = {
  code: string;
  message: string;
  userMessage: string;
  fieldErrors?: Record<string, string>;
  traceId?: string;
};
