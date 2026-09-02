import {
  LoadingIntent,
  AsyncStatus,
  createIdleAsyncState,
  createInitialLoadingAsyncState,
  createRefreshingAsyncState,
  createSubmittingAsyncState,
  createLoadingMoreAsyncState,
  createSuccessAsyncState,
  createErrorAsyncState,
} from '../AsyncState';

describe('asyncState explicit state model', () => {
  it('defines all required LoadingIntent enum values', () => {
    expect(LoadingIntent.INITIAL_PAGE).toBe('INITIAL_PAGE');
    expect(LoadingIntent.SECTION).toBe('SECTION');
    expect(LoadingIntent.BACKGROUND_REFRESH).toBe('BACKGROUND_REFRESH');
    expect(LoadingIntent.ACTION).toBe('ACTION');
    expect(LoadingIntent.PAGINATION).toBe('PAGINATION');
    expect(LoadingIntent.IMAGE).toBe('IMAGE');
    expect(LoadingIntent.ROUTE).toBe('ROUTE');
    expect(LoadingIntent.SEARCH).toBe('SEARCH');
    expect(LoadingIntent.FILTER).toBe('FILTER');
    expect(LoadingIntent.DETAIL).toBe('DETAIL');
    expect(LoadingIntent.MUTATION).toBe('MUTATION');
  });

  it('defines explicit AsyncStatus values', () => {
    expect(AsyncStatus.IDLE).toBe('IDLE');
    expect(AsyncStatus.INITIAL_LOADING).toBe('INITIAL_LOADING');
    expect(AsyncStatus.REFRESHING).toBe('REFRESHING');
    expect(AsyncStatus.SUBMITTING).toBe('SUBMITTING');
    expect(AsyncStatus.LOADING_MORE).toBe('LOADING_MORE');
    expect(AsyncStatus.SUCCESS).toBe('SUCCESS');
    expect(AsyncStatus.ERROR).toBe('ERROR');
  });

  it('creates idle async state correctly', () => {
    const state = createIdleAsyncState<string>('cached-data');
    expect(state.status).toBe(AsyncStatus.IDLE);
    expect(state.data).toBe('cached-data');
    expect(state.error).toBeNull();
    expect(state.isInitialLoading).toBe(false);
  });

  it('creates initial loading async state correctly', () => {
    const state = createInitialLoadingAsyncState<string>();
    expect(state.status).toBe(AsyncStatus.INITIAL_LOADING);
    expect(state.data).toBeNull();
    expect(state.isInitialLoading).toBe(true);
    expect(state.isRefreshing).toBe(false);
  });

  it('creates refreshing async state without losing existing data', () => {
    const state = createRefreshingAsyncState<string>('existing-data');
    expect(state.status).toBe(AsyncStatus.REFRESHING);
    expect(state.data).toBe('existing-data');
    expect(state.isInitialLoading).toBe(false);
    expect(state.isRefreshing).toBe(true);
  });

  it('creates submitting and loading-more async states', () => {
    const submitting = createSubmittingAsyncState<string>('current-data');
    expect(submitting.status).toBe(AsyncStatus.SUBMITTING);
    expect(submitting.isSubmitting).toBe(true);
    expect(submitting.data).toBe('current-data');

    const loadingMore = createLoadingMoreAsyncState<string>('current-data');
    expect(loadingMore.status).toBe(AsyncStatus.LOADING_MORE);
    expect(loadingMore.isLoadingMore).toBe(true);
    expect(loadingMore.data).toBe('current-data');
  });

  it('creates success and error async states', () => {
    const success = createSuccessAsyncState<string>('final-data');
    expect(success.status).toBe(AsyncStatus.SUCCESS);
    expect(success.data).toBe('final-data');
    expect(success.error).toBeNull();

    const error = createErrorAsyncState<string>('NETWORK_FAILURE', 'stale-data');
    expect(error.status).toBe(AsyncStatus.ERROR);
    expect(error.error).toBe('NETWORK_FAILURE');
    expect(error.data).toBe('stale-data');
  });
});
