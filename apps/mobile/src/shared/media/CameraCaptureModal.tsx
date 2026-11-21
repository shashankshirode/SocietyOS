import { AppAlert } from "../../ui/modal/AppAlert";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/useAppTheme";
import { Spacing } from "../theme/spacing";
import { AppIcon } from "../icons/AppIcon";
import { MediaActionButton } from "./MediaActionButton";
import { CapturedImagePreview } from "./CapturedImagePreview";
import { resolvePermissionDeniedError } from "../../core/device/deviceCapabilityError";
import { AppModal } from "../../ui/modal";
import { useMessages } from "../../messages";
import { styles, createTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorPaddingTopStyle, createTextColorStyle2, createTouchableOpacityBackgroundColorStyle, createTextColorStyle3, createViewPaddingTopStyle, createViewPaddingBottomStyle } from "./styles/CameraCaptureModal.styles";
interface CameraCaptureModalProps {
    visible: boolean;
    onCapture: (uri: string) => void;
    onClose: () => void;
}
export function CameraCaptureModal({ visible, onCapture, onClose }: CameraCaptureModalProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const messages = useMessages();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'back' | 'front'>('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    if (!visible)
        return null;
    if (!permission) {
        return (<AppModal visible={visible} onClose={onClose} fullScreen showDragHandle={false}>
        <View style={[styles.centered, createViewBackgroundColorStyle(colors.background)]}>
          <Text style={createTextColorStyle(colors.textSecondary)}>{messages.common.camera.checkingPermission}</Text>
        </View>
      </AppModal>);
    }
    if (!permission.granted) {
        return (<AppModal visible={visible} onClose={onClose} fullScreen showDragHandle={false}>
        <View style={[styles.permissionContainer, createViewBackgroundColorPaddingTopStyle(colors.background, insets.top)]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <AppIcon name="close" size={24} color={colors.textPrimary}/>
            </TouchableOpacity>
          </View>
          <View style={styles.permissionContent}>
            <AppIcon name="lock" size={64} color={colors.danger}/>
            <Text style={[styles.permissionText, createTextColorStyle2(colors.textPrimary)]}>
              {resolvePermissionDeniedError('camera')}
            </Text>
            <TouchableOpacity style={[styles.grantBtn, createTouchableOpacityBackgroundColorStyle(colors.primary)]} onPress={requestPermission}>
              <Text style={[styles.grantBtnText, createTextColorStyle3(colors.textInverse)]}>
                {messages.common.camera.grantPermission}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppModal>);
    }
    async function handleCapture() {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    skipProcessing: false,
                });
                if (photo?.uri) {
                    setPhotoUri(photo.uri);
                }
            }
            catch {
                AppAlert.alert(messages.common.camera.captureFailedTitle, messages.common.camera.captureFailedMessage);
            }
        }
    }
    function handleUsePhoto() {
        if (photoUri) {
            onCapture(photoUri);
            setPhotoUri(null);
            onClose();
        }
    }
    return (<AppModal visible={visible} onClose={onClose} fullScreen showDragHandle={false}>
      {photoUri ? (<CapturedImagePreview uri={photoUri} onRetake={() => setPhotoUri(null)} onUsePhoto={handleUsePhoto}/>) : (<View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} facing={facing} style={StyleSheet.absoluteFill}/>

          
          <View style={[styles.topActions, createViewPaddingTopStyle(insets.top + Spacing.md)]}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <AppIcon name="close" size={20} color="#fff"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}>
              <AppIcon name="settings" size={20} color="#fff"/>
            </TouchableOpacity>
          </View>

          
          <View style={[styles.bottomActions, createViewPaddingBottomStyle(insets.bottom + Spacing.lg)]}>
            <MediaActionButton onPress={handleCapture}/>
          </View>
        </View>)}
    </AppModal>);
}

