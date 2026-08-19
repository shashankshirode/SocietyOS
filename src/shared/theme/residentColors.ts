
export const residentColors = {
  brandInk: '#142454',
  brandIndigo: '#4E46E5',
  brandCobalt: '#3268D8',
  accentAqua: '#159E96',

  lightCanvas: '#F4F6FB',
  lightSurface: '#FFFFFF',
  lightElevatedSurface: '#F9FAFD',

  darkCanvas: '#080D18',
  darkSurface: '#111827',
  darkElevatedSurface: '#172033',

  success: '#198A59',
  warning: '#B97818',
  danger: '#D8464A',
  information: '#2878C7',

  onBrand: '#FFFFFF',
  onBrandStrong: 'rgba(255,255,255,0.90)',
  onBrandMedium: 'rgba(255,255,255,0.75)',
  onBrandMuted: 'rgba(255,255,255,0.60)',
  onBrandFaint: 'rgba(255,255,255,0.40)',
  onBrandSoft: 'rgba(255,255,255,0.20)',
  onBrandSubtle: 'rgba(255,255,255,0.12)',
  imageScrim: 'rgba(8,13,24,0.38)',
  attentionOnBrand: '#FFD38A',
} as const;

export type ResidentColorToken = keyof typeof residentColors;
