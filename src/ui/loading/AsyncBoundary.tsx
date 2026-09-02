import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AsyncStatus, LoadingIntent } from '../../core/async/AsyncState';
import { SocietyLoadingIndicator, SocietyRefreshIndicator } from './SocietyLoadingIndicators';
import { ScreenSkeleton } from './ScreenSkeleton';
import { ErrorState } from '../../shared/components/ErrorState';
import { EmptyState } from '../../shared/components/EmptyState';
import { loadingCopy } from './loadingCopy';

export type AsyncBoundaryProps<TData> = {
  status: AsyncStatus;
  data: TData | null;
  children: (data: TData) => React.ReactNode;
  skeletonVariant?: 'dashboard' | 'list' | 'detail' | 'form' | 'timeline';
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: string | null;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AsyncBoundary<TData>({ status, data, children, skeletonVariant = 'list', empty = false, emptyTitle = loadingCopy.emptyTitle, emptyDescription = loadingCopy.emptyDescription, error = null, onRetry, style, testID }: AsyncBoundaryProps<TData>) {
  if ((status === AsyncStatus.INITIAL_LOADING || (status === AsyncStatus.IDLE && data === null)) && data === null) {
    return <View style={style} testID={testID}><ScreenSkeleton variant={skeletonVariant} /></View>;
  }
  if (status === AsyncStatus.REFRESHING && data !== null) {
    return <View style={style} testID={testID}><SocietyRefreshIndicator refreshing testID="async-boundary-refresh" />{children(data)}</View>;
  }
  if (status === AsyncStatus.ERROR && data === null) {
    return <View style={style} testID={testID}><ErrorState message={error ?? loadingCopy.errorMessage} {...(onRetry === undefined ? {} : { onRetry })} /></View>;
  }
  if (empty || (status === AsyncStatus.SUCCESS && data === null)) {
    return <View style={style} testID={testID}><EmptyState title={emptyTitle} description={emptyDescription} /></View>;
  }
  if (status === AsyncStatus.SUBMITTING || status === AsyncStatus.LOADING_MORE) {
    return <View style={style} testID={testID}>{data === null ? <SocietyLoadingIndicator intent={LoadingIntent.ACTION} /> : children(data)}</View>;
  }
  return <View style={style} testID={testID}>{data === null ? null : children(data)}</View>;
}