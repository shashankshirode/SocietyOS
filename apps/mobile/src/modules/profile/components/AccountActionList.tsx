import { View } from "react-native";
import { AppCard } from "../../../shared/cards/AppCard";
import { AppDivider } from "../../../shared/components/AppDivider";
import { ProfileMenuItem } from "../../../shared/cards/ProfileMenuItem";
import { AppIconName } from "../../../shared/icons/icon.types";
import { styles } from "../styles/components/AccountActionList.styles";
type AccountAction = {
    label: string;
    description?: string;
    iconName: AppIconName;
    onPress: () => void;
    tone?: 'default' | 'danger';
};
type AccountActionListProps = {
    actions: AccountAction[];
};
export function AccountActionList({ actions }: AccountActionListProps) {
    return (<AppCard style={styles.card}>
      {actions.map((action, index) => (<View key={action.label}>
          <ProfileMenuItem {...action}/>
          {index < actions.length - 1 ? <AppDivider /> : null}
        </View>))}
    </AppCard>);
}
export default AccountActionList;

