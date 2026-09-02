import { View } from 'react-native';
import { useMessages } from '../../shared/constants/useMessages';
import { SafeText } from '../../shared/components/SafeText';
import { FilterChip } from '../../shared/filters/FilterChip';
import { AppDateField } from '../forms/AppDateField';
import { WrapRow } from '../layout/WrapRow';
import { includeWhenPresent } from '../../shared/utils/presentProperty';
import { styles } from './styles/TemporalFilter.styles';

export type TemporalPreset = 'today' | 'thisWeek' | 'thisMonth' | 'earlier' | 'custom';

export type TemporalFilterValue = {
  preset: TemporalPreset;
  from?: string;
  to?: string;
};

type TemporalFilterProps = {
  value: TemporalFilterValue;
  onChange: (value: TemporalFilterValue) => void;
  testID?: string;
};

const PRESETS: readonly TemporalPreset[] = ['today', 'thisWeek', 'thisMonth', 'earlier', 'custom'];

function startOfDay(value: Date): Date {
  const result = new Date(value);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(value: Date): Date {
  const result = new Date(value);
  result.setHours(23, 59, 59, 999);
  return result;
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function resolveTemporalRange(value: TemporalFilterValue, now = new Date()): { from: Date | null; to: Date | null } {
  const today = startOfDay(now);
  if (value.preset === 'today') return { from: today, to: endOfDay(today) };
  if (value.preset === 'thisWeek') {
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    return { from: monday, to: endOfDay(now) };
  }
  if (value.preset === 'thisMonth') {
    return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: endOfDay(now) };
  }
  if (value.preset === 'earlier') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const earlierEnd = new Date(monthStart.getTime() - 1);
    return { from: null, to: earlierEnd };
  }
  return {
    from: parseDate(value.from),
    to: value.to ? endOfDay(parseDate(value.to) ?? now) : null,
  };
}

export function isTemporalRangeValid(value: TemporalFilterValue): boolean {
  const range = resolveTemporalRange(value);
  return !range.from || !range.to || range.from.getTime() <= range.to.getTime();
}

export function matchesTemporalFilter(dateValue: string, value: TemporalFilterValue, now = new Date()): boolean {
  const date = parseDate(dateValue);
  if (!date || !isTemporalRangeValid(value)) return false;
  const range = resolveTemporalRange(value, now);
  return (!range.from || date >= range.from) && (!range.to || date <= range.to);
}

export function TemporalFilter({ value, onChange, testID }: TemporalFilterProps) {
  const messages = useMessages();
  const copy = messages.common.temporal;
  const labels: Record<TemporalPreset, string> = {
    today: copy.today,
    thisWeek: copy.thisWeek,
    thisMonth: copy.thisMonth,
    earlier: copy.earlier,
    custom: copy.custom,
  };
  const valid = isTemporalRangeValid(value);

  return (
    <View style={styles.root} testID={testID}>
      <WrapRow gap={8}>
        {PRESETS.map((preset) => (
          <FilterChip key={preset} label={labels[preset]} selected={value.preset === preset} onPress={() => onChange({ ...value, preset })} />
        ))}
      </WrapRow>
      {value.preset === 'custom' ? (
        <View style={styles.rangeFields}>
          <AppDateField label={copy.from} {...includeWhenPresent('value', value.from)} onChange={(from) => onChange({ ...value, from })} />
          <AppDateField label={copy.to} {...includeWhenPresent('value', value.to)} onChange={(to) => onChange({ ...value, to })} />
          {!valid ? <SafeText variant="caption" color="danger">{copy.invalidRange}</SafeText> : null}
        </View>
      ) : null}
    </View>
  );
}
