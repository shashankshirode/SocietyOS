import { useState, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentDocuments } from "../data/useDocuments";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { MyDocumentsScreenProps } from "../../../../app/navigation/navigation.types";
import type { DocumentStatus } from "../../../../shared/types/document.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/MyDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type FilterType = 'ALL' | 'VERIFIED' | 'PENDING' | 'REQUIRED';
export function MyDocumentsScreen({ navigation }: MyDocumentsScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const { data: documents = [] } = useResidentDocuments();
    const filteredDocs = useMemo(() => {
        return documents.filter((d) => {
            if (filter === 'VERIFIED')
                return d.status === 'VERIFIED';
            if (filter === 'PENDING')
                return d.status === 'PENDING_VERIFICATION';
            if (filter === 'REQUIRED')
                return d.status === 'REQUIRED';
            return true;
        });
    }, [documents, filter]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: String(localizedUiText.m_f57b0d1b6084) },
        { key: 'VERIFIED', label: String(localizedUiText.m_4f7838402f37) },
        { key: 'PENDING', label: String(localizedUiText.m_331551b0de41) },
        { key: 'REQUIRED', label: String(localizedUiText.m_9346491a4a85) },
    ];
    const getStatusTone = (status: DocumentStatus) => {
        if (status === 'VERIFIED')
            return 'success';
        if (status === 'PENDING_VERIFICATION')
            return 'warning';
        if (status === 'REQUIRED')
            return 'danger';
        return 'neutral';
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_ec5cb459e8c8}/>

      
      <View style={styles.filterBar}>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const isSelected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} style={[
                    styles.chip,
                    createPressableBackgroundColorBorderColorStyle(isSelected ? theme.accent : theme.surface, isSelected ? 'transparent' : theme.border),
                ]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(isSelected ? '#FFFFFF' : theme.textSecondary)}>
                  {chip.label}
                </SafeText>
              </Pressable>);
        })}
        </WrapRow>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {filteredDocs.map((doc) => {
            const isSensitive = doc.sensitivity !== 'PUBLIC';
            return (<PressableScale key={doc.id} onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}>
                <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  <View style={[styles.iconWrap, createViewBackgroundColorStyle2(theme.accentSoft)]}>
                    <Ionicons name="document-text-outline" size={20} color={theme.accent}/>
                  </View>
                  <View style={styles.info}>
                    <View style={styles.titleRow}>
                      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                        {doc.title}
                      </SafeText>
                      {isSensitive && (<Ionicons name="eye-off-outline" size={12} color={theme.textSecondary}/>)}
                    </View>
                    <SafeText variant="tiny" color="muted">
                      {doc.fileSize} • {doc.category}
                    </SafeText>
                  </View>
                  <View style={styles.right}>
                    <StatusPill label={doc.status === 'PENDING_VERIFICATION' ? localizedUiText.m_332011b91ccd : doc.status} tone={getStatusTone(doc.status)} small/>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                  </View>
                </View>
              </PressableScale>);
        })}
        </View>
      </ScrollView>
    </View>);
}
export default MyDocumentsScreen;

