export const countryDefaults: Record<string, { timezone: string; locale: string }> = {
  IN: { timezone: 'Asia/Kolkata', locale: 'en-IN' },
  INDIA: { timezone: 'Asia/Kolkata', locale: 'en-IN' },
  US: { timezone: 'America/New_York', locale: 'en-US' },
  USA: { timezone: 'America/New_York', locale: 'en-US' },
  GB: { timezone: 'Europe/London', locale: 'en-GB' },
  UK: { timezone: 'Europe/London', locale: 'en-GB' },
  SG: { timezone: 'Asia/Singapore', locale: 'en-SG' },
  SINGAPORE: { timezone: 'Asia/Singapore', locale: 'en-SG' },
};

export function getDefaultsForCountry(country?: string) {
  if (!country) return undefined;
  const key = country.toUpperCase().trim();
  return countryDefaults[key];
}
