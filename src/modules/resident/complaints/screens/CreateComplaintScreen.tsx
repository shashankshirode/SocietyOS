import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCreateComplaint } from '../hooks/useCreateComplaint';
import { useMessages } from '../../../../shared/constants/useMessages';
import { enMessages } from '../../../../messages/en';
import { SocietyDetailHeader } from '../../../../shared/components/SocietyDetailHeader';
import { SocietySuccessView } from '../../../../shared/components/SocietySuccessView';
import { SocietyInput } from '../../../../shared/components/SocietyInput';
import { SocietyButton } from '../../../../shared/components/SocietyButton';
import type { ComplaintCategory } from '../../../../shared/types/complaint.types';
import { ComplaintPriority } from '../data/complaints.enums';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

const CATEGORIES: { key: ComplaintCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'PLUMBING', label: 'Plumbing', icon: 'water-outline' },
  { key: 'ELECTRICAL', label: 'Electrical', icon: 'flash-outline' },
  { key: 'LIFT', label: 'Lift', icon: 'hardware-chip-outline' },
  { key: 'SECURITY', label: 'Security', icon: 'shield-outline' },
  { key: 'HOUSEKEEPING', label: 'Housekeeping', icon: 'sparkles-outline' },
  { key: 'PARKING', label: 'Parking', icon: 'car-outline' },
  { key: 'OTHER', label: 'Other', icon: 'alert-circle-outline' },
];

export function CreateComplaintScreen({ navigation }: { navigation: { navigate: (screen: string, params?: unknown) => void; goBack: () => void } }) {
  const insets = useSafeAreaInsets();
  const messages = useMessages();
  const { submit, isSubmitting } = useCreateComplaint();

  const [category, setCategory] = useState<ComplaintCategory>('PLUMBING');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [title, setTitle] = useState('Water leakage in bathroom');
  const [description, setDescription] = useState('Water is leaking from the ceiling onto the bathroom floor. Spreading towards the bedroom wall.');
  const [step, setStep] = useState<'details' | 'media' | 'success'>('details');
  const [createdComplaintId, setCreatedComplaintId] = useState('C-1024');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400',
  ]);

  const handleNext = () => {
    if (step === 'details') {
      setStep('media');
    } else if (step === 'media') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const res = await submit({
      category,
      title: title || 'Water leakage in bathroom',
      description: description || 'Water leakage in bathroom',
      priority: ComplaintPriority.MEDIUM,
      location: 'A-1204',
      isPrivate: false,
    });

    const newId = res.ok && 'id' in res.data ? String(res.data.id).replace('comp-', 'C-') : 'C-1024';
    setCreatedComplaintId(newId);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
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

  const selectedCategoryObj = CATEGORIES.find((c) => c.key === category) || CATEGORIES[0];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <SocietyDetailHeader
        title="Raise Complaint"
        onBackPress={() => {
          if (step === 'media') setStep('details');
          else navigation.goBack();
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {step === 'details' ? (
          <View style={styles.formContainer}>
            {/* Category Dropdown */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Category</Text>
              <Pressable
                style={styles.dropdownBtn}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                accessibilityRole="button"
                accessibilityLabel="Select category"
              >
                <View style={styles.dropdownLeft}>
                  {selectedCategoryObj && (
                    <Ionicons name={selectedCategoryObj.icon} size={20} color="#064F43" />
                  )}
                  <Text style={styles.dropdownText}>{selectedCategoryObj?.label}</Text>
                </View>
                <Ionicons
                  name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#626A65"
                />
              </Pressable>

              {/* Category Picker Popover */}
              {showCategoryPicker && (
                <View style={styles.pickerBox}>
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c.key}
                      style={[
                        styles.pickerItem,
                        category === c.key && styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setCategory(c.key);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Ionicons
                        name={c.icon}
                        size={18}
                        color={category === c.key ? '#064F43' : '#626A65'}
                      />
                      <Text
                        style={[
                          styles.pickerItemText,
                          category === c.key && styles.pickerItemTextSelected,
                        ]}
                      >
                        {c.label}
                      </Text>
                      {category === c.key && (
                        <Ionicons name="checkmark" size={16} color="#064F43" style={{ marginLeft: 'auto' }} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Title Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Water leakage in bathroom"
                placeholderTextColor="#8C928E"
              />
            </View>

            {/* Description Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the issue in detail..."
                placeholderTextColor="#8C928E"
                multiline
                numberOfLines={4}
              />
            </View>

            <Pressable
              style={styles.continueBtn}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </Pressable>
          </View>
        ) : (
          /* Step 3: Add media */
          <View style={styles.formContainer}>
            <Text style={styles.sectionHeading}>Add Photos (Optional)</Text>

            <View style={styles.photoGrid}>
              {photos.map((uri, idx) => (
                <View key={idx} style={styles.photoThumbBox}>
                  <Image source={{ uri }} style={styles.photoImg} />
                  <Pressable
                    style={styles.removePhotoBtn}
                    onPress={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    hitSlop={6}
                  >
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}

              <Pressable
                style={styles.addPhotoDashedBox}
                onPress={() =>
                  setPhotos([
                    ...photos,
                    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
                  ])
                }
                accessibilityRole="button"
                accessibilityLabel="Add more photos"
              >
                <Ionicons name="add" size={24} color="#064F43" />
                <Text style={styles.addPhotoText}>Add More</Text>
              </Pressable>
            </View>

            <Pressable
              style={[styles.continueBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Submit Complaint"
            >
              <Text style={styles.continueBtnText}>
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </Text>
            </Pressable>
          </View>
        )}
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
    paddingTop: 16,
  },
  formContainer: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 16,
    height: 52,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
  },
  pickerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F1EB',
  },
  pickerItemSelected: {
    backgroundColor: '#EEF5F0',
  },
  pickerItemText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
  },
  pickerItemTextSelected: {
    color: '#064F43',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    height: 52,
  },
  textArea: {
    height: 110,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  continueBtn: {
    backgroundColor: '#064F43',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
    marginBottom: 4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoThumbBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoDashedBox: {
    width: 100,
    height: 100,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#064F43',
    backgroundColor: '#EEF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#064F43',
    fontWeight: '600',
  },
});

export default CreateComplaintScreen;