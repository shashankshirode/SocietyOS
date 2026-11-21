import { View } from "react-native";
import { FilePickerButton } from "./FilePickerButton";
import { SelectedFileCard } from "./SelectedFileCard";
import type { SelectedFile } from "./filePicker.types";
import { styles } from "./styles/FileAttachmentList.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../localization/activeUiLiteral";
interface FileAttachmentListProps {
    files: SelectedFile[];
    onFilesChange: (files: SelectedFile[]) => void;
    maxFiles?: number;
    label?: string;
    allowedSource?: 'both' | 'file' | 'camera';
}
export function FileAttachmentList({ files, onFilesChange, maxFiles = 5, label = getActiveUiLiteral("m_d229d6998e59"), allowedSource = 'both', }: FileAttachmentListProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    function handleFilePicked(pickedFile: SelectedFile) {
        if (files.length >= maxFiles)
            return;
        onFilesChange([...files, pickedFile]);
    }
    function handleRemoveFile(index: number) {
        onFilesChange(files.filter((_, i) => i !== index));
    }
    return (<View style={styles.container}>
      {files.map((file, idx) => (<SelectedFileCard key={`${file.uri}-${idx}`} file={file} onRemove={() => handleRemoveFile(idx)}/>))}
      {files.length < maxFiles && (<FilePickerButton onFilePicked={handleFilePicked} label={label} allowedSource={allowedSource}/>)}
    </View>);
}

