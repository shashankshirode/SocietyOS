import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, ScrollView, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { FormField } from "../../../shared/forms/FormField";
import { formatFileSize } from "../../../shared/files/fileSizeFormatter";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { getPlatformKeyboardConfig } from "../../../shared/platform/platformKeyboard";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { residenceAccessMessages, residenceDocumentSideLabels } from "../../../messages/en/residenceAccess.messages";
import { captureResidenceDocumentImage, pickResidenceDocumentFile, pickResidenceDocumentImage } from "../services/ResidenceDocumentPickerService";
import type { ResidenceAccessRepositoryError, ResidenceDocumentRequirement, ResidenceDocumentSelection } from "../models/residenceAccess.types";
import { DocumentUploadTile } from "./DocumentUploadTile";
import { ResidenceAccessErrorBanner } from "./ResidenceAccessErrorBanner";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewWidthBackgroundColorStyle } from "../styles/components/ResidenceDocumentPickerSheet.styles";
interface ResidenceDocumentPickerSheetProps {
    readonly visible: boolean;
    readonly requirement: ResidenceDocumentRequirement | null;
    readonly uploading: boolean;
    readonly uploadProgress: number;
    readonly onUpload: (requirementId: string, selection: ResidenceDocumentSelection, expiryDate?: string) => Promise<boolean>;
    readonly onCancelUpload: () => void;
    readonly onDismiss: () => void;
}
export function ResidenceDocumentPickerSheet({ visible, requirement, uploading, uploadProgress, onUpload, onCancelUpload, onDismiss, }: ResidenceDocumentPickerSheetProps) {
    const { colors } = useAppTheme();
    const keyboard = getPlatformKeyboardConfig();
    const [selection, setSelection] = useState<ResidenceDocumentSelection | null>(null);
    const [side, setSide] = useState<ResidenceDocumentSelection['side']>('SINGLE');
    const [expiryDate, setExpiryDate] = useState('');
    const [pickerError, setPickerError] = useState<ResidenceAccessRepositoryError | null>(null);
    useEffect(() => {
        if (requirement?.frontAndBackRequired) {
            setSide('FRONT');
        }
        else {
            setSide('SINGLE');
        }
    }, [requirement]);
    const dismiss = () => {
        setSelection(null);
        setExpiryDate('');
        setPickerError(null);
        onDismiss();
    };
    const handlePickerResult = (result: Awaited<ReturnType<typeof pickResidenceDocumentFile>>) => {
        if (result.ok) {
            if (result.data) {
                setSelection(result.data);
            }
            setPickerError(null);
        }
        else {
            setPickerError(result.error);
        }
    };
    if (!requirement) {
        return null;
    }
    const submit = async () => {
        if (!selection) {
            return;
        }
        const uploaded = await onUpload(requirement.requirementId, selection, expiryDate.trim() || undefined);
        if (uploaded) {
            dismiss();
        }
    };
    return (<AppBottomSheet visible={visible} onClose={dismiss} onDismiss={dismiss} preventDismiss={uploading} header={(<ModalHeader title={selection ? residenceAccessMessages.requirements.previewTitle : residenceAccessMessages.requirements.sourceTitle} subtitle={requirement.title} {...includeWhenPresent("onClose", uploading ? undefined : dismiss)} showClose={!uploading}/>)}>
      <KeyboardAvoidingView {...includeWhenPresent("behavior", keyboard.behavior)} keyboardVerticalOffset={keyboard.keyboardVerticalOffset}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {pickerError ? (<ResidenceAccessErrorBanner error={pickerError} onDismiss={() => setPickerError(null)}/>) : null}
          {requirement.frontAndBackRequired ? (<View style={styles.sideRow}>
              {(['FRONT', 'BACK'] as const).map((value) => (<AppButton key={value} title={value === 'FRONT'
                    ? residenceAccessMessages.requirements.frontSide
                    : residenceAccessMessages.requirements.backSide} onPress={() => {
                    setSide(value);
                    setSelection(null);
                }} variant={side === value ? 'secondary' : 'outline'} size="sm"/>))}
            </View>) : null}
          {selection ? (<>
              {selection.mimeType.startsWith('image/') ? (<Image source={{ uri: selection.uri }} style={styles.previewImage} resizeMode="contain"/>) : (<View style={[styles.pdfPreview, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
                  <Ionicons name="document-text-outline" size={48} color={colors.primary}/>
                </View>)}
              <View style={[styles.metadata, createViewBackgroundColorStyle2(colors.surfaceMuted)]}>
                <AppText variant="caption" tone="secondary">
                  {residenceAccessMessages.requirements.fileName}
                </AppText>
                <AppText variant="bodySmall" weight="700">
                  {selection.fileName}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {`${residenceAccessMessages.requirements.fileSize}: ${formatFileSize(selection.fileSizeBytes)}`}
                </AppText>
                <AppText variant="caption" tone="secondary">
                  {`${residenceAccessMessages.requirements.documentSide}: ${residenceDocumentSideLabels[selection.side]}`}
                </AppText>
              </View>
              <AppText variant="caption" tone="secondary">
                {residenceAccessMessages.requirements.lowQualityGuidance}
              </AppText>
              {requirement.expiryDateRequired ? (<FormField label={residenceAccessMessages.requirements.expiryDate} value={expiryDate} onChangeText={setExpiryDate} placeholder={residenceAccessMessages.requirements.expiryDatePlaceholder}/>) : null}
              {uploading ? (<View accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: uploadProgress }} accessibilityLabel={residenceAccessMessages.accessibility.uploadProgress(uploadProgress)} style={styles.progress}>
                  <View style={[styles.progressTrack, createViewBackgroundColorStyle3(colors.surfaceMuted)]}>
                    <View style={[styles.progressFill, createViewWidthBackgroundColorStyle(`${uploadProgress}%`, colors.primary)]}/>
                  </View>
                  <AppText variant="caption" tone="secondary">
                    {`${uploadProgress}%`}
                  </AppText>
                </View>) : null}
              <AppButton title={residenceAccessMessages.requirements.submitUpload} onPress={submit} loading={uploading} disabled={requirement.expiryDateRequired && !expiryDate.trim()} fullWidth/>
              {uploading ? (<AppButton title={residenceAccessMessages.requirements.cancelUpload} onPress={onCancelUpload} variant="outline" fullWidth/>) : null}
              <AppButton title={residenceAccessMessages.requirements.replace} onPress={() => setSelection(null)} variant="outline" disabled={uploading} fullWidth/>
            </>) : (<>
              <AppText variant="body" tone="secondary">
                {residenceAccessMessages.requirements.sourceSubtitle}
              </AppText>
              <DocumentUploadTile icon="camera-outline" title={residenceAccessMessages.requirements.camera} subtitle={residenceAccessMessages.requirements.lowQualityGuidance} onPress={() => {
                void captureResidenceDocumentImage(side).then(handlePickerResult);
            }}/>
              <DocumentUploadTile icon="images-outline" title={residenceAccessMessages.requirements.library} onPress={() => {
                void pickResidenceDocumentImage(side).then(handlePickerResult);
            }}/>
              <DocumentUploadTile icon="document-attach-outline" title={residenceAccessMessages.requirements.file} onPress={() => {
                void pickResidenceDocumentFile(requirement.acceptedFileTypes, side).then(handlePickerResult);
            }}/>
              <AppText variant="caption" tone="secondary">
                {residenceAccessMessages.requirements.permissionsGuidance}
              </AppText>
            </>)}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBottomSheet>);
}

