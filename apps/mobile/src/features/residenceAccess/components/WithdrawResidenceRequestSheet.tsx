import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceAccessDetail } from "../models/residenceAccess.types";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/components/WithdrawResidenceRequestSheet.styles";
interface WithdrawResidenceRequestSheetProps {
    readonly visible: boolean;
    readonly detail: ResidenceAccessDetail | null;
    readonly loading: boolean;
    readonly onConfirm: () => Promise<boolean>;
    readonly onDismiss: () => void;
}
export function WithdrawResidenceRequestSheet({ visible, detail, loading, onConfirm, onDismiss, }: WithdrawResidenceRequestSheetProps) {
    if (!detail) {
        return null;
    }
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss} preventDismiss={loading} header={(<ModalHeader title={residenceAccessMessages.withdraw.title} subtitle={`${detail.residence.societyName} · ${detail.residence.unitNumber}`} {...includeWhenPresent("onClose", loading ? undefined : onDismiss)} showClose={!loading}/>)}>
      <View style={styles.content}>
        <AppText variant="body">
          {residenceAccessMessages.withdraw.body}
        </AppText>
        <AppButton title={residenceAccessMessages.withdraw.confirm} onPress={() => {
            void onConfirm();
        }} variant="danger" loading={loading} fullWidth/>
        <AppButton title={residenceAccessMessages.common.cancel} onPress={onDismiss} variant="outline" disabled={loading} fullWidth/>
      </View>
    </AppBottomSheet>);
}

