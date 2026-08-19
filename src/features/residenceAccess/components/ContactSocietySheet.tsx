import Ionicons from "@expo/vector-icons/Ionicons";
import { Linking, ScrollView, View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { AppButton } from "../../../shared/components/AppButton";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { AppBottomSheet } from "../../../ui/bottomSheet/AppBottomSheet";
import { ModalHeader } from "../../../ui/modal/ModalHeader";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import type { ResidenceSummary } from "../models/residenceAccess.types";
import { styles } from "../styles/components/ContactSocietySheet.styles";
interface ContactSocietySheetProps {
    readonly visible: boolean;
    readonly residence: ResidenceSummary | null;
    readonly onDismiss: () => void;
}
export function ContactSocietySheet({ visible, residence, onDismiss }: ContactSocietySheetProps) {
    const { colors } = useAppTheme();
    if (!residence) {
        return null;
    }
    const email = residence.officeEmail;
    return (<AppBottomSheet visible={visible} onClose={onDismiss} onDismiss={onDismiss} header={(<ModalHeader title={residenceAccessMessages.common.contact} subtitle={`${residence.societyName} · ${residence.unitNumber}`} onClose={onDismiss}/>)}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color={colors.primary}/>
          <View style={styles.text}>
            <AppText variant="caption" tone="secondary">
              {residence.officePhoneMasked ?? residenceAccessMessages.common.notAvailable}
            </AppText>
            <AppText variant="bodySmall" weight="700">
              {residence.supportHours ?? residenceAccessMessages.common.notAvailable}
            </AppText>
          </View>
        </View>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color={colors.primary}/>
          <AppText variant="bodySmall" style={styles.text}>
            {email ?? residenceAccessMessages.common.notAvailable}
          </AppText>
        </View>
        <View style={styles.row}>
          <Ionicons name="arrow-up-circle-outline" size={22} color={colors.warning}/>
          <AppText variant="bodySmall" style={styles.text}>
            {residence.escalationChannel ?? residenceAccessMessages.common.notAvailable}
          </AppText>
        </View>
        {email ? (<AppButton title={residenceAccessMessages.common.contact} onPress={() => {
                void Linking.openURL(`mailto:${email}`);
            }} fullWidth/>) : null}
      </ScrollView>
    </AppBottomSheet>);
}

