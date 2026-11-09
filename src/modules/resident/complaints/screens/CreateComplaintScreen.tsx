import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCreateComplaint } from '../hooks/useCreateComplaint';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { SocietySuccessView } from '../../../../shared/components/SocietySuccessView';
import type { ComplaintCategory } from '../../../../shared/types/complaint.types';
import { ComplaintPriority } from '../data/complaints.enums';
import {
  styles,
  createRootTopInset,
  createScrollPadding,
} from '../styles/screens/CreateComplaintScreen.styles';

const CATEGORIES: { key: ComplaintCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'PLUMBING', label: 'Plumbing', icon: 'water-outline' },
  { key: 'ELECTRICAL', label: 'Electrical', icon: 'flash-outline' },
  { key: 'LIFT', label: 'Lift', icon: 'hardware-chip-outline' },
  { key: 'SECURITY', label: 'Security', icon: 'shield-outline' },
  { key: 'HOUSEKEEPING', label: 'Housekeeping', icon: 'sparkles-outline' },
  { key: 'PARKING', label: 'Parking', icon: 'car-outline' },
  { key: 'OTHER', label: 'Other', icon: 'alert-circle-outline' },
];

const LOCATIONS = [
  'My Flat (A-1204)',
  'Floor Corridor',
  'Tower Lobby',
  'Lift / Elevator',
  'Parking Level -1',
  'Clubhouse',
  'Garden',
  'Main Gate',
  'Other Shared Area',
];

export function CreateComplaintScreen({
  navigation,
}: {
  navigation: { navigate: (screen: string, params?: unknown) => void; goBack: () => void };
}) {
  const insets = useSafeAreaInsets();
  const { submit, isSubmitting } = useCreateComplaint();

  const [category, setCategory] = useState<ComplaintCategory>('PLUMBING');
  const [location, setLocation] = useState('My Flat (A-1204)');
  const [priority, setPriority] = useState<ComplaintPriority>(ComplaintPriority.MEDIUM);
  const [title, setTitle] = useState('Water leakage in bathroom');
  const [description, setDescription] = useState(
    'Water is leaking from the ceiling onto the bathroom floor. Spreading towards the bedroom wall.',
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdComplaintId, setCreatedComplaintId] = useState('C-1024');
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const photos = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400',
  ];

  const handleSubmit = async () => {
    if (isSubmitting || submittedOnce) return;
    setSubmittedOnce(true);

    const res = await submit({
      category,
      title: title.trim() || 'Water leakage in bathroom',
      description: description.trim() || 'Water leakage in bathroom',
      priority,
      location,
      isPrivate: false,
    });

    const newId =
      res.ok && 'id' in res.data
        ? String(res.data.id).replace('comp-', 'C-')
        : 'C-1024';
    setCreatedComplaintId(newId);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <View style={[styles.root, createRootTopInset(insets.top)]}>
        <SocietySuccessView
          title="Complaint raised successfully!"
          subtitle={`#${createdComplaintId}\nYou will be notified on updates.`}
          primaryActionLabel="View Complaint"
          onPrimaryAction={() =>
            navigation.navigate('ComplaintDetail', {
              complaintId: `comp-${createdComplaintId.replace('C-', '')}`,
            })
          }
          secondaryActionLabel="Back to Complaints"
          onSecondaryAction={() => navigation.navigate('ComplaintList')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, createRootTopInset(insets.top)]}>
      <SocietyDetailHeader
        title="Raise Complaint"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, createScrollPadding(insets.bottom)]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.key;
            return (
              <Pressable
                key={cat.key}
                style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
                onPress={() => setCategory(cat.key)}
                accessibilityRole="button"
                accessibilityLabel={cat.label}
              >
                <View
                  style={[
                    styles.categoryIconBox,
                    isSelected && styles.categoryIconBoxSelected,
                  ]}
                >
                  <Ionicons
                    name={cat.icon}
                    size={20}
                    color={isSelected ? '#FFFFFF' : '#064F43'}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Problem Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Water leakage, Lift not working"
            placeholderTextColor="#8C928E"
          />

          <Text style={styles.inputLabel}>Detailed Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the problem, severity, and when it started..."
            placeholderTextColor="#8C928E"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Location / Area</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.locationScroll}
          >
            {LOCATIONS.map((loc) => {
              const isSelected = location === loc;
              return (
                <Pressable
                  key={loc}
                  style={[
                    styles.locationChip,
                    isSelected && styles.locationChipSelected,
                  ]}
                  onPress={() => setLocation(loc)}
                  accessibilityRole="button"
                  accessibilityLabel={loc}
                >
                  <Text
                    style={[
                      styles.locationChipText,
                      isSelected && styles.locationChipTextSelected,
                    ]}
                  >
                    {loc}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Urgency / Priority</Text>
          <View style={styles.priorityRow}>
            <Pressable
              style={[
                styles.priorityChip,
                priority === ComplaintPriority.LOW && styles.priorityChipSelectedLow,
              ]}
              onPress={() => setPriority(ComplaintPriority.LOW)}
              accessibilityRole="button"
              accessibilityLabel="Low priority"
            >
              <Text
                style={[
                  styles.priorityChipText,
                  priority === ComplaintPriority.LOW && styles.priorityChipTextSelected,
                ]}
              >
                Low
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.priorityChip,
                priority === ComplaintPriority.MEDIUM && styles.priorityChipSelectedMedium,
              ]}
              onPress={() => setPriority(ComplaintPriority.MEDIUM)}
              accessibilityRole="button"
              accessibilityLabel="Medium priority"
            >
              <Text
                style={[
                  styles.priorityChipText,
                  priority === ComplaintPriority.MEDIUM && styles.priorityChipTextSelected,
                ]}
              >
                Medium
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.priorityChip,
                priority === ComplaintPriority.HIGH && styles.priorityChipSelectedHigh,
              ]}
              onPress={() => setPriority(ComplaintPriority.HIGH)}
              accessibilityRole="button"
              accessibilityLabel="High priority"
            >
              <Text
                style={[
                  styles.priorityChipText,
                  priority === ComplaintPriority.HIGH && styles.priorityChipTextSelected,
                ]}
              >
                High
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.priorityChip,
                priority === ComplaintPriority.URGENT && styles.priorityChipSelectedUrgent,
              ]}
              onPress={() => setPriority(ComplaintPriority.URGENT)}
              accessibilityRole="button"
              accessibilityLabel="Urgent priority"
            >
              <Text
                style={[
                  styles.priorityChipText,
                  priority === ComplaintPriority.URGENT && styles.priorityChipTextSelected,
                ]}
              >
                Urgent
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Photos & Evidence (Optional)</Text>
          <View style={styles.mediaSection}>
            {photos.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={styles.photoThumb} />
            ))}
            <Pressable
              style={styles.addPhotoBtn}
              accessibilityRole="button"
              accessibilityLabel="Add photo"
            >
              <Ionicons name="camera-outline" size={24} color="#064F43" />
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.submitBtn, (isSubmitting || submittedOnce) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || submittedOnce}
          accessibilityRole="button"
          accessibilityLabel="Submit complaint"
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default CreateComplaintScreen;
