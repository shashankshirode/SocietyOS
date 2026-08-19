import type { Absent } from '../types/absence.types';

type UiInterpolationValue = string | number | boolean | bigint | null | Absent;

export function formatUiLiteral(
  template: string,
  values: readonly UiInterpolationValue[],
): string {
  return values.reduce<string>(
    (message, value, index) => message.replaceAll(
      `__SOCIETYOS_ARG_${index}__`,
      String(value),
    ),
    template,
  );
}
