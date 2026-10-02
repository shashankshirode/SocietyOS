import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { OnboardingDocument } from '../data/residentOnboarding.types';
import { PrimaryCTA } from './PrimaryCTA';
import { SecondaryCTA } from './SecondaryCTA';
import { FONT_FAMILY_INTER, FONT_FAMILY_INTER_MEDIUM, FONT_FAMILY_INTER_BOLD, FONT_FAMILY_SERIF, } from '../../../../shared/theme/typography';
interface DocumentUploaderProps {
    document: OnboardingDocument | null;
    visible: boolean;
    onClose: () => void;
    onConfirmUpload: (file: {
        fileName: string;
        fileSize: number;
        fileUri: string;
        mimeType?: string;
    }) => void;
}
export function DocumentUploader({ document, visible, onClose, onConfirmUpload, }: DocumentUploaderProps) {
    const [stagedFile, setStagedFile] = useState<{
        fileName: string;
        fileSize: number;
        fileUri: string;
        mimeType?: string;
    } | null>(null);
    if (!document)
        return null;
    const handlePickSample = (type: 'camera' | 'device') => {
        const ext = type === 'camera' ? 'jpg' : 'pdf';
        const prefix = (document.type || 'doc').replace('_', '-');
        setStagedFile({
            fileName: `${prefix}_scanned.${ext}`,
            fileSize: 1024 * 1024 * 1.4,
            fileUri: `file:///storage/docs/${prefix}.${ext}`,
            mimeType: type === 'camera' ? 'image/jpeg' : 'application/pdf',
        });
    };
    const handleConfirm = () => {
        if (stagedFile) {
            onConfirmUpload(stagedFile);
            setStagedFile(null);
            onClose();
        }
    };
    const handleCancel = () => {
        setStagedFile(null);
        onClose();
    };
    return (<Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          
          <View style={styles.headerRow}>
            <View style={styles.titleCol}>
              <Text style={styles.titleText}>Upload {document.label}</Text>
              <Text style={styles.formatsText}>
                Accepted: {document.acceptedFormats.join(', ')} • Max {document.maxSizeMB}MB
              </Text>
            </View>
            <Pressable onPress={handleCancel} hitSlop={8} style={styles.closeBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6l12 12" stroke="#69716D" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            </Pressable>
          </View>

          
          {stagedFile ? (<View style={styles.previewBox}>
              <View style={styles.previewIconBox}>
                <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </View>
              <View style={styles.previewMeta}>
                <Text style={styles.previewFileName}>{stagedFile.fileName}</Text>
                <Text style={styles.previewFileSize}>
                  {(stagedFile.fileSize / (1024 * 1024)).toFixed(1)} MB • Ready for verification
                </Text>
              </View>
              <Pressable onPress={() => setStagedFile(null)} style={styles.changeBtn}>
                <Text style={styles.changeBtnText}>Change</Text>
              </Pressable>
            </View>) : (<View style={styles.optionsGrid}>
              <Pressable onPress={() => handlePickSample('camera')} style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
            ]}>
                <View style={styles.optionIconBox}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    <Path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </View>
                <Text style={styles.optionTitle}>Take a photo</Text>
                <Text style={styles.optionSubtitle}>Use device camera</Text>
              </Pressable>

              <Pressable onPress={() => handlePickSample('device')} style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
            ]}>
                <View style={styles.optionIconBox}>
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" stroke="#064F45" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                </View>
                <Text style={styles.optionTitle}>Choose from device</Text>
                <Text style={styles.optionSubtitle}>Browse files or gallery</Text>
              </Pressable>
            </View>)}

          
          <View style={styles.actionsBox}>
            {stagedFile ? (<PrimaryCTA label="Confirm & Upload" onPress={handleConfirm} showArrow={false}/>) : null}
            <SecondaryCTA label="Cancel" onPress={handleCancel}/>
          </View>
        </View>
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(4, 25, 21, 0.55)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: '#FAF8F1',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 34,
        gap: 18,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    titleCol: {
        flex: 1,
        gap: 4,
    },
    titleText: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_SERIF,
        fontWeight: '600',
        color: '#10201D',
    },
    formatsText: {
        fontSize: 12.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#69716D',
    },
    closeBtn: {
        padding: 6,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    optionCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EBE8DE',
        padding: 16,
        alignItems: 'center',
        gap: 6,
    },
    optionCardPressed: {
        backgroundColor: '#F5F2EA',
    },
    optionIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E6F0EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 13.5,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
        textAlign: 'center',
    },
    optionSubtitle: {
        fontSize: 11.5,
        fontFamily: FONT_FAMILY_INTER,
        color: '#7C8581',
        textAlign: 'center',
    },
    previewBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#064F45',
        padding: 16,
        gap: 12,
    },
    previewIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E6F0EE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewMeta: {
        flex: 1,
        gap: 3,
    },
    previewFileName: {
        fontSize: 14,
        fontFamily: FONT_FAMILY_INTER_BOLD,
        color: '#10201D',
    },
    previewFileSize: {
        fontSize: 12,
        fontFamily: FONT_FAMILY_INTER,
        color: '#1B7A4E',
    },
    changeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    changeBtnText: {
        fontSize: 13,
        fontFamily: FONT_FAMILY_INTER_MEDIUM,
        color: '#064F45',
    },
    actionsBox: {
        gap: 8,
        marginTop: 6,
    },
});

