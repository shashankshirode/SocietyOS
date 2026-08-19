


export type DataResult<TData> =
  | {
      status: 'success';
      data: TData;
    }
  | {
      status: 'empty';
      reasonMessageKey: string;
    }
  | {
      status: 'restricted';
      reasonMessageKey: string;
    }
  | {
      status: 'error';
      errorMessageKey: string;
      canRetry: boolean;
    };



export function dataSuccess<TData>(data: TData): DataResult<TData> {
  return { status: 'success', data };
}

export function dataEmpty<TData>(reasonMessageKey: string): DataResult<TData> {
  return { status: 'empty', reasonMessageKey };
}

export function dataRestricted<TData>(reasonMessageKey: string): DataResult<TData> {
  return { status: 'restricted', reasonMessageKey };
}

export function dataError<TData>(
  errorMessageKey: string,
  canRetry = true,
): DataResult<TData> {
  return { status: 'error', errorMessageKey, canRetry };
}



export function isDataSuccess<TData>(
  result: DataResult<TData>,
): result is DataResult<TData> & { status: 'success'; data: TData } {
  return result.status === 'success';
}

export function isDataEmpty<TData>(
  result: DataResult<TData>,
): result is DataResult<TData> & { status: 'empty' } {
  return result.status === 'empty';
}

export function isDataRestricted<TData>(
  result: DataResult<TData>,
): result is DataResult<TData> & { status: 'restricted' } {
  return result.status === 'restricted';
}

export function isDataError<TData>(
  result: DataResult<TData>,
): result is DataResult<TData> & { status: 'error' } {
  return result.status === 'error';
}
