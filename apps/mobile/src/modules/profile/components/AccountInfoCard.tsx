import { View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppText } from "../../../shared/components/AppText";
import { DataRow } from "../../../shared/dataDisplay";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import { styles } from "../styles/components/AccountInfoCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export interface AccountInfoCardProps {
    societyName: string;
    flatNumber?: string;
    tower?: string;
    city?: string;
    phone?: string;
    email?: string;
    memberSince?: string;
    testID?: string;
}
export function AccountInfoCard({ societyName, flatNumber, tower, city, phone, email, memberSince, testID, }: AccountInfoCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<AppCard {...includeWhenPresent("testID", testID)} style={styles.card}>
      <AppText variant="cardTitle" tone="secondary" style={styles.title}>{localizedUiText.m_4e59b6c72f6f}</AppText>
      <View style={styles.list}>
        <DataRow label={localizedUiText.m_d5acfd8330f5} value={societyName} emptyContext="generic"/>
        <DataRow label={localizedUiText.m_92fccf78c843} {...includeWhenPresent("value", flatNumber)} emptyContext="notAssigned"/>
        <DataRow label={localizedUiText.m_2868c7155410} {...includeWhenPresent("value", tower)} emptyContext="notAssigned"/>
        <DataRow label={localizedUiText.m_fc33f73246f4} {...includeWhenPresent("value", city)} emptyContext="generic"/>
        <DataRow label={localizedUiText.m_63dceb8800b2} {...includeWhenPresent("value", phone)} emptyContext="notProvided" mask="mobile"/>
        <DataRow label={localizedUiText.m_969ccbd3cf63} {...includeWhenPresent("value", email)} emptyContext="notProvided" mask="email"/>
        <DataRow label={localizedUiText.m_f4d3b821c4cc} {...includeWhenPresent("value", memberSince)} emptyContext="generic" isLast/>
      </View>
    </AppCard>);
}
export default AccountInfoCard;

