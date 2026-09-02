/**
 * Society OS Global Loading System & Explicit Async State Model
 *
 * Defines standardized loading intents and a type-safe async state machine.
 */

import type { Nullable } from '../domain/domainTypes';

export enum LoadingIntent {
  INITIAL_PAGE = 'INITIAL_PAGE',
  SECTION = 'SECTION',
  BACKGROUND_REFRESH = 'BACKGROUND_REFRESH',
  ACTION = 'ACTION',
  PAGINATION = 'PAGINATION',
  IMAGE = 'IMAGE',
  ROUTE = 'ROUTE',
  SEARCH = 'SEARCH',
  FILTER = 'FILTER',
  DETAIL = 'DETAIL',
  MUTATION = 'MUTATION',
}

export enum AsyncStatus {
  IDLE = 'IDLE',
  INITIAL_LOADING = 'INITIAL_LOADING',
  REFRESHING = 'REFRESHING',
  SUBMITTING = 'SUBMITTING',
  LOADING_MORE = 'LOADING_MORE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface AsyncState<TData, TError extends string = string> {
  readonly status: AsyncStatus;
  readonly data: Nullable<TData>;
  readonly error: Nullable<TError>;
  readonly isInitialLoading: boolean;
  readonly isRefreshing: boolean;
  readonly isSubmitting: boolean;
  readonly isLoadingMore: boolean;
}

export function createIdleAsyncState<TData, TError extends string = string>(
  initialData: Nullable<TData> = null
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.IDLE,
    data: initialData,
    error: null,
    isInitialLoading: false,
    isRefreshing: false,
    isSubmitting: false,
    isLoadingMore: false,
  };
}

export function createInitialLoadingAsyncState<TData, TError extends string = string>(
  previousData: Nullable<TData> = null
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.INITIAL_LOADING,
    data: previousData,
    error: null,
    isInitialLoading: true,
    isRefreshing: false,
    isSubmitting: false,
    isLoadingMore: false,
  };
}

export function createRefreshingAsyncState<TData, TError extends string = string>(
  currentData: Nullable<TData>
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.REFRESHING,
    data: currentData,
    error: null,
    isInitialLoading: false,
    isRefreshing: true,
    isSubmitting: false,
    isLoadingMore: false,
  };
}

export function createSubmittingAsyncState<TData, TError extends string = string>(
  currentData: Nullable<TData> = null
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.SUBMITTING,
    data: currentData,
    error: null,
    isInitialLoading: false,
    isRefreshing: false,
    isSubmitting: true,
    isLoadingMore: false,
  };
}

export function createLoadingMoreAsyncState<TData, TError extends string = string>(
  currentData: Nullable<TData>
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.LOADING_MORE,
    data: currentData,
    error: null,
    isInitialLoading: false,
    isRefreshing: false,
    isSubmitting: false,
    isLoadingMore: true,
  };
}

export function createSuccessAsyncState<TData, TError extends string = string>(
  data: TData
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.SUCCESS,
    data,
    error: null,
    isInitialLoading: false,
    isRefreshing: false,
    isSubmitting: false,
    isLoadingMore: false,
  };
}

export function createErrorAsyncState<TData, TError extends string = string>(
  error: TError,
  previousData: Nullable<TData> = null
): AsyncState<TData, TError> {
  return {
    status: AsyncStatus.ERROR,
    data: previousData,
    error,
    isInitialLoading: false,
    isRefreshing: false,
    isSubmitting: false,
    isLoadingMore: false,
  };
}

export type AsyncResourceStatus = 'idle' | 'loading' | 'refreshing' | 'success' | 'error';

export interface AsyncResource<TData, TError = Error> {
  readonly status: AsyncResourceStatus;
  readonly data: Nullable<TData>;
  readonly error: Nullable<TError>;
}

export function isAnyLoading<TData, TError>(resource: AsyncResource<TData, TError>): boolean {
  return resource.status === 'loading' || resource.status === 'refreshing';
}

