import { useState } from "react";
import { View, ScrollView } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../../shared/components/AppHeader";
import { AppButton } from "../../../shared/components/AppButton";
import { AppText } from "../../../shared/components/AppText";
import { AppCard } from "../../../shared/cards/AppCard";
import { FilePickerButton } from "../../../shared/files/FilePickerButton";
import { SelectedFileCard } from "../../../shared/files/SelectedFileCard";
import type { SelectedFile } from "../../../shared/files/filePicker.types";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createSafeAreaViewBackgroundColorStyle } from "../styles/screens/UnitImportPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function UnitImportPlaceholderScreen({ navigation }: {
    navigation: {
        navigate: (route: string, params?: JsonObject) => void;
        goBack: () => void;
    };
}) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const handleImportSubmit = () => {
        if (!selectedFile) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_76b7577f262c));
            return;
        }
        navigation.navigate('UnitImportPreview');
    };
    return (<SafeAreaView style={[styles.container, createSafeAreaViewBackgroundColorStyle(colors.background)]} edges={['top']}>
      <AppHeader title={localizedUiText.m_5aa90c875c01} showBack onBack={navigation.goBack}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        <AppCard style={styles.card}>
          <AppText variant="h3" style={styles.title}>{localizedUiText.m_16b0e13f779f}</AppText>
          <AppText variant="body" style={styles.desc}>{localizedUiText.m_c38de971dab9}</AppText>

          <FilePickerButton onFilePicked={setSelectedFile}/>

          {selectedFile && (<View style={styles.cardWrapper}>
              <SelectedFileCard file={selectedFile} onRemove={() => setSelectedFile(null)}/>
            </View>)}
        </AppCard>

        <AppButton title={localizedUiText.m_578486bac032} onPress={handleImportSubmit} disabled={!selectedFile} style={styles.submitBtn}/>
      </ScrollView>
    </SafeAreaView>);
}

