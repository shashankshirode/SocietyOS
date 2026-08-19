import { lightTheme } from '../theme/lightTheme';

export const Colors = lightTheme.colors;

export type ColorToken = keyof typeof Colors;
export type PaletteColor = ColorToken;
