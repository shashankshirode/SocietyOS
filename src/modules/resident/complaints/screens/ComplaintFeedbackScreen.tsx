import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { useComplaintFeedback } from '../hooks/useComplaintFeedback';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

type Props = {
  navigation: {
    navigate: (screen: string, params?: unknown) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      complaintId?: string;
    };
  };
};

export function ComplaintFeedbackScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submit, isSubmitting } = useComplaintFeedback();
  const complaintId = route?.params?.complaintId || 'comp-1024';
  const displayId = complaintId.startsWith('comp-')
    ? `#C-${complaintId.replace('comp-', '')}`
    : `#${complaintId}`;

  const handleSubmit = async () => {
    await submit({ complaintId, rating, comments });
    setIsSubmitted(true);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <SocietyDetailHeader
        title=""
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerCard}>
          {/* Green Check Circle */}
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={36} color="#FFFFFF" />
          </View>

          {/* Headline */}
          <Text style={styles.resolvedTitle}>Complaint resolved!</Text>
          <Text style={styles.complaintIdSubtitle}>{displayId}</Text>

          <Text style={styles.questionText}>How was the resolution?</Text>

          {/* Star Rating Row */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = rating >= star;
              return (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  hitSlop={8}
                  style={styles.starPressable}
                  accessibilityRole="button"
                  accessibilityLabel={`${star} stars`}
                >
                  <Ionicons
                    name={active ? 'star' : 'star-outline'}
                    size={36}
                    color={active ? '#F59E0B' : '#D0D5DD'}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* Feedback Comments */}
          <View style={styles.commentsBox}>
            <TextInput
              style={styles.commentsInput}
              value={comments}
              onChangeText={setComments}
              placeholder="Add optional notes about the service..."
              placeholderTextColor="#8C928E"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Submit CTA */}
          <Pressable
            style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={isSubmitted ? () => navigation.navigate('ComplaintList') : handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel={isSubmitted ? 'Done' : 'Submit'}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? 'Submitting...' : isSubmitted ? 'Done' : 'Submit'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  centerCard: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resolvedTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  complaintIdSubtitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#626A65',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  starPressable: {
    padding: 4,
  },
  commentsBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 14,
    minHeight: 90,
    marginBottom: 16,
  },
  commentsInput: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    textAlignVertical: 'top',
  },
  submitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
});

export default ComplaintFeedbackScreen;
