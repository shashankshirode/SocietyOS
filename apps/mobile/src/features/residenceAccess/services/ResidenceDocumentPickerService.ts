import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { repositoryErrorMessages } from '../../../messages/en/residenceAccess.messages';
import type { ResidenceAccessRepositoryErrorCode, ResidenceAccessResult, ResidenceDocumentMimeType, ResidenceDocumentSelection, } from '../models/residenceAccess.types';
import type { Absent } from "../../../shared/types/absence.types";
function failure<T>(code: ResidenceAccessRepositoryErrorCode): ResidenceAccessResult<T> {
    return {
        ok: false,
        error: {
            code,
            message: repositoryErrorMessages[code],
            retryable: code === 'CAMERA_UNAVAILABLE',
        },
    };
}
function resolveMimeType(value: string | Absent, fileName: string): ResidenceDocumentMimeType | null {
    if (value === 'image/jpeg' || value === 'image/jpg') {
        return 'image/jpeg';
    }
    if (value === 'image/png') {
        return 'image/png';
    }
    if (value === 'image/heic' || value === 'image/heif') {
        return 'image/heic';
    }
    if (value === 'application/pdf') {
        return 'application/pdf';
    }
    const lowerName = fileName.toLocaleLowerCase();
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
        return 'image/jpeg';
    }
    if (lowerName.endsWith('.png')) {
        return 'image/png';
    }
    if (lowerName.endsWith('.heic') || lowerName.endsWith('.heif')) {
        return 'image/heic';
    }
    if (lowerName.endsWith('.pdf')) {
        return 'application/pdf';
    }
    return null;
}
function imageAssetSelection(asset: ImagePicker.ImagePickerAsset, side: ResidenceDocumentSelection['side']): ResidenceAccessResult<ResidenceDocumentSelection> {
    const fallbackName = `residence-document-${Date.now()}.jpg`;
    const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? fallbackName;
    const mimeType = resolveMimeType(asset.mimeType, fileName);
    if (!mimeType) {
        return failure('UNSUPPORTED_FORMAT');
    }
    return {
        ok: true,
        data: {
            uri: asset.uri,
            fileName,
            mimeType,
            fileSizeBytes: asset.fileSize ?? 0,
            side,
        },
    };
}
export async function pickResidenceDocumentFile(acceptedFileTypes: readonly ResidenceDocumentMimeType[], side: ResidenceDocumentSelection['side']): Promise<ResidenceAccessResult<ResidenceDocumentSelection | null>> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: [...acceptedFileTypes],
            multiple: false,
            copyToCacheDirectory: true,
        });
        if (result.canceled) {
            return { ok: true, data: null };
        }
        const asset = result.assets[0];
        if (!asset) {
            return failure('CORRUPTED_FILE');
        }
        const mimeType = resolveMimeType(asset.mimeType, asset.name);
        if (!mimeType || !acceptedFileTypes.includes(mimeType)) {
            return failure('UNSUPPORTED_FORMAT');
        }
        return {
            ok: true,
            data: {
                uri: asset.uri,
                fileName: asset.name,
                mimeType,
                fileSizeBytes: asset.size ?? 0,
                side,
            },
        };
    }
    catch {
        return failure('CORRUPTED_FILE');
    }
}
export async function pickResidenceDocumentImage(side: ResidenceDocumentSelection['side']): Promise<ResidenceAccessResult<ResidenceDocumentSelection | null>> {
    try {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            return failure('PERMISSION_DENIED');
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.82,
            selectionLimit: 1,
        });
        if (result.canceled) {
            return { ok: true, data: null };
        }
        const asset = result.assets[0];
        return asset ? imageAssetSelection(asset, side) : failure('CORRUPTED_FILE');
    }
    catch {
        return failure('CORRUPTED_FILE');
    }
}
export async function captureResidenceDocumentImage(side: ResidenceDocumentSelection['side']): Promise<ResidenceAccessResult<ResidenceDocumentSelection | null>> {
    try {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return failure('PERMISSION_DENIED');
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.82,
            cameraType: ImagePicker.CameraType.back,
        });
        if (result.canceled) {
            return { ok: true, data: null };
        }
        const asset = result.assets[0];
        return asset ? imageAssetSelection(asset, side) : failure('CAMERA_UNAVAILABLE');
    }
    catch {
        return failure('CAMERA_UNAVAILABLE');
    }
}

