import type { AppIconName } from '../icons/icon.types';


export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
  icon?: AppIconName;
  disabled?: boolean;
}


export type FilterChipLayout = 'wrap' | 'horizontal-scroll';


export interface FilterChipGroupProps<T = string> {
  filters: FilterOption<T>[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  layout?: FilterChipLayout;
  multiSelect?: boolean;
  showClear?: boolean;
}


export interface FilterPanelSection {
  key: string;
  title: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

export interface FilterPanelConfig {
  sections: FilterPanelSection[];
  onApply: (selections: Record<string, string[]>) => void;
  onClear: () => void;
  onCancel: () => void;
  visible: boolean;
}
