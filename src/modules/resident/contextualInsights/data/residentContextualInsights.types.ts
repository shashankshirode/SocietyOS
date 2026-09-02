import type Ionicons from '@expo/vector-icons/Ionicons';
export type MessageKey = string;

export type AppIconName = keyof typeof Ionicons.glyphMap;
export type ResidentRouteName = string;

export type WeatherConditionCode =
  | 'clear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavyRain'
  | 'thunderstorm'
  | 'heat'
  | 'cold'
  | 'wind'
  | 'unknown';

export type LocalAdvisoryType =
  | 'roadBlock'
  | 'waterlogging'
  | 'gateCongestion'
  | 'liftOutage'
  | 'powerCut'
  | 'securityAlert'
  | 'parkingCongestion'
  | 'societyEvent'
  | 'maintenanceWork'
  | 'airQuality'
  | 'none';

export type ContextualInsightPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type AreaWeatherSnapshot = {
  areaId: string;
  areaName: string;
  city: string;
  latitude: number;
  longitude: number;
  temperatureCelsius: number;
  feelsLikeCelsius?: number;
  humidityPercent?: number;
  precipitationProbabilityPercent?: number;
  windSpeedKmph?: number;
  conditionCode: WeatherConditionCode;
  observedAtIso: string;
  validUntilIso: string;
  provider: 'openMeteo' | 'openWeather' | 'weatherApi' | 'backendMock' | 'manual';
};

export type LocalAreaAdvisory = {
  id: string;
  societyId?: string;
  areaId: string;
  type: LocalAdvisoryType;
  priority: ContextualInsightPriority;
  titleMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  shortSuggestionMessageKey: MessageKey;
  reportedAtIso: string;
  validUntilIso: string;
  source: 'societyAdmin' | 'facilityTeam' | 'guardReport' | 'residentReports' | 'municipalFeed' | 'weatherRule' | 'mock';
  customTitle?: string;
  customDescription?: string;
  reporterName?: string;
  autoIconName?: AppIconName;
};

export type ResidentContextualSuggestion = {
  id: string;
  priority: ContextualInsightPriority;
  iconName: AppIconName;
  titleMessageKey: MessageKey;
  oneLineMessageKey: MessageKey;
  detailMessageKey: MessageKey;
  weatherSnapshot?: AreaWeatherSnapshot;
  advisory?: LocalAreaAdvisory;
  action?: ResidentContextualSuggestionAction;
};

export type ResidentContextualSuggestionAction = {
  labelMessageKey: MessageKey;
  routeName?: ResidentRouteName;
  actionType: 'openDetails' | 'openVisitors' | 'openEmergency' | 'openNotices' | 'openMapPlaceholder' | 'dismiss';
};

export type ResidentContextualInsightsResult = {
  activeAreaId: string;
  activeSocietyId: string;
  activeUnitId: string;
  weatherSnapshot: AreaWeatherSnapshot | null;
  advisories: LocalAreaAdvisory[];
  suggestions: ResidentContextualSuggestion[];
  topSuggestion: ResidentContextualSuggestion | null;
  lastUpdatedIso: string;
  nextRefreshDueIso: string;
};
