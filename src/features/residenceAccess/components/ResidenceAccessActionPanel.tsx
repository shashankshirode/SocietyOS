import { View } from "react-native";
import type { ResidenceAccessAction } from "../models/residenceAccess.types";
import { ResidenceActionButton } from "./ResidenceActionButton";
import { styles } from "../styles/components/ResidenceAccessActionPanel.styles";
interface ResidenceAccessActionPanelProps {
    readonly primaryAction?: ResidenceAccessAction;
    readonly secondaryActions: readonly ResidenceAccessAction[];
    readonly onAction: (action: ResidenceAccessAction) => void;
    readonly loadingAction?: ResidenceAccessAction['type'];
}
export function ResidenceAccessActionPanel({ primaryAction, secondaryActions, onAction, loadingAction, }: ResidenceAccessActionPanelProps) {
    return (<View style={styles.container}>
      {primaryAction ? (<ResidenceActionButton action={primaryAction} onPress={onAction} primary loading={loadingAction === primaryAction.type}/>) : null}
      {secondaryActions.filter((action) => action.enabled).map((action) => (<ResidenceActionButton key={action.type} action={action} onPress={onAction} loading={loadingAction === action.type}/>))}
    </View>);
}

