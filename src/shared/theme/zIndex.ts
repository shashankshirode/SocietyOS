export const zIndexScale = {
  deep: -1,
  base: 0,
  nav: 10,
  header: 20,
  dropdown: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const;

export type ZIndexScale = typeof zIndexScale;
export const zIndex = zIndexScale;
export type ZIndexToken = keyof ZIndexScale;
