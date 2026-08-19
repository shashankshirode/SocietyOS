import React from "react";
import { Pressable, ScrollView, Text, View, ViewStyle, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../../shared/constants/colors";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { ResponsiveContainer } from "../../../../shared/layouts/ResponsiveContainer";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import { styles } from "../styles/components/ParkingUi.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type ScreenProps = {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
};
type ActionTileProps = {
    title: string;
    subtitle?: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    danger?: boolean;
};
export function ParkingScreen({ title, subtitle, onBack, children, footer }: ScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <ResponsiveContainer>
        <View style={styles.header}>
          {onBack ? (<Pressable style={styles.backButton} onPress={onBack} accessibilityRole="button" accessibilityLabel={localizedUiText.m_6aadac2f2b7a}>
              <Ionicons name="chevron-back" size={22} color={Colors.textPrimary}/>
            </Pressable>) : null}
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, footer ? styles.contentWithFooter : null]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ResponsiveContainer>
    </SafeAreaView>);
}
export function ActionTile({ title, subtitle, iconName, onPress, danger = false }: ActionTileProps) {
    return (<Pressable style={({ pressed }) => [styles.actionTile, pressed && styles.pressed]} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <View style={[styles.actionIcon, danger && styles.actionIconDanger]}>
        <Ionicons name={iconName} size={22} color={danger ? Colors.danger : Colors.primary}/>
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.actionSubtitle}>{subtitle}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted}/>
    </Pressable>);
}
export function MetricCard({ label, value, note }: {
    label: string;
    value: string | number;
    note?: string;
}) {
    return (<AppCard style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      {note ? <Text style={styles.metricNote}>{note}</Text> : null}
    </AppCard>);
}
export function DetailCard({ title, children, style }: {
    title: string;
    children: React.ReactNode;
    style?: ViewStyle;
}) {
    return (<AppCard style={[styles.detailCard, style]}>
      <Text style={styles.detailCardTitle}>{title}</Text>
      <View style={styles.detailCardContent}>{children}</View>
    </AppCard>);
}
export function DetailRow({ label, value, isLast = false }: {
    label: string;
    value: string | null | Absent;
    isLast?: boolean;
}) {
    return (<View style={[styles.detailRow, isLast && styles.detailRowLast]}>
      <Text style={styles.detailRowLabel}>{label}</Text>
      <Text style={styles.detailRowValue}>{value || '—'}</Text>
    </View>);
}
export function WarningText({ children }: {
    children: React.ReactNode;
}) {
    return (<View style={styles.warningContainer}>
      <Ionicons name="warning-outline" size={18} color="#D97706" style={styles.ioniconsMarginRight}/>
      <Text style={styles.warningText}>{children}</Text>
    </View>);
}
export function MockFilePicker({ label, fileName, helper, onPress }: {
    label: string;
    fileName: string;
    helper: string;
    onPress: () => void;
}) {
    return (<View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={onPress}>
        <Ionicons name="camera-outline" size={20} color={Colors.textPrimary} style={styles.ioniconsMarginRight2}/>
        <Text style={styles.pickerText}>{fileName || helper}</Text>
      </TouchableOpacity>
    </View>);
}
export function Selector<T extends string>({ label, value, onChange, options, error }: {
    label: string;
    value: T;
    onChange: (value: T) => void;
    options: {
        label: string;
        value: T;
    }[];
    error?: string;
}) {
    return (<View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((opt) => {
            const isSelected = opt.value === value;
            return (<TouchableOpacity key={opt.value} style={[styles.optionButton, isSelected && styles.optionButtonSelected]} onPress={() => onChange(opt.value)}>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>);
        })}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>);
}
export function FooterActions({ primaryLabel, onPrimary, loading, danger }: {
    primaryLabel: string;
    onPrimary: () => void;
    loading?: boolean;
    danger?: boolean;
}) {
    return (<View style={styles.footerActions}>
      <AppButton title={primaryLabel} onPress={onPrimary} {...includeWhenPresent("loading", loading)} variant={danger ? 'danger' : 'primary'} style={styles.appButtonWidth}/>
    </View>);
}
export function labelize(str: string | null | Absent): string {
    if (!str)
        return '';
    return str
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
export function maskSticker(str?: string | null): string {
    if (!str)
        return '—';
    if (str.length <= 2)
        return str;
    return str[0] + '*' + str.slice(2);
}
export function maskRfid(str?: string | null): string {
    if (!str)
        return '—';
    if (str.length <= 2)
        return str;
    return str[0] + '*' + str.slice(2);
}

