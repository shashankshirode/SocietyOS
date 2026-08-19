import React from "react";
import { View } from "react-native";
import { styles } from "./styles/FormActions.styles";
export interface FormActionsProps {
    children: React.ReactNode;
    testID?: string;
}
export function FormActions({ children, testID }: FormActionsProps) {
    return (<View testID={testID} style={styles.container}>
      {children}
    </View>);
}
export default FormActions;

