export enum SupportedLocale {
  EnglishIndia = 'en-IN',
  HindiIndia = 'hi-IN',
  MarathiIndia = 'mr-IN',
}

export type LanguageOption = {
  locale: SupportedLocale;
  label: string;
};
