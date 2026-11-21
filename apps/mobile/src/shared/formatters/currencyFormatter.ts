import { formatResidentCurrency } from '../../core/localization/dateTimeFormatters';

export function formatCurrencyAmount(
  amount: number,
  currencyCode = 'INR',
  locale = 'en-IN',
): string {
  return formatResidentCurrency(amount, currencyCode, { locale });
}

export default formatCurrencyAmount;
