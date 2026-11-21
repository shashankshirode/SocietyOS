/**
 * React hook for accessing the resolved temporal context
 * 
 * This hook provides the canonical temporal context for all formatting needs.
 * Components MUST use this hook instead of direct formatting calls.
 */

import { useMemo, useContext, createContext, useState, useEffect, useCallback } from 'react';
import {
  SocietyTimeContext,
  ViewerTimeContext,
  DeviceTimeContext,
  ResolvedTemporalContext,
  DateFormatPreference,
  TimeFormatPreference,
  DisplayTimezoneMode,
  IanaTimeZone,
  SupportedLocale,
  UtcInstant,
  LocalDate,
  TemporalFormatOptions,
  FormattedDateTime,
  DualTimeDisplay,
  RelativeTimeContext,
  BusinessDeadline,
} from './temporal.types';
import {
  formatLocalDate,
  formatLocalTime,
  formatDateTime,
  formatDateOnly as serviceFormatDateOnly,
  formatYearMonth,
  formatDualTime,
  formatRelativeTime,
  getSocietyToday,
  getViewerToday,
  isSameSocietyDay,
  isSameViewerDay,
  formatBusinessDeadline,
  formatCurrency,
  validateTemporalValue as serviceValidateTemporalValue,
  systemClock,
} from './temporal.service';

import { useAuthSession } from '../../core/auth/useAuthSession';
import { useActiveResidentHome } from '../../modules/resident/homeContext/hooks/useActiveResidentHome';

/** Default society timezone */
const DEFAULT_SOCIETY_TIMEZONE = 'Asia/Kolkata' as const;

/** Temporal context for React components */
export interface TemporalContextValue {
  /** Resolved temporal context */
  readonly context: ResolvedTemporalContext;
  
  /** Society time context */
  readonly societyContext: SocietyTimeContext;
  
  /** Viewer time context */
  readonly viewerContext: ViewerTimeContext;
  
  /** Device time context */
  readonly deviceContext: DeviceTimeContext;
  
  /** Format a UTC instant as local date in society timezone */
  readonly formatSocietyDate: (value: string | Date, options?: { dateFormat?: 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD' | 'SYSTEM_LOCALE' }) => string;
  
  /** Format a UTC instant as local time in society timezone */
  readonly formatSocietyTime: (value: string | Date, options?: { timeFormat?: 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR' | 'SYSTEM_LOCALE' }) => string;
  
  /** Format a UTC instant as date-time in society timezone */
  readonly formatSocietyDateTime: (value: string | Date, options?: TemporalFormatOptions) => FormattedDateTime;
  
  /** Format a date-only value (NEVER shifts by timezone) */
  readonly formatDateOnly: (value: string | Date, options?: { dateFormat?: 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD' | 'SYSTEM_LOCALE' }) => string;
  
  /** Format a year-month value (billing periods) */
  readonly formatYearMonth: (value: string | Date) => string;
  
  /** Format with dual-time display when timezones differ */
  readonly formatDualTime: (instant: string, options?: { showTimeZoneLabel?: boolean }) => DualTimeDisplay;
  
  /** Format relative time (Today, Yesterday, etc.) using correct timezone */
  readonly formatRelative: (value: string | Date, mode?: 'society' | 'viewer') => string;
  
  /** Format a business deadline with dual-time display */
  readonly formatBusinessDeadline: (deadline: BusinessDeadline) => DualTimeDisplay;
  
  /** Get society "today" date */
  readonly getSocietyToday: () => string;
  
  /** Get viewer "today" date */
  readonly getViewerToday: () => string;
  
  /** Check if two instants are same society day */
  readonly isSameSocietyDay: (instant1: string, instant2: string) => boolean;
  
  /** Check if two instants are same viewer day */
  readonly isSameViewerDay: (instant1: string, instant2: string) => boolean;
  
  /** Format a UTC instant as local date in viewer timezone */
  readonly formatViewerDate: (value: string | Date, options?: { dateFormat?: 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD' | 'SYSTEM_LOCALE' }) => string;
  
  /** Format a UTC instant as local time in viewer timezone */
  readonly formatViewerTime: (value: string | Date, options?: { timeFormat?: 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR' | 'SYSTEM_LOCALE' }) => string;
  
  /** Format currency */
  readonly formatCurrency: (amount: number | { minorUnits: number; currency?: string }, currencyCode?: string) => string;
  
  /** Validate a temporal value */
  readonly validateTemporal: (value: string, type: 'instant' | 'date' | 'datetime' | 'year-month') => import('./temporal.types').TemporalValidationResult;
  
  /** Current temporal preferences */
  readonly preferences: {
    dateFormat: 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD' | 'SYSTEM_LOCALE';
    timeFormat: 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR' | 'SYSTEM_LOCALE';
    displayTimezoneMode: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT';
    customTimeZone: string | null;
  };
  
  /** Update temporal preferences */
  readonly updatePreferences: (prefs: Partial<TemporalContextValue['preferences']>) => Promise<void>;
  
  /** Is viewer timezone different from society timezone */
  readonly isCrossTimezone: boolean;
  
  /** Current display timezone mode */
  readonly displayTimezoneMode: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT';
}

/** Temporal context for React */
const TemporalContext = createContext<TemporalContextValue | null>(null);

/** Provider props */
interface TemporalProviderProps {
  children: React.ReactNode;
  /** Optional clock for testing */
  clock?: {
    now: () => string;
    nowUtc: () => Date;
  };
}

/** Temporal Provider Component */
export function TemporalProvider({ children, clock = systemClock }: TemporalProviderProps) {
  const { session } = useAuthSession();
  const { activeContext } = useActiveResidentHome();
  
  // Load preferences from secure storage
  const [preferences, setPreferencesState] = useState<{
    dateFormat: 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD' | 'SYSTEM_LOCALE';
    timeFormat: 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR' | 'SYSTEM_LOCALE';
    displayTimezoneMode: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT';
    customTimeZone: string | null;
  }>({
    dateFormat: 'DD_MMM_YYYY',
    timeFormat: 'TWELVE_HOUR',
    displayTimezoneMode: 'DUAL_WHEN_DIFFERENT',
    customTimeZone: null,
  });
  
  // Load preferences from storage on mount
  useEffect(() => {
    // TODO: Load from secure storage
    // For now, use defaults
  }, []);
  
  // Build society context from active residence
  const societyContext = useMemo(() => {
    if (!activeContext?.timezone) {
      return {
        timeZone: 'Asia/Kolkata' as const,
        locale: 'en-IN' as const,
        countryCode: 'IN',
        financialYearStartMonth: 4,
        financialYearStartDay: 1,
      };
    }
    
    return {
      timeZone: activeContext.timezone,
      locale: activeContext.locale ?? 'en-IN',
      countryCode: activeContext.country ?? 'IN',
      financialYearStartMonth: 4,
      financialYearStartDay: 1,
    };
  }, [activeContext]);
  
  // Build viewer context from preferences
  const viewerContext = useMemo(() => ({
    timeZone: preferences.customTimeZone ?? 'America/New_York',
    locale: 'en-IN',
    dateFormat: preferences.dateFormat,
    timeFormat: preferences.timeFormat,
    displayTimezoneMode: preferences.displayTimezoneMode,
    customTimeZone: preferences.customTimeZone,
  }), [preferences]);
  
  // Device context
  const deviceContext = useMemo(() => {
    let timeZone: 'Asia/Kolkata' | 'America/New_York' | 'Europe/London' | string = 'Asia/Kolkata';
    try {
      const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (deviceTz) timeZone = deviceTz;
    } catch {}
    
    return {
      timeZone,
      locale: 'en-IN',
    };
  }, []);
  
  // Resolve full temporal context
  const context: ResolvedTemporalContext = useMemo(() => ({
    society: {
      timeZone: societyContext.timeZone as IanaTimeZone,
      locale: societyContext.locale as SupportedLocale,
      countryCode: societyContext.countryCode,
      financialYearStartMonth: societyContext.financialYearStartMonth,
      financialYearStartDay: societyContext.financialYearStartDay,
    },
    viewer: {
      timeZone: viewerContext.timeZone as IanaTimeZone,
      locale: viewerContext.locale as SupportedLocale,
      dateFormat: viewerContext.dateFormat,
      timeFormat: viewerContext.timeFormat,
      displayTimezoneMode: viewerContext.displayTimezoneMode,
      ...(viewerContext.customTimeZone ? { customTimeZone: viewerContext.customTimeZone as IanaTimeZone } : {}),
    },
    device: {
      timeZone: deviceContext.timeZone as IanaTimeZone,
      locale: deviceContext.locale as SupportedLocale,
    },
    now: new Date().toISOString() as UtcInstant,
    societyToday: new Date().toLocaleDateString('en-CA', { timeZone: societyContext.timeZone }) as LocalDate,
    viewerToday: new Date().toLocaleDateString('en-CA', { timeZone: viewerContext.timeZone }) as LocalDate,
  }), [societyContext, viewerContext, deviceContext]);
  
  // Check if cross-timezone
  const isCrossTimezone = useMemo(() => 
    societyContext.timeZone !== viewerContext.timeZone, 
    [societyContext.timeZone, viewerContext.timeZone]
  );
  
  // Formatters
  const formatSocietyDate = useCallback((value: string | Date, options?: { dateFormat?: DateFormatPreference }) => 
    formatLocalDate(value, societyContext.timeZone as IanaTimeZone, societyContext.locale as SupportedLocale, options?.dateFormat ? { dateFormat: options.dateFormat } : {}), 
    [societyContext]
  );
  
  const formatSocietyTime = useCallback((value: string | Date, options?: { timeFormat?: TimeFormatPreference }) => 
    formatLocalTime(value, societyContext.timeZone as IanaTimeZone, societyContext.locale as SupportedLocale, options?.timeFormat ? { timeFormat: options.timeFormat } : {}), 
    [societyContext]
  );
  
  const formatSocietyDateTime = useCallback((value: string | Date, options?: TemporalFormatOptions) => 
    formatDateTime(value, societyContext.timeZone as IanaTimeZone, societyContext.locale as SupportedLocale, options), 
    [societyContext]
  );
  
  const formatDateOnly = useCallback((value: string | Date, options?: { dateFormat?: DateFormatPreference }) => 
    serviceFormatDateOnly(value, societyContext.locale as SupportedLocale, options?.dateFormat ? { dateFormat: options.dateFormat } : {}), 
    [societyContext]
  );
  
  const formatYearMonthValue = useCallback((value: string | Date) => 
    formatYearMonth(value, societyContext.locale as SupportedLocale), 
    [societyContext]
  );
  
  const formatDualTimeValue = useCallback((instant: string, options?: { showTimeZoneLabel?: boolean }) => {
    const society: SocietyTimeContext = {
      timeZone: societyContext.timeZone as IanaTimeZone,
      locale: societyContext.locale as SupportedLocale,
      countryCode: 'IN',
      financialYearStartMonth: 4,
      financialYearStartDay: 1,
    };
    const viewer: ViewerTimeContext = {
      timeZone: viewerContext.timeZone as IanaTimeZone,
      locale: viewerContext.locale as SupportedLocale,
      dateFormat: viewerContext.dateFormat,
      timeFormat: viewerContext.timeFormat,
      displayTimezoneMode: viewerContext.displayTimezoneMode,
      ...(viewerContext.customTimeZone ? { customTimeZone: viewerContext.customTimeZone as IanaTimeZone } : {}),
    };
    return formatDualTime(instant as UtcInstant, society, viewer, options);
  }, [societyContext, viewerContext]);
  
  const formatRelativeValue = useCallback((value: string | Date, mode?: 'society' | 'viewer') => {
    const targetTimeZone = mode === 'viewer' ? (viewerContext.timeZone as IanaTimeZone) : (societyContext.timeZone as IanaTimeZone);
    return formatRelativeTime(value, {
      referenceInstant: new Date().toISOString() as UtcInstant,
      referenceTimeZone: societyContext.timeZone as IanaTimeZone,
      targetTimeZone,
      locale: societyContext.locale as SupportedLocale,
    });
  }, [societyContext, viewerContext]);
  
  const formatBusinessDeadlineValue = useCallback((deadline: BusinessDeadline) => 
    formatBusinessDeadline(deadline, {
      timeZone: viewerContext.timeZone as IanaTimeZone,
      locale: viewerContext.locale as SupportedLocale,
      dateFormat: viewerContext.dateFormat,
      timeFormat: viewerContext.timeFormat,
      displayTimezoneMode: viewerContext.displayTimezoneMode,
      ...(viewerContext.customTimeZone ? { customTimeZone: viewerContext.customTimeZone as IanaTimeZone } : {}),
    }), [viewerContext]);
  
  const formatViewerDate = useCallback((value: string | Date, options?: { dateFormat?: DateFormatPreference }) => 
    formatLocalDate(value, viewerContext.timeZone as IanaTimeZone, viewerContext.locale as SupportedLocale, options?.dateFormat ? { dateFormat: options.dateFormat } : {}), 
    [viewerContext]
  );
  
  const formatViewerTime = useCallback((value: string | Date, options?: { timeFormat?: TimeFormatPreference }) => 
    formatLocalTime(value, viewerContext.timeZone as IanaTimeZone, viewerContext.locale as SupportedLocale, options?.timeFormat ? { timeFormat: options.timeFormat } : {}), 
    [viewerContext]
  );
  
  const formatCurrencyValue = useCallback((amount: number | { minorUnits: number; currency?: string }, currencyCode?: string) => 
    formatCurrency(amount, currencyCode, viewerContext.locale as SupportedLocale), 
    [viewerContext]
  );
  
  const validateTemporal = useCallback((value: string, type: 'instant' | 'date' | 'datetime' | 'year-month') => 
    serviceValidateTemporalValue(value, type), 
  []);
  
  const updatePreferences = useCallback(async (prefs: Partial<TemporalContextValue['preferences']>) => {
    setPreferencesState(prev => ({ ...prev, ...prefs }));
    // TODO: Persist to secure storage
  }, []);
  
  const value: TemporalContextValue = {
    context,
    societyContext: {
      timeZone: societyContext.timeZone as IanaTimeZone,
      locale: societyContext.locale as SupportedLocale,
      countryCode: societyContext.countryCode,
      financialYearStartMonth: societyContext.financialYearStartMonth,
      financialYearStartDay: societyContext.financialYearStartDay,
    },
    viewerContext: {
      timeZone: viewerContext.timeZone as IanaTimeZone,
      locale: viewerContext.locale as SupportedLocale,
      dateFormat: viewerContext.dateFormat,
      timeFormat: viewerContext.timeFormat,
      displayTimezoneMode: viewerContext.displayTimezoneMode,
      ...(viewerContext.customTimeZone ? { customTimeZone: viewerContext.customTimeZone as IanaTimeZone } : {}),
    },
    deviceContext: {
      timeZone: deviceContext.timeZone as IanaTimeZone,
      locale: deviceContext.locale as SupportedLocale,
    },
    formatSocietyDate,
    formatSocietyTime,
    formatSocietyDateTime,
    formatDateOnly,
    formatYearMonth: formatYearMonthValue,
    formatDualTime: formatDualTimeValue,
    formatRelative: formatRelativeValue,
    formatBusinessDeadline: formatBusinessDeadlineValue,
    getSocietyToday: () => new Date().toLocaleDateString('en-CA', { timeZone: societyContext.timeZone }),
    getViewerToday: () => new Date().toLocaleDateString('en-CA', { timeZone: viewerContext.timeZone }),
    isSameSocietyDay: (instant1: string, instant2: string) => 
      new Date(instant1).toLocaleDateString('en-CA', { timeZone: societyContext.timeZone }) === 
      new Date(instant2).toLocaleDateString('en-CA', { timeZone: societyContext.timeZone }),
    isSameViewerDay: (instant1: string, instant2: string) => 
      new Date(instant1).toLocaleDateString('en-CA', { timeZone: viewerContext.timeZone }) === 
      new Date(instant2).toLocaleDateString('en-CA', { timeZone: viewerContext.timeZone }),
    formatViewerDate,
    formatViewerTime,
    formatCurrency: formatCurrencyValue,
    validateTemporal,
    preferences,
    updatePreferences,
    isCrossTimezone,
    displayTimezoneMode: preferences.displayTimezoneMode,
  };
  
  return (
    <TemporalContext.Provider value={value}>
      {children}
    </TemporalContext.Provider>
  );
}

/**
 * Hook to access the temporal context
 * 
 * @throws Error if used outside TemporalProvider
 */
export function useTemporalContext(): TemporalContextValue {
  const context = useContext(TemporalContext);
  if (!context) {
    throw new Error('useTemporalContext must be used within a TemporalProvider');
  }
  return context;
}

/**
 * Hook for society-only formatting (business rules)
 */
export function useSocietyTime() {
  const { 
    formatSocietyDate, 
    formatSocietyTime, 
    formatSocietyDateTime, 
    formatDateOnly,
    formatYearMonth,
    getSocietyToday,
    isSameSocietyDay,
    societyContext,
  } = useTemporalContext();
  
  return {
    formatSocietyDate,
    formatSocietyTime,
    formatSocietyDateTime,
    formatDateOnly,
    formatYearMonth,
    getSocietyToday,
    isSameSocietyDay,
    societyTimeZone: societyContext.timeZone,
  };
}

/**
 * Hook for viewer formatting (display preferences)
 */
export function useViewerTime() {
  const { 
    formatViewerDate, 
    formatViewerTime, 
    formatDualTime, 
    formatRelative, 
    formatBusinessDeadline,
    getViewerToday,
    isSameViewerDay,
    viewerContext,
    formatCurrency,
    validateTemporal,
    preferences,
    isCrossTimezone,
    displayTimezoneMode,
    updatePreferences,
  } = useTemporalContext();
  
  return {
    formatViewerDate,
    formatViewerTime,
    formatDualTime,
    formatRelative,
    formatBusinessDeadline,
    getViewerToday,
    isSameViewerDay,
    viewerTimeZone: viewerContext.timeZone,
    formatCurrency,
    validateTemporal,
    preferences,
    isCrossTimezone,
    displayTimezoneMode,
    updatePreferences,
  };
}

/**
 * Hook for business deadline formatting
 */
export function useBusinessDeadlines() {
  const { formatBusinessDeadline, societyContext } = useTemporalContext();
  
  return {
    formatBusinessDeadline,
    societyTimeZone: societyContext.timeZone,
  };
}

export type { TemporalProviderProps };

