export const imageTokens = {
  aspectRatio: {
    hero: 16 / 9,
    card: 4 / 3,
    banner: 3 / 1,
    square: 1,
  },
  overlay: {
    light: 'rgba(15, 23, 42, 0.16)',
    medium: 'rgba(15, 23, 42, 0.34)',
    strong: 'rgba(15, 23, 42, 0.56)',
  },
  height: {
    compactHero: 168,
    dashboardHero: 220,
    cardImage: 128,
  },
} as const;

export type ImageTokenScale = typeof imageTokens;
export const ImageTokens = imageTokens;
