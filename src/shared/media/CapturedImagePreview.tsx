import { Image, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { styles } from "./styles/CapturedImagePreview.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface CapturedImagePreviewProps {
    uri: string;
    onRetake: () => void;
    onUsePhoto: () => void;
}
export function CapturedImagePreview({ uri, onRetake, onUsePhoto }: CapturedImagePreviewProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Image source={{ uri }} style={styles.preview} resizeMode="contain"/>
      <View style={styles.actions}>
        <AppButton title={localizedUiText.m_1c62f54c28ff} variant="secondary" size="sm" onPress={onRetake} style={styles.btn}/>
        <AppButton title={localizedUiText.m_6c042d2a4263} variant="primary" size="sm" onPress={onUsePhoto} style={styles.btn}/>
      </View>
    </View>);
}

