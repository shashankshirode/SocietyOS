import { ScrollView, Share, Text, View, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors } from "../../../../shared/constants/colors";
import { Messages } from "../../../../shared/constants/messages";
import { AppCard } from "../../../../shared/cards/AppCard";
import { AppButton } from "../../../../shared/components/AppButton";
import { AppHeader } from "../../../../shared/components/AppHeader";
import { InfoRow } from "../../../../shared/components/InfoRow";
import { WarningBanner } from "../../../../shared/feedback/WarningBanner";
import { StatusBadge, getDocumentStatusBadgeType } from "../../../../shared/components/StatusBadge";
import { getDocumentCategoryLabel, getDocumentSensitivityLabel } from "../../../../shared/utils/formatters";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { LoadingState } from "../../../../shared/feedback/LoadingState";
import { AccessRestrictedState } from "../../../../shared/feedback/AccessRestrictedState";
import { usePermission } from "../../../../core/permissions/usePermission";
import { canDownloadDocument, canViewAccessLogs, canViewDocument } from "../../../../core/permissions/documentAccessRules";
import { useDocumentDetail } from "../data/useDocumentDetail";
import { useRecordDocumentAccess } from "../data/useRecordDocumentAccess";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { AppAlert } from "../../../../ui/modal/AppAlert";
import type { DocumentDetailScreenProps } from "../../../../app/navigation/navigation.types";
import { styles } from "../styles/screens/DocumentDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
export function DocumentDetailScreen({ navigation, route }: DocumentDetailScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { documentId } = route.params;
    const { data: doc, isLoading, error, refetch } = useDocumentDetail(documentId);
    const { user } = usePermission();
    const { activeContext } = useActiveResidentHome();
    const { submit: recordAccess, isSubmitting: isRecordingAccess } = useRecordDocumentAccess();
    if (isLoading) {
        return (<SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title={localizedUiText.m_791d38f503ad} showBack onBack={() => navigation.goBack()}/>
        <LoadingState message={localizedUiText.m_fc76e6534e47} showCardPlaceholder/>
      </SafeAreaView>);
    }
    if (error) {
        return (<SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title={localizedUiText.m_791d38f503ad} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={error.message} onRetry={refetch}/>
      </SafeAreaView>);
    }
    if (!doc) {
        return (<SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title={localizedUiText.m_791d38f503ad} showBack onBack={() => navigation.goBack()}/>
        <ErrorState message={localizedUiText.m_b1f090de7d64} onRetry={refetch}/>
      </SafeAreaView>);
    }
    const isRejected = doc.status === 'REJECTED';
    const isRequired = doc.status === 'REQUIRED';
    const isRestricted = doc.sensitivity === 'RESTRICTED' || doc.sensitivity === 'COMMITTEE_ONLY';
    const canView = canViewDocument(user?.roles, doc);
    const canDownload = canDownloadDocument(user?.roles, doc);
    const canViewLogs = canViewAccessLogs(user?.roles, doc);
    const handleDownload = async () => {
        if (!canDownload || isRecordingAccess)
            return;
        const storageKey = `societyos:resident-document-downloads:${activeContext.dataScopeKey}`;
        const existingValue = await AsyncStorage.getItem(storageKey);
        const downloadedIds = new Set((existingValue ?? '').split('|').filter(Boolean));
        downloadedIds.add(doc.id);
        await AsyncStorage.setItem(storageKey, [...downloadedIds].join('|'));
        const result = await recordAccess({
            documentId: doc.id,
            documentTitle: doc.title,
            action: 'DOWNLOADED',
            reason: getActiveUiLiteral("m_0aa2107286d6"),
        });
        if (!result.ok) {
            AppAlert.alert(String(localizedUiText.m_db0b8d8e2b35), result.error.message);
            return;
        }
        AppAlert.alert(String(localizedUiText.m_30d6c7e26614), String(localizedUiText.m_82ed619f6229));
    };
    const handleShare = async () => {
        if (isRestricted || isRecordingAccess)
            return;
        const result = await Share.share({
            title: doc.title,
            message: formatUiLiteral(String(localizedUiText.m_28a310dda755), [doc.title, doc.id, activeContext.societyName]),
        });
        if (result.action !== Share.sharedAction)
            return;
        const accessResult = await recordAccess({
            documentId: doc.id,
            documentTitle: doc.title,
            action: 'SHARED',
            reason: getActiveUiLiteral("m_b6a4391f152e"),
        });
        if (!accessResult.ok)
            AppAlert.alert(String(localizedUiText.m_0e0eac7f1488), accessResult.error.message);
    };
    if (!canView) {
        return (<SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title={localizedUiText.m_791d38f503ad} showBack onBack={() => navigation.goBack()}/>
        <AccessRestrictedState title={localizedUiText.m_7134157e2e0f} description={localizedUiText.m_510a0ce2c5b0} requiredPermission="DOCUMENT_VIEW_RESTRICTED" onBack={() => navigation.goBack()}/>
      </SafeAreaView>);
    }
    return (<SafeAreaView style={styles.safeArea} edges={[]}>
      <AppHeader title={localizedUiText.m_791d38f503ad} showBack onBack={() => navigation.goBack()}/>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(400)}>
          {isRestricted ? (<WarningBanner message={localizedUiText.m_d832260f20e4} type="danger" style={styles.bannerMargin}/>) : isRejected ? (<WarningBanner message={formatUiLiteral(localizedUiText.m_8817060bfaf7, [doc.rejectionReason])} type="danger" style={styles.bannerMargin}/>) : isRequired ? (<WarningBanner message={localizedUiText.m_f84e37e7fb89} type="warning" style={styles.bannerMargin}/>) : (<WarningBanner message={localizedUiText.m_3838ce9262cf} type="info" style={styles.bannerMargin}/>)}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(450)}>
          <AppCard style={styles.detailsCard}>
            <View style={styles.titleBadgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{getDocumentCategoryLabel(doc.category)}</Text>
              </View>
              <StatusBadge label={doc.status.replace('_', ' ')} type={getDocumentStatusBadgeType(doc.status)}/>
            </View>

            <Text style={styles.docTitle}>{doc.title}</Text>
            {doc.description ? <Text style={styles.docDesc}>{doc.description}</Text> : null}
            
            <View style={styles.borderDivider}/>

            <InfoRow label={localizedUiText.m_2f2a95ec93b2} value={doc.id}/>
            <InfoRow label={localizedUiText.m_a3ccbc747b7b} value={getDocumentSensitivityLabel(doc.sensitivity)}/>
            <InfoRow label={localizedUiText.m_f1f2c2e3ae25} value={`${doc.fileType.toUpperCase()} / ${doc.fileSize}`}/>
            {doc.uploadedBy ? <InfoRow label={localizedUiText.m_353db12ae47d} value={doc.uploadedBy}/> : null}
            {doc.uploadedDate ? <InfoRow label={localizedUiText.m_4cd750811835} value={formatResidentDate(doc.uploadedDate)}/> : null}
            {doc.verifiedBy ? <InfoRow label={localizedUiText.m_514e74f9421a} value={doc.verifiedBy}/> : null}
            {doc.verifiedDate ? <InfoRow label={localizedUiText.m_f5832567d5c4} value={formatResidentDate(doc.verifiedDate)}/> : null}
            {doc.expiryDate ? <InfoRow label={localizedUiText.m_d600e62a6861} value={formatResidentDate(doc.expiryDate)} valueColor={Colors.danger} isLast/> : <InfoRow label={localizedUiText.m_60d014844170} value="Permanent" isLast/>}
          </AppCard>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(450)}>
          <AppCard style={styles.previewCard}>
            <Text style={styles.cardSectionTitle}>{localizedUiText.m_071b2af39677}</Text>
            
            {isRestricted ? (<View style={styles.restrictedPreviewBox}>
                <Ionicons name="lock-closed" size={48} color={Colors.danger}/>
                <Text style={styles.restrictedPreviewText}>{Messages.documents.restrictedText}</Text>
              </View>) : isRequired ? (<View style={styles.missingPreviewBox}>
                <Ionicons name="cloud-upload-outline" size={48} color={Colors.warning}/>
                <Text style={styles.missingPreviewText}>{localizedUiText.m_955fb1725121}</Text>
                <AppButton title={localizedUiText.m_c4e3a37dbf22} onPress={() => navigation.navigate('UploadDocument')} variant="primary" compact style={styles.uploadCta}/>
              </View>) : (<View style={styles.securePreviewBox}>
                <Ionicons name="document-text-outline" size={48} color={Colors.primary}/>
                <Text style={styles.previewFilename}>{doc.title.replace(/\s+/g, '_').toLowerCase()}.{doc.fileType}</Text>
                <Text style={styles.previewSize}>{doc.fileSize}{" " + localizedUiText.m_871c0aabfac5}</Text>
                <Text style={styles.securePreviewNote}>{Messages.documents.securePreviewText}</Text>
              </View>)}
          </AppCard>
        </Animated.View>

        {!isRequired && (<Animated.View entering={FadeInDown.delay(200).duration(450)} style={styles.actionsContainer}>
            <AppButton title={localizedUiText.m_9f8e8669eaf6} onPress={() => void handleDownload()} variant="primary" disabled={!canDownload || isRecordingAccess} loading={isRecordingAccess}/>

            <AppButton title={localizedUiText.m_18566f20d7d3} onPress={() => void handleShare()} variant="secondary" fullWidth disabled={isRestricted || isRecordingAccess} style={styles.shareBtn}/>

            <View style={styles.auditContainer}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.textMuted}/>
              <Text style={styles.auditText}>{Messages.documents.auditLogNote}</Text>
            </View>

            {canViewLogs ? (<Pressable style={styles.viewLogsBtn} onPress={() => navigation.navigate('DocumentAccessLog', { documentId: doc.id })}>
                <Text style={styles.viewLogsText}>{localizedUiText.m_24ad1e20013d}</Text>
              </Pressable>) : null}
          </Animated.View>)}

        <View style={styles.bottomSpacer}/>
      </ScrollView>
    </SafeAreaView>);
}

