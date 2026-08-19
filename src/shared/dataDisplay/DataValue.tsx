import { useAppTheme } from "../theme/useAppTheme";
import { EmptyValue } from "./EmptyValue";
import { isValueMissing, type EmptyValueContext } from "./dataDisplay.utils";
import { SafeText } from "../components/SafeText";
import { includeWhenPresent } from "../utils/presentProperty";
import type { Absent } from "../types/absence.types";
import { styles, createSafeTextColorStyle } from "./styles/DataValue.styles";
interface DataValueProps {
    value: string | number | null | Absent;
    emptyContext?: EmptyValueContext;
    emptyLabel?: string;
    bold?: boolean;
    color?: string;
}
export function DataValue({ value, emptyContext = 'generic', emptyLabel, bold = false, color }: DataValueProps) {
    const { colors } = useAppTheme();
    if (isValueMissing(value)) {
        return <EmptyValue context={emptyContext} {...includeWhenPresent("label", emptyLabel)}/>;
    }
    return (<SafeText variant="body" style={[
            styles.value,
            createSafeTextColorStyle(color || colors.textPrimary),
            bold && styles.bold,
        ]} numberOfLines={3}>
      {String(value)}
    </SafeText>);
}

