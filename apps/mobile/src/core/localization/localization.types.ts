export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export type MessageKey = string;

export type GreetingRule = {
  period: GreetingPeriod;
  startHourInclusive: number;
  endHourExclusive: number;
  messageKey: MessageKey;
};

export type DateTimeFormatContext = {
  locale: string;
  timezone: string;
  countryCode: string;
};
