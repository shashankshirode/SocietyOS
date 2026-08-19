export type AsyncStatus =
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'loadingMore'
  | 'success'
  | 'empty'
  | 'partial'
  | 'offline'
  | 'error';

export type AsyncResource<TData, TError = Error> =
  | {
      status: 'idle';
      data: null;
      error: null;
    }
  | {
      status: 'loading';
      data: null;
      error: null;
    }
  | {
      status: 'refreshing';
      data: TData;
      error: null;
    }
  | {
      status: 'loadingMore';
      data: TData;
      error: null;
    }
  | {
      status: 'success';
      data: TData;
      error: null;
    }
  | {
      status: 'empty';
      data: TData;
      error: null;
    }
  | {
      status: 'partial';
      data: TData;
      error: TError;
    }
  | {
      status: 'offline';
      data: TData | null;
      error: TError | null;
    }
  | {
      status: 'error';
      data: TData | null;
      error: TError;
    };

export const isIdle = <T, E>(res: AsyncResource<T, E>): res is { status: 'idle'; data: null; error: null } =>
  res.status === 'idle';

export const isLoading = <T, E>(res: AsyncResource<T, E>): res is { status: 'loading'; data: null; error: null } =>
  res.status === 'loading';

export const isRefreshing = <T, E>(res: AsyncResource<T, E>): res is { status: 'refreshing'; data: T; error: null } =>
  res.status === 'refreshing';

export const isLoadingMore = <T, E>(res: AsyncResource<T, E>): res is { status: 'loadingMore'; data: T; error: null } =>
  res.status === 'loadingMore';

export const isSuccess = <T, E>(res: AsyncResource<T, E>): res is { status: 'success'; data: T; error: null } =>
  res.status === 'success';

export const isEmpty = <T, E>(res: AsyncResource<T, E>): res is { status: 'empty'; data: T; error: null } =>
  res.status === 'empty';

export const isPartial = <T, E>(res: AsyncResource<T, E>): res is { status: 'partial'; data: T; error: E } =>
  res.status === 'partial';

export const isOffline = <T, E>(res: AsyncResource<T, E>): res is { status: 'offline'; data: T | null; error: E | null } =>
  res.status === 'offline';

export const isError = <T, E>(res: AsyncResource<T, E>): res is { status: 'error'; data: T | null; error: E } =>
  res.status === 'error';

export const hasData = <T, E>(res: AsyncResource<T, E>): res is AsyncResource<T, E> & { data: T } =>
  res.data !== null;

export const isAnyLoading = <T, E>(res: AsyncResource<T, E>): boolean =>
  res.status === 'loading' || res.status === 'refreshing' || res.status === 'loadingMore';
