import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

interface ReviewSectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function ReviewSection({
  title,
  onEdit,
  children,
}: ReviewSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        {onEdit && (
          <Pressable
            onPress={onEdit}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${title}`}
          >
            <Text style={styles.editText}>Edit →</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.contentBox}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 18,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDE4',
    paddingBottom: 8,
  },
  titleText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#69716D',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  editText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
  },
  contentBox: {
    gap: 4,
  },
});
