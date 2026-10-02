import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { OnboardingShell } from '../../components/OnboardingShell';
import { ProfileField } from '../../components/ProfileField';
import { PrimaryCTA } from '../../components/PrimaryCTA';
import { ResidentOnboardingDraft } from '../../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF,
} from '../../../../../shared/theme/typography';

import type { OnboardingProfile } from '../../hooks/useResidentOnboarding';

interface AboutYouStepProps {
  draft?: ResidentOnboardingDraft;
  profile?: OnboardingProfile;
  onUpdateProfile: (profile: Partial<OnboardingProfile>) => void;
  onBack: () => void;
  onHelp: () => void;
}

export function AboutYouStep({
  draft,
  profile,
  onUpdateProfile,
  onBack,
  onHelp,
}: AboutYouStepProps) {
  const draftProfile = draft?.profile;
  const [fullName, setFullName] = useState(profile?.fullName || draftProfile?.fullName || 'Shashank Shirode');
  const [preferredName, setPreferredName] = useState(profile?.preferredName || draftProfile?.preferredName || 'Shashank');
  const [email, setEmail] = useState(profile?.email || draftProfile?.email || 'shashank@example.com');
  const [dob, setDob] = useState(profile?.dateOfBirth || draftProfile?.dob || '');
  const [hasAvatar, setHasAvatar] = useState(Boolean(profile?.avatarUri || draftProfile?.avatarUri));

  const handleContinue = () => {
    const profileUpdate: Partial<OnboardingProfile> = {
      fullName,
      preferredName,
      email,
    };
    if (dob) profileUpdate.dateOfBirth = dob;
    if (hasAvatar) profileUpdate.avatarUri = 'file:///avatars/resident-photo.jpg';
    onUpdateProfile(profileUpdate);
  };

  const isFormValid = fullName.trim().length >= 2;

  return (
    <OnboardingShell
      currentMilestone="About you"
      currentStepIndex={3}
      onBack={onBack}
      onHelp={onHelp}
      footerCta={
        <PrimaryCTA
          label="Continue to documents"
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      }
    >
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.heading}>Tell us a little about you</Text>
          <Text style={styles.supportingText}>
            This helps your community recognize and serve you.
          </Text>
        </View>

        {/* Optional Profile Photo Picker */}
        <View style={styles.photoContainer}>
          <Pressable
            onPress={() => setHasAvatar(!hasAvatar)}
            style={styles.avatarCircle}
            accessibilityRole="button"
            accessibilityLabel="Add profile photo"
          >
            {hasAvatar ? (
              <View style={styles.avatarSetBox}>
                <Text style={styles.avatarInitials}>SS</Text>
                <View style={styles.avatarCheckBadge}>
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="m5 12 5 5L20 7"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </View>
            ) : (
              <View style={styles.avatarEmptyBox}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    stroke="#064F45"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="13" r="4" stroke="#064F45" strokeWidth={1.8} />
                </Svg>
                <Text style={styles.addPhotoText}>Add photo</Text>
              </View>
            )}
          </Pressable>
          <Text style={styles.photoHintText}>Photo is optional</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.fieldsContainer}>
          <ProfileField
            label="Full legal name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="As shown on government ID"
            required
            leadingIcon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  stroke="#69716D"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
          />

          <ProfileField
            label="Preferred name"
            value={preferredName}
            onChangeText={setPreferredName}
            placeholder="What neighbors should call you"
            helperText="Used in society greeting and directory if shared."
          />

          {/* Contact Details Card */}
          <View style={styles.contactCard}>
            <Text style={styles.contactCardTitle}>CONTACT DETAILS</Text>

            {/* Mobile Number - Verified */}
            <ProfileField
              label="Mobile number"
              value={draft?.maskedMobile || '+91 ••••• ••456'}
              editable={false}
              verifiedBadge
              leadingIcon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01"
                    stroke="#69716D"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              }
            />

            {/* Email Address */}
            <ProfileField
              label="Email address"
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              helperText="For maintenance invoices, AGM notices & receipts."
              leadingIcon={
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="#69716D"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="m22 6-10 7L2 6"
                    stroke="#69716D"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              }
            />
          </View>

          {/* Optional Date of Birth */}
          <ProfileField
            label="Date of birth (Optional)"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
            helperText="Only used for society age-based amenity discounts if applicable."
          />
        </View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  headerBlock: {
    gap: 6,
  },
  heading: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_SERIF,
    fontWeight: '600',
    color: '#10201D',
  },
  supportingText: {
    fontSize: 14.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 20,
  },
  photoContainer: {
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E6F0EE',
    borderWidth: 2,
    borderColor: '#CEE1DC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmptyBox: {
    alignItems: 'center',
    gap: 4,
  },
  addPhotoText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
  },
  avatarSetBox: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
    backgroundColor: '#064F45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 26,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#FFFFFF',
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1B7A4E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoHintText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
  fieldsContainer: {
    gap: 2,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 16,
    gap: 4,
    marginVertical: 6,
  },
  contactCardTitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#69716D',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
});

