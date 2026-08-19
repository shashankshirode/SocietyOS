import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from "expo-camera";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { styles, createViewBorderColorStyle } from "../styles/components/ResidenceQrScannerSheet.styles";
interface ResidenceQrScannerSheetProps {
    readonly visible: boolean;
    readonly onScanned: (societyIdentifier: string) => void;
    readonly onDismiss: () => void;
}
export function ResidenceQrScannerSheet({ visible, onScanned, onDismiss }: ResidenceQrScannerSheetProps) {
    const { colors } = useAppTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanLocked, setScanLocked] = useState(false);
    useEffect(() => {
        if (visible) {
            setScanLocked(false);
        }
    }, [visible]);
    const handleScan = (result: BarcodeScanningResult) => {
        if (scanLocked) {
            return;
        }
        const normalized = result.data.trim().replace(/^societyos:\/\/residence\//i, '');
        if (!normalized) {
            return;
        }
        setScanLocked(true);
        onScanned(normalized.slice(0, 80));
        onDismiss();
    };
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss} sheetStyle={styles.sheet} header={<ModalHeader title={residenceAccessMessages.link.scanTitle} subtitle={residenceAccessMessages.link.scanBody} onClose={onDismiss}/>}>
      <View style={styles.content}>
        {permission?.granted ? (visible ? (<View style={[styles.cameraFrame, createViewBorderColorStyle(colors.primary)]}>
              <CameraView style={StyleSheet.absoluteFill} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanLocked ? undefined : handleScan}/>
            </View>) : null) : (<View style={styles.permission}>
            <AppText variant="bodySmall" tone="secondary">{residenceAccessMessages.link.cameraPermission}</AppText>
            {permission?.canAskAgain !== false ? (<AppButton title={residenceAccessMessages.link.grantCamera} onPress={() => { void requestPermission(); }} fullWidth/>) : (<AppText variant="bodySmall" tone="danger">{residenceAccessMessages.link.scannerUnavailable}</AppText>)}
          </View>)}
      </View>
    </AppBottomSheet>);
}

