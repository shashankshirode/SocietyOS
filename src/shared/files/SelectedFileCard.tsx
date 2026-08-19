import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { AppIcon } from "../icons/AppIcon";
import { formatFileSize } from "./fileSizeFormatter";
import { FILE_TYPE_LABELS, type SelectedFile } from "./filePicker.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createTextColorStyle, createTextColorStyle2 } from "./styles/SelectedFileCard.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
interface SelectedFileCardProps {
    file: SelectedFile;
    onRemove: () => void;
}
export function SelectedFileCard({ file, onRemove }: SelectedFileCardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const fileTypeLabel = FILE_TYPE_LABELS[file.mimeType] || 'File';
    const isImage = file.mimeType.startsWith('image/');
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.card, colors.border)]}>
      <View style={[styles.iconCircle, createViewBackgroundColorStyle(colors.surfaceSoft)]}>
        <AppIcon name={isImage ? 'document' : 'document'} size={20} color={colors.primary}/>
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, createTextColorStyle(colors.textPrimary)]} numberOfLines={1} ellipsizeMode="middle">
          {file.name}
        </Text>
        <Text style={[styles.subtitle, createTextColorStyle2(colors.textMuted)]}>
          {fileTypeLabel} • {formatFileSize(file.size)}
        </Text>
      </View>
      <Pressable onPress={onRemove} style={styles.removeBtn} hitSlop={8} accessibilityLabel={formatUiLiteral(localizedUiText.m_394921aabf17, [file.name])}>
        <AppIcon name="close" size={16} color={colors.danger}/>
      </Pressable>
    </View>);
}

