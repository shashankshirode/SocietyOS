export type MockResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: MockError;
    };

export type MockError = {
  code: string;
  message: string;
};

export function mockSuccess<TData>(data: TData): MockResult<TData> {
  return { ok: true, data };
}

export function mockFailure(code: string, message: string): MockResult<never> {
  return { ok: false, error: { code, message } };
}

