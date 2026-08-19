import { AppAlert } from "../../ui/modal/AppAlert";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIcon } from "../icons/AppIcon";
import { pickDocument } from "../../core/files/documentPickerService";
import type { SelectedFile } from "./filePicker.types";
import * as ImagePicker from "expo-image-picker";
import { getRequiredItem } from "../utils/requiredItem";
import { styles, createPressableBackgroundColorBorderColorStyle, createTextColorStyle } from "./styles/FilePickerButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../localization/activeUiLiteral";
interface FilePickerButtonProps {
    onFilePicked: (file: SelectedFile) => void;
    label?: string;
    allowedSource?: 'both' | 'file' | 'camera';
}
export function FilePickerButton({ onFilePicked, label = getActiveUiLiteral("m_2aa491e69954"), allowedSource = 'both', }: FilePickerButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [loading, setLoading] = useState(false);
    async function handleFilePick() {
        setLoading(true);
        try {
            const file = await pickDocument();
            onFilePicked(file);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : getActiveUiLiteral("m_c044cfe281d4");
            if (!message.includes('cancelled')) {
                AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    async function handleCameraCapture() {
        setLoading(true);
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                AppAlert.alert(String(localizedUiText.m_866a0a58fd9a), String(localizedUiText.m_e92211cbb3fe));
                return;
            }
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.8,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = getRequiredItem(result.assets, 0, "FilePickerButton.tsx");
                const uriParts = asset.uri.split('/');
                const name = getRequiredItem(uriParts, uriParts.length - 1, "FilePickerButton.tsx") || 'camera_image.jpg';
                const file: SelectedFile = {
                    uri: asset.uri,
                    name,
                    mimeType: 'image/jpeg',
                    size: asset.fileSize || 2 * 1024 * 1024,
                };
                onFilePicked(file);
            }
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_0a4f0a96de0f));
        }
        finally {
            setLoading(false);
        }
    }
    function handleButtonPress() {
        if (allowedSource === 'file') {
            handleFilePick();
        }
        else if (allowedSource === 'camera') {
            handleCameraCapture();
        }
        else {
            AppAlert.alert(String(localizedUiText.m_4b2724c4c93e), String(localizedUiText.m_e344d39cb23b), [
                { text: String(localizedUiText.m_4a81e6464352), onPress: handleFilePick },
                { text: String(localizedUiText.m_03494b0d1f80), onPress: handleCameraCapture },
                { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            ]);
        }
    }
    return (<Pressable style={[
            styles.button,
            createPressableBackgroundColorBorderColorStyle(colors.surfaceMuted, colors.border),
        ]} onPress={handleButtonPress} disabled={loading} accessibilityRole="button" accessibilityLabel={label}>
      <AppIcon name="document" size={20} color={colors.primary}/>
      <Text style={[styles.text, createTextColorStyle(colors.textSecondary)]}>
        {loading ? localizedUiText.m_b19bb6f44869 : label}
      </Text>
    </Pressable>);
}

