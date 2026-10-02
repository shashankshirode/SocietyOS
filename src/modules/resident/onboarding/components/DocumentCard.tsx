import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingDocument } from '../data/residentOnboarding.types';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../shared/theme/typography';

interface DocumentCardProps {
  document: OnboardingDocument;
  onPressUpload: (document: OnboardingDocument) => void;
  onPressRemove?: (document: OnboardingDocument) => void;
}

export function DocumentCard({
  document,
  onPressUpload,
  onPressRemove,
}: DocumentCardProps) {
  const isUploaded = document.status === 'UPLOADED' || document.status === 'VERIFIED';

  return (
    <View style={[styles.card, isUploaded && styles.cardUploaded]}>
      <View style={styles.topRow}>
        {/* Document Icon Badge */}
        <View style={[styles.iconBadge, isUploaded && styles.iconBadgeUploaded]}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
              stroke={isUploaded ? '#FFFFFF' : '#064F45'}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.titleLine}>
            <Text style={styles.titleText}>{document.label || document.title}</Text>
            <View
              style={[
                styles.badge,
                document.isRequired ? styles.badgeRequired : styles.badgeOptional,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  document.isRequired
                    ? styles.badgeTextRequired
                    : styles.badgeTextOptional,
                ]}
              >
                {document.isRequired ? 'Required' : 'Optional'}
              </Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{document.description}</Text>
        </View>
      </View>

      {/* Upload Status & Actions */}
      <View style={styles.bottomRow}>
        {isUploaded ? (
          <View style={styles.uploadedStatusBox}>
            <View style={styles.checkPill}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="m5 12 5 5L20 7"
                  stroke="#1B7A4E"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.fileNameText}>
                {document.fileName || 'Document uploaded'}
              </Text>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={() => onPressUpload(document)}
                hitSlop={8}
                style={styles.actionBtn}
              >
                <Text style={styles.replaceText}>Replace</Text>
              </Pressable>
              {onPressRemove && (
                <Pressable
                  onPress={() => onPressRemove(document)}
                  hitSlop={8}
                  style={styles.actionBtn}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.pendingStatusBox}>
            <Text style={styles.pendingText}>Not uploaded</Text>
            <Pressable
              onPress={() => onPressUpload(document)}
              style={({ pressed }) => [
                styles.uploadBtn,
                pressed && styles.uploadBtnPressed,
              ]}
            >
              <Text style={styles.uploadBtnText}>Upload</Text>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="#064F45"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBE8DE',
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardUploaded: {
    borderColor: '#CEE1DC',
    backgroundColor: '#FBFDFD',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E6F0EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeUploaded: {
    backgroundColor: '#064F45',
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#10201D',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeRequired: {
    backgroundColor: '#FFEBEE',
  },
  badgeOptional: {
    backgroundColor: '#F5F2EA',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  badgeTextRequired: {
    color: '#D9534F',
  },
  badgeTextOptional: {
    color: '#7C8581',
  },
  descriptionText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER,
    color: '#69716D',
    lineHeight: 17,
  },
  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0EDE4',
    paddingTop: 10,
  },
  pendingStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#7C8581',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0EE',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 4,
  },
  uploadBtnPressed: {
    backgroundColor: '#CEE1DC',
  },
  uploadBtnText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#064F45',
  },
  uploadedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  fileNameText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#10201D',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 4,
  },
  replaceText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#064F45',
  },
  removeText: {
    fontSize: 12.5,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#D9534F',
  },
});
