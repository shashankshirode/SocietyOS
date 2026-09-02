import { Switch, type SwitchProps } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';

export type SocietySwitchProps = Omit<SwitchProps, 'trackColor' | 'thumbColor' | 'ios_backgroundColor'>;

export function SocietySwitch(props: SocietySwitchProps) {
  const { semantic, dark } = useAppTheme();

  return (
    <Switch
      {...props}
      trackColor={{
        false: semantic.surface.soft,
        true: semantic.accent.sage,
      }}
      thumbColor={props.disabled
        ? semantic.text.muted
        : dark
          ? semantic.surface.raised
          : semantic.surface.base}
      ios_backgroundColor={semantic.surface.soft}
      accessibilityRole="switch"
      accessibilityState={{
        checked: props.value ?? false,
        disabled: props.disabled ?? false,
      }}
    />
  );
}

export default SocietySwitch;
