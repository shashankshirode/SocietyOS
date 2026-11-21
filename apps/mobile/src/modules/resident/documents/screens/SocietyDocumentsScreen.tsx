import { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { SafeText } from "../../../../shared/components/SafeText";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2 } from "../styles/screens/SocietyDocumentsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
type DocType = 'BYLAWS' | 'MINUTES' | 'CIRCULARS';
export function SocietyDocumentsScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const [filter, setFilter] = useState<DocType>('BYLAWS');
    const societyDocs = [
        {
            id: 's-1',
            title: String(localizedUiText.m_1fcec2ea7a3a),
            category: 'BYLAWS',
            fileSize: '2.4 MB',
            date: '2026-01-10',
        },
        {
            id: 's-2',
            title: String(localizedUiText.m_fcc22a05bf72),
            category: 'MINUTES',
            fileSize: '1.1 MB',
            date: '2026-06-15',
        },
        {
            id: 's-3',
            title: String(localizedUiText.m_940b9fbba09f),
            category: 'CIRCULARS',
            fileSize: '450 KB',
            date: '2026-07-11',
        },
    ];
    const filteredDocs = societyDocs.filter((document) => document.category === filter);
    const chips: {
        key: DocType;
        label: string;
    }[] = [
        { key: 'BYLAWS', label: String(localizedUiText.m_5a2b7ad54368) },
        { key: 'MINUTES', label: String(localizedUiText.m_337ab4f8f908) },
        { key: 'CIRCULARS', label: String(localizedUiText.m_e3ff9c03488d) },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
      <ResidentPageHeader title={localizedUiText.m_bfc1e4226e5d}/>

      
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
          {filteredDocs.map((doc) => (<PressableScale key={doc.id} onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}>
              <View style={[styles.row, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                <View style={[styles.iconWrap, createViewBackgroundColorStyle2(theme.accentSoft)]}>
                  <Ionicons name="business-outline" size={20} color={theme.accent}/>
                </View>
                <View style={styles.info}>
                  <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={1}>
                    {doc.title}
                  </SafeText>
                  <SafeText variant="tiny" color="muted">
                    {doc.fileSize}{" " + localizedUiText.m_fede1ff1b281 + " "}{formatResidentDate(doc.date)}
                  </SafeText>
                </View>
                <Ionicons name="download-outline" size={16} color={theme.textSecondary}/>
              </View>
            </PressableScale>))}
        </View>
      </ScrollView>
    </View>);
}
export default SocietyDocumentsScreen;

