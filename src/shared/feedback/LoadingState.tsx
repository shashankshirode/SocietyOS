import { ActivityIndicator, Text, View } from "react-native";
import { Colors } from "../theme";
import { Radius } from "../theme/radius";
import { Skeleton } from "./Skeleton";
import { styles } from "./styles/LoadingState.styles";
export function LoadingState({ message = 'Loading...', showCardPlaceholder = false, compact = false, }: {
    message?: string;
    showCardPlaceholder?: boolean;
    compact?: boolean;
}) {
    return (<View style={[styles.container, compact && styles.compact]}>
      {showCardPlaceholder && !compact && (<Skeleton height={110} borderRadius={Radius.card} style={styles.skeleton}/>)}
      <View style={styles.contentRow}>
        <ActivityIndicator size="small" color={Colors.primary}/>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>);
}
export default LoadingState;

