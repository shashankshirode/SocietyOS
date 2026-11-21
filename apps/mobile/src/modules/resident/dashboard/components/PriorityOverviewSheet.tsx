import { Pressable, View, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppBottomSheet } from "../../../../ui/bottomSheet";
import { ResidentPriorityCard } from "../../../../ui/patterns/ResidentPriorityCard";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import type { ResidentPriorityItem } from "../data/dashboard.types";
import { styles, createPressableBackgroundColorStyle } from "../styles/components/PriorityOverviewSheet.styles";
type PriorityOverviewSheetProps = {
    visible: boolean;
    title: string;
    closeLabel: string;
    items: ResidentPriorityItem[];
    onClose: () => void;
    onActionPress: (id: string) => void;
};
export function PriorityOverviewSheet({ visible, title, closeLabel, items, onClose, onActionPress, }: PriorityOverviewSheetProps) {
    const { colors } = useAppTheme();
    return (<AppBottomSheet visible={visible} onClose={onClose} testID="priority-overview-sheet" header={(<View style={styles.header}>
          <SafeText variant="title" color="primary" style={styles.headerTitle}>{title}</SafeText>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel} style={[styles.closeButton, createPressableBackgroundColorStyle(colors.surfaceMuted)]}>
            <Ionicons name="close" size={20} color={colors.textPrimary}/>
          </Pressable>
        </View>)}>
      <FlatList data={items} keyExtractor={(item: ResidentPriorityItem) => item.id} renderItem={({ item, index }) => (<ResidentPriorityCard item={item} rank={index + 1} onActionPress={(id) => {
                onClose();
                onActionPress(id);
            }}/>)} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}/>
    </AppBottomSheet>);
}

