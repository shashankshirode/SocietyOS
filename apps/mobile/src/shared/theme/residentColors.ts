
export const residentColors = {
  brandInk: '#172019',
  brandIndigo: '#6E72D8',
  brandCobalt: '#557F8A',
  accentAqua: '#4C8069',

  lightCanvas: '#F5F1E7',
  lightSurface: '#FBF9F3',
  lightElevatedSurface: '#FFFDF8',

  darkCanvas: '#111612',
  darkSurface: '#1B211C',
  darkElevatedSurface: '#252C25',

  success: '#477353',
  warning: '#A86620',
  danger: '#B44934',
  information: '#4E7469',

  onBrand: '#FFFDF8',
  onBrandStrong: 'rgba(255,255,255,0.90)',
  onBrandMedium: 'rgba(255,255,255,0.75)',
  onBrandMuted: 'rgba(255,255,255,0.60)',
  onBrandFaint: 'rgba(255,255,255,0.40)',
  onBrandSoft: 'rgba(255,255,255,0.20)',
  onBrandSubtle: 'rgba(255,255,255,0.12)',
  imageScrim: 'rgba(8,13,24,0.38)',
  attentionOnBrand: '#E7BC76',
} as const;

export type ResidentColorToken = keyof typeof residentColors;
