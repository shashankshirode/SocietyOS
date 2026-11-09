import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { safeLog } from '../../core/logging/safeLog';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  diagnosticId: string | undefined;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: React.ReactNode[];
  onReset?: () => void;
}

function generateDiagnosticId(): string {
  return `ERR-${Date.now().toString(36).toUpperCase().slice(-4)}-${Math.random().toString(36).toUpperCase().slice(2, 6)}`;
}

function DefaultErrorFallback({
  error,
  diagnosticId,
  onReset,
}: {
  error: Error | null;
  diagnosticId?: string;
  onReset: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Something went wrong
      </Text>
      <Text style={styles.message}>
        {error?.message ?? 'An unexpected error occurred while loading this view.'}
      </Text>
      {diagnosticId ? (
        <Text style={styles.diagnosticRef}>
          Reference: {diagnosticId}
        </Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onReset}
          accessible
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, diagnosticId: undefined };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      diagnosticId: generateDiagnosticId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    safeLog.error('[ErrorBoundary] Caught unhandled exception', {
      error: error.message,
      stack: errorInfo.componentStack ?? error.stack,
      diagnosticId: this.state.diagnosticId,
    });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, diagnosticId: undefined });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <DefaultErrorFallback
          error={this.state.error}
          diagnosticId={this.state.diagnosticId}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; diagnosticId: string | undefined }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, diagnosticId: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
      diagnosticId: generateDiagnosticId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    safeLog.error('[AppErrorBoundary] Top-level app crash caught', {
      error: error.message,
      stack: errorInfo.componentStack ?? error.stack,
      diagnosticId: this.state.diagnosticId,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, diagnosticId: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>SocietyOS encountered a problem</Text>
          <Text style={styles.message}>
            The application experienced an unexpected issue. Tap below to reload.
          </Text>
          {this.state.diagnosticId ? (
            <Text style={styles.diagnosticRef}>
              Diagnostic Ref: {this.state.diagnosticId}
            </Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRestart}
              accessible
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Reload Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#DC2626',
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    color: '#4B5563',
  },
  diagnosticRef: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  offlineContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  offlineSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((err: Error) => {
    setError(err);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}

export class NetworkErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { offline: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { offline: false };
  }

  render(): React.ReactNode {
    if (this.state.offline) {
      return this.props.fallback ?? (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>You're offline</Text>
          <Text style={styles.offlineSubtext}>Changes will sync when you're back online</Text>
        </View>
      );
    }

    return this.props.children;
  }
}