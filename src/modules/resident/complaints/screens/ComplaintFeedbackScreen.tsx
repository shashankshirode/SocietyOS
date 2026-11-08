import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { useComplaintFeedback } from '../hooks/useComplaintFeedback';
import {
  styles,
  createRootTopInset,
  createScrollPadding,
} from '../styles/screens/ComplaintFeedbackScreen.styles';

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
    <View style={[styles.root, createRootTopInset(insets.top)]}>
      <SocietyDetailHeader
        title=""
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          createScrollPadding(insets.bottom),
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={36} color="#FFFFFF" />
          </View>

          <Text style={styles.resolvedTitle}>
            {isSubmitted ? 'Thank you for your feedback!' : 'Complaint resolved!'}
          </Text>
          <Text style={styles.complaintIdSubtitle}>{displayId}</Text>

          {!isSubmitted ? (
            <>
              <Text style={styles.questionText}>How was the resolution?</Text>

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

              <Pressable
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Submit feedback"
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.doneBtn}
              onPress={() => navigation.navigate('ComplaintList')}
              accessibilityRole="button"
              accessibilityLabel="Back to complaints"
            >
              <Text style={styles.doneBtnText}>Back to Complaints</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default ComplaintFeedbackScreen;
